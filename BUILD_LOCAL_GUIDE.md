# 🏗️ دليل البناء المحلي - Android APK

<div align="center">

![Local Build](https://img.shields.io/badge/Build-Local-success)
![Time](https://img.shields.io/badge/Time-15_minutes-blue)
![Free](https://img.shields.io/badge/Cost-Free-green)

**بناء APK على جهازك بدون GitHub Actions**

</div>

---

## 📋 المتطلبات

### 1. Node.js 20+
```bash
# تحقق من التثبيت
node --version  # يجب أن يكون >= 20.0.0
npm --version

# لو غير مثبت، حمّل من:
# https://nodejs.org/
```

### 2. Java JDK 17
```bash
# تحقق من التثبيت
java -version  # يجب أن يكون >= 17

# لو غير مثبت:
# Windows/Mac: https://adoptium.net/
# Linux:
sudo apt install openjdk-17-jdk
```

### 3. Android SDK
```bash
# الطريقة 1: تثبيت Android Studio (موصى به)
# حمّل من: https://developer.android.com/studio

# الطريقة 2: Command Line Tools فقط
# حمّل من: https://developer.android.com/studio#command-tools

# بعد التثبيت، أضف إلى PATH:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## 🚀 خطوات البناء

### الخطوة 1: Clone المشروع

```bash
# Clone من GitHub
git clone https://github.com/you112ef/opendev-agent.git
cd opendev-agent

# أو لو عندك المشروع محلياً
cd /path/to/opendev-agent
```

### الخطوة 2: انتقل إلى Frontend

```bash
cd frontend
```

### الخطوة 3: تثبيت Dependencies

```bash
npm install

# لو حصل خطأ، جرّب:
npm install --legacy-peer-deps

# أو:
npm ci
```

**⏱️ الوقت**: ~2-3 دقائق

### الخطوة 4: بناء Next.js

```bash
# Build Next.js app
npm run build

# Export static files
npx next export
```

**⏱️ الوقت**: ~1-2 دقائق

سيتم إنشاء مجلد `out/` يحتوي على الملفات الاستاتيكية.

### الخطوة 5: Initialize Capacitor (أول مرة فقط)

```bash
# Initialize Capacitor
npx cap init "OpenDevAgent" "com.opendevagent.app" --web-dir=out

# Add Android platform
npx cap add android
```

**⏱️ الوقت**: ~1-2 دقائق

**ملاحظة**: هذه الخطوة مرة واحدة فقط. المرات القادمة تخطاها.

### الخطوة 6: Sync Capacitor

```bash
# Sync web code with Android
npx cap sync android
```

**⏱️ الوقت**: ~30 ثانية

### الخطوة 7: Build APK

```bash
# انتقل إلى مجلد Android
cd android

# Build Debug APK
./gradlew assembleDebug

# أو للـ Release APK (يحتاج keystore)
./gradlew assembleRelease
```

**⏱️ الوقت**: 
- أول مرة: ~5-8 دقائق (تحميل dependencies)
- المرات التالية: ~2-3 دقائق

### الخطوة 8: احصل على APK

```bash
# Debug APK موجود في:
ls -lh app/build/outputs/apk/debug/app-debug.apk

# Release APK موجود في:
ls -lh app/build/outputs/apk/release/app-release.apk

# نسخ إلى مكان سهل
cp app/build/outputs/apk/debug/app-debug.apk ~/Desktop/OpenDevAgent.apk
```

---

## ⏱️ ملخص الوقت

| الخطوة | الوقت (أول مرة) | الوقت (المرات التالية) |
|--------|-----------------|------------------------|
| Clone | 1-2 دقيقة | - |
| npm install | 2-3 دقائق | - |
| npm run build | 1-2 دقيقة | 1 دقيقة |
| npx next export | 30 ثانية | 30 ثانية |
| cap init | 1-2 دقيقة | - (مرة واحدة) |
| cap add android | 1-2 دقيقة | - (مرة واحدة) |
| cap sync | 30 ثانية | 30 ثانية |
| gradlew assembleDebug | 5-8 دقائق | 2-3 دقائق |
| **المجموع** | **15-20 دقيقة** | **5-7 دقائق** |

---

## 🔄 التحديثات السريعة

بعد أول build، للتحديثات السريعة:

```bash
# فقط هذه الأوامر:
cd frontend
npm run build
npx next export
npx cap sync android
cd android
./gradlew assembleDebug

# ⏱️ الوقت: ~5 دقائق
```

---

## 🛠️ استكشاف الأخطاء

### خطأ: "ANDROID_HOME not set"

```bash
# Linux/Mac
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Windows
setx ANDROID_HOME "C:\Users\YourUsername\AppData\Local\Android\Sdk"
```

### خطأ: "Gradle build failed"

```bash
# تنظيف وإعادة البناء
cd frontend/android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### خطأ: "npm install failed"

```bash
# حذف node_modules وإعادة المحاولة
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### خطأ: "Java version mismatch"

```bash
# تحقق من إصدار Java
java -version

# استخدم Java 17
sudo update-alternatives --config java
# اختر Java 17
```

### خطأ: "capacitor not found"

```bash
# تثبيت Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
```

---

## 📲 تثبيت APK على الهاتف

### الطريقة 1: نقل الملف

```
1. انسخ app-debug.apk إلى هاتفك (USB/Email/Cloud)
2. افتح الملف على الهاتف
3. اسمح بالتثبيت من مصادر غير معروفة
4. اضغط "Install"
```

### الطريقة 2: ADB

```bash
# تأكد من تفعيل USB Debugging على الهاتف
adb devices

# تثبيت APK
adb install app/build/outputs/apk/debug/app-debug.apk

# لو APK مثبت مسبقاً، استخدم -r للـ reinstall
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### الطريقة 3: Android Studio

```
1. افتح Android Studio
2. Device Manager → Connect Device
3. Drag & Drop APK إلى الجهاز
```

---

## 🎨 تخصيص قبل البناء

### تغيير اسم التطبيق

```typescript
// frontend/capacitor.config.ts
const config: CapacitorConfig = {
  appName: 'اسم تطبيقك هنا',  // ← غيّر هنا
  // ...
};
```

### تغيير الأيقونة

```bash
# أضف صورتك في:
frontend/public/icon.png  (512x512)

# ستظهر تلقائياً في التطبيق
```

---

## 📊 معلومات APK

```yaml
App Name: OpenDevAgent
Package: com.opendevagent.app
Size: ~10-20 MB (Debug) / ~8-15 MB (Release)
Min Android: 5.0 (API 21)
Target Android: 14 (API 34)
Architecture: Universal (arm64, armeabi, x86, x86_64)
```

---

## ✅ Checklist

قبل البناء، تأكد من:
- [ ] Node.js 20+ مثبت
- [ ] Java JDK 17 مثبت
- [ ] Android SDK مثبت
- [ ] ANDROID_HOME معرّف
- [ ] Internet connection (لتحميل dependencies أول مرة)

---

## 🎯 الخلاصة

البناء المحلي:
- ✅ **مجاني** - لا تحتاج حساب أو اشتراك
- ✅ **سريع** - 5-7 دقائق بعد الإعداد الأولي
- ✅ **كامل التحكم** - تعديل وبناء فوراً
- ✅ **لا حدود** - ابني كم تريد

---

**تاريخ**: 2025-11-03  
**الحالة**: ✅ دليل كامل جاهز
