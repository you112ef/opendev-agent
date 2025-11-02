# 🎨 دليل التخصيص - OpenDevAgent

## كيفية تخصيص التصميم

---

## 🎨 تغيير نظام الألوان

### الطريقة 1: تحديث Tailwind Config

افتح `frontend/tailwind.config.ts` وعدّل الألوان:

```typescript
colors: {
  primary: {
    500: '#YOUR_COLOR', // غيّر هنا
    // ... باقي التدرجات
  },
  secondary: {
    500: '#YOUR_COLOR', // غيّر هنا
  },
  accent: {
    500: '#YOUR_COLOR', // غيّر هنا
  }
}
```

### الطريقة 2: استخدام CSS Variables

أضف في `globals.css`:

```css
:root {
  --color-primary: #6366F1;
  --color-secondary: #A855F7;
  --color-accent: #EC4899;
}
```

---

## 🖼️ تخصيص الخلفية

### تغيير Background Gradients

في `frontend/styles/globals.css`:

```css
body {
  background: 
    radial-gradient(ellipse 80% 80% at 50% -20%, rgba(YOUR_R, YOUR_G, YOUR_B, 0.15), transparent),
    radial-gradient(ellipse 60% 60% at 0% 50%, rgba(YOUR_R, YOUR_G, YOUR_B, 0.08), transparent),
    /* ... */
}
```

### إضافة صورة خلفية

```css
body {
  background-image: url('/path/to/your/image.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
```

---

## 🎭 تخصيص الأيقونات

### استبدال Emojis بـ SVG Icons

1. ثبّت مكتبة الأيقونات:
```bash
npm install react-icons
# أو
npm install lucide-react
```

2. استبدل في المكونات:
```tsx
// قبل
<span className="text-2xl">🤖</span>

// بعد
import { Bot } from 'lucide-react'
<Bot className="w-6 h-6 text-primary-400" />
```

---

## ✨ إضافة تأثيرات جديدة

### تأثير Particle

```tsx
// أضف في الخلفية
<div className="fixed inset-0 pointer-events-none">
  {[...Array(50)].map((_, i) => (
    <div
      key={i}
      className="absolute w-1 h-1 bg-primary-400 rounded-full animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }}
    />
  ))}
</div>
```

### تأثير Spotlight

```tsx
<div className="fixed inset-0 pointer-events-none">
  <div 
    className="absolute w-96 h-96 bg-gradient-radial from-primary-500/20 to-transparent rounded-full blur-3xl"
    style={{
      top: 'var(--mouse-y, 50%)',
      left: 'var(--mouse-x, 50%)',
      transform: 'translate(-50%, -50%)'
    }}
  />
</div>
```

---

## 🎬 تخصيص الحركات

### إنشاء Animation جديد

في `globals.css`:

```css
@keyframes yourAnimation {
  0% { /* start state */ }
  50% { /* middle state */ }
  100% { /* end state */ }
}

.animate-your-animation {
  animation: yourAnimation 2s ease-in-out infinite;
}
```

ثم استخدمه:
```tsx
<div className="animate-your-animation">
  Content
</div>
```

---

## 🔤 تغيير الخطوط

### 1. إضافة Google Font

في `pages/_document.tsx`:

```tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;600;700&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

### 2. تحديث CSS

في `globals.css`:

```css
html, body {
  font-family: 'Your Font Name', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## 🎯 تخصيص المكونات

### إنشاء Variant للـ Button

```tsx
// components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-primary hover:shadow-glow-lg',
    secondary: 'glass border-primary-500/30 hover:border-primary-500',
    ghost: 'hover:bg-white/5'
  }
  
  return (
    <button className={`px-6 py-3 rounded-xl transition ${variants[variant]}`}>
      {children}
    </button>
  )
}
```

---

## 🌗 Dark/Light Mode Toggle

### 1. إضافة Theme Context

```tsx
// context/ThemeContext.tsx
import { createContext, useState } from 'react'

export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {}
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
```

### 2. إضافة Light Theme Styles

في `tailwind.config.ts`:

```typescript
darkMode: 'class',
```

في المكونات:
```tsx
<div className="bg-dark-900 dark:bg-white text-white dark:text-dark-900">
  Content
</div>
```

---

## 🎨 تطبيق تصميم من صورة

### الخطوات:

1. **تحليل الصورة**
   - حدد نظام الألوان
   - لاحظ المسافات والتباعد
   - حدد أنواع الخطوط
   - راقب التأثيرات

2. **استخراج الألوان**
   ```
   استخدم أدوات مثل:
   - https://imagecolorpicker.com
   - https://coolors.co/image-picker
   ```

3. **تطبيق الألوان**
   ```typescript
   // في tailwind.config.ts
   colors: {
     'from-image-primary': '#COLOR_FROM_IMAGE',
     'from-image-secondary': '#COLOR_FROM_IMAGE',
   }
   ```

4. **تكرار التأثيرات**
   - Glass effects
   - Shadows
   - Borders
   - Animations

---

## 📱 تخصيص للموبايل

### Mobile-First Design

```tsx
// ابدأ بالموبايل ثم أضف للشاشات الكبيرة
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  Content
</div>
```

---

## 🎭 إضافة Themes مختلفة

### Theme Presets

```tsx
// themes.ts
export const themes = {
  neon: {
    primary: '#00ff41',
    secondary: '#ff00ff',
    background: '#000000'
  },
  ocean: {
    primary: '#0077be',
    secondary: '#00d4ff',
    background: '#001a33'
  },
  sunset: {
    primary: '#ff6b35',
    secondary: '#f7931e',
    background: '#1a0033'
  }
}
```

---

## 🔧 أدوات مفيدة

### للألوان:
- 🎨 [Coolors](https://coolors.co) - Color palette generator
- 🌈 [ColorHunt](https://colorhunt.co) - Color palettes
- 💎 [UI Colors](https://uicolors.app) - Tailwind color generator

### للتصميم:
- ✨ [Glassmorphism](https://glassmorphism.com) - Glass effect generator
- 🎭 [Neumorphism](https://neumorphism.io) - Soft UI generator
- 📐 [Layout Generator](https://layout.bradwoods.io) - CSS Grid layouts

### للأيقونات:
- 🎯 [Lucide Icons](https://lucide.dev)
- 🚀 [React Icons](https://react-icons.github.io/react-icons)
- 💫 [Heroicons](https://heroicons.com)

### للخطوط:
- 📝 [Google Fonts](https://fonts.google.com)
- 🔤 [Font Pair](https://www.fontpair.co)
- ✍️ [Type Scale](https://typescale.com)

---

## 💡 نصائح للتخصيص

### 1. حافظ على الاتساق
```
✅ استخدم نفس border-radius في كل مكان
✅ نفس المسافات (4, 8, 16, 24, 32)
✅ نفس مدة الـ transitions
```

### 2. اختبر الـ Contrast
```
✅ استخدم أدوات فحص التباين
✅ تأكد من قابلية القراءة
✅ اختبر على شاشات مختلفة
```

### 3. قلل من الحركات
```
⚠️ لا تبالغ في الـ animations
⚠️ استخدم prefers-reduced-motion
```

### 4. Performance أولاً
```
✅ استخدم CSS animations بدلاً من JS
✅ Avoid layout shifts
✅ Optimize images
```

---

## 🎯 مثال تطبيقي كامل

### تخصيص بسيط (تغيير اللون الأساسي)

```typescript
// 1. في tailwind.config.ts
primary: {
  500: '#FF6B35', // لون برتقالي
}

// 2. في globals.css
body {
  background: 
    radial-gradient(ellipse 80% 80% at 50% -20%, rgba(255, 107, 53, 0.15), transparent),
    /* ... */
}

// 3. الحفظ وإعادة التشغيل
npm run dev
```

**النتيجة**: جميع العناصر الأساسية ستستخدم اللون الجديد!

---

## 📞 الدعم

إذا واجهت أي مشكلة في التخصيص:

1. راجع `DESIGN_SYSTEM.md` للمرجع الكامل
2. تحقق من `DESIGN_UPDATE_SUMMARY.md` لفهم التغييرات
3. جرب الأمثلة في هذا الملف
4. تواصل معنا عبر Discord أو GitHub Issues

---

<div align="center">

**🎨 خصص تصميمك بحرية! ✨**

لا توجد قيود - عبّر عن إبداعك!

</div>
