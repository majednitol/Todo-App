import { PrismaClient } from '@prisma/client';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { redisClient, subscriberRedisClient } from '../src/redis/redisClient';


const prisma = new PrismaClient();
const pubsub = new RedisPubSub({
  publisher: redisClient,
  subscriber: subscriberRedisClient,
});

const TODO_ADDED = 'TODO_ADDED';
const TODO_UPDATED = 'TODO_UPDATED';
const TODO_DELETED = 'TODO_DELETED';

export const resolvers = {
  Query: {
    todos: async () => {
      try {
        const cachedTodos = await redisClient.get('todos');
        console.log("cachedTodos",cachedTodos)
        if (cachedTodos) {
          return JSON.parse(cachedTodos);
        }

        const todos = await prisma.todo.findMany();
        if (!todos || todos.length === 0) {
          console.log("Todos not exist in the database");
          throw new Error("No todos found in the database. Please check if the 'Todo' table exists.");
        }
        await redisClient.set('todos', JSON.stringify(todos), 'EX', 100000);

        return todos.map((todo: { createdAt: { toISOString: () => any; }; updatedAt: { toISOString: () => any; }; }) => ({
          ...todo,
          createdAt: todo.createdAt.toISOString(),
          updatedAt: todo.updatedAt.toISOString(),
        }));
      } catch (error) {
        console.error('Error in todos resolver:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to fetch todos: ${error.message}`);
        } else {
          throw new Error('Failed to fetch todos due to an unknown error');
        }
      }
    },
    todo: async (_: any, { id }: { id: number }) => {
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
        console.error('Error fetching todo:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to fetch todo: ${error.message}`);
        } else {
          throw new Error('Failed to fetch todo due to an unknown error');
        }
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
        console.error('Error adding todo:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to add todo: ${error.message}`);
        } else {
          throw new Error('Failed to add todo due to an unknown error');
        }
      }
    },
    toggleTodoCompleted: async (_: any, { id }: { id: number }) => {  // Changed to number
      try {
        const userId = Number(id)
        console.log("trying to addded")
        const todo = await prisma.todo.findUnique({ where: { id: userId } });
        if (!todo) {
          throw new Error(`Todo with id ${id} not found`);
        }

        const updatedTodo = await prisma.todo.update({
          where: { id: userId },
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
        console.error('Error toggling todo completed status:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to toggle todo completed status: ${error.message}`);
        } else {
          throw new Error('Failed to toggle todo completed status due to an unknown error');
        }
      }
    },
    deleteTodo: async (_: any, { id }: { id: number }) => {  // Changed to number
      try {
        const userId = Number(id)
        const todo = await prisma.todo.findUnique({ where: { id: userId } });
        if (!todo) {
          throw new Error(`Todo with id ${id} not found`);
        }

        await prisma.todo.delete({ where: { id: userId } });

        await redisClient.del('todos');
        await pubsub.publish(TODO_DELETED, { todoDeleted: id });

        return true;
      } catch (error) {
        console.error('Error deleting todo:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to delete todo: ${error.message}`);
        } else {
          throw new Error('Failed to delete todo due to an unknown error');
        }
      }
    },
  },
  Subscription: {
    todoAdded: {
      subscribe: () => pubsub.asyncIterator(TODO_ADDED),
    },
    todoUpdated: {
      subscribe: () => pubsub.asyncIterator(TODO_UPDATED),
    },
    todoDeleted: {
      subscribe: () => pubsub.asyncIterator(TODO_DELETED),
    },
  },
};

