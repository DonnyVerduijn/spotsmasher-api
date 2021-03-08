const axios = require("axios");

module.exports = (access_key) => {
  const baseUrl = "http://api.ipstack.com/";

  return {
    ipToLocation(ipAddress) {
      return axios
        .get(`${baseUrl}${ipAddress}?access_key=${access_key}`)
        .then(result => {
          return result.data;
        });
    }
  };
};
