FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/ .

# Create .env file (you should override this in production)
RUN echo "MONGODB_URI=mongodb://mongo:27017/smartgraama\nJWT_SECRET=your_jwt_secret_key_here\nPORT=5000" > .env

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 