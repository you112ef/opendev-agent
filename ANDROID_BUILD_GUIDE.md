# 📱 دليل بناء تطبيق Android

<div align="center">

![Android](https://img.shields.io/badge/Platform-Android-green)
![Capacitor](https://img.shields.io/badge/Capacitor-5.5-blue)
![Automated](https://img.shields.io/badge/Build-Automated-success)

**تطبيق OpenDevAgent على Android**  
**البناء التلقائي عبر GitHub Actions**

</div>

---

## 🎯 نظرة عامة

تم إعداد المشروع لبناء تطبيق Android APK تلقائياً باستخدام:
- ✅ **Capacitor** - لتحويل Next.js إلى Android
- ✅ **GitHub Actions** - للبناء التلقائي
- ✅ **Automated Signing** - التوقيع التلقائي للـ APK

---

## 🚀 البناء التلقائي

### يتم البناء تلقائياً عند:

1. **Push إلى main** - بناء Debug APK
2. **Push إلى أي branch** - بناء Debug APK
3. **Pull Request** - بناء Debug APK مع تعليق
4. **إنشاء Tag (v*)** - بناء Release APK موقّع
5. **Manual Trigger** - يمكن تشغيله يدوياً

---

## 📦 ما يتم بناؤه

### Debug APK
```
📱 App Name: OpenDevAgent
📦 Package: com.opendevagent.app
🔓 Signed: Debug signature
💾 Size: ~10-20 MB
⏱️ Build Time: ~5-10 minutes
```

### Release APK
```
📱 App Name: OpenDevAgent
📦 Package: com.opendevagent.app
🔐 Signed: Release signature (production)
💾 Size: ~8-15 MB (optimized)
⏱️ Build Time: ~10-15 minutes
```

---

## 🔧 إعداد الـ Release Signing

### 1. إنشاء Keystore

```bash
# على جهازك المحلي
keytool -genkeypair -v \
  -keystore release.keystore \
  -alias opendevagent \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=OpenDevAgent,OU=Development,O=OpenDevAgent,L=City,ST=State,C=US"
```

### 2. تحويل Keystore إلى Base64

```bash
base64 -i release.keystore -o keystore.txt
# أو على Linux/Mac:
cat release.keystore | base64 > keystore.txt
```

### 3. إضافة Secrets إلى GitHub

اذهب إلى:
```
Settings → Secrets and variables → Actions → New repository secret
```

أضف الـ Secrets التالية:

```yaml
KEYSTORE_FILE: [محتوى ملف keystore.txt]
KEYSTORE_PASSWORD: [كلمة سر الـ keystore]
KEY_ALIAS: opendevagent
KEY_PASSWORD: [كلمة سر الـ key]
```

---

## 📥 تحميل APK

### من GitHub Actions

1. اذهب إلى **Actions** tab
2. اختر أحدث workflow run
3. scroll down إلى **Artifacts**
4. حمّل **opendevagent-debug-xxx.apk**

### من Releases (للـ Release APK)

1. اذهب إلى **Releases**
2. اختر آخر Release
3. حمّل **app-release.apk**

---

## 📲 تثبيت APK

### على جهاز Android

#### الطريقة 1: التثبيت المباشر
```
1. حمّل APK على الهاتف
2. افتح الملف
3. اسمح بالتثبيت من مصادر غير معروفة (إذا لزم)
4. اضغط "Install"
```

#### الطريقة 2: باستخدام ADB
```bash
# تأكد من تفعيل USB Debugging
adb devices
adb install app-debug.apk
```

#### الطريقة 3: باستخدام Android Studio
```
1. افتح Android Studio
2. Device Manager → Connect Device
3. Drag & Drop APK إلى الجهاز
```

---

## 🛠️ البناء المحلي

### المتطلبات

```bash
# Node.js 20+
node --version

# Java JDK 17
java -version

# Android SDK
echo $ANDROID_HOME
```

### خطوات البناء

```bash
# 1. انتقل إلى frontend
cd frontend

# 2. تثبيت dependencies
npm install

# 3. بناء Next.js
npm run build

# 4. Export static files
npx next export

# 5. Initialize Capacitor (first time only)
npx cap init "OpenDevAgent" "com.opendevagent.app" --web-dir=out
npx cap add android

# 6. Sync Capacitor
npx cap sync android

# 7. Build APK
cd android
./gradlew assembleDebug

# للـ Release APK
./gradlew assembleRelease
```

### مواقع الـ APK

```
Debug APK:
frontend/android/app/build/outputs/apk/debug/app-debug.apk

Release APK:
frontend/android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎨 تخصيص التطبيق

### تغيير اسم التطبيق

```typescript
// frontend/capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.opendevagent.app',
  appName: 'OpenDevAgent',  // ← غيّر هنا
  // ...
};
```

### تغيير الأيقونة

```bash
# أضف الأيقونة
frontend/android/app/src/main/res/
  ├── mipmap-hdpi/ic_launcher.png (72x72)
  ├── mipmap-mdpi/ic_launcher.png (48x48)
  ├── mipmap-xhdpi/ic_launcher.png (96x96)
  ├── mipmap-xxhdpi/ic_launcher.png (144x144)
  └── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

### تغيير الألوان

```xml
<!-- frontend/android/app/src/main/res/values/colors.xml -->
<resources>
    <color name="colorPrimary">#000000</color>
    <color name="colorPrimaryDark">#000000</color>
    <color name="colorAccent">#FFFFFF</color>
</resources>
```

---

## 🔍 استكشاف الأخطاء

### خطأ: "Gradle build failed"

```bash
# تنظيف وإعادة البناء
cd frontend/android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### خطأ: "ANDROID_HOME not set"

```bash
# Linux/Mac
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# Windows
setx ANDROID_HOME "C:\Users\YourUsername\AppData\Local\Android\Sdk"
```

### خطأ: "Capacitor not found"

```bash
cd frontend
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap sync
```

### APK لا يعمل على الهاتف

```
1. تحقق من إصدار Android (يجب أن يكون 5.0+)
2. تأكد من السماح بالتثبيت من مصادر غير معروفة
3. جرّب إلغاء التثبيت وإعادة التثبيت
4. تحقق من logs: adb logcat
```

---

## 📊 معلومات التطبيق

```yaml
App Name: OpenDevAgent
Package ID: com.opendevagent.app
Platform: Android 5.0+ (API 21+)
Architecture: arm64-v8a, armeabi-v7a, x86, x86_64
Size (Debug): ~15-25 MB
Size (Release): ~10-18 MB
Permissions:
  - INTERNET (للاتصال بالـ API)
  - ACCESS_NETWORK_STATE
```

---

## 🚀 نشر على Google Play Store

### 1. إنشاء Release Build موقّع

```bash
cd frontend/android
./gradlew bundleRelease
```

### 2. الملف الناتج

```
frontend/android/app/build/outputs/bundle/release/app-release.aab
```

### 3. رفع إلى Google Play Console

```
1. افتح https://play.google.com/console
2. اختر تطبيقك أو أنشئ واحد جديد
3. Production → Create new release
4. Upload app-release.aab
5. املأ معلومات التطبيق
6. Submit for review
```

---

## 🔄 التحديثات التلقائية

كل مرة تقوم بـ push إلى GitHub:
1. ✅ يتم بناء APK جديد تلقائياً
2. ✅ يتم رفعه إلى Artifacts
3. ✅ يمكن تحميله فوراً
4. ✅ للـ tags: يتم إنشاء Release جديد

---

## 📝 ملاحظات مهمة

### للـ Debug APK:
- ✅ يعمل فوراً بدون إعداد
- ✅ مناسب للتطوير والاختبار
- ⚠️ حجم أكبر قليلاً
- ⚠️ أداء أقل قليلاً

### للـ Release APK:
- ✅ محسّن للأداء
- ✅ حجم أصغر
- ✅ جاهز للنشر
- ⚠️ يحتاج keystore للتوقيع

---

## 🎯 الخطوات التالية

1. ✅ قم بـ push للتغييرات
2. ✅ انتظر اكتمال GitHub Action (~10 دقائق)
3. ✅ حمّل APK من Artifacts
4. ✅ ثبّت على هاتفك
5. ✅ اختبر التطبيق

---

## 🔗 روابط مفيدة

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Studio](https://developer.android.com/studio)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Google Play Console](https://play.google.com/console)

---

## ✨ الخلاصة

<div align="center">

### 🎉 تطبيق Android جاهز!

**البناء التلقائي** • **GitHub Actions** • **سهل التثبيت**

كل push = APK جديد تلقائياً! 🚀

</div>

---

**تاريخ الإنشاء**: 2025-11-02  
**الحالة**: ✅ جاهز للاستخدام

