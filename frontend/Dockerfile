# Use official Node.js image as the base
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as a web server to serve the built app
FROM nginx:1.19

# Copy the build output from the Node.js image
COPY --from=0 /app/build /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
