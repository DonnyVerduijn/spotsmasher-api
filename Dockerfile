FROM node:alpine

WORKDIR /usr/src/app

ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

COPY package*.json ./

RUN npm install --only=production --silent

COPY . ./

ARG ENGINE_API_KEY

RUN npx graphql-codegen
RUN npx apollo service:push

EXPOSE 8080

CMD dockerize --wait tcp://${POSTGRES_HOST}:${POSTGRES_PORT} -timeout 60s node ./index.js