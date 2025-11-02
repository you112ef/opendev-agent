
# 🚂 Railway Deployment Instructions

## الطريقة الأسرع والأسهل:

1. اذهب إلى: https://railway.app/dashboard
2. اضغط: + New Project
3. اختر: Deploy from GitHub
4. ابحث: opendev-agent
5. اختر: you112ef/opendev-agent
6. اضغط: Deploy ✅

## Alternative - Using Token:

Export token and run:
```bash
export RAILWAY_TOKEN="fa1742f2-4136-4d07-b872-54b36c23c3c7"
railway up
```

## Expected URLs After Deploy:

- Frontend: https://opendev-frontend-prod.up.railway.app
- Backend: https://opendev-backend-api-prod.up.railway.app
