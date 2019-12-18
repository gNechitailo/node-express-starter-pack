FROM node:12

WORKDIR /app

COPY . .

RUN npm install
# RUN npm install --only=production

EXPOSE 3000
CMD npm start