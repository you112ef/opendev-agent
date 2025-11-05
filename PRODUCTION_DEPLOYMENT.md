# 🚀 Production Deployment - Step by Step

## ✅ الخطوة 1: إعداد Supabase Database

### 1.1 تشغيل Migration

1. **اذهب إلى Supabase SQL Editor:**
   https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/editor

2. **انسخ محتوى الملف:**
   `backend/supabase/migrations/001_init_ready.sql`

3. **الصقه في SQL Editor واضغط Run**

4. **تحقق من النجاح:**
   - يجب أن ترى: "✅ Database schema created successfully!"
   - تحقق من Tables في Database > Tables

### 1.2 تفعيل Realtime

1. اذهب إلى: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/database/replication
2. تأكد من تفعيل Realtime للجداول:
   - `runs`
   - `run_logs`
   - `agent_status`

## ✅ الخطوة 2: نشر Edge Functions

### 2.1 تثبيت Supabase CLI

```bash
npm install -g supabase
```

### 2.2 تسجيل الدخول

```bash
supabase login
```

### 2.3 ربط المشروع

```bash
cd backend/supabase
supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
```

### 2.4 نشر Functions

```bash
# نشر جميع Functions
./setup.sh

# أو يدوياً:
supabase functions deploy openrouter-models
supabase functions deploy openrouter-proxy
supabase functions deploy validate-api-key
supabase functions deploy run-handler
supabase functions deploy task-executor
supabase functions deploy github-pr
supabase functions deploy sandbox-execute
```

## ✅ الخطوة 3: إعداد Environment Variables

### في Supabase Dashboard:

1. اذهب إلى: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/functions

2. أضف Environment Variables:
   ```
   SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   SUPABASE_ANON_KEY=<انسخ-من-API-Settings>
   SUPABASE_SERVICE_ROLE_KEY=<انسخ-من-API-Settings>
   ```

3. احفظ

### الحصول على Keys:

1. اذهب إلى: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
2. انسخ:
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## ✅ الخطوة 4: نشر Frontend على Vercel

### 4.1 عبر Dashboard (الأسهل)

1. **اذهب إلى:** https://vercel.com/new

2. **Import Project:**
   - Repository: `you112ef/opendev-agent`
   - Framework: Next.js (auto-detected)
   - Root Directory: `frontend` ⚠️ مهم جداً

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Deploy**

### 4.2 التحقق من النشر

بعد النشر، ستحصل على رابط مثل:
`https://your-project.vercel.app`

## ✅ الخطوة 5: تكوين GitHub OAuth

1. **إنشاء GitHub OAuth App:**
   - اذهب إلى: https://github.com/settings/developers
   - New OAuth App
   - Authorization callback URL: `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co/auth/v1/callback`

2. **في Supabase Dashboard:**
   - اذهب إلى: https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/auth/providers
   - Enable GitHub
   - أضف Client ID و Client Secret

## ✅ الخطوة 6: التحقق والاختبار

### 6.1 التحقق من Functions

اختبر كل function:
```bash
# Test openrouter-models
curl https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co/functions/v1/openrouter-models

# Should return all models from OpenRouter
```

### 6.2 اختبار التطبيق

1. افتح رابط Vercel
2. أدخل OpenRouter API key
3. تحقق من ModelSelector - يجب أن يعرض جميع النماذج
4. أنشئ مهمة
5. تأكد من التحديثات الفورية

## 📋 Checklist النهائي

- [ ] Database migration run
- [ ] Realtime enabled
- [ ] All 7 Functions deployed
- [ ] Environment variables set
- [ ] Vercel deployed
- [ ] GitHub OAuth configured
- [ ] All models loading
- [ ] Task creation works
- [ ] Real-time updates work

## 🔗 الروابط المهمة

- **Supabase Dashboard:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc
- **SQL Editor:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/editor
- **API Settings:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
- **Functions:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions
- **Vercel:** https://vercel.com/new

## ✅ النتيجة

بعد إكمال جميع الخطوات:
- ✅ التطبيق يعمل بشكل كامل
- ✅ جميع النماذج متاحة
- ✅ Real-time updates تعمل
- ✅ GitHub PRs تعمل
- ✅ جاهز للإنتاج
