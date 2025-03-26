FROM node:slim
WORKDIR /app
COPY package*.json vite.config.js index.html ./
RUN npm install
COPY ./src ./src
EXPOSE 80
CMD ["npm", "run", "dev"]