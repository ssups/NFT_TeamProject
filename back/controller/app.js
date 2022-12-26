const express = require("express");
const app = express();
const PORT = "4000";
const cors = require("cors");
const address = "http://192.168.0.167:3000";
const { sequelize } = require("../models");

// 시퀄라이즈 테이블 생성 후에 DB 작업을 요청할 예정
let isSequelizeDone = false;

// axios 데이터 통신 시 필요 (상단부 위치 중요..)
// app.use(cors({ origin: address }));
app.use(cors({ origin: "*" }));
app.use(express.json());

// 해당 경로로 접근(통신)하면 파일 접근 가능 (static 미들웨어를 사용하여 정적 파일 제공)
// https://loclhost:4000/1.json
app.use(express.static("src/json"));

// https://locahost:4000/images/1.png
app.use(express.static("src"));

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("디비 연결 완료");
//     isSequelizeDone = true;
//   })
//   .catch(err => console.log("디비연결 오류", err));

app.listen(PORT, () => {
  console.log(PORT, "번 포트에 백 서버 열림");
});
