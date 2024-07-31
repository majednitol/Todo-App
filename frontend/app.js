import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

const socket = io('http://localhost:4001', {
  transports: [ 'polling'], // Match the server configuration
  withCredentials: true, // Optional: for CORS credentials
});




socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

window.addTodo = function () {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  axios.post('http://localhost:4000/graphql', {
    query: `
      mutation($title: String!, $description: String!) {
        addTodo(title: $title, description: $description) {
          id
          title
          description
          completed
        }
      }
    `,
    variables: {
      title: title,
      description: description,
    },
  })
    .then(response => {
      const data = response.data;
      if (data.errors) {
        console.error('GraphQL error adding todo:', data.errors);
        return;
      }
      const todo = data.data.addTodo;
      socket.emit('todo-added', todo);
    })
    .catch(error => {
      console.error('Error adding todo:', error);
    });
}

window.updateTodo = function (id) {
  axios.post('http://localhost:4000/graphql', {
    query: `
      mutation($id: ID!) {
        toggleTodoCompleted(id: $id) {
          id
          title
          description
          completed
        }
      }
    `,
    variables: {
      id: id.toString(),
    },
  })
    .then(response => {
      const data = response.data;
      if (data.errors) {
        console.error('GraphQL error updating todo:', data.errors);
        return;
      }
      const updatedTodo = data.data.toggleTodoCompleted;
      socket.emit('todo-updated', updatedTodo);
    })
    .catch(error => {
      console.error('Error updating todo:', error);
    });
}

window.deleteTodo = function (id) {
  axios.post('http://localhost:4000/graphql', {
    query: `
      mutation($id: ID!) {
        deleteTodo(id: $id)
      }
    `,
    variables: {
      id: id.toString(),
    },
  })
    .then(response => {
      const data = response.data;
      if (data.errors) {
        console.error('GraphQL error deleting todo:', data.errors);
        return;
      }
      if (data.data.deleteTodo) {
        socket.emit('todo-deleted', id);
      }
    })
    .catch(error => {
      console.error('Error deleting todo:', error);
    });
}

window.appendTodoToList = function (todo) {
  const todoList = document.getElementById('todo-list');
  const todoItem = document.createElement('li');
  todoItem.id = todo.id;
  todoItem.innerHTML = `
    ${todo.title} - ${todo.description}
    <button onclick="updateTodo('${todo.id}')">${todo.completed ? 'Undo' : 'Complete'}</button>
    <button onclick="deleteTodo('${todo.id}')">Delete</button>
  `;
  todoList.appendChild(todoItem);
}

window.updateTodoInList = function (updatedTodo) {
  const todoItem = document.getElementById(updatedTodo.id);
  if (todoItem) {
    todoItem.innerHTML = `
      ${updatedTodo.title} - ${updatedTodo.description}
      <button onclick="updateTodo('${updatedTodo.id}')">${updatedTodo.completed ? 'Undo' : 'Complete'}</button>
      <button onclick="deleteTodo('${updatedTodo.id}')">Delete</button>
    `;
  }
}

window.removeTodoFromList = function (id) {
  const todoItem = document.getElementById(id);
  if (todoItem) {
    todoItem.remove();
  }
}

socket.on('todo-added', (todo) => {
  console.log('Received todo-added event with todo:', todo);
  appendTodoToList(todo);
});

socket.on('todo-updated', (todo) => {
  console.log('Received todo-updated event with todo:', todo);
  updateTodoInList(todo);
});

socket.on('todo-deleted', (id) => {
  console.log('Received todo-deleted event with ID:', id);
  removeTodoFromList(id);
});

axios.post('http://localhost:4000/graphql', {
  query: `
    query {
      todos {
        id
        title
        description
        completed
      }
    }
  `,
})
  .then(response => {
    const data = response.data;
    if (data.errors) {
      console.error('GraphQL error fetching todos:', data.errors);
      return;
    }
    data.data.todos.forEach(todo => appendTodoToList(todo));
  })
  .catch(error => {
    console.error('Error fetching todos:', error);
  });
