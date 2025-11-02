from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class ComplexityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskRequest(BaseModel):
    api_key: str
    description: str
    language: str
    framework: str
    complexity: ComplexityLevel

class AgentStatus(BaseModel):
    name: str
    status: str
    progress: int
    logs: List[str]

class TaskStatus(BaseModel):
    task_id: str
    status: str
    agents: List[AgentStatus]
    logs: List[str]
    error: Optional[str] = None

class ExecutionResult(BaseModel):
    success: bool
    code: str
    explanation: str
    errors: List[str] = []
