import docker
import logging
import json
from typing import Dict, List, Optional
import os

logger = logging.getLogger(__name__)

class SandboxExecutor:
    def __init__(self):
        self.client = docker.from_env()
        self.timeout = 300  # 5 minutes
        self.memory_limit = "512m"
        self.cpu_limit = "1"

    def execute_code(
        self,
        code: str,
        language: str,
        framework: str,
        task_id: str
    ) -> Dict[str, any]:
        """Execute code in an isolated Docker container"""
        try:
            container_name = f"sandbox-{task_id}"
            
            # Prepare Docker image based on language
            image = self._get_docker_image(language)
            
            # Create working directory
            work_dir = f"/tmp/sandbox/{task_id}"
            os.makedirs(work_dir, exist_ok=True)
            
            # Write code to file
            code_file = self._write_code_file(work_dir, code, language)
            
            # Run container
            result = self.client.containers.run(
                image,
                f"timeout {self.timeout} python {code_file}",
                name=container_name,
                volumes={work_dir: {"bind": "/app", "mode": "rw"}},
                mem_limit=self.memory_limit,
                cpuset_cpus=self.cpu_limit,
                network_disabled=True,
                remove=True,
                capture_output=True
            )
            
            return {
                "success": result.returncode == 0,
                "output": result.stdout.decode() if result.stdout else "",
                "error": result.stderr.decode() if result.stderr else "",
                "exit_code": result.returncode
            }
            
        except Exception as e:
            logger.error(f"Sandbox execution error: {str(e)}")
            return {
                "success": False,
                "output": "",
                "error": str(e),
                "exit_code": -1
            }

    def _get_docker_image(self, language: str) -> str:
        """Get appropriate Docker image for language"""
        images = {
            "python": "python:3.11-slim",
            "javascript": "node:20-alpine",
            "typescript": "node:20-alpine",
            "java": "openjdk:21-slim",
            "go": "golang:1.22-alpine",
            "rust": "rust:latest",
        }
        return images.get(language.lower(), "python:3.11-slim")

    def _write_code_file(self, work_dir: str, code: str, language: str) -> str:
        """Write code to file with appropriate extension"""
        extensions = {
            "python": "py",
            "javascript": "js",
            "typescript": "ts",
            "java": "java",
            "go": "go",
            "rust": "rs",
        }
        
        ext = extensions.get(language.lower(), "py")
        file_path = f"/app/main.{ext}"
        
        with open(os.path.join(work_dir, f"main.{ext}"), "w") as f:
            f.write(code)
        
        return file_path

    def cleanup(self, task_id: str):
        """Clean up resources after execution"""
        try:
            container_name = f"sandbox-{task_id}"
            container = self.client.containers.get(container_name)
            container.kill()
            container.remove()
            logger.info(f"Cleaned up sandbox container: {container_name}")
        except Exception as e:
            logger.warning(f"Failed to cleanup container: {str(e)}")
