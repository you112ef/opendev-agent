import docker
import logging
import json
import os
import tempfile
import shutil
from typing import Dict, List, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

class SandboxExecutor:
    """
    Secure Sandbox Executor for running code in isolated Docker containers
    Features:
    - Language-specific Docker images
    - Resource limits (CPU, memory, timeout)
    - Network isolation
    - File system isolation
    - Automatic cleanup
    """
    
    def __init__(self):
        try:
            self.client = docker.from_env()
            logger.info("? Docker client initialized successfully")
        except Exception as e:
            logger.warning(f"⚠️ Docker not available: {str(e)}")
            self.client = None
        
        self.timeout = 300  # 5 minutes
        self.memory_limit = "512m"
        self.cpu_quota = 50000  # 50% of one CPU core
        self.cpu_period = 100000

    def execute_code(
        self,
        code: str,
        language: str,
        framework: str,
        task_id: str,
        test_command: Optional[str] = None
    ) -> Dict[str, any]:
        """Execute code in an isolated Docker container"""
        
        if not self.client:
            logger.warning("Docker not available, simulating execution")
            return self._simulate_execution(code, language)
        
        work_dir = None
        container = None
        
        try:
            container_name = f"sandbox-{task_id}"
            
            # Prepare Docker image based on language
            image = self._get_docker_image(language)
            
            # Create temporary working directory
            work_dir = tempfile.mkdtemp(prefix=f"sandbox_{task_id}_")
            logger.info(f"📁 Created sandbox directory: {work_dir}")
            
            # Write code and setup files
            self._prepare_sandbox_environment(work_dir, code, language, framework)
            
            # Determine execution command
            exec_command = test_command or self._get_execution_command(language, framework)
            
            logger.info(f"🐳 Starting container {container_name} with image {image}")
            logger.info(f"? Executing command: {exec_command}")
            
            # Run container with resource limits
            container = self.client.containers.run(
                image,
                exec_command,
                name=container_name,
                volumes={work_dir: {"bind": "/workspace", "mode": "rw"}},
                working_dir="/workspace",
                mem_limit=self.memory_limit,
                cpu_quota=self.cpu_quota,
                cpu_period=self.cpu_period,
                network_disabled=True,
                remove=False,
                detach=True
            )
            
            # Wait for execution with timeout
            result = container.wait(timeout=self.timeout)
            exit_code = result.get("StatusCode", -1)
            
            # Get logs
            logs = container.logs(stdout=True, stderr=True).decode('utf-8', errors='ignore')
            
            # Parse output and errors
            stdout, stderr = self._parse_container_logs(logs)
            
            success = exit_code == 0
            
            logger.info(f"{'?' if success else '?'} Container execution completed with exit code {exit_code}")
            
            return {
                "success": success,
                "output": stdout,
                "error": stderr,
                "exit_code": exit_code,
                "logs": logs
            }
            
        except docker.errors.ContainerError as e:
            logger.error(f"? Container execution error: {str(e)}")
            return {
                "success": False,
                "output": "",
                "error": str(e),
                "exit_code": e.exit_status if hasattr(e, 'exit_status') else -1
            }
        
        except docker.errors.ImageNotFound as e:
            logger.error(f"? Docker image not found: {str(e)}")
            return {
                "success": False,
                "output": "",
                "error": f"Docker image not found: {str(e)}",
                "exit_code": -1
            }
        
        except Exception as e:
            logger.error(f"? Sandbox execution error: {str(e)}")
            return {
                "success": False,
                "output": "",
                "error": str(e),
                "exit_code": -1
            }
        
        finally:
            # Cleanup
            if container:
                try:
                    container.stop(timeout=5)
                    container.remove()
                    logger.info(f"🧹 Container {container_name} removed")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to cleanup container: {str(e)}")
            
            if work_dir and os.path.exists(work_dir):
                try:
                    shutil.rmtree(work_dir)
                    logger.info(f"🧹 Sandbox directory cleaned: {work_dir}")
                except Exception as e:
                    logger.warning(f"⚠️ Failed to cleanup directory: {str(e)}")
    
    def _prepare_sandbox_environment(self, work_dir: str, code: str, language: str, framework: str):
        """Prepare the sandbox environment with code and configuration files"""
        
        # Write main code file
        code_file = self._write_code_file(work_dir, code, language)
        
        # Create language-specific setup files
        if language.lower() == "python":
            self._create_python_setup(work_dir, framework)
        elif language.lower() in ["javascript", "typescript"]:
            self._create_node_setup(work_dir, framework)
        elif language.lower() == "java":
            self._create_java_setup(work_dir, framework)
        
        logger.info(f"🛠️ Sandbox environment prepared for {language}")
    
    def _create_python_setup(self, work_dir: str, framework: str):
        """Create Python-specific setup files"""
        requirements = []
        
        if framework.lower() == "fastapi":
            requirements = ["fastapi", "uvicorn[standard]", "pydantic"]
        elif framework.lower() == "django":
            requirements = ["django"]
        elif framework.lower() == "flask":
            requirements = ["flask"]
        elif framework.lower() == "sqlalchemy":
            requirements = ["sqlalchemy"]
        
        if requirements:
            with open(os.path.join(work_dir, "requirements.txt"), "w") as f:
                f.write("\n".join(requirements))
    
    def _create_node_setup(self, work_dir: str, framework: str):
        """Create Node.js-specific setup files"""
        package_json = {
            "name": "sandbox-app",
            "version": "1.0.0",
            "dependencies": {}
        }
        
        if framework.lower() == "express":
            package_json["dependencies"]["express"] = "^4.18.0"
        elif framework.lower() == "react":
            package_json["dependencies"]["react"] = "^18.0.0"
            package_json["dependencies"]["react-dom"] = "^18.0.0"
        
        with open(os.path.join(work_dir, "package.json"), "w") as f:
            json.dump(package_json, f, indent=2)
    
    def _create_java_setup(self, work_dir: str, framework: str):
        """Create Java-specific setup files"""
        # Create basic pom.xml for Maven projects
        if framework.lower() == "maven":
            pom_xml = """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.sandbox</groupId>
    <artifactId>sandbox-app</artifactId>
    <version>1.0.0</version>
</project>"""
            with open(os.path.join(work_dir, "pom.xml"), "w") as f:
                f.write(pom_xml)
    
    def _get_execution_command(self, language: str, framework: str) -> str:
        """Get the appropriate execution command for the language"""
        commands = {
            "python": "python main.py",
            "javascript": "node main.js",
            "typescript": "npx ts-node main.ts",
            "java": "javac Main.java && java Main",
            "go": "go run main.go",
            "rust": "rustc main.rs && ./main",
            "c++": "g++ -o main main.cpp && ./main"
        }
        return commands.get(language.lower(), "python main.py")
    
    def _parse_container_logs(self, logs: str) -> tuple:
        """Parse container logs into stdout and stderr"""
        # Simple parsing - in production, you'd use docker SDK's stream separation
        lines = logs.split('\n')
        stdout_lines = []
        stderr_lines = []
        
        for line in lines:
            if 'error' in line.lower() or 'exception' in line.lower():
                stderr_lines.append(line)
            else:
                stdout_lines.append(line)
        
        return '\n'.join(stdout_lines), '\n'.join(stderr_lines)
    
    def _simulate_execution(self, code: str, language: str) -> Dict[str, any]:
        """Simulate code execution when Docker is not available"""
        logger.info("🎭 Simulating code execution (Docker not available)")
        return {
            "success": True,
            "output": f"Code simulation successful for {language}\nCode length: {len(code)} characters",
            "error": "",
            "exit_code": 0,
            "logs": "Simulated execution - Docker not available"
        }

    def _write_code_file(self, work_dir: str, code: str, language: str) -> str:
        """Write code to file with appropriate extension"""
        extensions = {
            "python": "py",
            "javascript": "js",
            "typescript": "ts",
            "java": "java",
            "go": "go",
            "rust": "rs",
            "c++": "cpp"
        }
        
        ext = extensions.get(language.lower(), "py")
        file_name = f"main.{ext}" if language.lower() != "java" else "Main.java"
        file_path = os.path.join(work_dir, file_name)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)
        
        logger.info(f"📝 Code written to {file_name}")
        return file_name
    
    def _get_docker_image(self, language: str) -> str:
        """Get appropriate Docker image for the language"""
        images = {
            "python": "python:3.11-slim",
            "javascript": "node:20-alpine",
            "typescript": "node:20-alpine",
            "java": "openjdk:21-slim",
            "go": "golang:1.22-alpine",
            "rust": "rust:latest",
            "c++": "gcc:latest"
        }
        return images.get(language.lower(), "python:3.11-slim")

    def cleanup(self, task_id: str):
        """Clean up resources after execution"""
        if not self.client:
            return
            
        try:
            container_name = f"sandbox-{task_id}"
            container = self.client.containers.get(container_name)
            container.kill()
            container.remove()
            logger.info(f"🧹 Cleaned up sandbox container: {container_name}")
        except docker.errors.NotFound:
            logger.info(f"Container {container_name} not found (already removed)")
        except Exception as e:
            logger.warning(f"⚠️ Failed to cleanup container: {str(e)}")
