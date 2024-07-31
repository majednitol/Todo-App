# Use Node.js as the base image
FROM node:18

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


EXPOSE 4000
EXPOSE 4001



CMD ["npm", "run", "dev"]
