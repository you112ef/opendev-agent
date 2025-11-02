# 🚀 دليل نشر OpenDevAgent على AWS

## المرحلة 1️⃣: الإعداد الأولي

### 1. إنشاء حساب AWS
```bash
# إذا لم يكن لديك حساب بالفعل
# https://aws.amazon.com/console
```

### 2. تثبيت AWS CLI
```bash
# على macOS
brew install awscli

# على Linux
sudo apt-get install awscli

# على Windows
choco install awscli

# التحقق من التثبيت
aws --version
```

### 3. إعداد بيانات اعتماد AWS
```bash
# إنشاء Access Key من AWS Console
aws configure

# ستُطلب منك:
# AWS Access Key ID: [أدخل المفتاح]
# AWS Secret Access Key: [أدخل السر]
# Default region name: us-east-1
# Default output format: json
```

---

## المرحلة 2️⃣: إعداد ECR (Elastic Container Registry)

### 1. إنشاء Repositories
```bash
# للـ Frontend
aws ecr create-repository \
  --repository-name opendev-frontend \
  --region us-east-1

# للـ Backend
aws ecr create-repository \
  --repository-name opendev-backend \
  --region us-east-1
```

### 2. تسجيل الدخول إلى ECR
```bash
# الحصول على تصريح تسجيل الدخول
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# حيث 123456789 هو AWS Account ID الخاص بك
```

### 3. بناء وتحميل الصور
```bash
# بناء Frontend
docker build -t opendev-frontend:latest ./frontend
docker tag opendev-frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/opendev-frontend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/opendev-frontend:latest

# بناء Backend
docker build -t opendev-backend:latest ./backend
docker tag opendev-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/opendev-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/opendev-backend:latest
```

---

## المرحلة 3️⃣: إنشاء RDS Database (اختياري)

### 1. إنشاء PostgreSQL RDS
```bash
aws rds create-db-instance \
  --db-instance-identifier opendev-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password "YourSecurePassword123!" \
  --allocated-storage 20 \
  --storage-type gp2 \
  --publicly-accessible false \
  --backup-retention-period 7 \
  --region us-east-1
```

### 2. الانتظار للإنشاء
```bash
# التحقق من الحالة
aws rds describe-db-instances \
  --db-instance-identifier opendev-db \
  --query 'DBInstances[0].DBInstanceStatus'
```

---

## المرحلة 4️⃣: إنشاء ElastiCache (Redis)

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id opendev-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --engine-version 7.0 \
  --region us-east-1
```

---

## المرحلة 5️⃣: إعداد ECS (Elastic Container Service)

### 1. إنشاء Cluster
```bash
aws ecs create-cluster \
  --cluster-name opendev-cluster \
  --region us-east-1
```

### 2. إنشاء Task Definition للـ Backend
```bash
cat > backend-task-definition.json << 'EOF'
{
  "family": "opendev-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "opendev-backend",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/opendev-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "OPENROUTER_API_KEY",
          "value": "sk-or-v1-xxxxxxxx"
        },
        {
          "name": "REDIS_HOST",
          "value": "opendev-redis.xxxxx.ng.0001.use1.cache.amazonaws.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/opendev-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

# تحميل Task Definition
aws ecs register-task-definition \
  --cli-input-json file://backend-task-definition.json \
  --region us-east-1
```

### 3. إنشاء Service
```bash
aws ecs create-service \
  --cluster opendev-cluster \
  --service-name opendev-backend-service \
  --task-definition opendev-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --region us-east-1
```

---

## المرحلة 6️⃣: إعداد Load Balancer

### 1. إنشاء Application Load Balancer
```bash
aws elbv2 create-load-balancer \
  --name opendev-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4 \
  --region us-east-1
```

### 2. إنشاء Target Group
```bash
aws elbv2 create-target-group \
  --name opendev-backend-tg \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --region us-east-1
```

### 3. إنشاء Listener
```bash
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789:loadbalancer/app/opendev-alb/xxxxx \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789:targetgroup/opendev-backend-tg/xxxxx \
  --region us-east-1
```

---

## المرحلة 7️⃣: إعداد Secrets Manager

### 1. تخزين API Key بأمان
```bash
aws secretsmanager create-secret \
  --name opendev/api-key \
  --description "OpenRouter API Key for OpenDevAgent" \
  --secret-string "sk-or-v1-xxxxxxxx" \
  --region us-east-1
```

### 2. تحديث Task Definition للاستخدام
```bash
# استخدم valueFrom بدلاً من value
# "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:opendev/api-key"
```

---

## المرحلة 8️⃣: إعداد CloudWatch Logs

### 1. إنشاء Log Group
```bash
aws logs create-log-group \
  --log-group-name /ecs/opendev-backend \
  --region us-east-1

aws logs create-log-group \
  --log-group-name /ecs/opendev-frontend \
  --region us-east-1
```

### 2. ضبط Retention
```bash
aws logs put-retention-policy \
  --log-group-name /ecs/opendev-backend \
  --retention-in-days 30 \
  --region us-east-1
```

---

## المرحلة 9️⃣: إعداد CloudFront (CDN)

### 1. إنشاء Distribution للـ Frontend
```bash
cat > cloudfront-config.json << 'EOF'
{
  "CallerReference": "opendev-$(date +%s)",
  "Comment": "CDN for OpenDevAgent Frontend",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-opendev-frontend",
        "DomainName": "opendev-frontend.s3.us-east-1.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "TargetOriginId": "S3-opendev-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    }
  },
  "Enabled": true
}
EOF

aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json \
  --region us-east-1
```

---

## المرحلة 🔟: إعداد Route 53 (DNS)

### 1. إنشاء Hosted Zone
```bash
aws route53 create-hosted-zone \
  --name opendevagent.com \
  --caller-reference opendev-$(date +%s)
```

### 2. إضافة A Record
```bash
cat > route53-change.json << 'EOF'
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.opendevagent.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z35SXDOTRQ7X7K",
          "DNSName": "opendev-alb-xxxxx.us-east-1.elb.amazonaws.com",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
EOF

aws route53 change-resource-record-sets \
  --hosted-zone-id /hostedzone/Z1234567890ABC \
  --change-batch file://route53-change.json
```

---

## المرحلة 1️⃣1️⃣: إعداد SSL/TLS عبر ACM

### 1. طلب شهادة
```bash
aws acm request-certificate \
  --domain-name opendevagent.com \
  --subject-alternative-names "*.opendevagent.com" \
  --validation-method DNS \
  --region us-east-1
```

### 2. التحقق والتفعيل
```bash
# تحقق من بريدك الإلكتروني أو استخدم DNS validation
```

---

## المرحلة 1️⃣2️⃣: إعداد Auto Scaling

### 1. إنشاء Auto Scaling Target
```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/opendev-cluster/opendev-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10 \
  --region us-east-1
```

### 2. إنشاء Scaling Policy
```bash
aws application-autoscaling put-scaling-policy \
  --policy-name opendev-cpu-scaling \
  --service-namespace ecs \
  --resource-id service/opendev-cluster/opendev-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
    },
    "ScaleOutCooldown": 60,
    "ScaleInCooldown": 300
  }' \
  --region us-east-1
```

---

## المرحلة 1️⃣3️⃣: إعداد CloudWatch Alarms

### 1. تنبيه عند ارتفاع استهلاك CPU
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name opendev-high-cpu \
  --alarm-description "Alert when CPU is high" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789:opendev-alerts \
  --region us-east-1
```

### 2. تنبيه عند ارتفاع عدد Errors
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name opendev-high-errors \
  --alarm-description "Alert when error rate is high" \
  --metric-name Errors \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:123456789:opendev-alerts \
  --region us-east-1
```

---

## 📊 Script بسيط للنشر الكامل

```bash
#!/bin/bash
# deploy-aws.sh

set -e

AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_FRONTEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/opendev-frontend"
ECR_REPO_BACKEND="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/opendev-backend"

echo "🚀 بدء النشر على AWS..."

# 1. تسجيل الدخول إلى ECR
echo "📝 تسجيل الدخول إلى ECR..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# 2. بناء الصور
echo "🔨 بناء الصور..."
docker build -t $ECR_REPO_FRONTEND:latest ./frontend
docker build -t $ECR_REPO_BACKEND:latest ./backend

# 3. تحميل الصور
echo "📤 تحميل الصور إلى ECR..."
docker push $ECR_REPO_FRONTEND:latest
docker push $ECR_REPO_BACKEND:latest

# 4. تحديث ECS Service
echo "🔄 تحديث ECS Service..."
aws ecs update-service \
  --cluster opendev-cluster \
  --service opendev-backend-service \
  --force-new-deployment \
  --region $AWS_REGION

echo "✅ تم النشر بنجاح!"
echo "🌐 الموقع: https://opendevagent.com"
```

---

## ✅ قائمة التحقق

- [ ] تثبيت AWS CLI
- [ ] إعداد بيانات اعتماد AWS
- [ ] إنشاء ECR Repositories
- [ ] بناء وتحميل الصور
- [ ] إنشاء RDS Database
- [ ] إنشاء ElastiCache
- [ ] إنشاء ECS Cluster و Service
- [ ] إعداد Load Balancer
- [ ] تخزين Secrets بأمان
- [ ] إعداد CloudWatch Logs
- [ ] إعداد CloudFront CDN
- [ ] إعداد Route 53 DNS
- [ ] طلب SSL/TLS Certificate
- [ ] إعداد Auto Scaling
- [ ] إعداد CloudWatch Alarms

---

## 🔍 المراقبة والصيانة

### عرض السجلات
```bash
aws logs tail /ecs/opendev-backend --follow

aws logs tail /ecs/opendev-frontend --follow
```

### عرض حالة الخدمة
```bash
aws ecs describe-services \
  --cluster opendev-cluster \
  --services opendev-backend-service \
  --region us-east-1
```

### تحديث البيانات الحساسة
```bash
aws secretsmanager update-secret \
  --secret-id opendev/api-key \
  --secret-string "sk-or-v1-newkey" \
  --region us-east-1
```

---

## 💰 تقدير التكاليف (شهري)

| الخدمة | السعر |
|--------|-------|
| ECS Fargate (2 tasks) | $30-50 |
| RDS PostgreSQL t3.micro | $15-25 |
| ElastiCache Redis | $10-15 |
| Load Balancer | $16+ |
| CloudFront CDN | متغير |
| **الإجمالي** | **$70-150** |

---

**آخر تحديث**: 2 نوفمبر 2024
