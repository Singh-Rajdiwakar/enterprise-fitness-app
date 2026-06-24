import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const REALTIME_URL = import.meta.env.VITE_REALTIME_URL || 'http://localhost:3000';

const traineeOptions = [
  {
    id: 'user-1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    goal: 'Strength gain',
  },
  {
    id: 'user-2',
    name: 'Nisha Rao',
    email: 'nisha.rao@example.com',
    goal: 'Fat loss',
  },
  {
    id: 'user-3',
    name: 'Kabir Shah',
    email: 'kabir.shah@example.com',
    goal: 'Athletic conditioning',
  },
];

function getRoomForUser(email) {
  return `trainer:${email}`;
}

function TrainerChat() {
  const socketRef = useRef(null);
  const activeRoomRef = useRef('');
  const trainerEmail = useMemo(() => localStorage.getItem('trainerEmail') || 'trainer@enterprise-fitness.app', []);
  const [selectedUser, setSelectedUser] = useState(traineeOptions[0]);
  const [activeRoom, setActiveRoom] = useState(getRoomForUser(traineeOptions[0].email));
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [roomStatus, setRoomStatus] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    const socket = io(REALTIME_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        email: trainerEmail,
        role: 'trainer',
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      setConnectionStatus('connected');
      socket.emit('register:user', { email: trainerEmail });

      if (activeRoomRef.current) {
        socket.emit('join_room', { room: activeRoomRef.current });
      }
    };

    const handleDisconnect = () => {
      setConnectionStatus('disconnected');
    };

    const handleRoomJoined = ({ room } = {}) => {
      if (room === activeRoomRef.current) {
        setRoomStatus(`Room active: ${room}`);
      }
    };

    const appendMessage = (payload = {}, direction) => {
      if (payload.room && payload.room !== activeRoomRef.current) {
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: payload.id || `${direction}-${Date.now()}`,
          direction,
          from: payload.from || 'Unknown',
          text: payload.text || payload.message || '',
          sentAt: payload.sentAt || new Date().toISOString(),
        },
      ]);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('room_joined', handleRoomJoined);
    socket.on('new_message', (payload) => appendMessage(payload, 'incoming'));
    socket.on('message_sent', (payload) => appendMessage(payload, 'outgoing'));
    socket.on('socket:error', ({ message } = {}) => {
      setRoomStatus(message || 'Real-time chat error');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [trainerEmail]);

  const handleSelectUser = (event) => {
    const nextUser = traineeOptions.find((user) => user.email === event.target.value);

    if (!nextUser) {
      return;
    }

    const nextRoom = getRoomForUser(nextUser.email);
    setSelectedUser(nextUser);
    setActiveRoom(nextRoom);
    activeRoomRef.current = nextRoom;
    setMessages([]);
    setRoomStatus('');

    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', { room: nextRoom });
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || !selectedUser || !socketRef.current?.connected) {
      return;
    }

    socketRef.current.emit('send_message', {
      room: activeRoom,
      message: trimmedMessage,
      from: trainerEmail,
      to: selectedUser.email,
    });

    setMessageText('');
  };

  const isConnected = connectionStatus === 'connected';

  return (
    <section className="mx-auto max-w-7xl px-8 pb-10">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-200/70">
              Trainer Chat
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Live trainee communication</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              Select a trainee, join their private room, and exchange messages through the real-time service.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            <span
              className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-300'}`}
            />
            {isConnected ? 'Connected' : 'Reconnecting'}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-2xl border border-white/10 bg-black/15 p-4">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-white/40" htmlFor="trainee">
              Active trainee
            </label>
            <select
              id="trainee"
              value={selectedUser.email}
              onChange={handleSelectUser}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-blue-400"
            >
              {traineeOptions.map((user) => (
                <option key={user.id} value={user.email}>
                  {user.name}
                </option>
              ))}
            </select>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-bold tracking-tight">{selectedUser.name}</p>
              <p className="mt-1 text-sm text-white/50">{selectedUser.email}</p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-white/35">Goal</p>
              <p className="mt-1 text-sm text-blue-100/80">{selectedUser.goal}</p>
            </div>

            <p className="mt-4 break-words text-xs leading-5 text-white/40">
              {roomStatus || `Room: ${activeRoom}`}
            </p>
          </aside>

          <div className="flex min-h-[420px] flex-col rounded-2xl border border-white/10 bg-black/15">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="font-semibold tracking-tight">Conversation with {selectedUser.name}</p>
              <p className="mt-1 text-xs text-white/40">Messages are delivered through Socket.IO rooms.</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {messages.length === 0 ? (
                <div className="flex h-full min-h-52 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] text-center text-sm text-white/40">
                  No messages yet. Send the first trainer note.
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.direction === 'outgoing'
                          ? 'bg-blue-600 text-white'
                          : 'border border-white/10 bg-white/10 text-white/85'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="mt-2 text-[11px] text-white/45">
                        {new Date(message.sentAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex flex-col gap-3 border-t border-white/10 p-4 sm:flex-row">
              <input
                type="text"
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Write a trainer message..."
                className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={!isConnected || !messageText.trim()}
                className="min-h-12 rounded-2xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrainerChat;
