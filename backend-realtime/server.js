const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const ENABLE_REDIS_ADAPTER = process.env.ENABLE_REDIS_ADAPTER === 'true';
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8081',
];
const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
const server = http.createServer(app);
const activeUsers = new Map();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingInterval: 25000,
  pingTimeout: 20000,
  transports: ['websocket', 'polling'],
});

async function setupRedisAdapter() {
  if (!ENABLE_REDIS_ADAPTER) {
    console.log('Redis adapter disabled. Set ENABLE_REDIS_ADAPTER=true to enable horizontal scaling.');
    return;
  }

  const pubClient = createClient({ url: REDIS_URL });
  const subClient = pubClient.duplicate();

  pubClient.on('error', (error) => console.error('Redis pub client error:', error.message));
  subClient.on('error', (error) => console.error('Redis sub client error:', error.message));

  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));
  console.log(`Socket.IO Redis adapter enabled using ${REDIS_URL}`);
}

app.get('/health', (req, res) => {
  res.send('Real-time service is up');
});

app.get('/health/details', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'backend-realtime',
    activeConnections: io.engine.clientsCount,
    activeUsers: activeUsers.size,
    redisAdapterEnabled: ENABLE_REDIS_ADAPTER,
    allowedOrigins: ALLOWED_ORIGINS,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

io.on('connection', (socket) => {
  const authEmail = socket.handshake.auth?.email;
  const userEmail = authEmail || `anonymous:${socket.id}`;

  activeUsers.set(socket.id, userEmail);
  console.log(`Client connected: ${socket.id} (${userEmail}). Active users: ${activeUsers.size}`);

  if (authEmail) {
    socket.join(`user:${authEmail}`);
  }

  socket.on('register:user', ({ email } = {}) => {
    if (!email) {
      socket.emit('socket:error', { message: 'email is required' });
      return;
    }

    activeUsers.set(socket.id, email);
    socket.join(`user:${email}`);
    socket.emit('register:success', { socketId: socket.id, email });
    console.log(`User registered on socket: ${email} (${socket.id})`);
  });

  socket.on('join_room', ({ room } = {}) => {
    if (!room) {
      socket.emit('socket:error', { message: 'room is required' });
      return;
    }

    socket.join(room);
    socket.emit('room_joined', { room });
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('send_message', ({ room, message, from, to } = {}) => {
    if (!room || !message) {
      socket.emit('socket:error', { message: 'room and message are required' });
      return;
    }

    const payload = {
      id: `message-${Date.now()}`,
      room,
      message,
      text: message,
      from: from || activeUsers.get(socket.id) || socket.id,
      to: to || null,
      sentAt: new Date().toISOString(),
    };

    socket.to(room).emit('new_message', payload);
    socket.emit('message_sent', payload);
  });

  socket.on('new_community_post', ({ userName, avatar, text, message, fires } = {}) => {
    const payload = {
      id: `post-${Date.now()}`,
      userName: userName || activeUsers.get(socket.id) || 'Community Member',
      avatar: avatar || getInitials(userName || activeUsers.get(socket.id) || 'CM'),
      text: text || message || 'Shared a new community update.',
      fires: Number(fires) || 0,
      createdAt: new Date().toISOString(),
    };

    io.emit('new_post', payload);
  });

  socket.on('disconnect', (reason) => {
    activeUsers.delete(socket.id);
    console.log(`Client disconnected: ${socket.id} (${reason}). Active users: ${activeUsers.size}`);
  });
});

function getInitials(value) {
  return value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

setupRedisAdapter()
  .catch((error) => {
    console.error('Redis adapter setup failed:', error.message);
    console.error('Continuing with in-memory Socket.IO adapter.');
  })
  .finally(() => {
    server.listen(PORT, () => {
      console.log(`Real-time service running on port ${PORT}`);
      console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
    });
  });
