import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Create an HTTP Link:
const httpLink = new HttpLink({
  uri: 'http://localhost/graphql', // Update with your GraphQL server URL
});

// Create a WebSocket Link:
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost/ws', // Update with your GraphQL server WebSocket URL
    on: {
      connected: () => {
        console.log('WebSocket connected successfully');
      },
      error: (error) => {
        console.error('WebSocket connection error:', error);
      },
    },
  })
);

// Using split for routing the data to the proper link based on the operation type:
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// Create Apollo Client:
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
