"""
OpenDevAgent Multi-Agent Software Engineering Crew
Inspired by Kilo Code Architecture - Plan-Act-Observe-Fix Loop
"""

import logging
from typing import Dict, Any, List
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from langchain.callbacks.base import BaseCallbackHandler
import httpx

logger = logging.getLogger(__name__)


class TaskCallbackHandler(BaseCallbackHandler):
    """Custom callback handler to track agent progress"""
    
    def __init__(self, task_id: str, cache: Dict):
        self.task_id = task_id
        self.cache = cache
        self.current_agent_idx = 0
    
    def on_agent_action(self, action, **kwargs):
        """Called when agent takes an action"""
        if self.task_id in self.cache:
            self.cache[self.task_id]["logs"].append(
                f"Agent action: {action.tool} - {action.tool_input[:100]}..."
            )
    
    def on_agent_finish(self, finish, **kwargs):
        """Called when agent finishes"""
        if self.task_id in self.cache:
            self.cache[self.task_id]["logs"].append(
                f"Agent completed: {finish.return_values.get('output', 'No output')[:100]}..."
            )


class SoftwareEngineerCrew:
    """Multi-Agent Software Engineering Crew with Plan-Act-Observe-Fix Loop"""
    
    def __init__(self, api_key: str, task_id: str, cache: Dict):
        self.api_key = api_key
        self.task_id = task_id
        self.cache = cache
        self.openrouter_base_url = "https://openrouter.ai/api/v1"
        
        # Initialize LLM models for each agent
        self.architect_llm = self._create_llm("openai/gpt-4o", temperature=0.7)
        self.coder_llm = self._create_llm("anthropic/claude-3.5-sonnet", temperature=0.5)
        self.debugger_llm = self._create_llm("anthropic/claude-3.5-sonnet", temperature=0.3)
        
        # Initialize agents
        self.architect_agent = self._create_architect_agent()
        self.coder_agent = self._create_coder_agent()
        self.debugger_agent = self._create_debugger_agent()
    
    def _create_llm(self, model: str, temperature: float = 0.7) -> ChatOpenAI:
        """Create LangChain LLM with OpenRouter"""
        return ChatOpenAI(
            model=model,
            openai_api_key=self.api_key,
            openai_api_base=self.openrouter_base_url,
            temperature=temperature,
            max_tokens=4000,
            default_headers={
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "OpenDevAgent"
            }
        )
    
    def _create_architect_agent(self) -> Agent:
        """Create the Architect Agent - Plan Phase"""
        return Agent(
            role="Senior Software Architect",
            goal="Design robust and scalable software architecture based on requirements",
            backstory="""You are an expert software architect with 15+ years of experience.
            You excel at breaking down complex requirements into well-structured designs.
            You consider scalability, maintainability, performance, and best practices.
            You create detailed architecture plans that guide development teams.""",
            llm=self.architect_llm,
            verbose=True,
            allow_delegation=False,
            max_iter=3
        )
    
    def _create_coder_agent(self) -> Agent:
        """Create the Coder Agent - Act Phase"""
        return Agent(
            role="Expert Software Developer",
            goal="Write clean, efficient, and well-documented code following best practices",
            backstory="""You are a senior software developer proficient in multiple languages.
            You write production-ready code with proper error handling, testing, and documentation.
            You follow SOLID principles, design patterns, and language-specific best practices.
            Your code is readable, maintainable, and optimized for performance.""",
            llm=self.coder_llm,
            verbose=True,
            allow_delegation=False,
            max_iter=5
        )
    
    def _create_debugger_agent(self) -> Agent:
        """Create the Debugger Agent - Observe & Fix Phase"""
        return Agent(
            role="Senior QA Engineer & Debugger",
            goal="Identify issues, validate code quality, and provide actionable fixes",
            backstory="""You are an expert QA engineer and debugger with deep knowledge of:
            - Code review best practices
            - Static analysis and security vulnerabilities
            - Performance optimization
            - Testing strategies (unit, integration, e2e)
            - Common bugs and anti-patterns
            You provide detailed feedback and specific recommendations for improvements.""",
            llm=self.debugger_llm,
            verbose=True,
            allow_delegation=False,
            max_iter=4
        )
    
    def create_tasks(self, task_description: str, language: str, framework: str, complexity: str) -> List[Task]:
        """Create tasks for the Plan-Act-Observe-Fix workflow"""
        
        # Task 1: PLAN - Architecture Design
        plan_task = Task(
            description=f"""
            Analyze this software development request and create a comprehensive architecture plan:
            
            **Requirements:**
            {task_description}
            
            **Technology Stack:**
            - Language: {language}
            - Framework: {framework}
            - Complexity Level: {complexity}
            
            **Deliverables:**
            1. System Architecture Overview
            2. Component Breakdown with responsibilities
            3. Data Flow Diagram (textual representation)
            4. Key Design Decisions and Rationale
            5. Technology Stack Justification
            6. Potential Challenges and Mitigation Strategies
            7. Development Phases and Milestones
            
            Be thorough and consider scalability, maintainability, and best practices.
            """,
            agent=self.architect_agent,
            expected_output="A detailed architecture document with all deliverables listed above"
        )
        
        # Task 2: ACT - Code Generation
        act_task = Task(
            description=f"""
            Based on the architecture plan, generate production-ready code:
            
            **Requirements:**
            {task_description}
            
            **Technology:**
            - Language: {language}
            - Framework: {framework}
            
            **Code Requirements:**
            1. Main application code with proper structure
            2. Configuration files (if needed)
            3. Error handling and validation
            4. Inline comments explaining key logic
            5. Type hints/annotations where applicable
            6. Basic logging setup
            7. README with setup instructions
            
            **Code Quality Standards:**
            - Follow {language} best practices
            - Use {framework} conventions
            - SOLID principles
            - DRY (Don't Repeat Yourself)
            - Proper naming conventions
            - Security considerations
            
            Generate complete, runnable code with clear explanations.
            """,
            agent=self.coder_agent,
            expected_output="Complete source code files with documentation and setup instructions",
            context=[plan_task]
        )
        
        # Task 3: OBSERVE & FIX - Code Review and Debugging
        observe_fix_task = Task(
            description=f"""
            Review the generated code thoroughly and provide detailed feedback:
            
            **Original Requirements:**
            {task_description}
            
            **Review Checklist:**
            
            1. **Correctness:**
               - Does it meet the requirements?
               - Are there logical errors?
               - Edge cases handled?
            
            2. **Code Quality:**
               - Readability and maintainability
               - Proper code organization
               - Naming conventions
               - Comments and documentation
            
            3. **Security:**
               - Input validation
               - SQL injection risks
               - Authentication/Authorization
               - Data exposure risks
            
            4. **Performance:**
               - Algorithm efficiency
               - Resource usage
               - Potential bottlenecks
               - Caching opportunities
            
            5. **Best Practices:**
               - Design patterns usage
               - Error handling
               - Logging strategy
               - Testing approach
            
            6. **Framework/Language Specific:**
               - {language} idioms
               - {framework} best practices
            
            **Deliverables:**
            1. Overall Quality Score (1-10)
            2. List of Issues (categorized by severity: Critical/High/Medium/Low)
            3. Specific Code Fixes with line references
            4. Performance Recommendations
            5. Security Concerns
            6. Testing Recommendations
            7. Deployment Considerations
            
            Be constructive and provide actionable feedback with code examples.
            """,
            agent=self.debugger_agent,
            expected_output="Comprehensive code review report with quality score, issues, and recommendations",
            context=[plan_task, act_task]
        )
        
        return [plan_task, act_task, observe_fix_task]
    
    def execute(self, task_description: str, language: str, framework: str, complexity: str) -> Dict[str, Any]:
        """Execute the full Plan-Act-Observe-Fix cycle"""
        try:
            logger.info(f"Starting crew execution for task {self.task_id}")
            
            # Update cache
            self.cache[self.task_id]["status"] = "running"
            self.cache[self.task_id]["logs"].append("🚀 Initializing multi-agent crew...")
            
            # Create tasks
            tasks = self.create_tasks(task_description, language, framework, complexity)
            
            # Create crew
            crew = Crew(
                agents=[self.architect_agent, self.coder_agent, self.debugger_agent],
                tasks=tasks,
                process=Process.sequential,
                verbose=True
            )
            
            # Execute Plan Phase
            logger.info(f"Task {self.task_id}: Starting PLAN phase (Architect Agent)")
            self.cache[self.task_id]["agents"][0]["status"] = "running"
            self.cache[self.task_id]["logs"].append("📐 PLAN Phase: Architect Agent designing system...")
            
            # Execute Act Phase
            self.cache[self.task_id]["agents"][0]["progress"] = 50
            logger.info(f"Task {self.task_id}: Starting ACT phase (Coder Agent)")
            self.cache[self.task_id]["agents"][1]["status"] = "running"
            self.cache[self.task_id]["logs"].append("⚡ ACT Phase: Coder Agent generating code...")
            
            # Execute crew
            result = crew.kickoff()
            
            # Mark Architect complete
            self.cache[self.task_id]["agents"][0]["status"] = "completed"
            self.cache[self.task_id]["agents"][0]["progress"] = 100
            
            # Mark Coder complete
            self.cache[self.task_id]["agents"][1]["status"] = "completed"
            self.cache[self.task_id]["agents"][1]["progress"] = 100
            
            # Execute Observe & Fix Phase
            logger.info(f"Task {self.task_id}: Starting OBSERVE & FIX phase (Debugger Agent)")
            self.cache[self.task_id]["agents"][2]["status"] = "running"
            self.cache[self.task_id]["logs"].append("🔍 OBSERVE & FIX Phase: Debugger Agent reviewing code...")
            
            # Extract results
            plan_result = tasks[0].output if hasattr(tasks[0], 'output') else "Architecture plan completed"
            code_result = tasks[1].output if hasattr(tasks[1], 'output') else "Code generation completed"
            review_result = tasks[2].output if hasattr(tasks[2], 'output') else "Code review completed"
            
            # Update agent logs
            self.cache[self.task_id]["agents"][0]["logs"] = [str(plan_result)[:2000]]
            self.cache[self.task_id]["agents"][1]["logs"] = [str(code_result)[:2000]]
            self.cache[self.task_id]["agents"][2]["logs"] = [str(review_result)[:2000]]
            
            # Mark Debugger complete
            self.cache[self.task_id]["agents"][2]["status"] = "completed"
            self.cache[self.task_id]["agents"][2]["progress"] = 100
            
            # Final update
            self.cache[self.task_id]["status"] = "completed"
            self.cache[self.task_id]["logs"].append("✅ All phases completed successfully!")
            
            logger.info(f"Task {self.task_id} completed successfully")
            
            return {
                "success": True,
                "task_id": self.task_id,
                "results": {
                    "architecture": str(plan_result)[:1000],
                    "code": str(code_result)[:1000],
                    "review": str(review_result)[:1000]
                }
            }
            
        except Exception as e:
            logger.error(f"Crew execution failed for task {self.task_id}: {str(e)}")
            
            # Update cache with error
            self.cache[self.task_id]["status"] = "error"
            self.cache[self.task_id]["error"] = str(e)
            self.cache[self.task_id]["logs"].append(f"❌ Error: {str(e)}")
            
            # Mark current agent as error
            for agent in self.cache[self.task_id]["agents"]:
                if agent["status"] == "running":
                    agent["status"] = "error"
            
            return {
                "success": False,
                "task_id": self.task_id,
                "error": str(e)
            }
