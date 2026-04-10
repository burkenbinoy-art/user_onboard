const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

const User = require('./models/user');

// ============ MongoDB Connection Config ============
const mongoOptions = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    w: 'majority',
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, mongoOptions)
  .then(() => {
    console.log("✅ MongoDB Connection Successful");
    console.log("Connected to:", process.env.MONGO_URI.split('@')[1] || 'MongoDB');
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("MONGO_URI:", process.env.MONGO_URI ? "Set" : "NOT SET");
    process.exit(1); // Exit if can't connect
  });

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

// ============ CREATE - POST /add-user ============
app.post('/add-user', async (req, res) => {
    try {
        console.log('Received data:', req.body);
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ 
            success: true,
            message: "User created successfully!", 
            user: newUser 
        });
    } catch (error) {
        console.error('Validation Error:', error);
        const errorMessage = error.errors 
            ? Object.values(error.errors).map(e => e.message).join(', ')
            : error.message;
        res.status(400).json({ 
            success: false,
            error: errorMessage 
        });
    }
});

// ============ READ - GET /users ============
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ 
            success: true,
            count: users.length,
            users: users 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// ============ READ - GET /users/:id ============
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }
        res.status(200).json({ 
            success: true,
            user: user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// ============ SEARCH - GET /search (Text Search on bio and name) ============
app.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ 
                success: false,
                error: "Search query is required" 
            });
        }
        
        const users = await User.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } });
        
        res.status(200).json({ 
            success: true,
            count: users.length,
            users: users 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// ============ UPDATE - PUT /users/:id ============
app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true, 
                runValidators: true 
            }
        );
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: "User updated successfully!", 
            user: user 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
});

// ============ DELETE - DELETE /users/:id ============
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found" 
            });
        }
        
        res.status(200).json({ 
            success: true,
            message: "User deleted successfully!", 
            user: user 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// ============ Health Check ============
app.get('/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: "Server is healthy" 
    });
});

// Catch all handler: send back React's index.html file for any non-API routes
if (process.env.NODE_ENV === 'production') {
    app.use((req, res) => {
        // Serve React's index.html for all non-API routes
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});