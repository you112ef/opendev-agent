# 🚀 دليل نشر OpenDevAgent على Google Cloud

## المرحلة 1️⃣: الإعداد الأولي

### 1. إنشاء حساب Google Cloud
```bash
# اذهب إلى
https://cloud.google.com/console

# أنشئ مشروع جديد
# اسم المشروع: opendev-agent
```

### 2. تثبيت Google Cloud CLI
```bash
# على macOS
brew install --cask google-cloud-sdk

# على Linux
curl https://sdk.cloud.google.com | bash

# على Windows
choco install google-cloud-sdk

# التحقق
gcloud --version
```

### 3. الاعتماد والتهيئة
```bash
# تسجيل الدخول
gcloud auth login

# اختر المشروع
gcloud config set project opendev-agent-123456

# اختر المنطقة
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a
```

---

## المرحلة 2️⃣: إعداد Container Registry

### 1. تمكين APIs المطلوبة
```bash
gcloud services enable \
  container.googleapis.com \
  containerregistry.googleapis.com \
  run.googleapis.com \
  sql-component.googleapis.com \
  redis.googleapis.com \
  compute.googleapis.com
```

### 2. بناء الصور وتحميلها
```bash
# للـ Frontend
gcloud builds submit \
  --tag gcr.io/opendev-agent-123456/opendev-frontend:latest \
  ./frontend

# للـ Backend
gcloud builds submit \
  --tag gcr.io/opendev-agent-123456/opendev-backend:latest \
  ./backend
```

---

## المرحلة 3️⃣: إنشاء Cloud SQL (PostgreSQL)

### 1. إنشاء Instance
```bash
gcloud sql instances create opendev-db \
  --database-version POSTGRES_15 \
  --tier db-f1-micro \
  --region us-central1 \
  --storage-size 20GB \
  --storage-auto-increase \
  --availability-type zonal \
  --enable-bin-log
```

### 2. إنشاء Database
```bash
gcloud sql databases create opendev \
  --instance=opendev-db
```

### 3. إنشاء User
```bash
gcloud sql users create admin \
  --instance=opendev-db \
  --password=YourSecurePassword123!
```

### 4. الحصول على Connection Name
```bash
gcloud sql instances describe opendev-db \
  --format='value(connectionName)'

# سيعطيك: opendev-agent-123456:us-central1:opendev-db
```

---

## المرحلة 4️⃣: إنشاء Memorystore (Redis)

### 1. إنشاء Instance
```bash
gcloud redis instances create opendev-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=7.0 \
  --tier=basic
```

### 2. الحصول على Host
```bash
gcloud redis instances describe opendev-redis \
  --region=us-central1 \
  --format='value(host)'
```

---

## المرحلة 5️⃣: نشر على Cloud Run

### 1. نشر Backend
```bash
gcloud run deploy opendev-backend \
  --image gcr.io/opendev-agent-123456/opendev-backend:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 600 \
  --set-env-vars OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx \
  --set-env-vars REDIS_HOST=10.0.1.3 \
  --set-env-vars DATABASE_URL=postgresql://admin:password@10.0.0.4:5432/opendev \
  --allow-unauthenticated
```

### 2. نشر Frontend
```bash
gcloud run deploy opendev-frontend \
  --image gcr.io/opendev-agent-123456/opendev-frontend:latest \
  --platform managed \
  --region us-central1 \
  --memory 256Mi \
  --cpu 1 \
  --set-env-vars NEXT_PUBLIC_API_URL=https://opendev-backend-xxxxx.a.run.app \
  --allow-unauthenticated
```

---

## المرحلة 6️⃣: إعداد Cloud Load Balancer

### 1. إنشاء Backend Service
```bash
gcloud compute backend-services create opendev-backend-service \
  --global \
  --protocol=HTTP \
  --port-name=http
```

### 2. إنشاء URL Map
```bash
gcloud compute url-maps create opendev-lb \
  --default-service=opendev-backend-service
```

### 3. إنشاء HTTP Proxy
```bash
gcloud compute target-http-proxies create opendev-http-proxy \
  --url-map=opendev-lb
```

### 4. إنشاء Forwarding Rule
```bash
gcloud compute forwarding-rules create opendev-forwarding-rule \
  --global \
  --target-http-proxy=opendev-http-proxy \
  --address=opendev-ip \
  --ports=80
```

---

## المرحلة 7️⃣: إعداد Cloud Storage

### 1. إنشاء Bucket
```bash
gsutil mb -l us-central1 gs://opendev-storage-bucket
```

### 2. تحميل ملفات Frontend
```bash
gsutil -m cp -r frontend/out/* gs://opendev-storage-bucket/
```

### 3. جعل الملفات عامة
```bash
gsutil iam ch serviceAccount:firebase-adminsdk@opendev-agent-123456.iam.gserviceaccount.com:objectViewer gs://opendev-storage-bucket
```

---

## المرحلة 8️⃣: إعداد Cloud CDN

### 1. تمكين CDN
```bash
gcloud compute backend-services update opendev-backend-service \
  --global \
  --enable-cdn \
  --cache-mode CACHE_ALL_STATIC \
  --default-ttl 3600 \
  --max-ttl 86400
```

---

## المرحلة 9️⃣: إعداد Secret Manager

### 1. حفظ API Key
```bash
echo -n "sk-or-v1-xxxxxxxx" | gcloud secrets create opendev-api-key \
  --data-file=-
```

### 2. حفظ Database URL
```bash
echo -n "postgresql://admin:password@10.0.0.4:5432/opendev" | gcloud secrets create opendev-db-url \
  --data-file=-
```

### 3. منح الوصول للخدمات
```bash
# للـ Backend Service
gcloud secrets add-iam-policy-binding opendev-api-key \
  --member=serviceAccount:opendev-backend@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

---

## المرحلة 🔟: إعداد Cloud Monitoring

### 1. إنشاء Uptime Check
```bash
gcloud monitoring uptime-checks create opendev-api \
  --resource-type uptime-url \
  --display-name "OpenDevAgent API" \
  --monitored-resource-labels host="opendev-backend-xxxxx.a.run.app"
```

### 2. إنشاء Alert Policy
```bash
gcloud alpha monitoring policies create \
  --notification-channels opendev-alerts \
  --display-name "OpenDevAgent High Error Rate" \
  --condition-display-name "Error Rate > 10%" \
  --condition-threshold-value 10
```

---

## المرحلة 1️⃣1️⃣: إعداد Cloud Logging

### 1. إنشاء Log Router
```bash
gcloud logging sinks create opendev-logs-sink \
  bigquery.googleapis.com/projects/opendev-agent-123456/datasets/opendev_logs \
  --log-filter='resource.type="cloud_run_revision"'
```

### 2. عرض السجلات
```bash
gcloud logging read "resource.type=cloud_run_revision" \
  --limit 50 \
  --format json
```

---

## المرحلة 1️⃣2️⃣: إعداد VPC و VPN

### 1. إنشاء VPC
```bash
gcloud compute networks create opendev-vpc \
  --subnet-mode=custom \
  --bgp-routing-mode=regional
```

### 2. إنشاء Subnet
```bash
gcloud compute networks subnets create opendev-subnet \
  --network=opendev-vpc \
  --region=us-central1 \
  --range=10.0.0.0/24
```

### 3. إنشاء Firewall Rule
```bash
gcloud compute firewall-rules create allow-opendev-api \
  --network=opendev-vpc \
  --allow=tcp:8000 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=opendev-backend
```

---

## 📊 Script نشر شامل

```bash
#!/bin/bash
# deploy-gcp.sh

set -e

PROJECT_ID="opendev-agent-123456"
REGION="us-central1"

echo "🚀 بدء النشر على Google Cloud..."

# تعيين المشروع
gcloud config set project $PROJECT_ID

# تمكين APIs
echo "📚 تمكين APIs..."
gcloud services enable container.googleapis.com containerregistry.googleapis.com run.googleapis.com

# بناء الصور
echo "🔨 بناء الصور..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/opendev-frontend:latest ./frontend &
gcloud builds submit --tag gcr.io/$PROJECT_ID/opendev-backend:latest ./backend &
wait

# نشر على Cloud Run
echo "🌐 نشر على Cloud Run..."
gcloud run deploy opendev-backend \
  --image gcr.io/$PROJECT_ID/opendev-backend:latest \
  --platform managed \
  --region $REGION \
  --memory 512Mi \
  --allow-unauthenticated

gcloud run deploy opendev-frontend \
  --image gcr.io/$PROJECT_ID/opendev-frontend:latest \
  --platform managed \
  --region $REGION \
  --memory 256Mi \
  --allow-unauthenticated

echo "✅ تم النشر بنجاح!"
echo "🌐 Frontend URL:"
gcloud run services describe opendev-frontend --platform managed --region $REGION --format 'value(status.url)'
echo "🔌 Backend URL:"
gcloud run services describe opendev-backend --platform managed --region $REGION --format 'value(status.url)'
```

---

## ✅ قائمة التحقق

- [ ] إنشاء مشروع Google Cloud
- [ ] تثبيت Google Cloud CLI
- [ ] تمكين APIs المطلوبة
- [ ] بناء الصور وتحميلها
- [ ] إنشاء Cloud SQL Database
- [ ] إنشاء Memorystore Redis
- [ ] نشر Backend على Cloud Run
- [ ] نشر Frontend على Cloud Run
- [ ] إعداد Cloud Load Balancer
- [ ] إعداد Cloud CDN
- [ ] تخزين Secrets بأمان
- [ ] إعداد Cloud Monitoring
- [ ] إعداد Cloud Logging
- [ ] إعداد VPC و Firewall

---

## 🔍 الأوامر المفيدة

### عرض الخدمات المنشورة
```bash
gcloud run services list --platform managed
```

### عرض السجلات
```bash
gcloud logging read --limit 50 --format json
```

### حذف الموارد
```bash
# حذف Cloud Run Service
gcloud run services delete opendev-backend --region us-central1

# حذف Cloud SQL
gcloud sql instances delete opendev-db

# حذف Memorystore
gcloud redis instances delete opendev-redis --region us-central1
```

### تحديث الخدمة
```bash
gcloud run deploy opendev-backend \
  --image gcr.io/opendev-agent-123456/opendev-backend:latest \
  --region us-central1
```

---

## 💰 تقدير التكاليف (شهري)

| الخدمة | السعر |
|--------|-------|
| Cloud Run (Backend) | $5-20 |
| Cloud Run (Frontend) | $1-5 |
| Cloud SQL PostgreSQL | $10-30 |
| Memorystore Redis | $5-15 |
| Cloud Load Balancer | $15+ |
| Cloud CDN | متغير |
| Storage | $0.50-5 |
| **الإجمالي** | **$40-80** |

---

**آخر تحديث**: 2 نوفمبر 2024
