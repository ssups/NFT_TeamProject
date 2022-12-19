const Sequelize = require("sequelize");

const config = require("../config");
const { database, username, password } = config.dev;

const sequelize = new Sequelize(database, username, password, config.dev);

const db = new Object();

db.sequelize = sequelize;

module.exports = { sequelize };
