import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { redisClient } from '../redis/redisClient';



export const setupSocketServer = () => {
  const socketIoHttpServer = http.createServer();
  const io = new SocketIOServer(socketIoHttpServer, {
    cors: {
      origin: ["http://localhost"],
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

  const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT || 4004;
  socketIoHttpServer.listen(SOCKET_IO_PORT, () => {
    console.log(`Socket.IO server running on port ${SOCKET_IO_PORT}`);
  });
};
// Server-side code with @socket.io/redis-adapter
// import http from 'http';
// import { Server as SocketIOServer } from 'socket.io';
// import { createAdapter } from "@socket.io/redis-adapter";
// import { createClient } from 'redis';
// export const setupSocketServer = async () => {
//   const pubClient = createClient({ url: "redis://redis:6379" });
//   const subClient = pubClient.duplicate();

//   await Promise.all([
//     pubClient.connect(),
//     subClient.connect()
//   ]);

  
//     const socketIoHttpServer = http.createServer();
//     const io = new SocketIOServer(socketIoHttpServer, {
//       cors: {
//         origin: ["http://localhost"],
//         methods: ["GET", "POST", "DELETE", "PUT"],
//         credentials: true,
//       },
//       transports: ['websocket', 'polling'],
//       allowEIO3: true,
//     });

//     io.adapter(createAdapter(pubClient, subClient));

//     io.on('connection', (socket) => {
//       console.log('A user connected with ID:', socket.id);

//       socket.on('todo-added', async (todo) => {
//         console.log('Received todo-added event:', todo);
//         try {
//           await pubClient.publish('todo-added', JSON.stringify(todo));
//           console.log('Published todo-added event to Redis');
//           io.emit('todo-added', todo); // Broadcast the event to all connected clients
//         } catch (error) {
//           if (error instanceof Error) {
//             console.error('Error publishing todo-added event:', error.message);
//           } else {
//             console.error('Unknown error publishing todo-added event:', error);
//           }
//         }
//       });

//       socket.on('todo-updated', async (todo) => {
//         console.log('Received todo-updated event:', todo);
//         try {
//           await pubClient.publish('todo-updated', JSON.stringify(todo));
//           console.log('Published todo-updated event to Redis');
//           io.emit('todo-updated', todo); // Broadcast the event to all connected clients
//         } catch (error) {
//           if (error instanceof Error) {
//             console.error('Error publishing todo-updated event:', error.message);
//           } else {
//             console.error('Unknown error publishing todo-updated event:', error);
//           }
//         }
//       });

//       socket.on('todo-deleted', async (todoId) => {
//         console.log('Received todo-deleted event with ID:', todoId);
//         try {
//           await pubClient.publish('todo-deleted', todoId);
//           console.log('Published todo-deleted event to Redis');
//           io.emit('todo-deleted', todoId); // Broadcast the event to all connected clients
//         } catch (error) {
//           if (error instanceof Error) {
//             console.error('Error publishing todo-deleted event:', error.message);
//           } else {
//             console.error('Unknown error publishing todo-deleted event:', error);
//           }
//         }
//       });

//       socket.on('disconnect', () => {
//         console.log('User disconnected with ID:', socket.id);
//       });
//     });

//     const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT || 4004;
//     socketIoHttpServer.listen(SOCKET_IO_PORT, () => {
//       console.log(`Socket.IO server running on port ${SOCKET_IO_PORT}`);
//     });
//   };
