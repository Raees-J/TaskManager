require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const commentRoutes = require('./routes/commentRoutes');
const activityRoutes = require('./routes/activityRoutes');
const messageRoutes = require('./routes/messages');
const directMessageRoutes = require('./routes/directMessages');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store online users
const onlineUsers = new Map(); // userId -> socketId

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User authentication and registration
  socket.on('user:register', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Broadcast online status to all users
      io.emit('user:online', { userId, socketId: socket.id });
      
      // Send current online users to newly connected user
      const onlineUsersList = Array.from(onlineUsers.keys());
      socket.emit('users:online-list', onlineUsersList);
      
      console.log(`User ${userId} registered. Online users: ${onlineUsers.size}`);
    }
  });

  // Handle notifications
  socket.on('notification:send', (data) => {
    const { recipientId, notification } = data;
    const recipientSocketId = onlineUsers.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('notification:new', notification);
      console.log(`Notification sent to user ${recipientId}`);
    }
  });

  // Handle real-time messages
  socket.on('message:send', (data) => {
    const { recipientId, message } = data;
    const recipientSocketId = onlineUsers.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('message:new', message);
    }
    
    // Also send back to sender for confirmation
    socket.emit('message:sent', message);
  });

  // Handle direct messages
  socket.on('direct-message:send', (data) => {
    const { recipientId, message } = data;
    const recipientSocketId = onlineUsers.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('direct-message:new', message);
      console.log(`Direct message sent from ${message.sender} to ${recipientId}`);
    }
  });

  // Handle project updates
  socket.on('project:update', (data) => {
    const { projectId, update } = data;
    // Broadcast to all users in the project
    socket.broadcast.emit('project:updated', { projectId, update });
  });

  // Handle task updates
  socket.on('task:update', (data) => {
    const { taskId, projectId, update } = data;
    socket.broadcast.emit('task:updated', { taskId, projectId, update });
  });

  // Handle typing indicators
  socket.on('typing:start', (data) => {
    const { recipientId, senderId } = data;
    const recipientSocketId = onlineUsers.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing:user', { userId: senderId, typing: true });
    }
  });

  socket.on('typing:stop', (data) => {
    const { recipientId, senderId } = data;
    const recipientSocketId = onlineUsers.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing:user', { userId: senderId, typing: false });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      
      // Broadcast offline status
      io.emit('user:offline', { userId: socket.userId });
      
      console.log(`User ${socket.userId} disconnected. Online users: ${onlineUsers.size}`);
    }
    console.log('Socket disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/direct-messages', directMessageRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic health check
app.get('/', (req, res) => res.json({ message: 'Backend running' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB successfully');
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on port ${PORT}`);
    console.log('🔌 WebSocket server ready for connections');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('\n🔧 Troubleshooting steps:');
  console.error('1. Check if MONGO_URI environment variable is set');
  console.error('2. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0');
  console.error('3. Ensure database user has correct permissions');
  console.error('4. Check if MongoDB cluster is running\n');
  process.exit(1);
});

module.exports = { app, server, io };
