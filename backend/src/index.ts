import express, { Express } from 'express';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from '../graphql/typeDefs';
import { resolvers } from '../graphql/resolvers';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { setupSocketServer } from './socket.io/socket';
import redisClient from './redis/redisClient';

const app: Express = express(); 

const apolloHttpServer = http.createServer(app);

// Set up Apollo Server
const pubsub = new RedisPubSub({
  publisher: redisClient,
  subscriber: redisClient,
});

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res, pubsub }),
});

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app: app as any }); 

  // Set up GraphQL WebSocket server
  const wsServer = new WebSocketServer({
    server: apolloHttpServer,
    path: '/graphql',
  });

  useServer({ schema }, wsServer);

  const APOLLO_PORT = process.env.APOLLO_PORT || 4000;
  const INSTANCE_NAME = process.env.INSTANCE_NAME || 'unknown instance';
  const HOST = process.env.HOST || 'unknown instance';
  apolloHttpServer.listen(APOLLO_PORT, () => {
    console.log(`Apollo Server (${INSTANCE_NAME}) is running on http://localhost:${APOLLO_PORT}${apolloServer.graphqlPath}`);
    console.log(`GraphQL subscriptions ready at ws://localhost:${APOLLO_PORT}/graphql`);
  });
});

// Setup Socket.IO server
setupSocketServer();
