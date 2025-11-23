# 🚀 QUICK START GUIDE

## ⚡ Get Started in 3 Steps

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Access the Platform

**User Side:**
- 🏠 Homepage: http://localhost:3000
- 🔐 Login: http://localhost:3000/login
- 📝 Signup: http://localhost:3000/signup
- 📊 Dashboard: http://localhost:3000/dashboard

**Admin Side:**
- 🔒 Admin Login: http://localhost:3000/admin/login
  - Email: `admin@dhanbyte.me`
  - Password: `704331`
- 🎛️ Admin Dashboard: http://localhost:3000/admin
- 📢 Manage Ads: http://localhost:3000/admin/ads

### Step 3: Test the Flow

1. **Sign up** as a new user
2. **Browse ads** on dashboard
3. **Start a task** and complete it
4. **Login as admin** and approve the task
5. **Check user balance** - money added!
6. **Request withdrawal** (min ₹20)
7. **Admin approves** withdrawal

---

## 📚 Database Collections

### 1. users
- Stores user information
- Auto-created on first login
- Includes referral code

### 2. ads
- All earning opportunities
- 3 categories: earnable, conditional, view_only
- 10 sample ads already loaded

### 3. user_tasks
- Tracks user task progress
- Statuses: pending → completed → approved/rejected

### 4. withdrawals
- Withdrawal requests
- Statuses: pending → approved/rejected

---

## 🎯 Ad Categories

| Category | Earning | Approval | Example |
|----------|---------|----------|---------|
| **Earnable** | ✅ Yes | Admin | Watch ad, earn ₹5 |
| **Conditional** | ✅ Yes | Admin | Install app, earn ₹15 |
| **View Only** | ❌ No | Auto | View ad, no earning |

---

## 🔑 API Quick Reference

### User APIs
```javascript
// Get current user
GET /api/user

// Get all ads
GET /api/ads

// Start task
POST /api/tasks/start
{ "adId": "..." }

// Complete task
POST /api/tasks/complete
{ "taskId": "...", "proofImageUrl": "..." }

// Request withdrawal
POST /api/withdraw
{ "amount": 50, "upiId": "user@upi" }
```

### Admin APIs
```javascript
// Login
POST /api/admin/login
{ "email": "...", "password": "..." }

// Get stats
GET /api/admin/stats

// Create ad
POST /api/ads
{
  "title": "...",
  "category": "earnable",
  "payout": 5.00,
  "imageUrl": "...",
  "description": "...",
  "link": "..."
}

// Approve task
PUT /api/tasks/approve/:id

// Approve withdrawal
PUT /api/withdraw/approve/:id
```

---

## 🛠️ Common Tasks

### Add a New Ad (Admin)
1. Go to `/admin/ads`
2. Click "Create New Ad"
3. Fill in details:
   - Title
   - Category (earnable/conditional/view_only)
   - Payout amount
   - Description
   - Link
4. Click "Create Ad"

### Approve User Task (Admin)
1. Go to `/admin/tasks`
2. View pending tasks
3. Click "Approve" or "Reject"
4. If approved, money added to user balance

### Process Withdrawal (Admin)
1. Go to `/admin/withdrawals`
2. View pending withdrawals
3. Click "Approve" or "Reject"
4. If rejected, money refunded to user

---

## 🎨 Database Schema (camelCase)

```javascript
// ✅ Correct Field Names
{
  userId: "...",
  adId: ObjectId("..."),
  imageUrl: "...",
  proofImageUrl: "...",
  earnedAmount: 5.00,
  createdAt: new Date(),
  updatedAt: new Date(),
  openedAt: new Date(),
  completedAt: new Date()
}

// ❌ Wrong (old snake_case)
{
  user_id: "...",  // Don't use
  ad_id: "...",    // Don't use
  image_url: "...", // Don't use
}
```

---

## 🔍 Troubleshooting

### Database Not Connected?
```bash
# Re-initialize database
node scripts/init-database.js
```

### No Ads Showing?
- Check if ads exist in database
- Run seed script: `node scripts/init-database.js`
- Check ad status is 'active'

### Task Not Approved?
- Admin must manually approve earnable/conditional tasks
- View_only tasks are auto-approved

### Withdrawal Failed?
- Check minimum amount (₹20)
- Check user has sufficient balance
- Check UPI ID is provided

---

## 📊 Sample Data

**10 Ads Already Loaded:**
- 6 Earnable ads (₹2-₹7)
- 3 Conditional ads (₹10-₹20)
- 1 View-only ad (₹0)

**Total Earning Potential:** ₹73.50 per user

---

## 🎯 User Flow Example

```
1. User signs up → Auto-created in DB
2. User sees 10 ads on dashboard
3. User clicks "Start Task" on ₹5 ad
4. Task status: pending
5. User clicks "Complete Task"
6. Task status: completed
7. Admin reviews task
8. Admin clicks "Approve"
9. Task status: approved
10. User balance: +₹5
11. User requests ₹50 withdrawal
12. Admin approves withdrawal
13. User receives payment
```

---

## 🔐 Admin Credentials

**Email:** admin@dhanbyte.me
**Password:** 704331

**Change in:** `.env.local`
```env
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=your_secure_password
```

---

## 📝 Environment Setup

**Required:**
- ✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- ✅ CLERK_SECRET_KEY
- ✅ MONGODB_URI
- ✅ ADMIN_EMAIL
- ✅ ADMIN_PASSWORD

**Optional:**
- ImageKit keys (for image uploads)

---

## 🚀 Deployment Checklist

- [ ] Update environment variables
- [ ] Change admin password
- [ ] Test all user flows
- [ ] Test all admin flows
- [ ] Check database indexes
- [ ] Enable production mode
- [ ] Deploy to Vercel/Railway
- [ ] Configure custom domain

---

## 📞 Support

**Documentation:**
- `README.md` - Full documentation
- `API_DOCUMENTATION.md` - API reference
- `BACKEND_COMPLETE.md` - Backend details

**Quick Help:**
- Check console for errors
- Verify environment variables
- Ensure MongoDB is connected
- Check Clerk dashboard

---

**🎉 Everything is ready! Start earning! 💰**
