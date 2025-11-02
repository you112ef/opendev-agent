import logging
import asyncio
from typing import Dict, Any
import httpx
from .models import TaskRequest, ExecutionResult
from .software_engineer_crew import SoftwareEngineerCrew
from .tools.sandbox_executor import SandboxExecutor

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    def __init__(self):
        self.openrouter_base_url = "https://openrouter.ai/api/v1"
        self.models = {
            "architect": "openai/gpt-4o",
            "coder": "anthropic/claude-3.5-sonnet",
            "debugger": "anthropic/claude-3.5-sonnet",
            "fallback": "meta-llama/llama-3.1-70b"
        }
        self.current_api_key = None
        self.sandbox_executor = SandboxExecutor()

    async def initialize(self):
        logger.info("?? Initializing Agent Orchestrator with CrewAI")

    async def validate_api_key(self, api_key: str) -> bool:
        """Validate OpenRouter API key"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "Authorization": f"Bearer {api_key}",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "OpenDevAgent"
                }
                response = await client.get(
                    f"{self.openrouter_base_url}/models",
                    headers=headers,
                    timeout=10
                )
                return response.status_code == 200
        except Exception as e:
            logger.error(f"API key validation error: {str(e)}")
            return False

    async def execute_task(self, task_id: str, task: TaskRequest, cache: Dict):
        """Execute the complete Plan-Act-Observe-Fix cycle using CrewAI"""
        try:
            self.current_api_key = task.api_key
            cache[task_id]["status"] = "running"
            cache[task_id]["logs"].append(f"?? Task started: {task.description[:100]}...")
            
            logger.info(f"?? Executing task {task_id} with CrewAI multi-agent system")
            
            # Initialize Software Engineer Crew
            crew = SoftwareEngineerCrew(
                api_key=task.api_key,
                task_id=task_id,
                cache=cache
            )
            
            # Execute the Plan-Act-Observe-Fix workflow
            result = await asyncio.to_thread(
                crew.execute,
                task.description,
                task.language,
                task.framework,
                task.complexity
            )
            
            if result["success"]:
                cache[task_id]["status"] = "completed"
                cache[task_id]["logs"].append("? Task completed successfully!")
                logger.info(f"? Task {task_id} completed successfully")
            else:
                cache[task_id]["status"] = "error"
                cache[task_id]["error"] = result.get("error", "Unknown error")
                logger.error(f"? Task {task_id} failed: {result.get('error')}")
            
        except Exception as e:
            logger.error(f"?? Task {task_id} execution failed: {str(e)}")
            cache[task_id]["status"] = "error"
            cache[task_id]["error"] = str(e)
            cache[task_id]["logs"].append(f"? Fatal error: {str(e)}")

    async def _run_architect_phase(self, task_id: str, task: TaskRequest, cache: Dict):
        """Architecture planning phase"""
        logger.info(f"Task {task_id}: Starting Architect phase")
        cache[task_id]["agents"][0]["status"] = "running"
        
        try:
            prompt = f"""
You are an expert software architect. Plan the architecture for this task:

Task Description: {task.description}
Language: {task.language}
Framework: {task.framework}
Complexity Level: {task.complexity}

Provide a detailed architecture plan including:
1. System design overview
2. Key components and their responsibilities
3. Data flow diagram (in text)
4. Technology stack recommendations
5. Potential challenges and solutions

Format your response clearly with sections.
"""
            
            response = await self._call_llm(
                task.api_key,
                self.models["architect"],
                prompt
            )
            
            cache[task_id]["logs"].append(f"Architect: {response[:200]}...")
            cache[task_id]["agents"][0]["progress"] = 100
            cache[task_id]["agents"][0]["status"] = "completed"
            cache[task_id]["agents"][0]["logs"].append(response)
            
        except Exception as e:
            logger.error(f"Architect phase error: {str(e)}")
            cache[task_id]["agents"][0]["status"] = "error"
            raise

    async def _run_coder_phase(self, task_id: str, task: TaskRequest, cache: Dict):
        """Code generation phase"""
        logger.info(f"Task {task_id}: Starting Coder phase")
        cache[task_id]["agents"][1]["status"] = "running"
        
        try:
            # Get architecture from previous phase
            arch_logs = cache[task_id]["agents"][0]["logs"]
            architecture = arch_logs[0] if arch_logs else "No architecture available"
            
            prompt = f"""
You are an expert code generator. Generate production-ready code based on this task:

Task Description: {task.description}
Language: {task.language}
Framework: {task.framework}
Complexity Level: {task.complexity}

Previous Architecture Plan:
{architecture}

Generate:
1. Main application code
2. Configuration files
3. Essential utility functions
4. Error handling and validation
5. Comments explaining key sections

Use best practices and ensure code is well-structured and maintainable.
"""
            
            response = await self._call_llm(
                task.api_key,
                self.models["coder"],
                prompt
            )
            
            cache[task_id]["logs"].append(f"Coder: Generated {len(response)} characters of code")
            cache[task_id]["agents"][1]["progress"] = 100
            cache[task_id]["agents"][1]["status"] = "completed"
            cache[task_id]["agents"][1]["logs"].append(response)
            
        except Exception as e:
            logger.error(f"Coder phase error: {str(e)}")
            cache[task_id]["agents"][1]["status"] = "error"
            raise

    async def _run_debugger_phase(self, task_id: str, task: TaskRequest, cache: Dict):
        """Debugging and validation phase"""
        logger.info(f"Task {task_id}: Starting Debugger phase")
        cache[task_id]["agents"][2]["status"] = "running"
        
        try:
            code = cache[task_id]["agents"][1]["logs"][0] if cache[task_id]["agents"][1]["logs"] else ""
            
            prompt = f"""
You are an expert code reviewer and debugger. Review and validate this generated code:

Task Description: {task.description}
Language: {task.language}
Framework: {task.framework}

Generated Code:
{code[:2000]}...

Provide:
1. Code quality assessment (score 1-10)
2. Identified issues and bugs
3. Performance recommendations
4. Security concerns if any
5. Suggested improvements
6. Testing recommendations

Be thorough but constructive in your review.
"""
            
            response = await self._call_llm(
                task.api_key,
                self.models["debugger"],
                prompt
            )
            
            cache[task_id]["logs"].append(f"Debugger: Review completed")
            cache[task_id]["agents"][2]["progress"] = 100
            cache[task_id]["agents"][2]["status"] = "completed"
            cache[task_id]["agents"][2]["logs"].append(response)
            
        except Exception as e:
            logger.error(f"Debugger phase error: {str(e)}")
            cache[task_id]["agents"][2]["status"] = "error"
            raise

    async def _call_llm(self, api_key: str, model: str, prompt: str, max_tokens: int = 2000) -> str:
        """Call the LLM via OpenRouter API"""
        try:
            async with httpx.AsyncClient() as client:
                headers = {
                    "Authorization": f"Bearer {api_key}",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "OpenDevAgent"
                }
                
                payload = {
                    "model": model,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": max_tokens
                }
                
                response = await client.post(
                    f"{self.openrouter_base_url}/chat/completions",
                    json=payload,
                    headers=headers,
                    timeout=60
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                else:
                    error_msg = f"LLM API error: {response.status_code} - {response.text}"
                    logger.error(error_msg)
                    raise Exception(error_msg)
                    
        except Exception as e:
            logger.error(f"LLM call failed: {str(e)}")
            raise
