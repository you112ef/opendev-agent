# دليل النشر (Deployment Guide)

## 🚀 نشر محلي (Local Deployment)

### المتطلبات المسبقة
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 5GB Disk Space minimum

### خطوات النشر المحلي

1. **استنساخ المستودع**
```bash
git clone <repository-url>
cd OpenDevAgent_Platform
```

2. **إعداد متغيرات البيئة**
```bash
cp .env.example .env
nano .env
```

3. **بناء وتشغيل**
```bash
docker-compose up --build
```

4. **التحقق من الصحة**
```bash
curl http://localhost:8000/api/health
```

## ☁️ نشر على السحابة

### AWS Deployment (EC2 + ECS)

1. **إنشاء EC2 Instance**
```bash
# استخدم Ubuntu 22.04 LTS
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.large \
  --key-name your-key-pair
```

2. **تثبيت Docker**
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker ubuntu
```

3. **نشر الحاويات**
```bash
git clone <repository-url>
cd OpenDevAgent_Platform
docker-compose up -d
```

### Google Cloud Platform (GCP)

1. **إنشاء Cloud Run Services**
```bash
gcloud run deploy opendev-frontend \
  --source . \
  --platform managed \
  --region us-central1
```

2. **استخدام Cloud SQL للبيانات**
```bash
gcloud sql instances create opendev-db \
  --database-version POSTGRES_13
```

### Azure Deployment

1. **إنشاء App Service**
```bash
az app service plan create \
  --name opendev-plan \
  --resource-group opendev-rg

az webapp create \
  --resource-group opendev-rg \
  --plan opendev-plan \
  --name opendev-app
```

## 🔧 Kubernetes Deployment

### 1. تجهيز Cluster

```bash
kubectl create namespace opendevagent
kubectl config set-context --current --namespace=opendevagent
```

### 2. إنشاء ConfigMaps و Secrets

```bash
# ConfigMap للإعدادات
kubectl create configmap opendev-config --from-file=config/

# Secret للمفاتيح الحساسة
kubectl create secret generic opendev-secrets \
  --from-literal=OPENROUTER_API_KEY=your-key
```

### 3. نشر Services

```bash
# قم بإنشاء ملفات YAML
# deployment.yaml
# service.yaml
# ingress.yaml

kubectl apply -f k8s/
```

### مثال deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: opendev-backend
  namespace: opendevagent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: opendev-backend
  template:
    metadata:
      labels:
        app: opendev-backend
    spec:
      containers:
      - name: backend
        image: opendev-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENROUTER_API_KEY
          valueFrom:
            secretKeyRef:
              name: opendev-secrets
              key: OPENROUTER_API_KEY
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
---
apiVersion: v1
kind: Service
metadata:
  name: opendev-backend-service
  namespace: opendevagent
spec:
  selector:
    app: opendev-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

## 📊 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy OpenDevAgent

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: docker-compose build
      
      - name: Push to Registry
        env:
          REGISTRY_USERNAME: ${{ secrets.REGISTRY_USERNAME }}
          REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }}
        run: |
          docker login -u $REGISTRY_USERNAME -p $REGISTRY_PASSWORD
          docker push opendev-frontend:latest
          docker push opendev-backend:latest
      
      - name: Deploy to Kubernetes
        run: kubectl apply -f k8s/
```

## 🔒 إعدادات الأمان

### SSL/TLS

1. **تثبيت Certbot**
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **إنشاء شهادات**
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

3. **تكوين Nginx**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

### WAF (Web Application Firewall)

```bash
# استخدام ModSecurity مع Nginx
sudo apt-get install libnginx-mod-http-modsecurity
```

## 📈 المراقبة والتنبيهات

### استخدام Prometheus

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'opendev-backend'
    static_configs:
      - targets: ['localhost:8000']
```

### استخدام Grafana

```bash
docker run -d -p 3001:3000 grafana/grafana
```

### تكوين التنبيهات

```yaml
groups:
- name: opendev_alerts
  rules:
  - alert: HighErrorRate
    expr: rate(errors_total[5m]) > 0.05
    for: 10m
    annotations:
      summary: "High error rate detected"
```

## 🔄 نسخ احتياطية واستعادة

### نسخ احتياطية تلقائية

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# نسخ احتياطية للبيانات
docker exec opendev-redis redis-cli --rdb $BACKUP_DIR/dump_$TIMESTAMP.rdb

# ضغط الملفات
tar -czf $BACKUP_DIR/opendev_$TIMESTAMP.tar.gz $BACKUP_DIR/

# حذف النسخ القديمة
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### استعادة النسخة الاحتياطية

```bash
tar -xzf opendev_backup.tar.gz
docker exec opendev-redis redis-cli --rdb restore < dump.rdb
```

## 🧪 اختبار النشر

### اختبارات الدخان

```bash
#!/bin/bash
# smoke-tests.sh

# اختبار Health Check
curl -f http://localhost:8000/api/health || exit 1

# اختبار API
curl -f -X POST http://localhost:8000/api/validate-key \
  -H "Content-Type: application/json" \
  -d '{"api_key":"test"}' || exit 1

# اختبار Frontend
curl -f http://localhost:3000 || exit 1

echo "✓ All smoke tests passed"
```

### اختبارات الأداء

```bash
# استخدام Apache Bench
ab -n 1000 -c 10 http://localhost:3000/

# استخدام wrk
wrk -t12 -c400 -d30s http://localhost:3000/
```

## 📋 قائمة تفقد النشر

- [ ] تحديث ملف `.env` بالمتغيرات الصحيحة
- [ ] تفعيل SSL/TLS
- [ ] إعداد النسخ الاحتياطية
- [ ] تفعيل المراقبة والتنبيهات
- [ ] اختبار جميع Endpoints
- [ ] التحقق من سجلات الأخطاء
- [ ] توثيق عملية النشر
- [ ] إنشاء خطة الاستعادة من الكوارث

---

للمزيد من المساعدة، يرجى زيارة: https://docs.opendevagent.io
