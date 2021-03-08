const fs = require("fs");

module.exports = (() => {
  const getSecretOrEnv = name => {
    return process.env.NODE_ENV === 'development'
      ? process.env[name.toString()]
      : // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.readFileSync(`/run/secrets/${name.toString()}`, 'utf8').trim();
  };
  // const getSecretOrEnv = name => {
  //   return process.env[name.toString()];
  // };

  return {
    client: "postgresql",
    debug: Boolean(Number(process.env.DEBUG)),
    connection: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: getSecretOrEnv("POSTGRES_DB"),
      user: getSecretOrEnv("POSTGRES_USER"),
      password: getSecretOrEnv("POSTGRES_PASSWORD")
    },
    pool: {
      min: 1,
      max: 5
    }
  };
})();
