# 📡 OpenDevAgent API Documentation

## Base URL

```
Development: http://localhost:8000
Production: https://api.opendevagent.com
```

## Authentication

OpenDevAgent uses **API Key Authentication** through OpenRouter. The API key is passed in request bodies for task submission and validation.

### Security Notes

- ⚠️ API keys are handled client-side only
- ⚠️ Never commit API keys to version control
- ⚠️ Keys are transmitted over HTTPS only in production
- ⚠️ Keys are not logged or stored on the server

---

## Endpoints

### 1. Health Check

Check if the API is running and healthy.

**Request**

```http
GET /api/health
```

**Response**

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "tasks_active": 3
}
```

**Status Codes**

- `200 OK` - Service is healthy
- `503 Service Unavailable` - Service is down

---

### 2. Validate API Key

Verify that an OpenRouter API key is valid.

**Request**

```http
POST /api/validate-key
Content-Type: application/json

{
  "api_key": "sk-or-v1-..."
}
```

**Response - Success**

```json
{
  "valid": true,
  "message": "API key is valid"
}
```

**Response - Invalid**

```json
{
  "valid": false,
  "message": "Invalid API key"
}
```

**Status Codes**

- `200 OK` - Validation completed (check `valid` field)
- `400 Bad Request` - Invalid request format

**Example**

```bash
curl -X POST http://localhost:8000/api/validate-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-or-v1-your-key-here"}'
```

---

### 3. Submit Task

Submit a new software development task to the multi-agent system.

**Request**

```http
POST /api/submit-task
Content-Type: application/json

{
  "api_key": "sk-or-v1-...",
  "description": "Create a REST API for task management with CRUD operations",
  "language": "Python",
  "framework": "FastAPI",
  "complexity": "medium"
}
```

**Parameters**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `api_key` | string | ✅ | OpenRouter API key |
| `description` | string | ✅ | Detailed task description |
| `language` | string | ✅ | Programming language (Python, JavaScript, TypeScript, Java, Go, Rust, C++) |
| `framework` | string | ✅ | Framework to use |
| `complexity` | string | ✅ | Task complexity: `low`, `medium`, or `high` |

**Response**

```json
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "message": "Task submitted for processing"
}
```

**Status Codes**

- `200 OK` - Task submitted successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Invalid API key
- `500 Internal Server Error` - Server error

**Example**

```bash
curl -X POST http://localhost:8000/api/submit-task \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "sk-or-v1-your-key",
    "description": "Create a REST API for user management",
    "language": "Python",
    "framework": "FastAPI",
    "complexity": "medium"
  }'
```

---

### 4. Get Task Status

Get the current status and progress of a task.

**Request**

```http
GET /api/task_status/{task_id}
```

**Parameters**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `task_id` | string (path) | ✅ | Task UUID |

**Response**

```json
{
  "status": "running",
  "agents": [
    {
      "name": "Architect",
      "status": "completed",
      "progress": 100,
      "logs": ["Architecture design completed..."]
    },
    {
      "name": "Coder",
      "status": "running",
      "progress": 45,
      "logs": ["Generating code..."]
    },
    {
      "name": "Debugger",
      "status": "idle",
      "progress": 0,
      "logs": []
    }
  ],
  "logs": [
    "🎯 Task started...",
    "📐 PLAN Phase: Architect Agent designing system...",
    "⚡ ACT Phase: Coder Agent generating code..."
  ],
  "error": null
}
```

**Agent Status Values**

- `idle` - Not started yet
- `running` - Currently executing
- `completed` - Finished successfully
- `error` - Encountered an error

**Task Status Values**

- `pending` - Waiting to start
- `running` - Currently processing
- `completed` - Finished successfully
- `error` - Failed with error

**Status Codes**

- `200 OK` - Status retrieved successfully
- `404 Not Found` - Task not found

**Example**

```bash
curl http://localhost:8000/api/task_status/550e8400-e29b-41d4-a716-446655440000
```

---

### 5. Get Task Logs

Retrieve detailed logs for a specific task.

**Request**

```http
GET /api/task_logs/{task_id}
```

**Parameters**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `task_id` | string (path) | ✅ | Task UUID |

**Response**

```json
{
  "logs": [
    "🎯 Task started: Creating REST API...",
    "📐 PLAN Phase: Architect Agent designing system...",
    "⚡ ACT Phase: Coder Agent generating code...",
    "🔍 OBSERVE & FIX Phase: Debugger Agent reviewing...",
    "✨ Task completed successfully!"
  ]
}
```

**Status Codes**

- `200 OK` - Logs retrieved successfully
- `404 Not Found` - Task not found

**Example**

```bash
curl http://localhost:8000/api/task_logs/550e8400-e29b-41d4-a716-446655440000
```

---

## Data Models

### TaskRequest

```typescript
interface TaskRequest {
  api_key: string          // OpenRouter API key
  description: string      // Task description
  language: string         // Programming language
  framework: string        // Framework name
  complexity: "low" | "medium" | "high"
}
```

### AgentStatus

```typescript
interface AgentStatus {
  name: string            // Agent name
  status: "idle" | "running" | "completed" | "error"
  progress: number        // 0-100
  logs: string[]          // Agent-specific logs
}
```

### TaskStatus

```typescript
interface TaskStatus {
  status: "pending" | "running" | "completed" | "error"
  agents: AgentStatus[]   // Status of all agents
  logs: string[]          // Task-level logs
  error: string | null    // Error message if any
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "detail": "Error message description"
}
```

### Common Error Codes

| Status Code | Meaning |
|-------------|---------|
| `400 Bad Request` | Invalid input parameters |
| `401 Unauthorized` | Invalid or missing API key |
| `404 Not Found` | Resource not found |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Server error |
| `503 Service Unavailable` | Service temporarily down |

---

## Rate Limiting

To ensure fair usage and system stability:

- **60 requests per minute** per IP address
- **10 concurrent tasks** per API key
- **5 minutes maximum** task execution time

Rate limit headers in response:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640995200
```

---

## Polling Best Practices

When monitoring task status:

1. **Start polling after task submission**
   ```javascript
   const pollInterval = setInterval(async () => {
     const status = await getTaskStatus(taskId);
     if (status.status !== 'running') {
       clearInterval(pollInterval);
     }
   }, 2000); // Poll every 2 seconds
   ```

2. **Use exponential backoff** for errors
   ```javascript
   let delay = 1000;
   const maxDelay = 30000;
   
   async function pollWithBackoff() {
     try {
       const status = await getTaskStatus(taskId);
       delay = 1000; // Reset on success
     } catch (error) {
       delay = Math.min(delay * 2, maxDelay);
     }
     setTimeout(pollWithBackoff, delay);
   }
   ```

3. **Set a maximum poll duration**
   ```javascript
   const maxPollTime = 5 * 60 * 1000; // 5 minutes
   const startTime = Date.now();
   
   const pollInterval = setInterval(async () => {
     if (Date.now() - startTime > maxPollTime) {
       clearInterval(pollInterval);
       console.error('Task timeout');
     }
     // ... poll logic
   }, 2000);
   ```

---

## WebSocket (Coming Soon)

Real-time updates via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/task/{task_id}');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Task update:', data);
};
```

---

## Interactive API Documentation

OpenDevAgent provides interactive API documentation using Swagger UI:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## Code Examples

### Python

```python
import requests

# Submit task
response = requests.post('http://localhost:8000/api/submit-task', json={
    'api_key': 'sk-or-v1-...',
    'description': 'Create a REST API',
    'language': 'Python',
    'framework': 'FastAPI',
    'complexity': 'medium'
})

task_id = response.json()['task_id']

# Poll for status
import time

while True:
    status_response = requests.get(f'http://localhost:8000/api/task_status/{task_id}')
    status = status_response.json()
    
    if status['status'] != 'running':
        break
    
    print(f"Progress: {status['agents'][1]['progress']}%")
    time.sleep(2)

print("Task completed!")
```

### JavaScript/TypeScript

```typescript
// Submit task
const response = await fetch('http://localhost:8000/api/submit-task', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: 'sk-or-v1-...',
    description: 'Create a REST API',
    language: 'Python',
    framework: 'FastAPI',
    complexity: 'medium'
  })
});

const { task_id } = await response.json();

// Poll for status
const pollStatus = async () => {
  const statusResponse = await fetch(`http://localhost:8000/api/task_status/${task_id}`);
  const status = await statusResponse.json();
  
  if (status.status === 'running') {
    console.log(`Progress: ${status.agents[1].progress}%`);
    setTimeout(pollStatus, 2000);
  } else {
    console.log('Task completed!');
  }
};

pollStatus();
```

### cURL

```bash
# Submit task
TASK_ID=$(curl -s -X POST http://localhost:8000/api/submit-task \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "sk-or-v1-...",
    "description": "Create a REST API",
    "language": "Python",
    "framework": "FastAPI",
    "complexity": "medium"
  }' | jq -r '.task_id')

echo "Task ID: $TASK_ID"

# Poll status
while true; do
  STATUS=$(curl -s http://localhost:8000/api/task_status/$TASK_ID | jq -r '.status')
  echo "Status: $STATUS"
  
  if [ "$STATUS" != "running" ]; then
    break
  fi
  
  sleep 2
done

# Get logs
curl -s http://localhost:8000/api/task_logs/$TASK_ID | jq '.logs[]'
```

---

## Support

- 📧 API Issues: api@opendevagent.com
- 📖 Full Documentation: https://docs.opendevagent.com
- 💬 Discord: https://discord.gg/opendevagent
- 🐛 Bug Reports: https://github.com/yourusername/OpenDevAgent/issues

---

**Last Updated**: 2025-11-02  
**API Version**: v0.1.0
