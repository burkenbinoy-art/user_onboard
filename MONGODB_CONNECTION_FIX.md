# 🗄️ MongoDB Connection Error Fix

## ❌ Error You're Getting

```
"Operation `users.find()` buffering timed out after 10000ms"
```

**This means**: Mongoose can't reach your MongoDB Atlas database from Render.

---

## ✅ Fix: Configure MongoDB Atlas Network Access

### Step 1: Go to MongoDB Atlas Dashboard

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your cluster "Cluster0"
3. Click **"Security"** → **"Network Access"**

### Step 2: Add Render's IP Address (Correct Method for Production)

**Option A: Allow All IPs (Easiest, for testing)**

1. Click **"Add IP Address"**
2. Select **"Allow Access from Anywhere"**
3. Enter `0.0.0.0/0` (means all IPs)
4. Click **"Confirm"**

**Option B: Whitelist Render Servers (More Secure)**

Render Cloud IPs:
- `34.212.75.30/32`
- `54.185.253.106/32`
- `35.164.230.217/32`

Or check [Render's IP ranges](https://render.com/docs/deploy-service#deploying-from-github)

### Step 3: Verify MongoDB User Credentials

1. Go to **"Security"** → **"Database Access"**
2. Find user `burkenbinoy_db_user`
3. Verify permissions: **"Read and write to any database"**

### Step 4: Verify Connection String

Your MONGO_URI should look like:
```
mongodb+srv://burkenbinoy_db_user:n94KN6rjZUuU8s6p@cluster0.3miurhm.mongodb.net/user-management?retryWrites=true&w=majority
```

Check it has:
- ✅ Username and password correct
- ✅ Cluster address correct
- ✅ Database name at end (`/user-management`)
- ✅ Query parameters (`?retryWrites=true&w=majority`)

---

## 🔧 What Was Updated in Your Server

The server now has **better MongoDB connection handling**:

```javascript
const mongoOptions = {
    maxPoolSize: 10,          // More concurrent connections
    minPoolSize: 2,           // Keep 2 connections alive
    serverSelectionTimeoutMS: 5000,  // 5 second timeout
    socketTimeoutMS: 45000,         // 45 second socket timeout
    connectTimeoutMS: 10000,        // 10 second connection timeout
    retryWrites: true,        // Retry failed writes
    w: 'majority',            // Wait for majority confirmation
};
```

This handles connection issues better.

---

## 🧪 Test Connection Locally First

Before deploying to Render, test your MongoDB connection locally:

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Test the health endpoint
curl http://localhost:5000/health

# Terminal 3: Create a test user
curl -X POST http://localhost:5000/add-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "age": 25,
    "bio": "Test bio"
  }'

# Terminal 3: Get all users
curl http://localhost:5000/users
```

**If local works** ✅ → Then it's definitely a MongoDB Atlas network access issue on Render

---

## 🚀 Steps to Fix & Redeploy

### Step 1: MongoDB Atlas Configuration (CRITICAL)

1. ✅ Allow IP access: `0.0.0.0/0` or Render's IPs
2. ✅ Verify user credentials are correct
3. ✅ Verify database name is correct

### Step 2: Verify Render Environment Variables

Go to Render Dashboard → Your Service → Environment:

```
MONGO_URI=mongodb+srv://burkenbinoy_db_user:n94KN6rjZUuU8s6p@cluster0.3miurhm.mongodb.net/user-management?retryWrites=true&w=majority

NODE_ENV=production

PORT=10000
```

**Check that**:
- ✅ MONGO_URI is complete and correct
- ✅ No extra spaces or quotes
- ✅ Password and username match MongoDB Atlas

### Step 3: Deploy Updated Code

```bash
# Code is already updated with better MongoDB handling
git status

# Show all changes
git diff

# Commit and push
git add .
git commit -m "Improve MongoDB connection handling with timeout config"
git push origin main
```

### Step 4: Monitor Render Logs

1. Go to Render Dashboard
2. Click your service → **"Logs"** tab
3. Look for:
   - ✅ `✅ MongoDB Connection Successful`
   - ✅ `🚀 Server is running`

Or errors like:
- ❌ `❌ MongoDB Connection Error`
- ❌ `MONGO_URI: NOT SET`

---

## 🔍 Debugging Checklist

### MongoDB Atlas Network Access
- [ ] Go to Security → Network Access
- [ ] Verify `0.0.0.0/0` is in the list (or Render IPs)
- [ ] Status should be "ACTIVE" (green checkmark)

### Database & User
- [ ] Cluster name: `Cluster0`
- [ ] Database name: `user-management`
- [ ] User: `burkenbinoy_db_user`
- [ ] Password: Correct and URL-encoded if special characters

### Connection String
- [ ] Protocol: `mongodb+srv://`
- [ ] User:Pass format: `username:password`
- [ ] Cluster: `@cluster0.3miurhm.mongodb.net`
- [ ] Database: `/user-management`
- [ ] Query params: `?retryWrites=true&w=majority`

### Render Configuration
- [ ] Root Directory: `.` (not `server`)
- [ ] Build Command: `npm run render-postbuild`
- [ ] Start Command: `npm start`
- [ ] Environment Variable `MONGO_URI` set and complete

---

## 📊 Common MongoDB Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `buffering timed out` | Network access not allowed | Allow `0.0.0.0/0` in MongoDB Atlas |
| `authentication failed` | Wrong password | Verify password in MongoDB Atlas |
| `no servers in replicaset` | Wrong connection string | Check cluster name and database |
| `ECONNREFUSED` | MongoDB service down | Restart cluster in Atlas |
| `auth error` | User doesn't have permissions | Add "readWriteAnyDatabase" role |

---

## 🆘 Still Getting Timeout?

### Quick Diagnostic Script

Add this temporarily to see what's happening:

```javascript
// At the top of server/index.js, after require statements

console.log("=== MongoDB Debug Info ===");
console.log("MONGO_URI is set:", !!process.env.MONGO_URI);
console.log("URI length:", process.env.MONGO_URI?.length || 0);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("Connecting to MongoDB...");
console.log("===========================");
```

Check server logs to verify:
- ✅ MONGO_URI is set
- ✅ Connection attempts are happening

### Check Network

Test if Render can reach MongoDB:

```bash
# Can you ping MongoDB from Render?
# (This appears in logs if connection fails)

# Check if MONGO_URI format is correct
echo "Your MONGO_URI:"
echo "mongodb+srv://burkenbinoy_db_user:n94KN6rjZUuU8s6p@cluster0.3miurhm.mongodb.net/user-management?retryWrites=true&w=majority"
```

---

## ✅ Success Signs

After fixing, your Render logs should show:

```
✅ MongoDB Connection Successful
Connected to: cluster0.3miurhm.mongodb.net
🚀 Server is running on http://localhost:10000
```

And API calls should work:
```
GET /health → { "success": true, "message": "Server is healthy" }
GET /users → { "success": true, "count": X, "users": [...] }
POST /add-user → Creates new user successfully
```

---

## 📚 Related Guides

- **Main Guide**: `RENDER_DEPLOYMENT_GUIDE.md`
- **Quick Fix**: `RENDER_QUICK_FIX.md`
- **Checklist**: `RENDER_DEPLOYMENT_CHECKLIST.md`

---

## 🎯 Action Items

1. **RIGHT NOW**: 
   - [ ] Go to MongoDB Atlas
   - [ ] Add IP: `0.0.0.0/0`
   - [ ] Confirm changes

2. **NEXT**:
   - [ ] Test locally (if haven't already)
   - [ ] Commit updated code
   - [ ] Push to GitHub

3. **THEN**:
   - [ ] Render auto-deploys
   - [ ] Check logs for "✅ MongoDB Connection Successful"
   - [ ] Test API endpoints

Your connection timeout should be **fixed immediately** once MongoDB Atlas allows the network access! 🎉