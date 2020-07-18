const { Op } = require('sequelize')
const sequelize = require('./db')

const orderString = function (orderBy = '', descending = 1) {
  return sequelize.literal(`${orderBy} ${descending ? 'DESC' : 'ASC'}`)
}

const searchObj = function (key = '', text = '') {
  const searchRegex = `%${text}%`
  return {
    [key]: {
      [Op.like]: searchRegex,
    },
  }
}

const findOr = function (key = '', vals = []) {
  return { [Op.or]: vals.map((val) => ({ [key]: val })) }
}
const findGte = function (key = '', val = null) {
  return {
    [key]: {
      [Op.gte]: val,
    },
  }
}
const findLte = function (key = '', val = null) {
  return {
    [key]: {
      [Op.lte]: val,
    },
  }
}

var getRandomString = () => {
  return (Math.ceil(Math.random() * 1000000000) + 1000000000)
    .toString(36)
    .toUpperCase()
}

module.exports = {
  getRandomString,
  orderString,
  searchObj,
  findOr,
  findGte,
  findLte,
}
