# 🚀 User Management System - Postman Testing Guide

## 📋 Overview

This comprehensive guide provides step-by-step instructions for testing all API endpoints of the User Management System built with Node.js, Express, and MongoDB. The system includes full CRUD operations, text search functionality, and proper validation.

## 🛠️ Prerequisites

### 1. Environment Setup
- **Node.js** (v14 or higher)
- **MongoDB** (local or Atlas)
- **Postman** (latest version)

### 2. Start the Server
```bash
cd server
npm install
npm start
# Server will run on http://localhost:5000
```

### 3. Environment Variables
Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb+srv://your-connection-string
PORT=5000
```

## 🌐 Base URL
```
http://localhost:5000
```

## 📚 API Endpoints Reference

### 📊 Health Check
**GET** `/health`

**Purpose:** Verify server is running and healthy

**Request:**
- Method: `GET`
- URL: `{{base_url}}/health`
- Headers: None required
- Body: None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

## 👤 User Management Endpoints

### 1. ➕ Create User
**POST** `/add-user`

**Purpose:** Create a new user with validation

**Request:**
- Method: `POST`
- URL: `{{base_url}}/add-user`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 25,
  "hobbies": ["Reading", "Coding", "Gaming"],
  "bio": "Software developer passionate about technology and innovation."
}
```

**Field Validations:**
- `name`: Required, min 3 characters, trimmed
- `email`: Required, unique, valid email format
- `age`: Optional, 0-120 range
- `hobbies`: Optional array of strings
- `bio`: Optional, max 500 characters, used for text search

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully!",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 25,
    "hobbies": ["Reading", "Coding", "Gaming"],
    "bio": "Software developer passionate about technology and innovation.",
    "userId": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**
- **400 Bad Request** (Validation Error):
```json
{
  "success": false,
  "error": "Name must be at least 3 characters long, Please enter a valid email address"
}
```

- **400 Bad Request** (Duplicate Email):
```json
{
  "success": false,
  "error": "E11000 duplicate key error collection: test.users index: email_1 dup key: { email: \"john.doe@example.com\" }"
}
```

---

### 2. 📋 Get All Users
**GET** `/users`

**Purpose:** Retrieve all users in the system

**Request:**
- Method: `GET`
- URL: `{{base_url}}/users`
- Headers: None required
- Body: None

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 25,
      "hobbies": ["Reading", "Coding"],
      "bio": "Software developer",
      "userId": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "__v": 0
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "age": 30,
      "hobbies": ["Writing", "Traveling"],
      "bio": "Content creator and blogger",
      "userId": null,
      "createdAt": "2024-01-15T10:35:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### 3. 🔍 Get User by ID
**GET** `/users/:id`

**Purpose:** Retrieve a specific user by their MongoDB ObjectId

**Request:**
- Method: `GET`
- URL: `{{base_url}}/users/507f1f77bcf86cd799439011`
- Headers: None required
- Body: None

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 25,
    "hobbies": ["Reading", "Coding"],
    "bio": "Software developer",
    "userId": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 4. 🔍 Text Search Users
**GET** `/search`

**Purpose:** Search users by name or bio using MongoDB text search

**Request:**
- Method: `GET`
- URL: `{{base_url}}/search?query=developer`
- Headers: None required
- Body: None

**Query Parameters:**
- `query`: Search term (required)

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 25,
      "hobbies": ["Reading", "Coding"],
      "bio": "Software developer passionate about technology",
      "userId": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "__v": 0
    }
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Search query is required"
}
```

---

### 5. ✏️ Update User
**PUT** `/users/:id`

**Purpose:** Update an existing user's information

**Request:**
- Method: `PUT`
- URL: `{{base_url}}/users/507f1f77bcf86cd799439011`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body (raw JSON):
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "age": 26,
  "hobbies": ["Reading", "Coding", "Photography"],
  "bio": "Senior software developer with 5 years experience."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully!",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "age": 26,
    "hobbies": ["Reading", "Coding", "Photography"],
    "bio": "Senior software developer with 5 years experience.",
    "userId": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Responses:**
- **404 Not Found:**
```json
{
  "success": false,
  "error": "User not found"
}
```

- **400 Bad Request** (Validation Error):
```json
{
  "success": false,
  "error": "Name must be at least 3 characters long"
}
```

---

### 6. 🗑️ Delete User
**DELETE** `/users/:id`

**Purpose:** Delete a user from the system

**Request:**
- Method: `DELETE`
- URL: `{{base_url}}/users/507f1f77bcf86cd799439011`
- Headers: None required
- Body: None

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully!",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "age": 26,
    "hobbies": ["Reading", "Coding", "Photography"],
    "bio": "Senior software developer with 5 years experience.",
    "userId": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

## 🧪 Testing Scenarios

### ✅ Complete CRUD Workflow

1. **Create User**
   ```json
   {
     "name": "Alice Johnson",
     "email": "alice.johnson@example.com",
     "age": 28,
     "hobbies": ["Painting", "Music"],
     "bio": "Digital artist and musician"
   }
   ```

2. **Get All Users** - Verify user was created

3. **Get User by ID** - Copy the `_id` from step 1

4. **Update User**
   ```json
   {
     "name": "Alice Johnson",
     "email": "alice.johnson@example.com",
     "age": 29,
     "hobbies": ["Painting", "Music", "Photography"],
     "bio": "Digital artist, musician, and photographer"
   }
   ```

5. **Search Users** - Search for "artist" or "Alice"

6. **Delete User** - Delete the user created in step 1

### ✅ Validation Testing

**Test Required Fields:**
```json
{
  "email": "test@example.com"
}
// Should fail: "Name is required"
```

**Test Minimum Length:**
```json
{
  "name": "A",
  "email": "test@example.com"
}
// Should fail: "Name must be at least 3 characters long"
```

**Test Email Format:**
```json
{
  "name": "Test User",
  "email": "invalid-email"
}
// Should fail: "Please enter a valid email address"
```

**Test Age Range:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "age": 150
}
// Should fail: "Age cannot be greater than 120"
```

**Test Bio Length:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "bio": "x".repeat(501)
}
// Should fail: "Bio cannot exceed 500 characters"
```

### ✅ Error Handling Testing

**Test Invalid ID:**
- GET `/users/invalid-id`
- Should return 404: "User not found"

**Test Duplicate Email:**
- Create two users with same email
- Second request should fail with duplicate key error

**Test Empty Search:**
- GET `/search`
- Should return 400: "Search query is required"

---

## 📋 Postman Collection Setup

### 1. Create New Collection
- Open Postman
- Click "New" → "Collection"
- Name: "User Management System API"
- Add description: "Complete API testing for User Management System"

### 2. Set Environment Variables
- Click "Environments" → "Create Environment"
- Name: "User Management API"
- Add variables:
  ```
  base_url = http://localhost:5000
  user_id = (leave empty, will be set dynamically)
  ```

### 3. Import Requests
Create the following requests in your collection:

#### Health Check
- Method: GET
- URL: `{{base_url}}/health`

#### Create User
- Method: POST
- URL: `{{base_url}}/add-user`
- Headers: `Content-Type: application/json`
- Body: Raw JSON (use examples above)

#### Get All Users
- Method: GET
- URL: `{{base_url}}/users`

#### Get User by ID
- Method: GET
- URL: `{{base_url}}/users/{{user_id}}`

#### Search Users
- Method: GET
- URL: `{{base_url}}/search?query=developer`

#### Update User
- Method: PUT
- URL: `{{base_url}}/users/{{user_id}}`
- Headers: `Content-Type: application/json`
- Body: Raw JSON

#### Delete User
- Method: DELETE
- URL: `{{base_url}}/users/{{user_id}}`

### 4. Add Tests (Optional)
Add this test script to requests that return user data:

```javascript
// Set user_id environment variable from response
if (pm.response.code === 201 || pm.response.code === 200) {
    const response = pm.response.json();
    if (response.user && response.user._id) {
        pm.environment.set("user_id", response.user._id);
    }
}
```

---

## 🔧 Troubleshooting

### Common Issues:

1. **400 Bad Request**
   - Check request body format (must be valid JSON)
   - Verify all required fields are present
   - Check field validations (name length, email format, age range)

2. **404 Not Found**
   - Verify the user ID exists
   - Check if ID format is correct (MongoDB ObjectId)

3. **500 Internal Server Error**
   - Check server logs for detailed error messages
   - Verify MongoDB connection
   - Ensure all dependencies are installed

4. **Connection Refused**
   - Make sure server is running on port 5000
   - Check if MongoDB is running and accessible

### Debug Tips:
- Check server terminal for detailed error logs
- Use Postman's console to see request/response details
- Test with simple data first, then add complexity

---

## 📊 Database Schema

The User model includes the following fields with validations:

```javascript
{
  name: String (required, min: 3 chars),
  email: String (required, unique, valid email),
  age: Number (optional, 0-120),
  hobbies: [String] (optional array),
  bio: String (optional, max: 500 chars, text searchable),
  userId: String (optional, unique),
  createdAt: Date (auto-generated)
}
```

### Indexes:
- Text index on `bio` and `name` fields
- Unique index on `email`
- TTL index on `createdAt` (for automatic expiration)

---

## 🎯 Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Set up `.env` file with MongoDB URI
- [ ] Start MongoDB service
- [ ] Start server: `npm start`
- [ ] Test health endpoint: `GET /health`
- [ ] Create first user: `POST /add-user`
- [ ] Test all CRUD operations
- [ ] Test search functionality
- [ ] Test validation errors

---

## 📞 Support

If you encounter issues:
1. Check server logs for error details
2. Verify MongoDB connection
3. Test with Postman's built-in console
4. Ensure all environment variables are set correctly

**Happy Testing! 🚀**