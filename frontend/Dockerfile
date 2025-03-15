# Use the official Node 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Expose the port used by your development server (e.g., Vite typically uses 5173)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
