# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the frontend code
COPY . .

# Expose port 80
EXPOSE 80

# Start the application
CMD ["npm", "start"]

