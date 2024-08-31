// import { gql } from 'apollo-server';

// export const typeDefs = gql`
//   type User {
//     id: ID!
//     username: String!
//     role: Role!
//   }

//   enum Role {
//     ADMIN
//     USER
//   }

//   type Todo {
//     id: ID!
//     title: String!
//     description: String!
//     completed: Boolean!
//     createdAt: String!
//     updatedAt: String!
//   }

//   type Query {
//     todos: [Todo!]!
//     todo(id: ID!): Todo
//     me: User
//   }

//   type Mutation {
//     signup(username: String!, password: String!, role: Role!): String!
//     login(username: String!, password: String!): String!
//     addTodo(title: String!, description: String!): Todo!
//     toggleTodoCompleted(id: ID!): Todo!
//     deleteTodo(id: ID!): Boolean!
//   }

//   type Subscription {
//     todoAdded: Todo!
//     todoUpdated: Todo!
//     todoDeleted: ID!
//   }
// `;
import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Todo {
  id: ID!
  title: String!
  description: String!
  completed: Boolean!
  createdAt: String!
  updatedAt: String!
}

type Query {
  todos: [Todo!]!
  todo(id: ID!): Todo
}

type Mutation {
  addTodo(title: String!, description: String!): Todo!
  toggleTodoCompleted(id: ID!): Todo!
  deleteTodo(id: ID!): Boolean!
}



type Subscription {
  todoAdded: Todo!
  todoUpdated: Todo!
  todoDeleted: ID!
}
`;