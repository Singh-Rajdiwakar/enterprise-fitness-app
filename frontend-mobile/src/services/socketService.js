import { io } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_REALTIME_URL || 'http://localhost:3000';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }

  return socket;
}

export function connectSocket(authContext = {}) {
  const activeSocket = getSocket();
  const { token, email } = authContext;

  if (token || email) {
    activeSocket.auth = { token, email };
  }

  if (!activeSocket.connected) {
    activeSocket.connect();
  }

  if (email) {
    activeSocket.emit('register:user', { email });
    activeSocket.emit('join_room', { room: `trainer:${email}` });
  }

  return activeSocket;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export default {
  getSocket,
  connectSocket,
  disconnectSocket,
};
