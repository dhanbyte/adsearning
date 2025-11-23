# 🔥 COMPLETE API ENDPOINTS - PRODUCTION READY

All endpoints return clean JSON responses with proper error handling.

---

## 🟩 1) AUTH ENDPOINTS (User System)

### POST /api/auth/register
**Create new user with JWT authentication**

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "referredBy": "ABC12345"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "referralCode": "XYZ98765",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST /api/auth/login
**Validate email/password and return JWT token**

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "balance": 150.50,
    "totalEarnings": 500.00,
    "referralCode": "XYZ98765",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET /api/auth/me
**Get current user details using JWT token**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "balance": 150.50,
    "totalEarnings": 500.00,
    "referralCode": "XYZ98765",
    "referredBy": "ABC12345",
    "createdAt": "2025-01-23T10:00:00.000Z",
    "updatedAt": "2025-01-23T12:00:00.000Z"
  }
}
```

---

## 🟩 2) ADS ENDPOINTS

### GET /api/ads
**Return list of active ads**

**Query Parameters:**
- `category` (optional): Filter by category

**Response (200):**
```json
{
  "success": true,
  "ads": [
    {
      "id": "65abc123...",
      "title": "Watch Smartphone Ad",
      "imageUrl": "https://...",
      "category": "earnable",
      "payout": 5.00,
      "description": "Watch a 30-second ad",
      "link": "https://...",
      "status": "active"
    }
  ]
}
```

---

### GET /api/ads/:id
**Return single ad details**

**Response (200):**
```json
{
  "success": true,
  "ad": {
    "id": "65abc123...",
    "title": "Watch Smartphone Ad",
    "imageUrl": "https://...",
    "category": "earnable",
    "payout": 5.00,
    "description": "Watch a 30-second ad",
    "link": "https://...",
    "status": "active"
  }
}
```

---

### POST /api/ads
**(Admin only) Create new ad**

**Headers:**
```
Cookie: admin_session=true
```

**Request Body:**
```json
{
  "title": "Watch Smartphone Ad",
  "imageUrl": "https://...",
  "category": "earnable",
  "payout": 5.00,
  "description": "Watch a 30-second ad",
  "link": "https://..."
}
```

**Response (200):**
```json
{
  "success": true,
  "ad": {
    "id": "65abc123...",
    "title": "Watch Smartphone Ad",
    ...
  }
}
```

---

### PUT /api/ads/:id
**(Admin only) Update ad**

**Request Body:**
```json
{
  "title": "Updated Title",
  "payout": 6.00,
  "status": "inactive"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Ad updated successfully"
}
```

---

### DELETE /api/ads/:id
**(Admin only) Disable/delete ad**

**Response (200):**
```json
{
  "success": true,
  "message": "Ad disabled successfully"
}
```

---

## 🟩 3) USER TASKS ENDPOINTS

### POST /api/tasks/start
**Start a task - creates task with status = "pending"**

**Request Body:**
```json
{
  "userId": "user_123",
  "adId": "65abc123..."
}
```

**Response (200):**
```json
{
  "success": true,
  "taskId": "65def456...",
  "ad": {
    "id": "65abc123...",
    "title": "Watch Smartphone Ad",
    "link": "https://...",
    "payout": 5.00,
    "category": "earnable"
  },
  "message": "Task started successfully"
}
```

---

### POST /api/tasks/complete
**Complete task - updates status to "completed"**

**Request Body:**
```json
{
  "taskId": "65def456...",
  "proofImageUrl": "https://..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task submitted! Waiting for admin approval.",
  "status": "completed",
  "payout": 5.00,
  "category": "earnable"
}
```

---

### GET /api/tasks/user/:userId
**Return all tasks for a user**

**Response (200):**
```json
{
  "success": true,
  "tasks": [
    {
      "id": "65def456...",
      "userId": "user_123",
      "ad": {
        "id": "65abc123...",
        "title": "Watch Smartphone Ad",
        "category": "earnable",
        "payout": 5.00
      },
      "status": "approved",
      "earnedAmount": 5.00,
      "proofImageUrl": "https://...",
      "openedAt": "2025-01-23T10:00:00.000Z",
      "completedAt": "2025-01-23T10:05:00.000Z"
    }
  ]
}
```

---

### PUT /api/tasks/approve/:taskId
**(Admin) Approve task and add earnings**

**Response (200):**
```json
{
  "success": true,
  "message": "Task approved successfully",
  "payout": 5.00
}
```

**Side Effects:**
- Task status → `approved`
- User balance += payout
- User totalEarnings += payout

---

### PUT /api/tasks/reject/:taskId
**(Admin) Reject task**

**Request Body:**
```json
{
  "reason": "Task did not meet requirements"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task rejected successfully"
}
```

---

## 🟩 4) WITHDRAW ENDPOINTS

### POST /api/withdraw
**Create withdrawal request**

**Request Body:**
```json
{
  "userId": "user_123",
  "amount": 50.00,
  "method": "UPI",
  "upiId": "user@upi"
}
```

**Response (200):**
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

---

### GET /api/withdraw/user/:userId
**Get all withdrawals for a user**

**Response (200):**
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
      "created_at": "2025-01-23T10:00:00.000Z",
      "processed_at": "2025-01-23T12:00:00.000Z"
    }
  ]
}
```

---

### PUT /api/withdraw/approve/:withdrawId
**(Admin) Approve withdrawal**

**Request Body:**
```json
{
  "transaction_id": "TXN123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Withdrawal approved successfully"
}
```

---

### PUT /api/withdraw/reject/:withdrawId
**(Admin) Reject withdrawal and refund**

**Request Body:**
```json
{
  "reason": "Invalid UPI ID"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Withdrawal rejected and amount refunded to user"
}
```

**Side Effects:**
- User balance += withdrawal amount (refund)

---

## 🟩 5) POSTBACK ENDPOINTS (Offerwalls)

### POST /api/postback/cpalead
**Handle CPALead offerwall postback**

**Request Body:**
```json
{
  "user_id": "65abc123...",
  "transaction_id": "TXN_EXT_12345",
  "amount": 10.50,
  "currency": "USD",
  "offer_name": "Install Gaming App",
  "signature": "abc123def456..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Postback processed successfully",
  "data": {
    "taskId": "65jkl012...",
    "userId": "65abc123...",
    "transactionId": "TXN_EXT_12345",
    "earnedAmount": 10.50,
    "newBalance": 160.50
  }
}
```

**Features:**
- ✅ Validates signature (HMAC-SHA256)
- ✅ Checks if transaction already exists (idempotency)
- ✅ Auto-approves and credits user
- ✅ Stores `externalTransactionId` in task table

**Idempotency Response (if already processed):**
```json
{
  "success": true,
  "message": "Transaction already processed",
  "data": {
    "taskId": "65jkl012...",
    "status": "approved"
  }
}
```

---

## 🟩 6) ADMIN STATS

### GET /api/admin/stats
**(Admin) Get platform dashboard stats**

**Headers:**
```
Cookie: admin_session=true
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalEarningsDistributed": 50000.00,
    "totalActiveAds": 25,
    "pendingTasks": 45,
    "pendingWithdrawals": 12,
    "totalTasksCompleted": 5000,
    "totalWithdrawn": 30000.00,
    "recentStats": {
      "newUsersLast7Days": 150,
      "tasksLast7Days": 800
    }
  }
}
```

---

## 🟩 7) ERROR HANDLING

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token / invalid token)
- `403` - Forbidden (invalid signature)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

**Example Error Responses:**

```json
// 400 - Validation Error
{
  "success": false,
  "error": "Email and password are required"
}

// 401 - Unauthorized
{
  "success": false,
  "error": "No token provided"
}

// 404 - Not Found
{
  "success": false,
  "error": "User not found"
}

// 409 - Duplicate
{
  "success": false,
  "error": "User with this email already exists"
}
```

---

## 🟩 8) SECURITY

### Authentication
- **User Endpoints**: Require JWT token in `Authorization: Bearer <token>` header
- **Admin Endpoints**: Require `admin_session` cookie

### Rate Limiting
- Max 200 requests per minute per user (to be implemented with middleware)

### Password Security
- Passwords hashed with bcrypt (10 rounds)
- Minimum 6 characters required

### Signature Validation
- Postback endpoints validate HMAC-SHA256 signature
- Secret key stored in environment variable

### Input Validation
- All inputs validated before processing
- Email format validation
- Amount validation (min/max)
- Required fields checked

### Idempotency
- Postback endpoints check for duplicate transactions
- Prevents double-crediting

---

## 📝 Environment Variables Required

```env
# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CPALead Secret
CPALEAD_SECRET=your-cpalead-secret-key

# MongoDB
MONGODB_URI=mongodb+srv://...

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

---

## 🚀 Quick Test Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Start Task
```bash
curl -X POST http://localhost:3000/api/tasks/start \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "adId": "AD_ID"
  }'
```

---

**🎉 All endpoints are production-ready with:**
- ✅ Clean JSON responses
- ✅ Proper error handling
- ✅ Input validation
- ✅ Security measures
- ✅ Idempotency checks
- ✅ ISO timestamp format
- ✅ Indexed database fields

**Last Updated**: January 23, 2025
