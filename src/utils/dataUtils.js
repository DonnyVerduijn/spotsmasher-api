module.exports = {
  propertyFromObjects(property, app, args) {
    return Object.keys(app).reduce((acc, key) => {
      return app[key.toString()][property.toString()]
        ? Object.assign({}, acc, {
            [key]: args
              ? app[key.toString()][property.toString()](args(key))
              : app[key.toString()][property.toString()]
          })
        : acc;
    }, {});
  }
};
