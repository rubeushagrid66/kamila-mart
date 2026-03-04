# Kamila Mart - Complete Setup Guide

This guide covers how to prepare your project for GitHub, integrate Firebase, and deploy to Vercel.

---

## 📋 Table of Contents

1. [GitHub Setup](#github-setup)
2. [Firebase Setup](#firebase-setup)
3. [Local Development](#local-development)
4. [Vercel Deployment](#vercel-deployment)
5. [Firestore Database Structure](#firestore-database-structure)

---

## 1. GitHub Setup

### Step 1: Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Kamila Mart e-commerce app with Firebase"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **+ New repository**
3. Name it: `kamila-mart`
4. Add description: "E-commerce management system with admin dashboard"
5. Choose **Public** or **Private**
6. Click **Create repository**

### Step 3: Push to GitHub

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/kamila-mart.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### File Structure on GitHub

```
kamila-mart/
├── src/
│   ├── App.jsx                    (Use App-firebase.jsx)
│   ├── Login.jsx
│   ├── Pemesanan.jsx
│   ├── AdminDashboard.jsx         (Use AdminDashboard-firebase.jsx)
│   ├── utils.js
│   ├── firebase-config.js
│   └── main.jsx
├── public/
├── .gitignore                     ✅ Already created
├── .env.example                   ✅ Already created
├── package.json                   ✅ Already created
├── vite.config.js                 ✅ Already created
├── vercel.json                    ✅ Already created
├── README.md
├── SETUP.md                       (This file)
└── tailwind.config.js             (See below)
```

### Important Files for GitHub

✅ **DO** include:
- `package.json` - dependencies
- `.gitignore` - exclude node_modules, .env
- `.env.example` - template for env variables
- `README.md` - project documentation
- `vite.config.js` - build configuration
- `vercel.json` - deployment config

❌ **DO NOT** include:
- `.env` file (local secrets)
- `node_modules/` folder
- `.firebase/` folder
- `.DS_Store`
- `dist/` (build output)

---

## 2. Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **+ Create a project**
3. Project name: `kamila-mart`
4. Enable Analytics (optional)
5. Choose location
6. Click **Create project** (wait 1-2 minutes)

### Step 2: Register Web App

1. In Firebase Console, click **Web** icon
2. App nickname: `kamila-mart-web`
3. Copy the Firebase config (you'll need this)

### Step 3: Get Firebase Credentials

1. Go to **Project Settings** (gear icon)
2. Under **Your apps**, select your web app
3. Copy all values to `.env.local`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_APP_URL=http://localhost:5173
```

### Step 4: Enable Firebase Services

#### 4.1 Authentication

1. In Firebase Console → **Authentication**
2. Click **Get started**
3. Enable **Email/Password**
4. Create a test admin account:
   - Email: `admin@kamilamart.com`
   - Password: `Admin123!`

#### 4.2 Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Choose location: `us-central1` (or closest to you)
5. Click **Create**

#### 4.3 Storage (for product images)

1. Go to **Storage**
2. Click **Get started**
3. Keep default rules for now
4. Click **Done**

### Step 5: Set Firestore Rules (Important!)

In Firestore, go to **Rules** tab and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read all collections
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    // Allow admin operations on products, transactions, settings
    match /products/{document=**} {
      allow write: if request.auth != null;
    }
    
    match /transactions/{document=**} {
      allow create: if request.auth == null;  // Customers can create orders
      allow update: if request.auth != null;  // Admins can update status
      allow read: if request.auth != null;
    }
    
    match /settings/{document=**} {
      allow write: if request.auth != null;
      allow read: if true;
    }
  }
}
```

Click **Publish**.

---

## 3. Local Development

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- React 18.2.0
- Firebase SDK
- Lucide icons
- React Hot Toast (notifications)
- Vite (build tool)
- Tailwind CSS

### Step 2: Create Environment File

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Firebase credentials from Step 2.

### Step 3: Set Up Tailwind CSS

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `postcss.config.js`:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Create `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Create Main Entry Files

Create `src/main.jsx`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Create `index.html` in root:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kamila Mart - Admin Dashboard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

**Login with:**
- Email: `admin@kamilamart.com`
- Password: `Admin123!`

---

## 4. Vercel Deployment

### Step 1: Push to GitHub (Required)

Your code must be on GitHub first:

```bash
git add .
git commit -m "Add Firebase integration and Vercel config"
git push origin main
```

### Step 2: Connect Vercel to GitHub

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Click **Import Project**
4. Select your `kamila-mart` repository
5. Click **Import**

### Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add all Firebase variables:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | Your API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | your-project-id |
| `VITE_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Your measurement ID |
| `VITE_APP_URL` | https://your-domain.vercel.app |

3. Click **Save**

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete
3. Visit your live site: `https://kamila-mart.vercel.app` (or custom domain)

### Step 5: Update Firebase CORS (If using Storage)

In Firebase Console → **Storage** → **Rules**:

```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Redeploy on Changes

After pushing to GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel automatically redeploys within seconds!

---

## 5. Firestore Database Structure

### Collections to Create

Create these collections in Firestore Console:

#### 5.1 `products` Collection

Each document structure:

```json
{
  "id": "auto-generated",
  "name": "LPG 3kg",
  "price": 20000,
  "cost": 18000,
  "stock": 50,
  "image": "base64_string_or_url",
  "createdAt": "timestamp"
}
```

#### 5.2 `transactions` Collection

```json
{
  "id": "auto-generated",
  "customer": "John Doe",
  "phone": "081234567890",
  "address": "Jl. Merdeka No. 123",
  "items": [
    {
      "id": "product_id",
      "name": "LPG 3kg",
      "price": 20000,
      "qty": 2
    }
  ],
  "total": 40000,
  "method": "transfer",
  "date": "timestamp",
  "time": "2024-03-04 14:30:00",
  "paymentStatus": "menunggu",
  "shippingStatus": "menunggu"
}
```

#### 5.3 `settings` Collection

Create one document with ID: `main`

```json
{
  "martName": "Kamila Mart",
  "adminPhone": "6281936617426",
  "bankName": "BCA",
  "bankAccountName": "Kamila Mart Admin",
  "bankAccountNumber": "1234567890"
}
```

### Create Test Data

1. Go to Firestore Console
2. Click **+ Add collection**
3. Name: `products`
4. Click **Add document**
5. Add test product:

```
{
  "name": "LPG 3kg",
  "price": 20000,
  "cost": 18000,
  "stock": 50,
  "image": "https://images.unsplash.com/photo-1635335279970-ca72aa3d3c93?w=400&q=80"
}
```

---

## 🚀 Troubleshooting

### Firebase Not Connecting

❌ **Error**: `Firebase is not initialized`

✅ **Solution**: Check `.env.local` has all required variables

```bash
# Verify env file exists
cat .env.local

# Restart dev server
npm run dev
```

### Build Fails on Vercel

❌ **Error**: `Command failed with ENOENT`

✅ **Solution**: Add build script to `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Images Not Showing

❌ **Error**: Images display as broken

✅ **Solution**: Use external URLs (Unsplash, etc.) instead of Base64 for large images

### Authentication Failing

❌ **Error**: "Login failed with code auth/invalid-api-key"

✅ **Solution**: Check Firebase credentials in `.env.local`

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Git workflow
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push origin main    # Push to GitHub
git pull origin main    # Pull latest changes
```

---

## 🔐 Security Tips

1. **Never commit `.env`** - Always use `.env.example`
2. **Use Firebase Rules** - Set proper Firestore security rules
3. **Enable Auth** - Require login for sensitive operations
4. **Store Secrets** - Keep API keys in Vercel environment variables
5. **Review Rules** - Regularly check Firebase security rules

---

## 📖 Additional Resources

- [Vite Docs](https://vitejs.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React 18](https://react.dev)

---

## Next Steps

1. ✅ Set up GitHub repository
2. ✅ Configure Firebase project
3. ✅ Create `.env.local` file
4. ✅ Run `npm install && npm run dev`
5. ✅ Test locally
6. ✅ Push to GitHub
7. ✅ Deploy to Vercel
8. ✅ Update Firebase CORS settings

You're all set! 🎉
