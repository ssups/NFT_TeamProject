const env = require("dotenv").config();

const config = {
  dev: {
    password: process.env.DATABASE_PASSWORD,
    database: "nft_project",
    host: "127.0.0.1",
    username: "root",
    dialect: "mysql",
    logging: false,
  },
};

module.exports = config;
