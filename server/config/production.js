module.exports = {
  // disbable logging for production
  logging: false,
  dbLog: false,
  seed: false,
  db: {
    hostname: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    dbName: process.env.RDS_DB_NAME,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
  },
}