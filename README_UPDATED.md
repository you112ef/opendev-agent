# Capy-Inspired AI Engineer Platform

منصة مهندس برمجيات ذكي تعمل end-to-end — تقبل قضايا/مهام، تقوم بتحليلها تلقائيًا، تنفذ الكود داخل بيئة معزولة، وتفتح Pull Requests على GitHub.

## ✨ المميزات

- 🤖 **تكامل OpenRouter الكامل**: اكتشاف تلقائي لجميع النماذج المتاحة
- 🔐 **إدارة آمنة لمفاتيح API**: تخزين مشفر في Supabase Vault
- ⚡ **تحديثات فورية**: استخدام Supabase Realtime للبث المباشر
- 🎨 **واجهة عصرية**: تصميم داكن/فاتح مع دعم اللغة العربية
- 🔄 **إدارة المهام**: إنشاء وتتبع المهام في الوقت الفعلي

## 🏗️ البنية المعمارية

### Frontend (Vercel)
- **Framework**: Next.js 14 (React + TypeScript)
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Backend Integration**: Supabase Client SDK

### Backend (Supabase)
- **Database**: PostgreSQL
- **API**: Supabase Edge Functions (Deno runtime)
- **Auth**: Supabase Auth (GitHub OAuth + Email)
- **Realtime**: Supabase Realtime Subscriptions
- **Storage**: Supabase Storage

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- حساب Supabase
- حساب OpenRouter (للحصول على مفتاح API)

### التثبيت

1. **استنساخ المشروع**
   ```bash
   git clone <repository-url>
   cd capy-clone-like-platform
   ```

2. **إعداد Supabase**
   - أنشئ مشروع جديد في [Supabase](https://supabase.com)
   - نفّذ migration من `backend/supabase/migrations/001_init.sql`
   - انشر Edge Functions (انظر `SUPABASE_SETUP.md`)

3. **إعداد Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # عدّل .env.local بإضافة مفاتيح Supabase
   ```

4. **تشغيل التطبيق**
   ```bash
   npm run dev
   ```

## 📁 هيكل المشروع

```
frontend/
├── components/          # مكونات React
├── lib/                # مكتبات وAPI clients
├── pages/              # صفحات Next.js
└── styles/             # ملفات CSS

backend/
├── supabase/
│   ├── functions/      # Edge Functions
│   └── migrations/     # Database migrations
└── agent_logic/        # منطق الوكلاء (Legacy)
```

## 🔧 التكوين

### متغيرات البيئة (Frontend)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Edge Functions

اضبط في Supabase Dashboard > Project Settings > Edge Functions:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📚 الوثائق

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Deployment Guide](./DEPLOYMENT_SUPABASE.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

## 🎯 الاستخدام

1. **إدخال مفتاح API**
   - افتح التطبيق
   - أدخل مفتاح OpenRouter API الخاص بك
   - سيتم التحقق منه وحفظه بشكل آمن

2. **اختيار النموذج**
   - اختر النموذج المفضل من القائمة المنسدلة
   - جميع النماذج متاحة من OpenRouter

3. **إنشاء مهمة**
   - املأ تفاصيل المهمة
   - اختر اللغة والإطار
   - حدد مستوى التعقيد
   - ابدأ التنفيذ

4. **متابعة التقدم**
   - شاهد التحديثات الفورية للسجلات
   - تتبع حالة كل وكيل
   - راجع النتائج عند الانتهاء

## 🔒 الأمان

- Row Level Security (RLS) مفعّل على جميع الجداول
- مفاتيح API مشفرة في Supabase Vault
- التحقق من الهوية قبل كل طلب
- حماية CORS محدّثة

## 🚢 النشر

### Vercel (Frontend)
1. اربط مستودع GitHub
2. اضبط متغيرات البيئة
3. انشر تلقائيًا

### Supabase (Backend)
1. انشر Edge Functions:
   ```bash
   supabase functions deploy <function-name>
   ```
2. تأكد من تفعيل Realtime
3. راجع RLS policies

## 📝 التطوير

المشروع يستخدم:
- TypeScript للتحقق من الأنواع
- ESLint للجودة
- TailwindCSS للتصميم
- Supabase للبنية التحتية

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة دليل المساهمة قبل البدء.

## 📄 الترخيص

MIT License
