const { readdirSync, statSync } = require("fs");
const { join } = require("path");

module.exports = {
  getDirectories(path) {
    readdirSync(path).filter(value =>
      statSync(join(path, value)).isDirectory()
    );
  }
};
