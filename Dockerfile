FROM node:14

WORKDIR /usr/src/app

RUN npm install -g http-server

COPY . .

EXPOSE 9000

CMD ["http-server", "site", "-p", "9000"]
