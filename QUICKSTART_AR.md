# ⚡ دليل البدء السريع - OpenDevAgent

## 🎯 من الصفر إلى التشغيل في 5 دقائق

### الخطوة 1: المتطلبات (دقيقة واحدة)

```bash
# تحقق من وجود Docker
docker --version
docker-compose --version

# إذا لم يكن مثبتاً:
# macOS: brew install docker docker-compose
# Ubuntu: sudo apt install docker.io docker-compose
# Windows: تحميل Docker Desktop
```

### الخطوة 2: الحصول على مفتاح API (دقيقتان)

1. اذهب إلى [OpenRouter](https://openrouter.ai/keys)
2. سجل حساب جديد (مجاني)
3. اذهب إلى "Keys"
4. انقر "Create Key"
5. انسخ المفتاح (يبدأ بـ `sk-or-v1-...`)

💡 **نصيحة**: OpenRouter يعطيك رصيد تجريبي مجاني!

### الخطوة 3: تثبيت المشروع (دقيقة واحدة)

```bash
# استنساخ المشروع
git clone https://github.com/yourusername/OpenDevAgent.git
cd OpenDevAgent

# نسخ ملف الإعدادات (اختياري)
cp .env.example .env
```

### الخطوة 4: التشغيل (دقيقة واحدة)

```bash
# تشغيل كل شيء
docker-compose up -d

# انتظر حتى يصبح جاهزاً (10-30 ثانية)
# تابع السجلات:
docker-compose logs -f

# عندما ترى:
# ✅ backend  | Application startup complete
# ✅ frontend | ready - started server on 0.0.0.0:3000
# ✅ redis    | Ready to accept connections
```

### الخطوة 5: الاستخدام (30 ثانية)

1. افتح المتصفح: `http://localhost:3000`
2. الصق مفتاح OpenRouter API
3. اكتب مهمتك الأولى!

```
مثال:
"إنشاء REST API لإدارة قائمة المهام (To-Do List) 
باستخدام FastAPI مع دعم CRUD operations"
```

4. اختر:
   - اللغة: **Python**
   - الإطار: **FastAPI**
   - التعقيد: **متوسط**

5. انقر "بدء المهمة" وشاهد السحر يحدث! ✨

---

## 📊 ما الذي سيحدث؟

```
⏱️ الوقت المتوقع: 1-3 دقائق

📐 المرحلة 1: PLAN (30-60 ثانية)
   └─ Architect Agent يحلل المتطلبات ويصمم المعمارية

⚡ المرحلة 2: ACT (45-90 ثانية)
   └─ Coder Agent يولد الكود الكامل

🔍 المرحلة 3: OBSERVE & FIX (20-45 ثانية)
   └─ Debugger Agent يراجع الكود ويقترح تحسينات

✅ النتيجة النهائية:
   ├─ Architecture Document
   ├─ Complete Source Code
   │  ├─ main.py
   │  ├─ models.py
   │  ├─ config.py
   │  ├─ README.md
   │  └─ requirements.txt
   └─ Quality Review Report
```

---

## 🎓 مثال كامل - خطوة بخطوة

### المهمة: إنشاء API لإدارة المهام

#### 1. الوصف الدقيق

```
إنشاء REST API لإدارة قائمة المهام (To-Do List) مع:
- CRUD operations (Create, Read, Update, Delete)
- SQLite database
- FastAPI framework
- Pydantic models للتحقق من البيانات
- Error handling شامل
- API documentation تلقائية
```

#### 2. اختيار التقنية

```yaml
Language: Python 3.11+
Framework: FastAPI
Complexity: Medium
```

#### 3. النتائج المتوقعة

##### أ) Architecture Plan

```markdown
# To-Do List API Architecture

## System Overview
RESTful API for task management with SQLite persistence

## Components
1. FastAPI Application (main.py)
2. Database Layer (database.py)
3. Models (models.py)
4. Schemas (schemas.py)
5. CRUD Operations (crud.py)
6. API Routes (routes/tasks.py)

## Data Model
```python
class Task:
    - id: int (primary key)
    - title: str
    - description: str
    - completed: bool
    - created_at: datetime
```

## API Endpoints
- POST /tasks - إنشاء مهمة جديدة
- GET /tasks - قائمة كل المهام
- GET /tasks/{id} - الحصول على مهمة معينة
- PUT /tasks/{id} - تحديث مهمة
- DELETE /tasks/{id} - حذف مهمة
```

##### ب) Generated Code

```python
# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="To-Do List API",
    description="Task management API",
    version="1.0.0"
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db=db, task=task)

@app.get("/tasks", response_model=list[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks

# ... المزيد من endpoints
```

```python
# models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

##### ج) Quality Review

```yaml
Code Quality Score: 9/10

✅ Strengths:
  - Clean architecture
  - Proper error handling
  - Type hints throughout
  - Good separation of concerns
  - Comprehensive API documentation

⚠️ Areas for Improvement:
  - Add authentication middleware
  - Implement pagination for large datasets
  - Add input validation tests
  - Consider adding logging

🔒 Security:
  - ✅ No SQL injection vulnerabilities
  - ✅ Proper input validation
  - ⚠️ Consider adding rate limiting

🚀 Performance:
  - ✅ Database connection pooling
  - ✅ Efficient queries
  - 💡 Consider adding caching for read-heavy operations

🧪 Testing Recommendations:
  1. Unit tests for CRUD operations
  2. Integration tests for API endpoints
  3. Load testing for performance validation
```

---

## 🎨 استكشاف الواجهة

### 1. لوحة التحكم الرئيسية

```
┌─────────────────────────────────────────────────┐
│  🚀 OpenDevAgent                    [●] متصل    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────┐  ┌─────────────────────┐   │
│  │ إنشاء مهمة    │  │  حالة المهام         │   │
│  │               │  │                      │   │
│  │ [وصف المهمة] │  │  ✓ مهمة 1 - مكتملة   │   │
│  │ [اللغة]       │  │  ⟳ مهمة 2 - جاري     │   │
│  │ [الإطار]      │  │  ○ مهمة 3 - معلقة    │   │
│  │               │  │                      │   │
│  │  [بدء المهمة] │  │  [عرض التفاصيل]      │   │
│  └───────────────┘  └─────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│  📊 حالة الوكلاء                               │
│  ┌──────────┬──────────┬──────────┐            │
│  │Architect │  Coder   │ Debugger │            │
│  │  100%    │   45%    │   idle   │            │
│  │   ✓      │   ⟳     │    ○     │            │
│  └──────────┴──────────┴──────────┘            │
├─────────────────────────────────────────────────┤
│  📜 السجلات المباشرة                           │
│  [1] 🎯 Task started: Creating To-Do API...    │
│  [2] 📐 PLAN: Architect designing system...    │
│  [3] ⚡ ACT: Coder generating code...          │
│  [4] 🔍 OBSERVE: Debugger reviewing...         │
└─────────────────────────────────────────────────┘
```

### 2. نظام الإشعارات

```
┌──────────────────────────────────────┐
│  ✓  تم التحقق من مفتاح API بنجاح     │
│     12:34:56                         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  ⚡  تم بدء المهمة #task-abc-123      │
│     12:35:12                         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  ✨  المهمة مكتملة بنجاح!             │
│     12:37:45                         │
└──────────────────────────────────────┘
```

---

## 🛠️ الأوامر المفيدة

### إدارة Docker

```bash
# بدء الخدمات
docker-compose up -d

# إيقاف الخدمات
docker-compose down

# إعادة البناء
docker-compose up --build

# عرض السجلات
docker-compose logs -f

# عرض سجلات خدمة معينة
docker-compose logs -f backend

# حالة الخدمات
docker-compose ps

# إعادة تشغيل خدمة
docker-compose restart backend
```

### إدارة البيانات

```bash
# مسح كل البيانات وإعادة البدء
docker-compose down -v
docker-compose up -d

# نسخ احتياطي لـ Redis
docker exec opendev-redis redis-cli BGSAVE

# الاتصال بـ Redis
docker exec -it opendev-redis redis-cli
```

### استكشاف الأخطاء

```bash
# فحص صحة الخدمات
curl http://localhost:8000/api/health
curl http://localhost:3000

# دخول حاوية للتصحيح
docker exec -it opendev-backend bash

# عرض استخدام الموارد
docker stats

# تنظيف Docker
docker system prune -a
```

---

## 💡 نصائح للمبتدئين

### 1. كتابة وصف مهمة جيد

#### ❌ سيء

```
"إنشاء API"
```

#### ✅ جيد

```
"إنشاء REST API لإدارة المستخدمين مع:
- تسجيل دخول وخروج
- JWT authentication
- MongoDB للتخزين
- FastAPI framework
- معالجة الأخطاء الشاملة"
```

### 2. اختيار مستوى التعقيد المناسب

- **منخفض**: تطبيقات بسيطة، scripts، أدوات صغيرة
- **متوسط**: APIs متوسطة، تطبيقات web، CLIs
- **عالي**: أنظمة معقدة، microservices، تطبيقات enterprise

### 3. الاستفادة من النتائج

```bash
# احفظ الكود المولد
mkdir my-project
cd my-project

# انسخ الكود من الواجهة
# أو استخدم API مباشرة:
curl http://localhost:8000/api/task_status/{task_id} | jq .agents[1].logs[0] > main.py
```

### 4. التكرار والتحسين

لا تتوقع كود مثالي من المحاولة الأولى:

1. ابدأ بمهمة بسيطة
2. راجع النتائج
3. حسّن الوصف
4. أعد المحاولة
5. كرر حتى تحصل على ما تريد

---

## 🎯 مهام تدريبية مقترحة

### المستوى المبتدئ

```yaml
مهمة 1: "Hello World API"
  وصف: "إنشاء FastAPI API بسيط مع endpoint واحد يرجع Hello World"
  لغة: Python
  إطار: FastAPI
  تعقيد: منخفض

مهمة 2: "حاسبة CLI"
  وصف: "إنشاء تطبيق سطر أوامر لحاسبة بسيطة مع العمليات الأساسية"
  لغة: Python
  إطار: None
  تعقيد: منخفض
```

### المستوى المتوسط

```yaml
مهمة 3: "To-Do API مع Database"
  وصف: "REST API لإدارة المهام مع SQLite و CRUD operations"
  لغة: Python
  إطار: FastAPI
  تعقيد: متوسط

مهمة 4: "Weather Dashboard"
  وصف: "لوحة معلومات للطقس مع Next.js تعرض بيانات من API خارجي"
  لغة: TypeScript
  إطار: Next.js
  تعقيد: متوسط
```

### المستوى المتقدم

```yaml
مهمة 5: "E-commerce Backend"
  وصف: "نظام متجر إلكتروني مع products, cart, orders, users, authentication"
  لغة: Python
  إطار: FastAPI
  تعقيد: عالي

مهمة 6: "Real-time Chat App"
  وصف: "تطبيق دردشة فورية مع WebSockets و Redis للرسائل"
  لغة: Python
  إطار: FastAPI
  تعقيد: عالي
```

---

## 🤔 أسئلة شائعة

### س: كم يكلف استخدام OpenDevAgent؟

**ج**: المنصة مجانية ومفتوحة المصدر! تدفع فقط لاستخدام OpenRouter API:
- رصيد تجريبي مجاني عند التسجيل
- أسعار تنافسية جداً (cents لكل ألف token)
- تحكم كامل في الميزانية

### س: ما هي أفضل النماذج للاستخدام؟

**ج**: النماذج الافتراضية ممتازة:
- **Architect**: GPT-4 (تخطيط دقيق)
- **Coder**: Claude 3.5 Sonnet (كود عالي الجودة)
- **Debugger**: Claude 3.5 Sonnet (مراجعة شاملة)

### س: هل يمكنني استخدام نماذج مجانية؟

**ج**: نعم! جرب:
- `meta-llama/llama-3.1-70b` (مجاني)
- `google/gemini-pro` (مجاني مع قيود)
- `mistralai/mixtral-8x7b` (رخيص جداً)

### س: كيف أحسن جودة النتائج؟

**ج**:
1. اكتب وصف مفصل للمهمة
2. حدد متطلبات واضحة
3. اذكر أفضل الممارسات المطلوبة
4. استخدم نماذج أكثر تقدماً للمهام المعقدة
5. راجع وحسّن الوصف بناءً على النتائج

---

## 🎉 تهانينا!

أنت الآن جاهز لبدء استخدام OpenDevAgent! 

### الخطوات التالية:

1. ✅ جرب إنشاء مهمتك الأولى
2. 📖 اقرأ [KILO_ARCHITECTURE_AR.md](./KILO_ARCHITECTURE_AR.md) لفهم المعمارية
3. 🔧 استكشف [README_AR.md](./README_AR.md) للميزات المتقدمة
4. 💬 انضم إلى [مجتمعنا على Discord](https://discord.gg/opendevagent)
5. ⭐ أعط المشروع نجمة على GitHub

**سعيد بالبرمجة!** 🚀

---

<div align="center">

هل واجهت مشكلة؟ [افتح issue](https://github.com/yourusername/OpenDevAgent/issues)

هل لديك سؤال؟ [انضم إلى Discord](https://discord.gg/opendevagent)

</div>
