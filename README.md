
# Todo CRUD Application

## Overview

A full-featured Todo CRUD application with real-time updates, built using Node.js, TypeScript, GraphQL, Redis, MongoDB, and Docker.

## Features

 **CRUD Operations**: Create, Read, Update, and Delete Todos.
 **Real-Time Updates**: Via Socket.IO and Redis Pub/Sub.
 **GraphQL API**: Flexible querying and mutation.
 **WebSockets**: Real-time GraphQL subscriptions.
 **Containerized**: Docker and Docker Compose for easy setup.

## Tech Stack

 **Frontend**: HTML, CSS, JavaScript
 **Backend**: Node.js, TypeScript, Apollo Server, Socket.IO
 **Database**: MongoDB, Prisma
 **Cache**: Redis
 **Web Server**: Nginx
 **Containerization**: Docker

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/majednitol/todo-app.git
cd todo-app
```

### 2. Set Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=4000
SOCKET_PORT=4001
MONGO_URI=mongodb://mongo:27017/todo
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3. Build and Run

```bash
docker-compose up --build
```

### 4. Access

 **Frontend**: [http://localhost:3000](http://localhost:80)
 **GraphQL**: [http://localhost:4000/graphql](http://localhost:4000/graphql)
 **Socket.IO**: [http://localhost:4001](http://localhost:4001)

## Contributing

1. **Fork the repo**
2. **Create a new branch**
3. **Commit your changes**
4. **Push and create a pull request**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
