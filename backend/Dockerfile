# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Expose the necessary ports (adjust as needed)
# EXPOSE 4001-4006
# npx prisma migrate reset --force && npx prisma migrate dev --name init
# Run database reset, migrations, and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
