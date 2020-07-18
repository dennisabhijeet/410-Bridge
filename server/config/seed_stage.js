module.exports = {
  // disbable logging for testing
  logging: true,
  seed: true,
  db: {
    hostname: process.env.RDS_STAGE_HOSTNAME,
    port: process.env.RDS_STAGE_PORT,
    dbName: process.env.RDS_STAGE_DB_NAME,
    username: process.env.RDS_STAGE_USERNAME,
    password: process.env.RDS_STAGE_PASSWORD,
  },
}
