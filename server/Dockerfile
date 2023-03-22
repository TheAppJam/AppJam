# Use Node.js 14 with Debian Buster as the parent image
FROM node:14-buster

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci --unsafe-perm

# Copy the application code to the working directory
COPY . .

# Remove local bcrypt and install it within the container
RUN rm -rf node_modules/bcrypt && \
    npm install bcrypt --unsafe-perm

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
