const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const Knex = require("knex");
const connection = require("./knexfile");
const { createServer } = require("http");
// const { SubscriptionServer } = require("subscriptions-transport-ws");
const { ApolloServer } = require("apollo-server-express");
// const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
// const { execute, subscribe } = require('graphql');
const { mergeSchemas } = require("graphql-tools");
const { applyMiddleware } = require("graphql-middleware");
const graphqlFields = require("graphql-fields");
const { gql } = require("apollo-server-express");
const Container = require("./src/helpers/Container");
const BaseModel = require("./src/helpers/BaseModel");
const { propertyFromObjects } = require("./src/utils/dataUtils");
const app = require("./src/app");

const path = require('path')
const mergeGraphqlSchemas = require('merge-graphql-schemas')
const fileLoader = mergeGraphqlSchemas.fileLoader
// const mergeTypes = mergeGraphqlSchemas.mergeTypes

const typesArray = fileLoader(path.join(__dirname, './src/**/*.graphql'))
// console.log(typesArray)
const corsOptions = {
  origin: "*"
  // origin: process.env.NODE_ENV === "production" ? "*.spotsmasher.com" : "*"
};

const withFieldsObject = (...restArgs) => {
  const [resolver, obj, args, context, info] = restArgs;
  // eslint-disable-next-line no-unused-vars
  const { __typename, ...fields } = graphqlFields(info);
  const appendedArgs = Object.assign({}, args, { fields });
  return resolver(obj, appendedArgs, context, info);
};

// instantiate globally available logger
global.logger = require("winston").createLogger(
  require("./winston.config")[process.env.NODE_ENV]
);

const PORT = process.env.API_PORT;

main();

function main() {
  const container = new Container();
  container.add("knex", () => Knex(connection));
  container.add("BaseModel", c => BaseModel(c.knex));
  container.add("models", c =>
    propertyFromObjects("model", app, () => ({
      Model: c.BaseModel,
      relations: () => c.models
    }))
  );
  container.add("queries", c =>
    propertyFromObjects("queries", app, () => ({
      models: c.models,
      knex: c.knex
    }))
  );
  container.add("resolvers", c =>
    propertyFromObjects("resolvers", app, key => ({
      [key]: c.queries[key.toString()] ? c.queries[key.toString()] : null
    }))
  );

  const server = express();
  server.get("/", (req, res) => res.send(""));
  server.use("*", helmet(), cors(corsOptions));

  const httpServer = createServer(server);
  const apolloServer = new ApolloServer({
    schema: applyMiddleware(
      mergeSchemas({
        schemas: typesArray,
        resolvers: Object.keys(container.resolvers).map(
          key => container.resolvers[key.toString()]
        ),
        subscriptions: {
          // onConnect: (connectionParams, webSocket) => {
          //   if (connectionParams.authToken) {
          //     return validateToken(connectionParams.authToken)
          //       .then(findUser(connectionParams.authToken))
          //       .then(user => {
          //         return {
          //           currentUser: user,
          //         };
          //       });
          //   }
          //   throw new Error('Missing auth token!');
          // },
        }
      }),
      withFieldsObject
    ),
    context: async ({ req, connection }) => {
      if (connection) {
        // check connection for metadata
        return connection.context;
      } else {
        // check from req
        const token = req.headers.authorization || "";

        return { token };
      }
    },
    playground: Boolean(Number(process.env.APOLLO_PLAYGROUND)),
    introspection: Boolean(Number(process.env.APOLLO_INTROSPECTION)),
    tracing: Boolean(Number(process.env.APOLLO_TRACING)),
    debug: Boolean(Number(process.env.APOLLO_DEBUG))
  });

  apolloServer.applyMiddleware({ app: server });
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: PORT }, () => {
    logger.info(
      `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
    logger.info(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
    );
  });
}
