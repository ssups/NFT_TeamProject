const express = require("express");
const app = express();
const PORT = "4000";
const cors = require("cors");
const address = "http://localhost:3000";
const { sequelize } = require("../models");

// 시퀄라이즈 테이블 생성 후에 DB 작업을 요청할 예정
let isSequelizeDone = false;

// axios 데이터 통신 시 필요
app.use(express.json());

app.use(cors({ origin: address }));

sequelize.sync({ force: true }).then(() => {
  console.log("시퀄라이즈");
  isSequelizeDone = true;
});

app.listen(PORT, () => {
  console.log(PORT, "번 포트에 백서버 열림");
});
