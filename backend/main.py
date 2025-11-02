from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import uuid
from typing import Optional
from pydantic import BaseModel
from agent_logic.orchestrator import AgentOrchestrator
from agent_logic.models import TaskRequest, TaskStatus

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="OpenDevAgent API",
    description="Advanced AI-powered software engineering platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = AgentOrchestrator()
tasks_cache = {}

class APIKeyRequest(BaseModel):
    api_key: str

@app.on_event("startup")
async def startup():
    logger.info("🚀 OpenDevAgent Backend started")
    await orchestrator.initialize()

@app.on_event("shutdown")
async def shutdown():
    logger.info("🛑 OpenDevAgent Backend shutting down")

@app.post("/api/validate-key")
async def validate_api_key(request: APIKeyRequest):
    """Validate OpenRouter API key"""
    try:
        is_valid = await orchestrator.validate_api_key(request.api_key)
        if is_valid:
            return {"valid": True, "message": "API key is valid"}
        return {"valid": False, "message": "Invalid API key"}
    except Exception as e:
        logger.error(f"API key validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/submit-task")
async def submit_task(
    task_request: TaskRequest,
    background_tasks: BackgroundTasks
):
    """Submit a new task for processing"""
    try:
        task_id = str(uuid.uuid4())
        logger.info(f"New task submitted: {task_id}")
        
        tasks_cache[task_id] = {
            "status": "pending",
            "agents": [
                {"name": "Architect", "status": "idle", "progress": 0, "logs": []},
                {"name": "Coder", "status": "idle", "progress": 0, "logs": []},
                {"name": "Debugger", "status": "idle", "progress": 0, "logs": []},
            ],
            "logs": [],
            "error": None,
        }
        
        background_tasks.add_task(
            orchestrator.execute_task,
            task_id,
            task_request,
            tasks_cache
        )
        
        return {
            "task_id": task_id,
            "status": "pending",
            "message": "Task submitted for processing"
        }
    except Exception as e:
        logger.error(f"Task submission error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/task_status/{task_id}")
async def get_task_status(task_id: str):
    """Get current status of a task"""
    if task_id not in tasks_cache:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return tasks_cache[task_id]

@app.get("/api/task_logs/{task_id}")
async def get_task_logs(task_id: str):
    """Get logs for a specific task"""
    if task_id not in tasks_cache:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {
        "logs": tasks_cache[task_id].get("logs", [])
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "0.1.0",
        "tasks_active": len([t for t in tasks_cache.values() if t["status"] == "running"])
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "OpenDevAgent API",
        "version": "0.1.0",
        "endpoints": {
            "health": "/api/health",
            "validate_key": "/api/validate-key",
            "submit_task": "/api/submit-task",
            "task_status": "/api/task_status/{task_id}",
            "task_logs": "/api/task_logs/{task_id}",
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
