const googleMapsClient = require("@google/maps");

module.exports = key => {
  const api = googleMapsClient.createClient({
    key,
    Promise
  });

  return {
    geocode(input) {
      return api
        .geocode(input)
        .asPromise()
        .then(results => results.json.results);
    },
    place(input) {
      return api
        .place(input)
        .asPromise()
        .then(results => results.json.result);
    },
    reverseGeocode(input) {
      return api
        .reverseGeocode(input)
        .asPromise()
        .then(results => results.json.result);
    },
    placesAutoComplete(input) {
      const options = mergeOptions(defaults.placesAutoComplete, input);
      return api
        .placesAutoComplete(options)
        .asPromise()
    }
  };
};

const mergeOptions = (defaults, options) => {
  return Object.assign({}, defaults, options);
};

const defaults = {
  placesAutoComplete: {
    language: "nl",
    types: "geocode",
    
  }
};
