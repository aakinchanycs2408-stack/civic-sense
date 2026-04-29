FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY package.json ./

# Run npm install
RUN npm install

# Copy all files
COPY . .

# Expose port 8080
EXPOSE 8080

# Run npm start
CMD ["npm", "start"]