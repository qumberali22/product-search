# Use the official Node.js image with your version
FROM node:23.10.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Expose the Next.js port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]