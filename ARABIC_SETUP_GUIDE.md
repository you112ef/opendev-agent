# 🚀 دليل الإعداد والنشر الكامل
# Project: sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

## ✅ الخطوة 1: إعداد Supabase

### 1.1 تثبيت Supabase CLI
```bash
npm install -g supabase
```

### 1.2 تسجيل الدخول
```bash
supabase login
```

### 1.3 ربط المشروع
```bash
cd backend/supabase
supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
```

### 1.4 تشغيل Migration

**الطريقة 1: عبر SQL Editor (الأسهل)**
1. اذهب إلى: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/editor
2. افتح SQL Editor
3. انسخ محتوى `backend/supabase/migrations/001_init.sql`
4. الصقه و Run

**الطريقة 2: عبر CLI**
```bash
supabase db push
```

### 1.5 نشر جميع Edge Functions

**الطريقة السريعة:**
```bash
cd backend/supabase
./setup.sh
```

**أو يدوياً:**
```bash
supabase functions deploy openrouter-models
supabase functions deploy openrouter-proxy
supabase functions deploy validate-api-key
supabase functions deploy run-handler
supabase functions deploy task-executor
supabase functions deploy github-pr
supabase functions deploy sandbox-execute
```

### 1.6 إعداد Environment Variables

اذهب إلى: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/functions

أضف:
```
SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
SUPABASE_ANON_KEY=<من-API-Settings>
SUPABASE_SERVICE_ROLE_KEY=<من-API-Settings>
```

## ✅ الخطوة 2: الحصول على API Keys

1. اذهب إلى: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
2. انسخ:
   - `Project URL`: https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   - `anon public` key
   - `service_role` key

## ✅ الخطوة 3: نشر على Vercel

### عبر Dashboard:
1. اذهب إلى: https://vercel.com/new
2. Import: `you112ef/opendev-agent`
3. Root Directory: `frontend`
4. Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
5. Deploy

## ✅ الخطوة 4: تكوين GitHub OAuth

1. اذهب إلى: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/auth/providers
2. Enable GitHub
3. أضف Client ID و Secret
4. Redirect URL: `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co/auth/v1/callback`

## ✅ التحقق من النماذج

جميع نماذج OpenRouter متاحة بدون استثناء:
- ✅ `openrouter-models` function يعرض جميع النماذج
- ✅ ModelSelector محدث مع بحث وتحسينات
- ✅ لا يوجد استثناء أو فلترة

## 🎯 بعد النشر

1. افتح رابط Vercel
2. أدخل OpenRouter API key
3. تحقق من ModelSelector - يجب أن يعرض جميع النماذج
4. اختر أي نموذج
5. أنشئ مهمة
6. تأكد من التحديثات الفورية
