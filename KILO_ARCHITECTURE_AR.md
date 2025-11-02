# معمارية OpenDevAgent المستوحاة من Kilo Code

## 🎯 نظرة عامة

**OpenDevAgent** هي منصة متقدمة لهندسة البرمجيات بالذكاء الاصطناعي، مستوحاة من معمارية **Kilo Code**، تعمل وفق حلقة **Plan-Act-Observe-Fix** لتطوير البرمجيات بشكل تلقائي وذكي.

## 🏗️ المعمارية العامة

### الطبقات الأساسية

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (Next.js)                  │
│          واجهة المستخدم التفاعلية - إدارة المهام            │
└─────────────────────────────────────────────────────────────┘
                              ↕️ REST API
┌─────────────────────────────────────────────────────────────┐
│               Backend Agent Orchestrator (FastAPI)           │
│         نظام تنسيق الوكلاء المتعددين مع CrewAI              │
└─────────────────────────────────────────────────────────────┘
                              ↕️ OpenRouter API
┌─────────────────────────────────────────────────────────────┐
│            Multi-Agent System (Plan-Act-Observe-Fix)         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Architect   │→ │    Coder     │→ │   Debugger   │      │
│  │    Agent     │  │    Agent     │  │    Agent     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↕️ Code Execution
┌─────────────────────────────────────────────────────────────┐
│          Secure Sandbox Executor (Docker Containers)         │
│            بيئة معزولة لتنفيذ واختبار الكود                 │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 حلقة Plan-Act-Observe-Fix

### المرحلة 1: PLAN (التخطيط) - Architect Agent

**الوكيل**: `openai/gpt-4o`

**المسؤوليات**:
- تحليل متطلبات المشروع بعمق
- تصميم المعمارية العامة للنظام
- تحديد المكونات الرئيسية ومسؤولياتها
- إنشاء مخطط تدفق البيانات
- اختيار المجموعة التقنية المناسبة
- تحديد التحديات المحتملة وحلولها

**المخرجات**:
```
- وثيقة المعمارية الشاملة
- تفصيل المكونات والعلاقات بينها
- مخطط تدفق البيانات (نصي)
- توصيات المجموعة التقنية
- استراتيجية معالجة التحديات
- خطة مراحل التطوير
```

### المرحلة 2: ACT (التنفيذ) - Coder Agent

**الوكيل**: `anthropic/claude-3.5-sonnet`

**المسؤوليات**:
- توليد كود جاهز للإنتاج
- تطبيق أفضل الممارسات البرمجية
- إنشاء ملفات الإعدادات اللازمة
- إضافة معالجة الأخطاء والتحقق من البيانات
- كتابة التعليقات التوضيحية
- إعداد نظام تسجيل الأحداث (Logging)
- إنشاء وثائق الإعداد (README)

**المبادئ المتبعة**:
- ✅ SOLID Principles
- ✅ DRY (Don't Repeat Yourself)
- ✅ Clean Code
- ✅ Design Patterns
- ✅ Type Safety
- ✅ Security Best Practices

**المخرجات**:
```python
# مثال على الكود المولد
main.py
├── config/
│   └── settings.py
├── models/
│   └── schemas.py
├── services/
│   └── business_logic.py
├── utils/
│   └── helpers.py
└── README.md
```

### المرحلة 3: OBSERVE & FIX (المراقبة والإصلاح) - Debugger Agent

**الوكيل**: `anthropic/claude-3.5-sonnet`

**المسؤوليات**:
- مراجعة شاملة للكود المولد
- تحليل الجودة البرمجية
- اكتشاف الأخطاء والثغرات
- تقييم الأداء والأمان
- اقتراح التحسينات
- توصيات الاختبارات

**معايير المراجعة**:

#### 1. الصحة (Correctness)
- ✓ استيفاء جميع المتطلبات
- ✓ خلو الكود من الأخطاء المنطقية
- ✓ معالجة الحالات الحدية (Edge Cases)

#### 2. جودة الكود (Code Quality)
- ✓ قابلية القراءة والصيانة
- ✓ تنظيم الكود بشكل صحيح
- ✓ تسمية المتغيرات والدوال بوضوح
- ✓ التعليقات والتوثيق الكافي

#### 3. الأمان (Security)
- ✓ التحقق من المدخلات
- ✓ حماية من SQL Injection
- ✓ آليات المصادقة/التفويض
- ✓ عدم تسريب البيانات الحساسة

#### 4. الأداء (Performance)
- ✓ كفاءة الخوارزميات
- ✓ استخدام الموارد بحكمة
- ✓ تحديد الاختناقات المحتملة
- ✓ فرص استخدام التخزين المؤقت (Caching)

#### 5. أفضل الممارسات
- ✓ استخدام أنماط التصميم (Design Patterns)
- ✓ معالجة الأخطاء المناسبة
- ✓ استراتيجية تسجيل الأحداث
- ✓ منهجية الاختبار

**المخرجات**:
```yaml
تقرير المراجعة:
  - درجة الجودة الإجمالية: 8/10
  - المشاكل المكتشفة:
      - حرجة: 0
      - عالية: 1
      - متوسطة: 3
      - منخفضة: 5
  - توصيات التحسين: [...]
  - اعتبارات الأداء: [...]
  - مخاوف أمنية: [...]
  - توصيات الاختبار: [...]
```

## 🤖 نظام الوكلاء المتعددين

### تكامل CrewAI

```python
from crewai import Agent, Task, Crew, Process

# تعريف الوكلاء
architect = Agent(
    role="Senior Software Architect",
    goal="Design robust and scalable architecture",
    llm=ChatOpenAI(model="openai/gpt-4o")
)

coder = Agent(
    role="Expert Software Developer",
    goal="Write production-ready code",
    llm=ChatOpenAI(model="anthropic/claude-3.5-sonnet")
)

debugger = Agent(
    role="Senior QA Engineer",
    goal="Ensure code quality and identify issues",
    llm=ChatOpenAI(model="anthropic/claude-3.5-sonnet")
)

# إنشاء الفريق
crew = Crew(
    agents=[architect, coder, debugger],
    tasks=[plan_task, code_task, review_task],
    process=Process.sequential
)

# تنفيذ المهمة
result = crew.kickoff()
```

### تدفق التنفيذ

```
1. استقبال المهمة من المستخدم
   ↓
2. إنشاء معرف فريد للمهمة (Task ID)
   ↓
3. تهيئة Crew مع الوكلاء الثلاثة
   ↓
4. تنفيذ المرحلة 1: PLAN
   │  ├─ Architect Agent يحلل المتطلبات
   │  ├─ يصمم المعمارية
   │  └─ يوثق القرارات
   ↓
5. تنفيذ المرحلة 2: ACT
   │  ├─ Coder Agent يتلقى خطة المعمارية
   │  ├─ يولد الكود الكامل
   │  └─ يضيف الوثائق والإعدادات
   ↓
6. تنفيذ المرحلة 3: OBSERVE & FIX
   │  ├─ Debugger Agent يراجع الكود
   │  ├─ يحلل الجودة والأمان
   │  ├─ يحدد المشاكل
   │  └─ يقترح التحسينات
   ↓
7. إعادة المخرجات للمستخدم
   ├─ Architecture Document
   ├─ Generated Code
   └─ Quality Review Report
```

## 🔒 منفذ الحاوية الآمنة (Secure Sandbox Executor)

### الميزات الأمنية

```python
class SandboxExecutor:
    """
    نظام تنفيذ آمن للكود في بيئة معزولة
    """
    
    def __init__(self):
        self.timeout = 300  # 5 دقائق
        self.memory_limit = "512m"
        self.cpu_quota = 50000  # 50% من نواة واحدة
        self.network_disabled = True  # عزل الشبكة
```

### القيود الأمنية

| القيد | القيمة | الهدف |
|-------|--------|-------|
| الذاكرة | 512MB | منع استهلاك الموارد الزائد |
| CPU | 50% نواة | تحديد الاستخدام الحسابي |
| الوقت | 5 دقائق | منع التنفيذ المستمر |
| الشبكة | معطلة | عزل الحاوية عن الإنترنت |
| نظام الملفات | معزول | حماية نظام الملفات الرئيسي |

### اللغات المدعومة

```yaml
Languages:
  - Python: python:3.11-slim
  - JavaScript/TypeScript: node:20-alpine
  - Java: openjdk:21-slim
  - Go: golang:1.22-alpine
  - Rust: rust:latest
  - C++: gcc:latest
```

### مثال على التنفيذ

```python
# تنفيذ كود Python في بيئة آمنة
executor = SandboxExecutor()
result = executor.execute_code(
    code=generated_code,
    language="python",
    framework="fastapi",
    task_id="task-123"
)

# النتيجة
{
    "success": True,
    "output": "Application started successfully...",
    "error": "",
    "exit_code": 0,
    "logs": "..."
}
```

## 🌐 تكامل OpenRouter API

### لماذا OpenRouter؟

OpenRouter توفر:
- 🔑 **نقطة وصول موحدة** لجميع نماذج الذكاء الاصطناعي
- 💰 **أسعار تنافسية** مع إدارة ذكية للتكلفة
- 🚀 **أداء عالي** مع توجيه ديناميكي
- 🔄 **احتياطية تلقائية** (Fallback) عند فشل النموذج
- 📊 **مراقبة الاستخدام** والتحليلات

### النماذج المستخدمة

```yaml
Agents:
  Architect:
    model: openai/gpt-4o
    reason: "تفكير استراتيجي متقدم، تخطيط معماري عميق"
    
  Coder:
    model: anthropic/claude-3.5-sonnet
    reason: "توليد كود عالي الجودة، فهم سياقي ممتاز"
    
  Debugger:
    model: anthropic/claude-3.5-sonnet
    reason: "تحليل دقيق، اكتشاف أخطاء متقدم"
    
  Fallback:
    model: meta-llama/llama-3.1-70b
    reason: "احتياطي قوي ومفتوح المصدر"
```

### إعداد API

```python
import httpx
from langchain_openai import ChatOpenAI

# تهيئة LLM مع OpenRouter
llm = ChatOpenAI(
    model="openai/gpt-4o",
    openai_api_key=user_api_key,
    openai_api_base="https://openrouter.ai/api/v1",
    temperature=0.7,
    max_tokens=4000,
    default_headers={
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "OpenDevAgent"
    }
)
```

## 📊 تدفق البيانات الكامل

```
┌──────────────────────────────────────────────────────────────┐
│                         المستخدم                              │
│         يدخل: مفتاح API + وصف المهمة + تفاصيل تقنية          │
└───────────────────────────┬──────────────────────────────────┘
                            │ POST /api/submit-task
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                           │
│  • التحقق من المفتاح                                          │
│  • إرسال المهمة                                               │
│  • بدء polling للحالة                                        │
└───────────────────────────┬──────────────────────────────────┘
                            │ REST API
                            ↓
┌──────────────────────────────────────────────────────────────┐
│              Backend FastAPI (main.py)                        │
│  • استقبال المهمة                                             │
│  • إنشاء Task ID                                             │
│  • تشغيل المهمة في خلفية (Background Task)                   │
│  • تحديث الذاكرة الوسيطة (Cache)                             │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ↓
┌──────────────────────────────────────────────────────────────┐
│         Agent Orchestrator (orchestrator.py)                  │
│  • تهيئة Software Engineer Crew                              │
│  • إدارة حلقة Plan-Act-Observe-Fix                           │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ↓
┌──────────────────────────────────────────────────────────────┐
│    Software Engineer Crew (software_engineer_crew.py)         │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Phase 1: PLAN                                       │   │
│  │  Architect Agent → تحليل وتصميم المعمارية           │   │
│  │  ↓ Architecture Document                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Phase 2: ACT                                        │   │
│  │  Coder Agent → توليد الكود بناءً على المعمارية      │   │
│  │  ↓ Generated Code + Documentation                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Phase 3: OBSERVE & FIX                              │   │
│  │  Debugger Agent → مراجعة وتحليل الكود                │   │
│  │  ↓ Quality Report + Recommendations                 │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬──────────────────────────────────┘
                            │ (اختياري) تنفيذ الكود
                            ↓
┌──────────────────────────────────────────────────────────────┐
│       Sandbox Executor (sandbox_executor.py)                  │
│  • إنشاء حاوية Docker معزولة                                 │
│  • تنفيذ الكود مع القيود الأمنية                             │
│  • جمع المخرجات والسجلات                                     │
│  • تنظيف الموارد                                             │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                 النتائج النهائية                              │
│  • Architecture Plan                                          │
│  • Generated Source Code                                      │
│  • Quality Review Report                                      │
│  • (إن وجد) Execution Results                                │
└───────────────────────────┬──────────────────────────────────┘
                            │ WebSocket / Polling
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                  عرض النتائج للمستخدم                         │
│  • لوحة حالة الوكلاء                                          │
│  • عارض السجلات المباشر                                       │
│  • الكود والوثائق المولدة                                     │
└──────────────────────────────────────────────────────────────┘
```

## 🎨 واجهة المستخدم الحديثة

### المكونات الرئيسية

#### 1. ApiKeyInputForm
```typescript
// إدخال وتخزين مفتاح API بشكل آمن
<ApiKeyInputForm onSuccess={() => navigate('/dashboard')} />
```

#### 2. TaskCreationWizard
```typescript
// معالج متعدد الخطوات لإنشاء المهام
<TaskCreationWizard />
// الخطوة 1: وصف المهمة
// الخطوة 2: اختيار اللغة والإطار
// الخطوة 3: تحديد مستوى التعقيد
```

#### 3. AgentStatusDashboard
```typescript
// لوحة متابعة حية لحالة الوكلاء
<AgentStatusDashboard task={currentTask} />
```

#### 4. RealTimeLogViewer
```typescript
// عرض السجلات المباشرة مع تمرير تلقائي
<RealTimeLogViewer taskId={taskId} isLive={true} />
```

#### 5. NotificationSystem
```typescript
// نظام إشعارات ذكي
<NotificationSystem />
```

### التصميم البصري

```css
/* نظام الألوان - مستوحى من Capy.ai */
:root {
  --primary: #1A1A2E;      /* خلفية رئيسية داكنة */
  --secondary: #16213E;    /* خلفية ثانوية */
  --accent: #0F3460;       /* لون التمييز */
  --highlight: #0ED4FF;    /* لون التظليل الساطع */
  --error: #E94560;        /* لون الخطأ */
  --success: #2ECC71;      /* لون النجاح */
  --warning: #F39C12;      /* لون التحذير */
}
```

## 🚀 التشغيل والنشر

### التشغيل المحلي

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd OpenDevAgent_KiloInspired_Architecture

# 2. إعداد متغيرات البيئة
cp .env.example .env
# قم بتحرير .env وإضافة إعداداتك

# 3. تشغيل باستخدام Docker Compose
docker-compose up --build

# 4. الوصول إلى التطبيق
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### النشر على السحابة

#### خيارات النشر:
- ☁️ **Railway** - نشر بنقرة واحدة
- ☁️ **Heroku** - منصة PaaS سهلة
- ☁️ **AWS ECS** - حاويات قابلة للتوسع
- ☁️ **Google Cloud Run** - حاويات serverless
- ☁️ **Azure Container Instances** - نشر سريع

## 📈 الأداء والقابلية للتوسع

### التحسينات:

1. **Caching مع Redis**
   - تخزين نتائج المهام المكررة
   - cache لتحقق من مفتاح API
   - تخزين حالة الجلسات

2. **Background Tasks**
   - تنفيذ المهام الطويلة في الخلفية
   - عدم حظر واجهة المستخدم

3. **Resource Limits**
   - قيود CPU والذاكرة لكل حاوية
   - timeout للمهام الطويلة

4. **Horizontal Scaling**
   - إمكانية تشغيل نسخ متعددة من Backend
   - Load balancing تلقائي

## 🔐 الأمان

### طبقات الحماية:

```yaml
Security Layers:
  1. Frontend:
     - API Key في الذاكرة فقط (لا يُخزن)
     - HTTPS فقط في Production
     - Input validation
     
  2. Backend:
     - Rate limiting
     - API key verification
     - Request validation
     
  3. Sandbox:
     - Docker isolation
     - No network access
     - Resource limits
     - Read-only file system (optional)
     
  4. OpenRouter:
     - Secure API communication
     - No key logging
     - Usage tracking
```

## 📚 الموارد والمراجع

- [CrewAI Documentation](https://docs.crewai.com/)
- [OpenRouter API](https://openrouter.ai/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)

---

**OpenDevAgent** - قوة الذكاء الاصطناعي المتعدد الوكلاء في خدمة تطوير البرمجيات 🚀
