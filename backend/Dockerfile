

FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the necessary ports
EXPOSE 4001
EXPOSE 4002
EXPOSE 4003
EXPOSE 4004
EXPOSE 4005
EXPOSE 4006

# Run database migrations and start the application
CMD ["sh", "-c", "npx prisma migrate dev --name init && npm run dev"]
