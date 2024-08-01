# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Install nodemon and prisma globally
RUN npm install -g nodemon prisma

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Stage 2: Run the application
FROM node:18

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app /app

# Install nodemon and prisma globally
RUN npm install -g nodemon prisma

# Expose the necessary ports
EXPOSE 4000
EXPOSE 4001

# Run database migrations and start the application with nodemon
CMD ["sh", "-c", "npx prisma migrate dev --name init && npm run dev"]
