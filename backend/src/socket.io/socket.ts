import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import redisClient from '../redis/redisClient';


export const setupSocketServer = () => {
  const socketIoHttpServer = http.createServer();
  const io = new SocketIOServer(socketIoHttpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
  });

  io.on('connection', (socket) => {
    console.log('A user connected with ID:', socket.id);

    socket.on('todo-added', async (todo) => {
      console.log('Received todo-added event:', todo);
      try {
        await redisClient.publish('todo-added', JSON.stringify(todo));
        console.log('Published todo-added event to Redis');
        io.emit('todo-added', todo); // Broadcast the event to all connected clients
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error publishing todo-added event:', error.message);
        } else {
          console.error('Unknown error publishing todo-added event:', error);
        }
      }
    });

    socket.on('todo-updated', async (todo) => {
      console.log('Received todo-updated event:', todo);
      try {
        await redisClient.publish('todo-updated', JSON.stringify(todo));
        console.log('Published todo-updated event to Redis');
        io.emit('todo-updated', todo); // Broadcast the event to all connected clients
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error publishing todo-updated event:', error.message);
        } else {
          console.error('Unknown error publishing todo-updated event:', error);
        }
      }
    });

    socket.on('todo-deleted', async (todoId) => {
      console.log('Received todo-deleted event with ID:', todoId);
      try {
        await redisClient.publish('todo-deleted', todoId);
        console.log('Published todo-deleted event to Redis');
        io.emit('todo-deleted', todoId); // Broadcast the event to all connected clients
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error publishing todo-deleted event:', error.message);
        } else {
          console.error('Unknown error publishing todo-deleted event:', error);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected with ID:', socket.id);
    });
  });

  const SOCKET_PORT = process.env.SOCKET_PORT || 4001;
  socketIoHttpServer.listen(SOCKET_PORT, () => {
    console.log(`Socket.IO server running on port ${SOCKET_PORT}`);
  });
};
