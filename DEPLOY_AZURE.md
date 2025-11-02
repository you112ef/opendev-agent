# 🚀 دليل نشر OpenDevAgent على Azure

## المرحلة 1️⃣: الإعداد الأولي

### 1. إنشاء حساب Azure
```bash
# اذهب إلى
https://portal.azure.com

# اشترك في خطة مجانية أو مدفوعة
```

### 2. تثبيت Azure CLI
```bash
# على macOS
brew install azure-cli

# على Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# على Windows
choco install azure-cli

# التحقق
az --version
```

### 3. تسجيل الدخول
```bash
# تسجيل الدخول
az login

# تحديد الاشتراك
az account set --subscription "your-subscription-id"

# إنشاء Resource Group
az group create \
  --name opendev-rg \
  --location eastus
```

---

## المرحلة 2️⃣: إعداد Container Registry

### 1. إنشاء Azure Container Registry
```bash
az acr create \
  --resource-group opendev-rg \
  --name opendevregistry \
  --sku Basic \
  --location eastus
```

### 2. بناء الصور وتحميلها
```bash
# بناء وتحميل Frontend
az acr build \
  --registry opendevregistry \
  --image opendev-frontend:latest \
  ./frontend

# بناء وتحميل Backend
az acr build \
  --registry opendevregistry \
  --image opendev-backend:latest \
  ./backend
```

### 3. تفعيل Admin User
```bash
az acr update \
  --name opendevregistry \
  --admin-enabled true
```

---

## المرحلة 3️⃣: إنشاء Azure Database for PostgreSQL

### 1. إنشاء الخادم
```bash
az postgres server create \
  --resource-group opendev-rg \
  --name opendev-db-server \
  --location eastus \
  --admin-user opendevadmin \
  --admin-password "YourSecurePassword123!" \
  --sku-name B_Gen5_1 \
  --storage-size 51200 \
  --enable-public-network true
```

### 2. إنشاء Firewall Rule
```bash
az postgres server firewall-rule create \
  --resource-group opendev-rg \
  --server-name opendev-db-server \
  --name AllowAzure \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 255.255.255.255
```

### 3. إنشاء Database
```bash
az postgres db create \
  --resource-group opendev-rg \
  --server-name opendev-db-server \
  --name opendev
```

---

## المرحلة 4️⃣: إنشاء Azure Cache for Redis

### 1. إنشاء Redis Cache
```bash
az redis create \
  --resource-group opendev-rg \
  --name opendev-redis \
  --location eastus \
  --sku Basic \
  --vm-size c0
```

### 2. الحصول على Connection String
```bash
az redis show-connection-string \
  --name opendev-redis \
  --resource-group opendev-rg
```

---

## المرحلة 5️⃣: إنشاء App Service Plan

### 1. إنشاء App Service Plan
```bash
az appservice plan create \
  --name opendev-plan \
  --resource-group opendev-rg \
  --sku B1 \
  --is-linux
```

---

## المرحلة 6️⃣: نشر على Azure Container Instances

### 1. نشر Backend
```bash
az container create \
  --resource-group opendev-rg \
  --name opendev-backend \
  --image opendevregistry.azurecr.io/opendev-backend:latest \
  --ports 8000 \
  --registry-login-server opendevregistry.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --memory 1 \
  --cpu 1 \
  --environment-variables OPENROUTER_API_KEY="sk-or-v1-xxxxxxxx" \
  --dns-name-label opendev-backend
```

### 2. نشر Frontend
```bash
az container create \
  --resource-group opendev-rg \
  --name opendev-frontend \
  --image opendevregistry.azurecr.io/opendev-frontend:latest \
  --ports 3000 \
  --registry-login-server opendevregistry.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --memory 0.5 \
  --cpu 0.5 \
  --environment-variables NEXT_PUBLIC_API_URL="http://opendev-backend.eastus.azurecontainer.io:8000" \
  --dns-name-label opendev-frontend
```

---

## المرحلة 7️⃣: نشر على Azure App Service

### 1. نشر Backend
```bash
az webapp create \
  --resource-group opendev-rg \
  --plan opendev-plan \
  --name opendev-backend-app \
  --deployment-container-image-name opendevregistry.azurecr.io/opendev-backend:latest

# تعيين Container Image
az webapp config container set \
  --resource-group opendev-rg \
  --name opendev-backend-app \
  --docker-custom-image-name opendevregistry.azurecr.io/opendev-backend:latest \
  --docker-registry-server-url https://opendevregistry.azurecr.io \
  --docker-registry-server-user <username> \
  --docker-registry-server-password <password>
```

### 2. نشر Frontend
```bash
az webapp create \
  --resource-group opendev-rg \
  --plan opendev-plan \
  --name opendev-frontend-app \
  --deployment-container-image-name opendevregistry.azurecr.io/opendev-frontend:latest

az webapp config container set \
  --resource-group opendev-rg \
  --name opendev-frontend-app \
  --docker-custom-image-name opendevregistry.azurecr.io/opendev-frontend:latest \
  --docker-registry-server-url https://opendevregistry.azurecr.io \
  --docker-registry-server-user <username> \
  --docker-registry-server-password <password>
```

---

## المرحلة 8️⃣: إعداد Application Gateway

### 1. إنشاء Public IP
```bash
az network public-ip create \
  --resource-group opendev-rg \
  --name opendev-pip \
  --sku Standard \
  --allocation-method Static
```

### 2. إنشاء Virtual Network
```bash
az network vnet create \
  --resource-group opendev-rg \
  --name opendev-vnet \
  --subnet-name opendev-subnet
```

### 3. إنشاء Application Gateway
```bash
az network application-gateway create \
  --resource-group opendev-rg \
  --name opendev-appgw \
  --location eastus \
  --vnet-name opendev-vnet \
  --subnet opendev-subnet \
  --public-ip-address opendev-pip \
  --http-settings-cookie-based-affinity Disabled \
  --frontend-port 80 \
  --http-settings-port 8000 \
  --http-settings-protocol Http \
  --sku Standard_Small
```

---

## المرحلة 9️⃣: إعداد Azure Key Vault

### 1. إنشاء Key Vault
```bash
az keyvault create \
  --resource-group opendev-rg \
  --name opendev-keyvault \
  --location eastus
```

### 2. تخزين Secrets
```bash
# تخزين API Key
az keyvault secret set \
  --vault-name opendev-keyvault \
  --name OPENROUTER-API-KEY \
  --value "sk-or-v1-xxxxxxxx"

# تخزين Database Password
az keyvault secret set \
  --vault-name opendev-keyvault \
  --name DB-PASSWORD \
  --value "YourSecurePassword123!"

# تخزين Redis Connection String
az keyvault secret set \
  --vault-name opendev-keyvault \
  --name REDIS-CONNECTION-STRING \
  --value "opendev-redis.redis.cache.windows.net:6379,password=..."
```

### 3. منح الوصول
```bash
# الحصول على Service Principal
PRINCIPAL_ID=$(az webapp identity assign \
  --resource-group opendev-rg \
  --name opendev-backend-app \
  --query principalId -o tsv)

# منح الوصول
az keyvault set-policy \
  --name opendev-keyvault \
  --spn $PRINCIPAL_ID \
  --secret-permissions get list
```

---

## المرحلة 🔟: إعداد Azure CDN

### 1. إنشاء CDN Profile
```bash
az cdn profile create \
  --resource-group opendev-rg \
  --name opendev-cdn \
  --sku Standard_Akamai
```

### 2. إنشاء Endpoint
```bash
az cdn endpoint create \
  --resource-group opendev-rg \
  --profile-name opendev-cdn \
  --name opendev-frontend \
  --origin opendev-frontend-app.azurewebsites.net \
  --origin-host-header opendev-frontend-app.azurewebsites.net
```

---

## المرحلة 1️⃣1️⃣: إعداد Application Insights

### 1. إنشاء Application Insights
```bash
az monitor app-insights component create \
  --resource-group opendev-rg \
  --application-type web \
  --kind web \
  --app opendev-insights \
  --location eastus
```

### 2. ربط مع App Service
```bash
IKEY=$(az monitor app-insights component show \
  --resource-group opendev-rg \
  --app opendev-insights \
  --query instrumentationKey -o tsv)

az webapp config appsettings set \
  --resource-group opendev-rg \
  --name opendev-backend-app \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$IKEY
```

---

## المرحلة 1️⃣2️⃣: إعداد Azure DevOps Pipeline

### 1. إنشاء Pipeline
```yaml
# azure-pipelines.yml

trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  dockerRegistryServiceConnection: 'opendevregistry'
  imageRepository: 'opendev-backend'
  containerRegistry: 'opendevregistry.azurecr.io'
  dockerfilePath: '$(Build.SourcesDirectory)/backend/Dockerfile'
  tag: '$(Build.BuildId)'

stages:
- stage: Build
  displayName: Build stage
  jobs:
  - job: Build
    displayName: Build
    steps:
    - task: Docker@2
      displayName: Build an image
      inputs:
        command: build
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(dockerRegistryServiceConnection)
        tags: |
          $(tag)
          latest

    - task: Docker@2
      displayName: Push an image to container registry
      inputs:
        command: push
        repository: $(imageRepository)
        containerRegistry: $(dockerRegistryServiceConnection)
        tags: |
          $(tag)
          latest

- stage: Deploy
  displayName: Deploy stage
  dependsOn: Build
  condition: succeeded()
  jobs:
  - deployment: Deploy
    displayName: Deploy
    environment: 'production'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebAppContainer@1
            displayName: 'Deploy to Azure Web App Container'
            inputs:
              azureSubscription: 'azure-connection'
              appName: 'opendev-backend-app'
              containers: |
                opendevregistry.azurecr.io/opendev-backend:$(Build.BuildId)
```

---

## 📊 Script نشر شامل

```bash
#!/bin/bash
# deploy-azure.sh

set -e

RESOURCE_GROUP="opendev-rg"
LOCATION="eastus"
REGISTRY="opendevregistry"

echo "🚀 بدء النشر على Azure..."

# إنشاء Resource Group
echo "📦 إنشاء Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# بناء الصور
echo "🔨 بناء الصور..."
az acr build --registry $REGISTRY --image opendev-frontend:latest ./frontend
az acr build --registry $REGISTRY --image opendev-backend:latest ./backend

# الحصول على Credentials
USERNAME=$(az acr credential show --name $REGISTRY --query username -o tsv)
PASSWORD=$(az acr credential show --name $REGISTRY --query passwords[0].value -o tsv)

# نشر Backend
echo "🚀 نشر Backend..."
az container create \
  --resource-group $RESOURCE_GROUP \
  --name opendev-backend \
  --image $REGISTRY.azurecr.io/opendev-backend:latest \
  --registry-username $USERNAME \
  --registry-password $PASSWORD \
  --ports 8000 \
  --memory 1 \
  --cpu 1 \
  --dns-name-label opendev-backend

# نشر Frontend
echo "🚀 نشر Frontend..."
az container create \
  --resource-group $RESOURCE_GROUP \
  --name opendev-frontend \
  --image $REGISTRY.azurecr.io/opendev-frontend:latest \
  --registry-username $USERNAME \
  --registry-password $PASSWORD \
  --ports 3000 \
  --memory 0.5 \
  --cpu 0.5 \
  --dns-name-label opendev-frontend

echo "✅ تم النشر بنجاح!"
echo "🌐 Frontend URL: http://opendev-frontend.$LOCATION.azurecontainer.io:3000"
echo "🔌 Backend URL: http://opendev-backend.$LOCATION.azurecontainer.io:8000"
```

---

## ✅ قائمة التحقق

- [ ] إنشاء حساب Azure
- [ ] تثبيت Azure CLI
- [ ] إنشاء Resource Group
- [ ] إنشاء Container Registry
- [ ] بناء الصور وتحميلها
- [ ] إنشاء Azure Database for PostgreSQL
- [ ] إنشاء Azure Cache for Redis
- [ ] إنشاء App Service Plan
- [ ] نشر Backend و Frontend
- [ ] إعداد Application Gateway
- [ ] إعداد Key Vault
- [ ] تخزين Secrets بأمان
- [ ] إعداد Azure CDN
- [ ] إعداد Application Insights
- [ ] إنشاء DevOps Pipeline

---

## 🔍 الأوامر المفيدة

### عرض الموارد
```bash
# عرض Container Groups
az container list --resource-group opendev-rg

# عرض App Services
az webapp list --resource-group opendev-rg

# عرض Databases
az postgres server list --resource-group opendev-rg
```

### عرض السجلات
```bash
# عرض Container Logs
az container logs --resource-group opendev-rg --name opendev-backend

# عرض App Service Logs
az webapp log tail --resource-group opendev-rg --name opendev-backend-app
```

### حذف الموارد
```bash
# حذف كل الموارد
az group delete --name opendev-rg --yes

# حذف خدمة محددة
az container delete --resource-group opendev-rg --name opendev-backend --yes
```

---

## 💰 تقدير التكاليف (شهري)

| الخدمة | السعر |
|--------|-------|
| Container Instances | $10-30 |
| App Service (B1) | $10-15 |
| PostgreSQL Database | $10-30 |
| Redis Cache | $5-15 |
| Application Gateway | $15+ |
| CDN | متغير |
| **الإجمالي** | **$50-100** |

---

**آخر تحديث**: 2 نوفمبر 2024
