FROM node:slim
WORKDIR /app
COPY package*.json vite.config.js index.html ./
RUN npm install
COPY ./src ./src
EXPOSE 5173
CMD ["npm", "run", "dev"]