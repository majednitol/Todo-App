# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app for production
RUN npm run build

# Install a static file server (serve) to serve the built files
RUN npm install -g serve

# Expose port 5000 (default port for serve)
EXPOSE 3000

# Start the application using serve
CMD ["serve", "-s", "build", "-l", "3000"]
