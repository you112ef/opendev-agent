# 🚀 Vercel Deployment Guide

## طريقة النشر إلى Vercel

### الطريقة 1: عبر Vercel Dashboard (الأسهل والأسرع)

1. **اذهب إلى [Vercel Dashboard](https://vercel.com/new)**

2. **Import Project:**
   - اضغط على "Add New Project"
   - اختر GitHub repository: `you112ef/opendev-agent`
   - Vercel سيكتشف تلقائياً أنه Next.js project

3. **تكوين المشروع:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `frontend` ⚠️ مهم جداً
   - **Build Command:** `npm run build` (auto)
   - **Output Directory:** `.next` (auto)
   - **Install Command:** `npm install` (auto)

4. **Environment Variables:**
   أضف المتغيرات التالية قبل النشر:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-dashboard>
   ```

5. **Deploy:**
   - اضغط "Deploy"
   - انتظر حتى يكتمل البناء (2-3 دقائق)
   - ستحصل على رابط مثل: `https://your-project.vercel.app`

### الطريقة 2: عبر Vercel CLI

```bash
# 1. تثبيت Vercel CLI
npm install -g vercel

# 2. تسجيل الدخول
vercel login

# 3. الانتقال إلى مجلد Frontend
cd frontend

# 4. النشر (سيسألك عن الإعدادات)
vercel

# 5. إضافة Environment Variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# 6. النشر للإنتاج
vercel --prod
```

### 📋 Checklist قبل النشر

- [x] تم push الكود إلى GitHub main branch ✅
- [ ] تم تكوين Supabase project
- [ ] تم نشر Supabase Edge Functions
- [ ] تم الحصول على Supabase URL و Anon Key
- [ ] جاهز لإضافة Environment Variables في Vercel

### ⚙️ Project Configuration

المشروع مُكوّن بشكل صحيح:
- ✅ `vercel.json` موجود في root
- ✅ `frontend/package.json` موجود
- ✅ Next.js 14 configured
- ✅ Build settings صحيحة

### 🔧 Environment Variables المطلوبة

قبل النشر، يجب إضافة:

```
NEXT_PUBLIC_SUPABASE_URL=https://sbp_e2fc6787340d1be587c2eb26a10146db79f2efdc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

**كيفية الحصول على Anon Key:**
1. اذهب إلى Supabase Dashboard
2. Project Settings > API
3. انسخ `anon public` key

### 🎯 بعد النشر

1. افتح رابط Vercel (مثل: `https://your-project.vercel.app`)
2. أدخل OpenRouter API key
3. اختبر إنشاء مهمة
4. تأكد من أن Realtime updates تعمل

### 🔍 Troubleshooting

**إذا فشل البناء:**
- تأكد من Root Directory = `frontend`
- تحقق من Build Logs في Vercel Dashboard
- تأكد من Environment Variables

**إذا كانت Environment Variables لا تعمل:**
- تأكد من `NEXT_PUBLIC_` prefix
- أعد deploy بعد إضافة المتغيرات

### 📝 ملاحظات

- Vercel سيحذف تلقائياً ملفات غير ضرورية
- Build time: ~2-3 دقائق
- كل push جديد سيتم النشر تلقائياً (إذا فعلت GitHub Integration)
