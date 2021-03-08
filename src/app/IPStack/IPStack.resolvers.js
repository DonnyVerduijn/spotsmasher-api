// const { ApolloError } = require("apollo-server");
const createIPStackApi = require("./IPStack.queries");
const fs = require("fs");
const getSecretOrEnv = name => {
  return process.env.NODE_ENV === "development"
    ? process.env[name.toString()]
    : fs.readFileSync(`/run/secrets/${name.toString()}`, "utf8").trim();
};

const apiKey = getSecretOrEnv("IPSTACK_API_KEY");
const IPStack = createIPStackApi(apiKey);

// function getEnvironmentVariable(key) {
//   return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging' ?
//   process.env[key] : fs.readFileSync(`/run/secrets/${key.toLowerCase()}`)
// }

module.exports = () => ({
  Query: {
    ipToLocation: (obj, { ipAddress }) => {
      return IPStack.ipToLocation(ipAddress);
    }
  }
});
