import { gql } from '@apollo/client';

export const ADD_TODO = gql`
  mutation AddTodo($title: String!, $description: String!) {
    addTodo(title: $title, description: $description) {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

export const TOGGLE_TODO_COMPLETED = gql`
  mutation ToggleTodoCompleted($id: ID!) {
    toggleTodoCompleted(id: $id) {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;
