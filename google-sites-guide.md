# 🚀 دليل رفع الموقع على Google Sites

## 📋 الخطوات المفصلة للرفع على Google Sites

### 1. إنشاء الموقع الجديد
1. اذهب إلى [Google Sites](https://sites.google.com)
2. انقر على "إنشاء موقع جديد" أو "Create New Site"
3. اختر "موقع فارغ" أو "Blank Template"
4. أدخل عنوان الموقع: **استراحة وشاليه الغصن**

### 2. إضافة المحتوى
#### أ) إضافة HTML المخصص:
1. في محرر Google Sites، انقر على "إدراج" → "تضمين"
2. اختر "تضمين كود"
3. انسخ **المحتوى الكامل** من ملف `index.html` والصقه
4. احفظ التغييرات

#### ب) إضافة CSS المخصص:
```html
<style>
/* انسخ المحتوى الكامل من ملف styles.css هنا */
</style>
```

#### ج) إضافة JavaScript:
```html
<script>
/* انسخ المحتوى الكامل من ملف script.js هنا */
</script>
```

### 3. إعداد الموقع للغة العربية
1. اذهب إلى "الإعدادات" → "إعدادات الموقع"
2. اختر اللغة: **العربية**
3. تأكد من تفعيل الكتابة من اليمين إلى اليسار (RTL)

### 4. تخصيص الموقع
1. **الألوان**: استخدم الألوان المتطابقة مع التصميم
2. **الخطوط**: تأكد من تحميل خط Cairo
3. **الأيقونات**: تأكد من تحميل Font Awesome

### 5. النشر
1. انقر على "نشر" في الزاوية العلوية اليمنى
2. اختر عنوان URL مناسب (مثل: algasan-resort)
3. انقر على "نشر"

---

## 🎯 طريقة بديلة: استخدام HTML مباشرة

### الخطوة الأولى: إنشاء ملف HTML شامل
قم بدمج جميع الملفات في ملف واحد:

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>استراحة وشاليه الغصن</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    <style>
        /* هنا يتم وضع كامل محتوى ملف styles.css */
    </style>
</head>
<body>
    <!-- هنا يتم وضع كامل محتوى body من ملف index.html -->
    
    <script>
        /* هنا يتم وضع كامل محتوى ملف script.js */
    </script>
</body>
</html>
```

---

## 🔧 حل المشاكل المحتملة

### 1. إذا لم تظهر الأيقونات:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
```

### 2. إذا لم يظهر الخط العربي:
```html
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
```

### 3. إذا لم تعمل الوظائف التفاعلية:
- تأكد من إضافة كود JavaScript بشكل صحيح
- تحقق من عدم وجود أخطاء في وحدة التحكم (F12)

---

## 📝 ملاحظات مهمة

1. **البيانات**: جميع البيانات محفوظة في Local Storage
2. **الأمان**: معلومات الإدارة (admin / admin123)
3. **الصور**: استبدل الصور بصور حقيقية
4. **المعلومات**: عدّل معلومات الاتصال

---

## 🎨 تخصيص إضافي

### تغيير الألوان الرئيسية:
```css
:root {
    --primary-color: #27ae60;
    --secondary-color: #2980b9;
    --accent-color: #e74c3c;
}
```

### تغيير الأسعار:
```javascript
const PRICING = {
    'استراحة': 300,
    'شاليه': 250,
    'كلاهما': 500
};
```

---

## 🔐 بيانات الإدارة الافتراضية

- **اسم المستخدم**: `admin`
- **كلمة المرور**: `admin123`

⚠️ **تنبيه**: غيّر هذه البيانات قبل النشر الفعلي!

---

## 📞 الدعم الفني

في حالة مواجهة أي مشاكل:
1. تأكد من صحة الكود
2. اختبر الموقع محلياً أولاً
3. تحقق من إعدادات Google Sites

**الموقع جاهز للرفع والاستخدام! 🎉**
