# 📚 API Documentation - EarnX Platform

Complete API reference for the EarnX earning platform.

---

## 🔐 Authentication

Most endpoints require authentication via Clerk. Admin endpoints require admin session cookie.

### Headers
```
Content-Type: application/json
```

---

## 📌 Ads API

### 1. Get All Ads
**GET** `/api/ads`

Get all active ads, optionally filtered by category.

**Query Parameters:**
- `category` (optional): Filter by category (`earnable`, `conditional`, `view_only`)

**Response:**
```json
{
  "success": true,
  "ads": [
    {
      "id": "65abc123...",
      "title": "Watch Product Ad",
      "image_url": "https://...",
      "category": "earnable",
      "payout": 2.50,
      "time_required": 30,
      "description": "Watch a 30-second ad",
      "ad_link": "https://...",
      "status": "active"
    }
  ]
}
```

---

### 2. Get Single Ad
**GET** `/api/ads/:id`

Get details of a specific ad.

**Response:**
```json
{
  "success": true,
  "ad": {
    "id": "65abc123...",
    "title": "Watch Product Ad",
    "category": "earnable",
    "payout": 2.50,
    "time_required": 30,
    "description": "Watch a 30-second ad",
    "ad_link": "https://...",
    "status": "active"
  }
}
```

---

### 3. Create Ad (Admin Only)
**POST** `/api/ads`

Create a new ad.

**Request Body:**
```json
{
  "title": "Watch Product Ad",
  "image_url": "https://...",
  "category": "earnable",
  "payout": 2.50,
  "time_required": 30,
  "description": "Watch a 30-second ad",
  "ad_link": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "ad": {
    "id": "65abc123...",
    ...
  }
}
```

---

### 4. Update Ad (Admin Only)
**PUT** `/api/ads/:id`

Update an existing ad.

**Request Body:**
```json
{
  "title": "Updated Title",
  "payout": 3.00,
  "status": "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ad updated successfully"
}
```

---

### 5. Delete/Disable Ad (Admin Only)
**DELETE** `/api/ads/:id`

Soft delete (disable) an ad.

**Response:**
```json
{
  "success": true,
  "message": "Ad disabled successfully"
}
```

---

## 🎯 Tasks API

### 1. Start Task
**POST** `/api/tasks/start`

User starts a task/ad.

**Request Body:**
```json
{
  "ad_id": "65abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "task_id": "65def456...",
  "ad": {
    "id": "65abc123...",
    "title": "Watch Product Ad",
    "ad_link": "https://...",
    "time_required": 30,
    "payout": 2.50,
    "category": "earnable"
  },
  "message": "Task started successfully"
}
```

**Error Responses:**
- `400` - Ad not found or inactive
- `400` - Task already started or completed

---

### 2. Complete Task
**POST** `/api/tasks/complete`

User completes a task.

**Request Body:**
```json
{
  "task_id": "65def456...",
  "proof_screenshot_url": "https://..." // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task submitted! Waiting for admin approval.",
  "status": "completed",
  "payout": 2.50,
  "category": "earnable"
}
```

**Category-specific behavior:**
- `view_only`: Auto-approved, no earning
- `earnable`: Needs admin approval
- `conditional`: Needs admin verification

---

### 3. Get User Tasks
**GET** `/api/tasks/user/:userId`

Get all tasks for a specific user.

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "id": "65def456...",
      "user_id": "user_123",
      "ad": {
        "id": "65abc123...",
        "title": "Watch Product Ad",
        "category": "earnable",
        "payout": 2.50
      },
      "status": "approved",
      "earned_amount": 2.50,
      "proof_screenshot_url": null,
      "task_opened_at": "2025-01-23T10:00:00Z",
      "task_completed_at": "2025-01-23T10:05:00Z"
    }
  ]
}
```

---

### 4. Approve Task (Admin Only)
**PUT** `/api/tasks/approve/:id`

Admin approves a task and adds payout to user balance.

**Response:**
```json
{
  "success": true,
  "message": "Task approved successfully",
  "payout": 2.50
}
```

**Side Effects:**
- Updates task status to `approved`
- Adds payout to user balance
- Updates user total earnings

---

### 5. Reject Task (Admin Only)
**PUT** `/api/tasks/reject/:id`

Admin rejects a task.

**Request Body:**
```json
{
  "reason": "Task did not meet requirements"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task rejected successfully"
}
```

---

## 💰 Withdrawal API

### 1. Request Withdrawal
**POST** `/api/withdraw`

User requests a withdrawal.

**Request Body:**
```json
{
  "amount": 50.00,
  "upiId": "user@upi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal request submitted successfully"
}
```

**Validation:**
- Minimum amount: ₹20
- User must have sufficient balance
- UPI ID required

**Side Effects:**
- Deducts amount from user balance
- Creates withdrawal request with status `pending`

---

### 2. Get Withdrawal History
**GET** `/api/withdraw/user/:userId`

Get withdrawal history for a user.

**Response:**
```json
{
  "success": true,
  "withdrawals": [
    {
      "id": "65ghi789...",
      "amount": 50.00,
      "method": "UPI",
      "upi_id": "user@upi",
      "status": "approved",
      "created_at": "2025-01-23T10:00:00Z",
      "processed_at": "2025-01-23T12:00:00Z"
    }
  ]
}
```

---

### 3. Approve Withdrawal (Admin Only)
**PUT** `/api/withdraw/approve/:id`

Admin approves a withdrawal.

**Request Body:**
```json
{
  "transaction_id": "TXN123456" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal approved successfully"
}
```

---

### 4. Reject Withdrawal (Admin Only)
**PUT** `/api/withdraw/reject/:id`

Admin rejects a withdrawal and refunds amount to user.

**Request Body:**
```json
{
  "reason": "Invalid UPI ID"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal rejected and amount refunded to user"
}
```

**Side Effects:**
- Refunds amount to user balance
- Updates withdrawal status to `rejected`

---

## 👤 User API

### Get Current User
**GET** `/api/user`

Get current authenticated user data.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "65jkl012...",
    "clerkId": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "balance": 150.50,
    "totalEarnings": 500.00,
    "adsWatched": 50,
    "tasksCompleted": 45,
    "referralCode": "ABC12345",
    "referrals": []
  }
}
```

**Auto-creation:**
- If user doesn't exist in database, creates new user record
- Generates unique referral code

---

## 🔒 Admin API

### 1. Admin Login
**POST** `/api/admin/login`

Admin login endpoint.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Side Effects:**
- Sets `admin_session` cookie (7 days expiry)

---

### 2. Admin Logout
**POST** `/api/admin/logout`

Admin logout endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Side Effects:**
- Deletes `admin_session` cookie

---

### 3. Get Platform Stats (Admin Only)
**GET** `/api/admin/stats`

Get platform statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1250,
    "totalEarnings": 50000.00,
    "totalAdsWatched": 25000,
    "totalTasksCompleted": 22500,
    "pendingWithdrawals": 15
  }
}
```

---

## 🚨 Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📊 Status Values

### Task Status
- `pending` - Task started but not completed
- `completed` - Task completed, waiting for approval
- `approved` - Task approved, payout added
- `rejected` - Task rejected by admin

### Withdrawal Status
- `pending` - Withdrawal requested
- `approved` - Withdrawal approved and processed
- `rejected` - Withdrawal rejected, amount refunded

### Ad Status
- `active` - Ad is live and available
- `inactive` - Ad is disabled

### Ad Categories
- `earnable` - User earns money after admin approval
- `conditional` - Requires specific conditions/verification
- `view_only` - No earning, just view

---

## 🔄 Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:

```javascript
// Example: 100 requests per 15 minutes per user
```

---

## 🛡️ Security Considerations

1. **Authentication**: All user endpoints require Clerk authentication
2. **Admin Protection**: Admin endpoints check for admin session cookie
3. **Input Validation**: All inputs are validated before processing
4. **SQL Injection**: Using MongoDB with proper ObjectId validation
5. **XSS Protection**: Next.js automatically escapes output

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- All monetary values are in INR (₹)
- Minimum withdrawal amount: ₹20
- Referral commission: 20% of referral's earnings

---

**Last Updated**: January 23, 2025
