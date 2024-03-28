const envalid = require("envalid");

const env = envalid.cleanEnv(process.env, {
  PORT: envalid.port(),
  SECRET_SESSION: envalid.str(),
  DATABASE_URL: envalid.str(),
  JWT_SECRET: envalid.str(),
  JWT_REFRESH_SECRET: envalid.str(),
  PRISMA_SECRET_SESSION: envalid.str(),
});

export default env;
