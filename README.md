
# Todo CRUD Application

## Overview

A full-featured Todo CRUD application with real-time updates, built using Node.js, TypeScript, GraphQL, Redis, Postgresql, Prisma ORM , Socket.io , Graphql subscription and Docker,Kubernete with PersistentVolume and PersistentVolumeClaim

## Features

 **CRUD Operations**: Create, Read, Update, and Delete Todos.
 **Real-Time Updates**: Via Socket.IO and Redis Pub/Sub.
 **GraphQL API**: Flexible querying and mutation.
 **WebSockets**: Real-time GraphQL subscriptions.
 **Containerized**: Docker and Docker Compose for easy setup.

## Tech Stack

 **Frontend**: HTML, CSS, JavaScript
 **Backend**: Node.js, TypeScript, Apollo Server, Socket.IO
 **Database**: Postgresql, Prisma
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
postgresql://user:password@postgres:5432/todoapp?schema=public
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3.1. Build and Run (without Kubernete)

```bash
docker-compose watch
docker-compose down   //stop app

```
### 3.2. Build and Run (without Kubernete)

```bash
minikube start / stop
minikube dashboard 
kubectl apply -f fileName (for create new development or service or pv or pvc)

kubectl apply -f postgres-pv-pvc.yml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

kubectl get pods
kubectl get all  ( see all development , service)
kubectl logs podsName  (see what happening in pods)

kubectl port-forward service/frontend-service 3000:3000
kubectl port-forward service/backend-service 4001:4001 (for graphql)
kubectl port-forward service/backend-service 4004:4004 (for socket.io)

```
### 4. Access

 **Frontend**: [http://localhost:3000](http://localhost:80)
 **GraphQL**: [http://localhost:4001/graphql](http://localhost:4000/graphql)
 **Socket.IO**: [http://localhost:4004](http://localhost:4001)

## Contributing

1. **Fork the repo**
2. **Create a new branch**
3. **Commit your changes**
4. **Push and create a pull request**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
