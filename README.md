<div align="center">

# ⚡ PixelVault Store

### Premium Digital Product Marketplace

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-purple?style=for-the-badge)](https://github.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

A **futuristic cyberpunk-themed** digital product marketplace built with React, Vite, Firebase, and Netlify Functions. Sell eBooks, AI prompts, presets, templates, courses, and more — with a premium UI experience.

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📸 Screenshots

> *Coming soon — screenshots of the storefront, product pages, checkout flow, and admin dashboard.*

---

## ✨ Features

### 🛍️ Storefront
- **Product Catalog** — Browse products by category with search & filters
- **Product Detail Pages** — Rich product pages with ratings, reviews, and download info
- **Shopping Cart** — Add/remove items with real-time price calculations
- **UPI Payment** — QR code based UPI checkout with screenshot verification
- **Order Tracking** — Track order status and download purchased products

### 👤 User Management
- **Firebase Authentication** — Email/password and Google sign-in
- **User Dashboard** — View orders, downloads, and profile settings
- **Password Reset** — Secure password recovery via email

### 🔧 Admin Panel
- **Dashboard** — Real-time analytics with revenue charts and key metrics
- **Product Management** — Full CRUD operations for digital products
- **Order Management** — Review, approve/reject orders with payment verification
- **User Management** — View, search, and manage user accounts
- **Premium UI** — Vercel/Linear-inspired admin dashboard aesthetics

### 🎨 Design
- **Cyberpunk Theme** — Dark mode with neon purple/cyan accents
- **Glassmorphism** — Frosted glass effects throughout the UI
- **Smooth Animations** — Framer Motion powered transitions
- **Fully Responsive** — Mobile-first design, works on all devices
- **Premium Typography** — Inter + SF Mono font pairing

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, Vite 5, React Router v6 |
| **Styling** | Vanilla CSS, CSS Variables, Glassmorphism |
| **Animation** | Framer Motion |
| **Auth** | Firebase Authentication |
| **Database** | Firebase Firestore |
| **Storage** | Firebase Storage |
| **Backend** | Netlify Functions (Serverless) |
| **API** | Express.js (via serverless-http) |
| **Hosting** | Netlify |
| **Icons** | React Icons (Feather) |
| **Notifications** | React Hot Toast |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ — [Download](https://nodejs.org)
- **npm** 9+ (comes with Node.js)
- **Firebase Account** — [Create one](https://firebase.google.com)
- **Netlify Account** — [Sign up](https://netlify.com) (for deployment)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pixelvault-store.git
cd pixelvault-store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_UPI_ID=yourupi@paytm
VITE_UPI_NAME=PixelVault Store
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select an existing one
3. Enable **Authentication** → Email/Password and Google sign-in
4. Create a **Firestore Database** in production mode
5. Set up **Storage** for file uploads
6. Copy your Firebase config to the `.env` file

### 5. Run Development Server

```bash
# Frontend only (Vite dev server)
npm run dev

# Full stack with Netlify Functions
npx netlify dev
```

The app will be available at `http://localhost:5173` (Vite) or `http://localhost:8888` (Netlify Dev).

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | ✅ |
| `VITE_UPI_ID` | UPI ID for payments | ✅ |
| `VITE_UPI_NAME` | Display name for UPI | ✅ |

---

## 📁 Project Structure

```
pixelvault-store/
├── public/                    # Static assets
├── netlify/
│   └── functions/
│       └── api.js             # Serverless Express API
├── src/
│   ├── components/            # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx    # Firebase auth context
│   ├── data/
│   │   └── sampleProducts.js  # Demo product data
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── admin/
│   │       ├── AdminLayout.jsx
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminProducts.jsx
│   │       ├── AdminOrders.jsx
│   │       └── AdminUsers.jsx
│   ├── styles/
│   │   └── index.css          # Global design system
│   ├── firebase.js            # Firebase config
│   ├── App.jsx                # App router
│   └── main.jsx               # Entry point
├── .env.example               # Environment template
├── index.html                 # HTML entry
├── package.json
├── vite.config.js
├── netlify.toml               # Netlify configuration
└── README.md
```

---

## 🌐 Deployment to Netlify

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your GitHub repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`

### 3. Set Environment Variables

In Netlify dashboard → **Site settings** → **Environment variables**, add all variables from your `.env` file.

### 4. Deploy

Click **Deploy** — Netlify will build and deploy your site automatically.

---

## 👑 Admin Setup

### Setting Admin Role in Firebase

1. Go to Firebase Console → **Firestore**
2. Create a `users` collection (if not exists)
3. Find the user document for the admin account
4. Add/update the field: `role: "admin"`

Alternatively, use the Firebase Admin SDK:

```javascript
const admin = require('firebase-admin');
admin.auth().setCustomUserClaims(uid, { admin: true });
```

### Demo Admin Access

For demo purposes, use these credentials:
- **Email:** `admin@pixelvault.com`
- **Password:** `admin123`

---

## 💰 UPI Payment Configuration

PixelVault uses a manual UPI verification system:

1. **Customer** selects products and proceeds to checkout
2. **Customer** scans the UPI QR code and makes payment
3. **Customer** uploads payment screenshot + enters UPI Transaction ID
4. **Admin** reviews the screenshot and transaction ID in the admin panel
5. **Admin** approves/rejects the order
6. **Customer** receives download links for approved orders

To configure your UPI:
- Set `VITE_UPI_ID` to your UPI ID (e.g., `yourname@paytm`)
- Set `VITE_UPI_NAME` to your display name

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/products/:id` | Public | Get single product |
| `POST` | `/api/products` | Admin | Create product |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |
| `POST` | `/api/orders` | User | Create order |
| `GET` | `/api/orders` | User/Admin | Get orders |
| `PUT` | `/api/orders/:id/verify` | Admin | Verify payment |
| `POST` | `/api/upload` | User | Upload screenshot |
| `GET` | `/api/users` | Admin | List users |
| `GET` | `/api/analytics` | Admin | Sales analytics |

All API routes are prefixed with `/.netlify/functions/api`.

**Response format:**
```json
{
  "success": true,
  "data": {},
  "message": "Description of result"
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

Please ensure your code follows the existing style and includes appropriate tests.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the PixelVault Team**

⚡ *Where digital products meet futuristic design* ⚡

</div>
