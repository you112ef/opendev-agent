# ✅ إعداد ونشر التطبيق - خطوات عملية

## 🎯 الخطوات المطلوبة (بالترتيب)

### ✅ الخطوة 1: إعداد Supabase Database (5 دقائق)

1. **افتح Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/editor
   ```

2. **انسخ محتوى الملف:**
   - الملف: `backend/supabase/migrations/001_init_ready.sql`
   - انسخ كل المحتوى

3. **الصقه في SQL Editor واضغط RUN**

4. **تحقق من النجاح:**
   - يجب أن ترى رسالة نجاح
   - تحقق من Tables في Database > Tables

### ✅ الخطوة 2: نشر Edge Functions (10 دقائق)

```bash
# 1. تثبيت Supabase CLI
npm install -g supabase

# 2. تسجيل الدخول
supabase login

# 3. الانتقال إلى مجلد supabase
cd backend/supabase

# 4. ربط المشروع
supabase link --project-ref sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc

# 5. نشر جميع Functions
./quick-deploy.sh
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

### ✅ الخطوة 3: إعداد Environment Variables (3 دقائق)

1. **اذهب إلى:**
   ```
   https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/functions
   ```

2. **أضف Environment Variables:**
   ```
   SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   SUPABASE_ANON_KEY=<انسخ-من-API-Settings>
   SUPABASE_SERVICE_ROLE_KEY=<انسخ-من-API-Settings>
   ```

3. **للحصول على Keys:**
   ```
   https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
   ```
   - انسخ `anon public` → `SUPABASE_ANON_KEY`
   - انسخ `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### ✅ الخطوة 4: نشر Frontend على Vercel (5 دقائق)

1. **اذهب إلى:** https://vercel.com/new

2. **Import Project:**
   - Repository: `you112ef/opendev-agent`
   - Framework: Next.js (auto-detected)
   - ⚠️ **Root Directory:** `frontend` (مهم جداً!)

3. **Environment Variables:**
   اضغط "Environment Variables" وأضف:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Deploy**

### ✅ الخطوة 5: تكوين GitHub OAuth (اختياري)

1. **إنشاء GitHub OAuth App:**
   - https://github.com/settings/developers
   - New OAuth App
   - Callback URL: `https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co/auth/v1/callback`

2. **في Supabase:**
   - https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/auth/providers
   - Enable GitHub
   - أضف Client ID و Secret

### ✅ الخطوة 6: التحقق والاختبار

1. **افتح رابط Vercel** (مثل: `https://your-project.vercel.app`)

2. **اختبار:**
   - ✅ أدخل OpenRouter API key
   - ✅ تحقق من ModelSelector - يجب أن يعرض جميع النماذج
   - ✅ أنشئ مهمة
   - ✅ تحقق من التحديثات الفورية

## 📋 Checklist النهائي

- [ ] Database migration run
- [ ] All 7 Functions deployed
- [ ] Environment variables set
- [ ] Vercel deployed
- [ ] GitHub OAuth configured (optional)
- [ ] Tested successfully

## 🔗 الروابط السريعة

- **SQL Editor:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/editor
- **Functions:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/functions
- **API Settings:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
- **Vercel:** https://vercel.com/new

## ✅ النتيجة

بعد إكمال جميع الخطوات:
- ✅ التطبيق يعمل بشكل كامل
- ✅ جميع نماذج OpenRouter متاحة (100+ نموذج)
- ✅ Real-time updates تعمل
- ✅ GitHub PRs تعمل
- ✅ جاهز للإنتاج
