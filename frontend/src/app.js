import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import {
  GET_TODOS,
  TODO_ADDED_SUBSCRIPTION,
  TODO_DELETED_SUBSCRIPTION,
} from './graphql/queries';
import {
  ADD_TODO,
  DELETE_TODO,
  TOGGLE_TODO_COMPLETED,
} from './graphql/mutations';
import './App.css';

const App = () => {
  const { data, loading } = useQuery(GET_TODOS);
  const { data: addedData } = useSubscription(TODO_ADDED_SUBSCRIPTION);
  const { data: deletedData } = useSubscription(TODO_DELETED_SUBSCRIPTION);

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [addTodo] = useMutation(ADD_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [toggleTodoCompleted] = useMutation(TOGGLE_TODO_COMPLETED);

  useEffect(() => {
    if (data) {
      setTodos(data.todos);
    }
  }, [data]);

  useEffect(() => {
    if (addedData) {
      setTodos((prevTodos) => [...prevTodos, addedData.todoAdded]);
    }
  }, [addedData]);

  useEffect(() => {
    if (deletedData) {
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== deletedData.todoDeleted)
      );
    }
  }, [deletedData]);

  const handleAddTodo = () => {
    if (title.trim() && description.trim()) {
      addTodo({
        variables: { title, description },
      });
      setTitle('');
      setDescription('');
    }
  };

  const handleDeleteTodo = (id) => {
    deleteTodo({
      variables: { id },
    });
  };

  const handleToggleCompleted = async (id) => {
    try {
      const { data } = await toggleTodoCompleted({
        variables: { id },
      });
      if (data) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === data.toggleTodoCompleted.id ? data.toggleTodoCompleted : todo
          )
        );
      }
    } catch (error) {
      console.error('Error toggling todo completed status:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div>
              <h2>{todo.title}</h2>
              <p>{todo.description}</p>
              <p>{todo.completed ? 'Completed' : 'Not Completed'}</p>
            </div>
            <div className="todo-actions">
              <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              <button onClick={() => handleToggleCompleted(todo.id)}>
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
