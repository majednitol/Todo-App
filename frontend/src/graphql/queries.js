import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

export const TODO_ADDED_SUBSCRIPTION = gql`
  subscription OnTodoAdded {
    todoAdded {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

export const TODO_DELETED_SUBSCRIPTION = gql`
  subscription OnTodoDeleted {
    todoDeleted
  }
`;
