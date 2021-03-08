module.exports = (() => {
  function isObject(value) {
    return Object(value) === value;
  }

  function parseJsonRecursively(node) {
    return Object.keys(node).reduce((acc, key) => {
      let result;
      try {
        result = JSON.parse(node[key]);
      } catch (e) {
        result = isObject(node[key])
          ? parseJsonRecursively(node[key])
          : node[key];
      }
      return { ...acc, [key]: result };
    }, {});
  }

  return {
    parseJsonRecursively
  };
})();
