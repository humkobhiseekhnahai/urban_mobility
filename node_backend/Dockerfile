# Use the official Node 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the entrypoint script and make it executable
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Expose the port (adjust if needed)
EXPOSE 3000

# Use the entrypoint script as the container's command
CMD ["./docker-entrypoint.sh"]
