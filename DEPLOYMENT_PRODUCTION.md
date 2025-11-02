# 🚀 دليل النشر للإنتاج - OpenDevAgent

## 🎯 نظرة عامة

هذا الدليل يوضح كيفية نشر OpenDevAgent في بيئة الإنتاج على منصات سحابية مختلفة.

---

## ☁️ خيارات النشر

### مقارنة المنصات

| المنصة | الصعوبة | التكلفة | القابلية للتوسع | الوقت |
|--------|---------|---------|-----------------|-------|
| Railway | ⭐ سهل جداً | $$ | ⭐⭐⭐⭐ | 5 دقائق |
| Heroku | ⭐⭐ سهل | $$$ | ⭐⭐⭐ | 10 دقائق |
| Render | ⭐⭐ سهل | $$ | ⭐⭐⭐ | 10 دقائق |
| AWS ECS | ⭐⭐⭐⭐ معقد | $-$$$$ | ⭐⭐⭐⭐⭐ | 30 دقيقة |
| Google Cloud Run | ⭐⭐⭐ متوسط | $-$$$ | ⭐⭐⭐⭐⭐ | 20 دقيقة |
| Azure Container | ⭐⭐⭐ متوسط | $-$$$ | ⭐⭐⭐⭐ | 20 دقيقة |
| VPS (DigitalOcean) | ⭐⭐⭐ متوسط | $ | ⭐⭐⭐ | 15 دقيقة |

---

## 1️⃣ النشر على Railway (موصى به للمبتدئين)

### لماذا Railway؟

- ✅ نشر بنقرة واحدة
- ✅ SSL تلقائي
- ✅ Database مدمجة
- ✅ CI/CD تلقائي
- ✅ Free tier سخي

### الخطوات

#### 1. تثبيت Railway CLI

```bash
npm install -g @railway/cli
```

#### 2. تسجيل الدخول

```bash
railway login
```

#### 3. إنشاء مشروع جديد

```bash
cd OpenDevAgent
railway init
```

#### 4. إضافة متغيرات البيئة

```bash
# في لوحة Railway Dashboard
# أضف:
OPENROUTER_API_KEY=sk-or-v1-...  # اختياري
REDIS_URL=<سيتم إضافته تلقائياً>
```

#### 5. إضافة Redis

```bash
railway add redis
```

#### 6. النشر

```bash
railway up
```

#### 7. الحصول على URL

```bash
railway domain
```

### ملف railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "docker-compose up",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300
  }
}
```

---

## 2️⃣ النشر على Heroku

### الخطوات

#### 1. تثبيت Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 2. تسجيل الدخول

```bash
heroku login
```

#### 3. إنشاء تطبيق

```bash
heroku create opendevagent-prod
```

#### 4. إضافة Redis

```bash
heroku addons:create heroku-redis:mini
```

#### 5. تعيين Container Stack

```bash
heroku stack:set container
```

#### 6. تعيين متغيرات البيئة

```bash
heroku config:set PYTHONUNBUFFERED=1
heroku config:set LOG_LEVEL=INFO
```

#### 7. النشر

```bash
git push heroku main
```

#### 8. فتح التطبيق

```bash
heroku open
```

### heroku.yml

```yaml
build:
  docker:
    frontend: frontend/Dockerfile
    backend: backend/Dockerfile
run:
  frontend: npm start
  backend: uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## 3️⃣ النشر على AWS ECS (للإنتاج المتقدم)

### البنية التحتية

```
┌──────────────────────────────────────────┐
│         Application Load Balancer         │
│          (ALB with SSL/TLS)              │
└─────────────┬────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐        ┌────▼────┐
│Frontend│        │ Backend │
│  ECS   │        │   ECS   │
│Service │        │ Service │
└───┬────┘        └────┬────┘
    │                  │
    │         ┌────────▼────────┐
    │         │ ElastiCache     │
    │         │    (Redis)      │
    │         └─────────────────┘
    │
    │         ┌─────────────────┐
    └────────►│   CloudFront    │
              │      (CDN)      │
              └─────────────────┘
```

### الخطوات

#### 1. تثبيت AWS CLI

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

#### 2. تكوين AWS

```bash
aws configure
# AWS Access Key ID: xxxxxxxx
# AWS Secret Access Key: xxxxxxxx
# Default region: us-east-1
# Default output format: json
```

#### 3. إنشاء ECR Repository

```bash
# إنشاء repositories للصور
aws ecr create-repository --repository-name opendevagent-frontend
aws ecr create-repository --repository-name opendevagent-backend

# الحصول على URI
aws ecr describe-repositories --repository-names opendevagent-frontend opendevagent-backend
```

#### 4. بناء ورفع الصور

```bash
# تسجيل الدخول لـ ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# بناء الصور
docker-compose build

# Tag الصور
docker tag opendevagent_frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/opendevagent-frontend:latest
docker tag opendevagent_backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/opendevagent-backend:latest

# رفع الصور
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/opendevagent-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/opendevagent-backend:latest
```

#### 5. إنشاء ECS Cluster

```bash
aws ecs create-cluster --cluster-name opendevagent-prod
```

#### 6. إنشاء Task Definitions

```bash
# إنشاء ملف task-definition.json
# راجع الملف المرفق للتفاصيل

aws ecs register-task-definition --cli-input-json file://task-definition.json
```

#### 7. إنشاء Services

```bash
aws ecs create-service \
  --cluster opendevagent-prod \
  --service-name opendevagent-backend \
  --task-definition opendevagent-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

### task-definition.json (مثال)

```json
{
  "family": "opendevagent-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/opendevagent-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PYTHONUNBUFFERED",
          "value": "1"
        },
        {
          "name": "REDIS_URL",
          "value": "redis://elasticache-endpoint:6379"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/opendevagent",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      }
    }
  ]
}
```

---

## 4️⃣ النشر على DigitalOcean (VPS)

### الخطوات

#### 1. إنشاء Droplet

```bash
# اختر:
# - Ubuntu 22.04
# - 2GB RAM, 2 vCPUs
# - $18/month
```

#### 2. الاتصال بالخادم

```bash
ssh root@your-droplet-ip
```

#### 3. تثبيت المتطلبات

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# تثبيت Docker Compose
apt install docker-compose -y

# تثبيت Git
apt install git -y
```

#### 4. استنساخ المشروع

```bash
cd /opt
git clone https://github.com/yourusername/OpenDevAgent.git
cd OpenDevAgent
```

#### 5. إعداد البيئة

```bash
cp .env.example .env
nano .env
# أضف إعداداتك
```

#### 6. تشغيل التطبيق

```bash
docker-compose up -d
```

#### 7. إعداد Nginx Reverse Proxy

```bash
apt install nginx -y

# إنشاء ملف الإعداد
nano /etc/nginx/sites-available/opendevagent
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# تفعيل الإعداد
ln -s /etc/nginx/sites-available/opendevagent /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 8. إعداد SSL مع Let's Encrypt

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your-domain.com
```

---

## 🔒 أفضل ممارسات الأمان للإنتاج

### 1. متغيرات البيئة

```bash
# لا تضع مفاتيح API في الكود
# استخدم secrets management:
# - AWS Secrets Manager
# - HashiCorp Vault
# - Azure Key Vault
```

### 2. HTTPS فقط

```bash
# فرض HTTPS
# في Nginx:
return 301 https://$host$request_uri;
```

### 3. Rate Limiting

```nginx
# في Nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://localhost:8000;
}
```

### 4. Firewall

```bash
# UFW على Ubuntu
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

### 5. Docker Security

```yaml
# في docker-compose.yml
security_opt:
  - no-new-privileges:true
read_only: true
tmpfs:
  - /tmp
```

---

## 📊 المراقبة والتشخيص

### Prometheus + Grafana

```bash
# إضافة في docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Logging مع ELK Stack

```bash
services:
  elasticsearch:
    image: elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  kibana:
    image: kibana:8.5.0
    ports:
      - "5601:5601"
```

---

## 🚀 التوسع الأفقي

### Auto-Scaling على AWS

```bash
# إنشاء Auto Scaling Group
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/opendevagent-prod/backend \
  --min-capacity 2 \
  --max-capacity 10

# إنشاء Scaling Policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/opendevagent-prod/backend \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and Push to Registry
        run: |
          docker-compose build
          docker push ...
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster prod --service backend --force-new-deployment
```

---

## 📝 Checklist للإنتاج

- [ ] ✅ SSL/TLS enabled
- [ ] ✅ Environment variables secured
- [ ] ✅ Database backups configured
- [ ] ✅ Monitoring setup
- [ ] ✅ Logging configured
- [ ] ✅ Rate limiting enabled
- [ ] ✅ Firewall configured
- [ ] ✅ Auto-scaling setup
- [ ] ✅ Health checks configured
- [ ] ✅ CI/CD pipeline ready
- [ ] ✅ Documentation updated
- [ ] ✅ Team trained

---

## 🆘 استكشاف الأخطاء

### مشكلة: Container يتوقف عن العمل

```bash
# فحص السجلات
docker-compose logs backend

# فحص صحة الحاوية
docker ps -a

# إعادة التشغيل
docker-compose restart backend
```

### مشكلة: بطء الأداء

```bash
# فحص استخدام الموارد
docker stats

# زيادة الموارد
# في docker-compose.yml:
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
```

---

## 💰 تقدير التكاليف

### Railway
- Free Tier: $5 credit شهرياً
- Pro: $20/شهر + استخدام

### AWS
- ECS Fargate: ~$30-100/شهر
- ElastiCache: ~$15-50/شهر
- Load Balancer: ~$20/شهر
- **المجموع**: ~$65-170/شهر

### DigitalOcean
- Droplet (2GB): $18/شهر
- Managed Redis: $15/شهر
- **المجموع**: ~$33/شهر

---

## 📞 الدعم

للمساعدة في النشر:
- 📧 deploy@opendevagent.com
- 💬 Discord: https://discord.gg/opendevagent
- 📖 Docs: https://docs.opendevagent.com/deployment

---

**نشر موفق!** 🚀
