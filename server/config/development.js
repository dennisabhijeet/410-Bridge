module.exports = {
  // enabled logging for development
  logging: true,
  dbLog: true,
  seed: false,
  db: {
    hostname: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    dbName: process.env.RDS_DB_NAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
  },
}
