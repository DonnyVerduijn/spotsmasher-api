## spotsmasher-api

An API that provides access to a postgresql database and a proxy to additional third party REST API's such as Google Maps API.

# Requirements

The requirements for this project are docker and docker-compose. Please install these first before launching this project.

# Getting started

```
yarn install
yarn db:up
yarn db:migrate:latest
yarn db:seed:run
yarn start
```