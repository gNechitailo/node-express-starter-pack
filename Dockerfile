FROM node:12

WORKDIR /app

COPY . .

RUN npm install
RUN npm install pm2 -g

EXPOSE 3000
CMD ./startup.sh
