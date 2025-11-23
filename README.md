# 🚀 EarnX - Complete Ads Earning Platform

A modern, full-stack earning platform built with **Next.js**, **MongoDB**, **Clerk Authentication**, and **ImageKit**.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Admin Panel](#admin-panel)

---

## ✨ Features

### User Features
- ✅ **Clerk Authentication** - Secure login/signup
- ✅ **Multiple Ad Categories**:
  - **Earnable** - Earn money after admin approval
  - **Conditional** - Requires verification
  - **View Only** - No earning, just view
- ✅ **Real-time Balance** - Track earnings instantly
- ✅ **Withdrawal System** - UPI/Bank transfer (Min: ₹20)
- ✅ **Referral Program** - Earn 20% commission
- ✅ **Task History** - View all completed tasks
- ✅ **Beautiful UI** - Modern, responsive design

### Admin Features
- ✅ **Admin Dashboard** - Overview of platform stats
- ✅ **Manage Ads** - Create, edit, delete, enable/disable ads
- ✅ **Approve/Reject Tasks** - Review user submissions
- ✅ **Process Withdrawals** - Approve/reject withdrawal requests
- ✅ **User Management** - View all registered users
- ✅ **Analytics** - Track total earnings, ads watched, etc.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: Clerk
- **Media**: ImageKit
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React

---

## 🗄️ Database Schema

### Collections

#### 1. **users**
```javascript
{
  clerkId: String,
  email: String,
  name: String,
  balance: Number,
  totalEarnings: Number,
  adsWatched: Number,
  tasksCompleted: Number,
  referralCode: String,
  referredBy: String,
  referrals: Array,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **ads**
```javascript
{
  title: String,
  image_url: String,
  category: String, // 'earnable' | 'conditional' | 'view_only'
  payout: Number,
  time_required: Number,
  description: String,
  ad_link: String,
  status: String, // 'active' | 'inactive'
  created_at: Date,
  updated_at: Date
}
```

#### 3. **user_tasks**
```javascript
{
  user_id: String,
  ad_id: ObjectId,
  status: String, // 'pending' | 'completed' | 'approved' | 'rejected'
  earned_amount: Number,
  proof_screenshot_url: String,
  task_opened_at: Date,
  task_completed_at: Date,
  rejection_reason: String
}
```

#### 4. **withdrawals**
```javascript
{
  clerkId: String,
  email: String,
  name: String,
  amount: Number,
  method: String, // 'UPI' | 'Bank'
  upiId: String,
  status: String, // 'pending' | 'approved' | 'rejected'
  requestedAt: Date,
  processedAt: Date,
  transaction_id: String,
  rejection_reason: String
}
```

---

## 🔌 API Endpoints

### **Ads API**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/ads` | Get all active ads | User |
| GET | `/api/ads/:id` | Get single ad | User |
| POST | `/api/ads` | Create new ad | Admin |
| PUT | `/api/ads/:id` | Update ad | Admin |
| DELETE | `/api/ads/:id` | Disable ad | Admin |

### **Tasks API**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/tasks/start` | Start a task | User |
| POST | `/api/tasks/complete` | Complete a task | User |
| GET | `/api/tasks/user/:userId` | Get user tasks | User |
| PUT | `/api/tasks/approve/:id` | Approve task | Admin |
| PUT | `/api/tasks/reject/:id` | Reject task | Admin |

### **Withdrawal API**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/withdraw` | Request withdrawal | User |
| GET | `/api/withdraw/user/:userId` | Get withdrawal history | User |
| PUT | `/api/withdraw/approve/:id` | Approve withdrawal | Admin |
| PUT | `/api/withdraw/reject/:id` | Reject withdrawal | Admin |

### **User API**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/user` | Get current user data | User |

### **Admin API**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/admin/login` | Admin login | Public |
| POST | `/api/admin/logout` | Admin logout | Admin |
| GET | `/api/admin/stats` | Get platform stats | Admin |

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd earning-website-ui
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# ImageKit (Optional)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
```

### 4. Seed the database
```bash
node scripts/seed-tasks.js
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `ADMIN_EMAIL` | Admin login email | Yes |
| `ADMIN_PASSWORD` | Admin login password | Yes |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | ImageKit public key | No |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | No |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | No |

---

## 📱 Usage

### For Users

1. **Sign Up**: Create an account at `/signup`
2. **Browse Ads**: View available ads on the dashboard
3. **Complete Tasks**: Click "Start Task" to begin earning
4. **Withdraw**: Request withdrawal from the wallet page (Min: ₹20)
5. **Refer Friends**: Share your referral code to earn 20% commission

### For Admins

1. **Login**: Access admin panel at `/admin/login`
   - Email: `admin@dhanbyte.me`
   - Password: `704331`

2. **Manage Ads**: Create, edit, or disable ads
3. **Review Tasks**: Approve or reject user task submissions
4. **Process Withdrawals**: Approve or reject withdrawal requests
5. **View Analytics**: Monitor platform performance

---

## 🎯 Admin Panel

### Access
- URL: `/admin/login`
- Email: Set in `.env.local` (`ADMIN_EMAIL`)
- Password: Set in `.env.local` (`ADMIN_PASSWORD`)

### Features

#### 1. **Dashboard** (`/admin`)
- Total users count
- Total earnings paid
- Total ads watched
- Tasks completed
- Pending withdrawals

#### 2. **Manage Ads** (`/admin/ads`)
- Create new ads
- Edit existing ads
- Enable/disable ads
- Delete ads
- Filter by category

#### 3. **Approve Tasks** (`/admin/tasks`)
- View all user tasks
- Approve tasks (adds payout to user balance)
- Reject tasks (with reason)
- Filter by status

#### 4. **Process Withdrawals** (`/admin/withdrawals`)
- View all withdrawal requests
- Approve withdrawals
- Reject withdrawals (refunds to user balance)
- Add transaction ID

---

## 🔄 Workflow

### User Task Completion Flow

1. User clicks "Start Task" → Creates `user_tasks` entry with status `pending`
2. User completes task → Updates status to `completed`
3. Admin reviews task → Approves or rejects
4. If approved → Adds payout to user balance
5. If rejected → User can try again

### Withdrawal Flow

1. User requests withdrawal → Deducts from balance, creates withdrawal request
2. Admin reviews → Approves or rejects
3. If approved → Payment processed
4. If rejected → Amount refunded to user balance

---

## 🎨 Ad Categories

### 1. **Earnable**
- User earns money after admin approval
- Requires task completion verification
- Payout added to balance after approval

### 2. **Conditional**
- Requires specific conditions to be met
- Admin verifies completion
- Higher payouts typically

### 3. **View Only**
- No earning for users
- Just view the ad
- Used for brand awareness

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Environment Variables on Vercel
Add all environment variables from `.env.local` to your Vercel project settings.

---

## 📞 Support

For issues or questions:
- Email: admin@dhanbyte.me
- Create an issue on GitHub

---

## 📄 License

This project is proprietary and confidential.

---

## 🙏 Credits

Built with ❤️ using modern web technologies.

---

**Happy Earning! 💰**
