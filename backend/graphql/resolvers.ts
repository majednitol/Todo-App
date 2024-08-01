import { PrismaClient } from '@prisma/client';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import redisClient from './../src/redis/redisClient';


const prisma = new PrismaClient();
const pubsub = new RedisPubSub({
  publisher: redisClient,
  subscriber: redisClient,
});

const TODO_ADDED = 'TODO_ADDED';
const TODO_UPDATED = 'TODO_UPDATED';
const TODO_DELETED = 'TODO_DELETED';

export const resolvers = {
  Query: {
    todos: async () => {
      try {
        const cachedTodos = await redisClient.get('todos');
        console.log("cachedTodos", cachedTodos)

        if (cachedTodos) {
          return JSON.parse(cachedTodos);
        }

        const todos = await prisma.todo.findMany();
        await redisClient.set('todos', JSON.stringify(todos), 'EX', 10);

        return todos.map(todo => ({
          ...todo,
          createdAt: todo.createdAt.toISOString(),
          updatedAt: todo.updatedAt.toISOString(),
        }));
      } catch (error) {
        // Handle error explicitly
        const err = error as Error;
        console.error('Error in todos resolver:', err.message);
        throw new Error(`Failed to fetch todos: ${err.message}`);
      }
    },
    todo: async (_: any, { id }: { id: string }) => {
      try {
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) {
          throw new Error(`Todo with id ${id} not found`);
        }

        return {
          ...todo,
          createdAt: todo.createdAt.toISOString(),
          updatedAt: todo.updatedAt.toISOString(),
        };
      } catch (error) {
        // Handle error explicitly
        const err = error as Error;
        console.error('Error fetching todo:', err.message);
        throw new Error(`Failed to fetch todo: ${err.message}`);
      }
    },
  },
  Mutation: {
    addTodo: async (_: any, { title, description }: { title: string; description: string }) => {
      try {
        const newTodo = await prisma.todo.create({
          data: {
            title,
            description,
            completed: false,
          },
        });

        await redisClient.del('todos');
        await pubsub.publish(TODO_ADDED, { todoAdded: newTodo });

        return {
          ...newTodo,
          createdAt: newTodo.createdAt.toISOString(),
          updatedAt: newTodo.updatedAt.toISOString(),
        };
      } catch (error) {
        // Handle error explicitly
        const err = error as Error;
        console.error('Error adding todo:', err.message);
        throw new Error(`Failed to add todo: ${err.message}`);
      }
    },
    toggleTodoCompleted: async (_: any, { id }: { id: string }) => {
      try {
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) {
          throw new Error(`Todo with id ${id} not found`);
        }

        const updatedTodo = await prisma.todo.update({
          where: { id },
          data: { completed: !todo.completed },
        });

        await redisClient.del('todos');
        await pubsub.publish(TODO_UPDATED, { todoUpdated: updatedTodo });

        return {
          ...updatedTodo,
          createdAt: updatedTodo.createdAt.toISOString(),
          updatedAt: updatedTodo.updatedAt.toISOString(),
        };
      } catch (error) {
        // Handle error explicitly
        const err = error as Error;
        console.error('Error toggling todo completed status:', err.message);
        throw new Error(`Failed to toggle todo completed status: ${err.message}`);
      }
    },
    deleteTodo: async (_: any, { id }: { id: string }) => {
      try {
        const todo = await prisma.todo.findUnique({ where: { id } });
        if (!todo) {
          throw new Error(`Todo with id ${id} not found`);
        }

        await prisma.todo.delete({ where: { id } });

        await redisClient.del('todos');
        await pubsub.publish(TODO_DELETED, { todoDeleted: id });

        return true;
      } catch (error) {
        // Handle error explicitly
        const err = error as Error;
        console.error('Error deleting todo:', err.message);
        throw new Error(`Failed to delete todo: ${err.message}`);
      }
    },
  },
  Subscription: {
    todoAdded: {
      subscribe: () => pubsub.asyncIterator([TODO_ADDED]),
      
    },
    todoUpdated: {
      subscribe: () => pubsub.asyncIterator([TODO_UPDATED]),
    },
    todoDeleted: {
      subscribe: () => pubsub.asyncIterator([TODO_DELETED]),
    },
  },
};
