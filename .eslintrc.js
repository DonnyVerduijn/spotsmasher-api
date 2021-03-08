module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true
  },
  extends: ["eslint:recommended", "plugin:security/recommended"],
  globals: {
    expect: "readonly",
    logger: "readonly",
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-unused-vars": 1,
    "no-console": 0
  },
  plugins: ["mocha", "security"]
};
