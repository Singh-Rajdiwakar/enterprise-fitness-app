const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
  pingInterval: 25000,
  pingTimeout: 20000,
  transports: ['websocket', 'polling'],
});

const activeUsers = new Map();

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'backend-realtime',
    uptimeSeconds: Math.floor(process.uptime()),
    activeConnections: io.engine.clientsCount,
  });
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('register:user', ({ email }) => {
    if (!email) {
      return;
    }

    activeUsers.set(socket.id, email);
    socket.join(`user:${email}`);
    socket.emit('register:success', { socketId: socket.id, email });
  });

  socket.on('notification:send', ({ toEmail, payload }) => {
    if (!toEmail || !payload) {
      socket.emit('notification:error', { message: 'toEmail and payload are required' });
      return;
    }

    io.to(`user:${toEmail}`).emit('notification:received', {
      payload,
      sentAt: new Date().toISOString(),
    });
  });

  socket.on('chat:message', ({ roomId, message }) => {
    if (!roomId || !message) {
      socket.emit('chat:error', { message: 'roomId and message are required' });
      return;
    }

    socket.to(`chat:${roomId}`).emit('chat:message', {
      message,
      fromSocketId: socket.id,
      sentAt: new Date().toISOString(),
    });
  });

  socket.on('chat:join', ({ roomId }) => {
    if (!roomId) {
      return;
    }

    socket.join(`chat:${roomId}`);
    socket.emit('chat:joined', { roomId });
  });

  socket.on('disconnect', (reason) => {
    activeUsers.delete(socket.id);
    console.log(`Socket disconnected: ${socket.id} (${reason})`);
  });
});

server.listen(PORT, () => {
  console.log(`Realtime server listening on port ${PORT}`);
});

