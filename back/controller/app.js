const express = require("express");
const app = express();
const PORT = "4000";
const cors = require("cors");
const address = "http://localhost:3000";
const { sequelize } = require("../models");

let isSequelizeDone = false;

// axios 데이터 통신 시 필요
app.use(express.json());

app.use(cors({ origin: address }));

//
sequelize.sync({ force: true }).then(() => {
  console.log("시퀄라이즈");
  isSequelizeDone = true;
});

app.listen(PORT, () => {
  console.log(PORT, "번 포트에 백서버 열림");
});
