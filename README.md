# User Management System

A full-stack web application for managing users with React frontend, Node.js/Express backend, and MongoDB database.

## 🚀 Features

- **Complete CRUD Operations**: Create, Read, Update, Delete users
- **Advanced Search**: Text search across user names and bios
- **Data Validation**: Comprehensive input validation with detailed error messages
- **Responsive UI**: Modern, mobile-friendly React interface
- **RESTful API**: Well-structured API endpoints with consistent response format
- **MongoDB Integration**: Robust database operations with Mongoose ODM
- **Production Ready**: Configured for deployment on Render and other platforms

## 🏗️ Architecture

```
user-management-system/
├── client/          # React frontend
├── server/          # Node.js/Express backend
├── .gitignore       # Comprehensive ignore patterns
├── package.json     # Root package.json with scripts
├── render.yaml      # Render deployment configuration
└── README.md        # This file
```

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install all dependencies (client + server)
npm run install:all

# Or install individually:
npm run install:client
npm run install:server
```

### 2. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your MongoDB connection string
# For local MongoDB: MONGO_URI=mongodb://localhost:27017/user-management
# For MongoDB Atlas: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/user-management
```

### 3. Start Development Servers

```bash
# Start both client and server concurrently
npm run dev

# Or start individually:
npm run dev:server    # Backend on http://localhost:5000
npm run dev:client    # Frontend on http://localhost:3000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/add-user` | Create new user |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| GET | `/search?query=term` | Search users by name/bio |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### API Response Format

```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... },
  "count": 5
}
```

## 🧪 Testing

### API Testing with Postman

Import the `POSTMAN_TESTING_GUIDE.md` file for comprehensive API testing instructions.

### Manual Testing

1. **Create User**: Use the React form to add new users
2. **View Users**: Browse the user list
3. **Search Users**: Use the search functionality
4. **Update Users**: Edit existing user information
5. **Delete Users**: Remove users from the system

## 🚀 Deployment

### Render Deployment

1. **Connect Repository**: Link your GitHub repository to Render
2. **Environment Variables**: Set the following in Render dashboard:
   - `MONGO_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or Render's assigned port)
3. **Deploy**: Render will automatically build and deploy using `render.yaml`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

### Client (React)
```
client/
├── public/
├── src/
│   ├── App.js          # Main React component
│   ├── App.css         # Styling
│   └── index.js        # React entry point
└── package.json
```

### Server (Node.js/Express)
```
server/
├── index.js            # Express server & API routes
├── models/
│   └── user.js         # Mongoose user schema
└── package.json
```

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start both client and server
npm run dev:client       # Start React dev server
npm run dev:server       # Start Express dev server

# Production
npm run build            # Build React app for production
npm start                # Start production server

# Installation
npm run install:all      # Install all dependencies
npm run install:client   # Install client dependencies
npm run install:server   # Install server dependencies
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true, min: 1, max: 120 },
  bio: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify `MONGO_URI` in `.env` file
   - Ensure MongoDB is running (local) or credentials are correct (Atlas)

2. **Port Already in Use**
   - Change `PORT` in `.env` or kill process using the port

3. **Build Failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

4. **CORS Issues**
   - Ensure backend is running on correct port
   - Check CORS configuration in server

### Getting Help

- Check the `POSTMAN_TESTING_GUIDE.md` for API testing
- Review server logs for error details
- Verify all dependencies are installed correctly