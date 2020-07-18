const Umzug = require('umzug')
const path = require('path')
const db = require('./index')

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: db,
  },
  migrations: {
    path: path.join(__dirname, './migrations'),
    params: [db.getQueryInterface()],
  },
})

;(async () => {
  // Checks migrations and run them if they are not already applied. To keep
  // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
  // will be automatically created (if it doesn't exist already) and parsed.
  const command = process.argv.length > 2 ? process.argv.slice(2) : ['']
  const [direction, val] = command[0].split('=')
  switch (direction) {
    case 'up':
      await umzug.up()
      break
    case 'down':
      await umzug.down()
      break
    case 'down:all':
      await umzug.down({ to: 0 })
      break

    default:
      await umzug.up()
      break
  }
  process.exit(0)
})()
