FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install express dotenv cors mongoose
COPY . .
EXPOSE 5000
CMD ["npm", "start"]