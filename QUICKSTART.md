# 🚀 Quick Start Guide

Follow these steps to get your app running locally, on GitHub, and deployed to Vercel.

---

## ⚡ 5-Minute Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Copy `.env.example` → `.env.local` and fill in your Firebase credentials

### 3. Run Dev Server
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 📤 Push to GitHub (10 minutes)

### 1. Initialize Git
```bash
git init
git add .
git commit -m "Initial commit: Kamila Mart with Firebase"
```

### 2. Create Repository on GitHub.com
- Go to github.com/new
- Name: `kamila-mart`
- Click "Create repository"

### 3. Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/kamila-mart.git
git branch -M main
git push -u origin main
```

---

## 🔥 Firebase Setup (15 minutes)

### 1. Create Firebase Project
- Go to console.firebase.google.com
- Click "Create project"
- Name: `kamila-mart`
- Enable Analytics (optional)

### 2. Get Firebase Credentials
1. Project Settings → Your apps
2. Copy all 7 Firebase config values
3. Paste into `.env.local`

### 3. Enable Services

**Authentication:**
- Go to Authentication
- Enable Email/Password
- Create test account: `admin@kamilamart.com` / `Admin123!`

**Firestore:**
- Go to Firestore Database
- Create database in test mode

**Storage:**
- Go to Storage
- Get started

### 4. Create Collections
In Firestore Console, create:
- `products` collection
- `transactions` collection  
- `settings` collection (with one document)

See SETUP.md for detailed structure.

---

## 🌐 Deploy to Vercel (5 minutes)

### 1. Connect to Vercel
- Go to vercel.com
- Import project from GitHub
- Select `kamila-mart` repo

### 2. Add Environment Variables
In Vercel dashboard:
- Settings → Environment Variables
- Add all 7 Firebase variables
- Add VITE_APP_URL

### 3. Deploy
- Click "Deploy"
- Wait for build (2-3 minutes)
- Visit your live URL! 🎉

---

## 📂 Project Structure

```
kamila-mart/
├── src/
│   ├── App-firebase.jsx           ← Main app with Firebase
│   ├── AdminDashboard-firebase.jsx
│   ├── Login.jsx
│   ├── Pemesanan.jsx
│   ├── utils.js
│   ├── firebase-config.js
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── .env.example
├── .env.local                      ← YOUR SECRETS (don't commit!)
├── .gitignore
├── vite.config.js
├── vercel.json
├── tailwind.config.js
├── postcss.config.js
├── SETUP.md                        ← Detailed guide
├── README.md                       ← Project info
└── QUICKSTART.md                   ← This file
```

---

## 🔑 Environment Variables

Required in `.env.local`:

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_FIREBASE_MEASUREMENT_ID=xxx
VITE_APP_URL=http://localhost:5173
```

---

## 🛠️ Useful Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build

git status         # Check git status
git add .          # Stage all changes
git commit -m ""   # Commit changes
git push           # Push to GitHub
```

---

## ✅ Checklist

- [ ] Node.js installed (v18+)
- [ ] GitHub account created
- [ ] Firebase project created
- [ ] Firebase credentials in `.env.local`
- [ ] Firestore collections created
- [ ] `npm install` completed
- [ ] `npm run dev` working locally
- [ ] Code pushed to GitHub
- [ ] Vercel connected to GitHub
- [ ] Environment variables added to Vercel
- [ ] App deployed to Vercel ✨

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| Firebase not connecting | Check `.env.local` has all credentials |
| Build fails on Vercel | Check vercel.json has correct settings |
| Login not working | Verify authentication enabled in Firebase |
| Images not loading | Use external URLs instead of Base64 |

---

## 📚 Need More Help?

- Detailed guide: See **SETUP.md**
- File documentation: See **README.md**
- Firebase setup: See **SETUP.md** section 2
- Deployment: See **SETUP.md** section 4

---

## 🎯 Next Steps

1. Follow "Local Setup" above
2. Test app locally with `npm run dev`
3. Push to GitHub
4. Deploy to Vercel
5. Login with: `admin@kamilamart.com` / `Admin123!`
6. Start adding products! 🚀

Good luck! 🎉
