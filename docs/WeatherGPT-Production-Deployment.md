# WeatherGPT — Production Deployment & Configuration Guide
**Version:** 1.0.0-PRODUCTION-READY  
**Date:** September 2026  
**Status:** Documented & Environment-Ready  

---

## 1. Overview & Architecture

WeatherGPT is designed as a decoupled two-tier application:

1. **Frontend:** React 18 + Vite SPA compiled into static assets (`dist/`). Can be deployed to Vercel, Netlify, Cloudflare Pages, or AWS S3 + CloudFront.
2. **Backend Gateway:** Node.js + Express REST API listening on a configurable `PORT` (default: 5000). Can be deployed to Render, Railway, Google Cloud Run, Heroku, or AWS EC2/App Runner.
3. **Database & AI:** Firebase Admin SDK (Firestore) and Google Gemini LLM API.

---

## 2. Environment Variables Configuration

### Backend Environment Configuration (`backend/.env`)

Create `backend/.env` based on `backend/.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Firebase Server Credentials (Firebase Admin SDK)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_signature\n-----END PRIVATE KEY-----"

# Optional AI / Weather Provider Keys
OPENWEATHER_API_KEY=your_openweather_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Security & CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment Configuration (`frontend/.env`)

Create `frontend/.env`:

```env
# Production Backend API Gateway Base URL
VITE_BACKEND_URL=https://your-backend-api-domain.com/api/v1

# Client-Side Public Keys (Optional UI Overlays)
VITE_OPENWEATHER_API_KEY=
VITE_GOOGLE_MAPS_API_KEY=
```

> **Security Rule:** Never place private service account keys or backend database secrets inside `VITE_` variables. All private credentials remain strictly in `backend/.env`.

---

## 3. Frontend Deployment Procedure

### Step 1: Install & Build Production Assets
```bash
cd frontend
npm install
npm run build
```
This generates the optimized static bundle in `frontend/dist/`.

### Step 2: Hosting Configuration
* **Vercel / Netlify:** Connect Git repository, set Root Directory to `frontend`, Build Command to `npm run build`, Output Directory to `dist`, and set `VITE_BACKEND_URL`.
* **SPA Rewrite Rule (`vercel.json`):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 4. Backend Deployment Procedure

### Step 1: Install Dependencies
```bash
cd backend
npm install --production
```

### Step 2: Start Production Server
```bash
npm start
```

### Step 3: Health Verification
Once deployed, verify backend responsiveness:
`GET https://your-backend-api-domain.com/api/v1/health`

**Expected 200 OK Response:**
```json
{
  "success": true,
  "data": {
    "service": "WeatherGPT Backend",
    "status": "healthy",
    "environment": "production",
    "version": "1.0.0",
    "firebase": {
      "configured": true,
      "status": "connected"
    }
  }
}
```

---

## 5. Firebase Admin & Firestore Provisioning

1. Go to [Firebase Console](https://console.firebase.google.com/), select or create a project.
2. Navigate to **Project Settings > Service Accounts**.
3. Click **Generate New Private Key** to download the JSON service account file.
4. Copy `project_id`, `client_email`, and `private_key` into `backend/.env`.
5. Enable **Firestore Database** in Native Mode with default security rules.

---

## 6. Security Checklist & Pre-Flight Verification

- [x] `.env` files and private key JSON files are listed in `.gitignore` and **not committed**.
- [x] CORS is restricted to production `FRONTEND_URL`.
- [x] Security headers enabled (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`).
- [x] Rate limiting enabled for `/api/v1/chat` and API endpoints.
- [x] Error middleware hides internal stack traces in production (`NODE_ENV=production`).
