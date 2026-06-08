import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  socket.on('joinRoom', (room) => {
    socket.join(room);
  });
});

server.listen(PORT, () => {
  console.log(`SMACom backend listening on http://localhost:${PORT}`);
});
