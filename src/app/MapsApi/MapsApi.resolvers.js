const createMapsApi = require("./MapsApi.queries");
const { ApolloError } = require("apollo-server");
const fs = require("fs");
const getSecretOrEnv = name => {
  return process.env.NODE_ENV === "development"
    ? process.env[name.toString()]
    : fs.readFileSync(`/run/secrets/${name.toString()}`, "utf8").trim();
};

const apiKey = getSecretOrEnv("GOOGLE_MAPS_API_KEY");
const mapsApi = createMapsApi(apiKey);

// console.log(apiKey)
module.exports = () => ({
  Query: {
    placesAutoComplete: (obj, { input }) => {
      return input.input.length > 0
        ? mapsApi
            .placesAutoComplete(input)
            .then(results => results.json.predictions)
            .catch(error => {
              throw new ApolloError(error);
            })
        : [];
    },
    geocode: (obj, { input }) => {
      return mapsApi.geocode(input);
    },
    place: (obj, { input }) => {
      return mapsApi.place(input);
    },
    reverseGeocode: (obj, { input }) => {
      return mapsApi.reverseGeocode(input);
    }
  }
});
