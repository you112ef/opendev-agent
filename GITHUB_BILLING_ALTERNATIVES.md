# 🔧 حل مشكلة GitHub Actions Billing

## ⚠️ المشكلة

```
The job was not started because your account is locked 
due to a billing issue.
```

حساب GitHub مقفل ولا يمكن تشغيل GitHub Actions.

---

## ✅ الحلول المتاحة

### الحل 1: حل مشكلة الفواتير (الأفضل)

#### الخطوات:
1. اذهب إلى: https://github.com/settings/billing
2. تحقق من:
   - Payment method
   - Billing issues/alerts
   - Usage limits
3. أضف/حدّث طريقة الدفع
4. أو: اختر Free plan مع حدود GitHub Actions المجانية

#### حدود Free Plan:
```yaml
GitHub Actions Free:
  - 2,000 دقيقة شهرياً (Linux runners)
  - 500 MB storage
  - مجاني للـ public repositories
```

---

### الحل 2: البناء المحلي ⚡ (سريع)

يمكنك بناء APK على جهازك:

```bash
# 1. تثبيت المتطلبات
# Node.js 20+
node --version

# Java JDK 17
java -version

# Android SDK
# حمّل من: https://developer.android.com/studio

# 2. Setup المشروع
cd frontend
npm install

# 3. بناء Next.js
npm run build
npx next export

# 4. Initialize Capacitor (أول مرة فقط)
npx cap init "OpenDevAgent" "com.opendevagent.app" --web-dir=out
npx cap add android

# 5. Sync
npx cap sync android

# 6. Build APK
cd android
./gradlew assembleDebug

# 7. APK جاهز في:
# android/app/build/outputs/apk/debug/app-debug.apk
```

**⏱️ الوقت**: ~15-20 دقيقة أول مرة، ~5-10 دقائق بعدها

---

### الحل 3: استخدام خدمات CI/CD مجانية 🆓

#### أ) CircleCI (مجاني)

**الحدود المجانية**:
- 6,000 دقيقة بناء شهرياً
- 1 concurrent job

**الإعداد**:

1. سجّل في: https://circleci.com
2. اربط repository
3. أنشئ `.circleci/config.yml`:

```yaml
version: 2.1

jobs:
  build-android:
    docker:
      - image: cimg/android:2024.01.1-node
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: |
            cd frontend
            npm ci
      - run:
          name: Build Next.js
          command: |
            cd frontend
            npm run build
            npx next export
      - run:
          name: Build APK
          command: |
            cd frontend
            npx cap init "OpenDevAgent" "com.opendevagent.app" --web-dir=out
            npx cap add android
            npx cap sync android
            cd android
            ./gradlew assembleDebug
      - store_artifacts:
          path: frontend/android/app/build/outputs/apk/debug/app-debug.apk

workflows:
  build:
    jobs:
      - build-android
```

#### ب) GitLab CI/CD (مجاني)

**الحدود المجانية**:
- 400 دقيقة شهرياً (free tier)
- Unlimited للـ self-hosted runners

**الإعداد**:

1. انسخ repository إلى GitLab: https://gitlab.com
2. أنشئ `.gitlab-ci.yml`:

```yaml
image: openjdk:17-jdk

variables:
  ANDROID_COMPILE_SDK: "34"
  ANDROID_BUILD_TOOLS: "34.0.0"
  ANDROID_SDK_TOOLS: "9477386"

before_script:
  - apt-get update -qq
  - apt-get install -y nodejs npm
  - node --version

stages:
  - build

build-apk:
  stage: build
  script:
    - cd frontend
    - npm ci
    - npm run build
    - npx next export
    - npx cap init "OpenDevAgent" "com.opendevagent.app" --web-dir=out
    - npx cap add android
    - npx cap sync android
    - cd android
    - ./gradlew assembleDebug
  artifacts:
    paths:
      - frontend/android/app/build/outputs/apk/debug/app-debug.apk
    expire_in: 30 days
```

#### ج) Travis CI (مجاني للـ Open Source)

**الحدود**: 10,000 credits مجانية

1. سجّل في: https://travis-ci.com
2. أنشئ `.travis.yml`:

```yaml
language: android
jdk: openjdk17

android:
  components:
    - build-tools-34.0.0
    - android-34

before_install:
  - nvm install 20
  - nvm use 20

script:
  - cd frontend
  - npm ci
  - npm run build
  - npx next export
  - npx cap init "OpenDevAgent" "com.opendevagent.app" --web-dir=out
  - npx cap add android
  - npx cap sync android
  - cd android
  - ./gradlew assembleDebug

deploy:
  provider: releases
  api_key: $GITHUB_TOKEN
  file: frontend/android/app/build/outputs/apk/debug/app-debug.apk
  skip_cleanup: true
  on:
    tags: true
```

#### د) AppVeyor (مجاني)

**الحدود**: Unlimited للـ Open Source

1. سجّل في: https://ci.appveyor.com
2. أنشئ `appveyor.yml`:

```yaml
version: 1.0.{build}
image: Ubuntu2004

install:
  - sh: |
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
      sudo apt-get install -y nodejs openjdk-17-jdk

build_script:
  - cd frontend
  - npm ci
  - npm run build
  - npx next export
  - npx cap init "OpenDevAgent" "com.opendevagent.app" --web-dir=out
  - npx cap add android
  - npx cap sync android
  - cd android
  - ./gradlew assembleDebug

artifacts:
  - path: frontend/android/app/build/outputs/apk/debug/app-debug.apk
    name: OpenDevAgent-Debug-APK
```

---

### الحل 4: Netlify/Vercel (للـ Web فقط)

**ملاحظة**: لن تحصل على APK، لكن يمكن نشر التطبيق كـ web app:

```bash
# Netlify
npm install -g netlify-cli
cd frontend
npm run build
netlify deploy --prod

# Vercel
npm install -g vercel
cd frontend
vercel --prod
```

---

## 🎯 التوصية

### للاستخدام الفوري:
✅ **البناء المحلي** (الحل 2)
- أسرع وأسهل
- لا يحتاج حساب
- كامل التحكم

### للاستخدام طويل المدى:
✅ **CircleCI** (الحل 3أ)
- 6,000 دقيقة مجانية
- سهل الإعداد
- دعم ممتاز

### لحل المشكلة نهائياً:
✅ **حل مشكلة GitHub Billing** (الحل 1)
- GitHub Actions أفضل تكامل
- 2,000 دقيقة مجانية
- سهل الاستخدام

---

## 📋 خطوات سريعة للبناء المحلي

```bash
# 1. Clone repository
git clone https://github.com/you112ef/opendev-agent
cd opendev-agent/frontend

# 2. Install dependencies
npm install

# 3. Build
npm run build
npx next export

# 4. Setup Capacitor
npx cap init "OpenDevAgent" "com.opendevagent.app" --web-dir=out
npx cap add android
npx cap sync android

# 5. Build APK
cd android
./gradlew assembleDebug

# 6. Get APK
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔗 روابط مفيدة

- **GitHub Billing**: https://github.com/settings/billing
- **CircleCI**: https://circleci.com
- **GitLab**: https://gitlab.com
- **Travis CI**: https://travis-ci.com
- **AppVeyor**: https://ci.appveyor.com
- **Android Studio**: https://developer.android.com/studio

---

## ❓ الأسئلة الشائعة

### كم تكلفة GitHub Actions؟
- **Free**: 2,000 دقيقة/شهر (public repos)
- **Pro**: $4/شهر + 3,000 دقيقة
- **Team**: $4/user/شهر + 3,000 دقيقة

### هل يمكن استخدام GitHub Actions مجاناً؟
نعم! للـ public repositories تحصل على 2,000 دقيقة مجانية.

### ما أفضل بديل مجاني؟
**CircleCI** - 6,000 دقيقة مجانية شهرياً.

### هل البناء المحلي صعب؟
لا، يحتاج فقط Node.js + Java + Android SDK.

---

**تاريخ**: 2025-11-03  
**الحالة**: ✅ حلول متعددة متاحة
