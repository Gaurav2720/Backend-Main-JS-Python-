# Base Image: Lightweight Node.js Alpine Linux runtime
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose server port
EXPOSE 3000

# Set Node environment to production
ENV NODE_ENV=production

# Start the student management application
CMD ["node", "student-app.js"]
