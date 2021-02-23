const {PgHelper} = require('@c_kai/pg-helper');

// detail https://node-postgres.com/api/pool
const pgHelper = new PgHelper({
    host,
    user,
    password,
    database,
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
},{
  autoHump: true,
  returning: true,
  logger: console,
});