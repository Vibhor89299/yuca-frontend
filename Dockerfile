# Use official Node.js 22 LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the app
RUN npm run build

# Expose the Vite preview port
EXPOSE 4173

# Run Vite preview server
CMD ["npm", "run", "preview", "--", "--host"]
