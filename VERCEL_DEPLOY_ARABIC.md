# 🚀 النشر على Vercel - تعليمات نهائية

## ✅ الطريقة الأسهل: Vercel Dashboard

### الخطوات (5 دقائق):

1. **افتح الرابط:**
   ```
   https://vercel.com/new
   ```

2. **Import Project:**
   - ابحث عن: `you112ef/opendev-agent`
   - اضغط Import

3. **Configure (مهم جداً!):**
   - **Root Directory:** غير من `/` إلى `frontend` ⚠️
   - **Framework:** Next.js (auto-detected)
   - باقي الإعدادات تلقائية

4. **Environment Variables:**
   قبل النشر، اضغط "Environment Variables" وأضف:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<انسخ-من-Supabase>
   ```

5. **Deploy:**
   - اضغط "Deploy"
   - انتظر 2-3 دقائق
   - ستحصل على رابط مثل: `https://your-project.vercel.app`

### 🔑 الحصول على Anon Key:

```
https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
```
انسخ `anon public` key

## ✅ الطريقة الثانية: Vercel CLI

```bash
# من مجلد المشروع
cd /workspace

# تسجيل الدخول (سيفتح متصفح)
vercel login

# النشر
vercel --prod

# عند السؤال عن Root Directory: أدخل `frontend`
# عند السؤال عن Environment Variables: أضفها
```

## ⚠️ ملاحظات مهمة

1. **Root Directory يجب أن يكون `frontend`**
   - إذا كان `/` سيحدث خطأ في البناء
   - غير إلى `frontend`

2. **Environment Variables:**
   - يجب أن تبدأ بـ `NEXT_PUBLIC_`
   - بدون هذا الـ prefix لن تعمل في المتصفح

3. **بعد النشر:**
   - افتح الرابط
   - أدخل OpenRouter API key
   - تحقق من أن جميع النماذج تظهر

## ✅ Checklist:

- [ ] Root Directory = `frontend`
- [ ] Environment Variables مضافة
- [ ] Build نجح
- [ ] التطبيق يعمل

## 🔗 روابط سريعة:

- **Deploy:** https://vercel.com/new
- **Supabase API:** https://supabase.com/dashboard/project/sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc/settings/api
