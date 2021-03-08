module.exports = class Container {
  constructor() {
    this.services = {};
  }

  add(name, cb) {
    Object.defineProperty(this, name, {
      get: () => {
        if (!this.services.hasOwnProperty(name)) {
          this.services[name] = cb(this);
        }

        return this.services[name];
      },
      configurable: true,
      enumerable: true
    });

    return this;
  }
};
