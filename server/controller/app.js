const express = require("express");
const app = express();
const PORT = "4000";
const cors = require("cors");
const path = require("path");
// const address = "http://192.168.0.167:3000";

// axios 데이터 통신 시 필요 (상단부 위치 중요..)
// app.use(cors({ origin: address }));
app.use(cors({ origin: "*" }));
app.use(express.json());

// 해당 경로로 접근(통신)하면 파일 접근 가능 (static 미들웨어를 사용하여 정적 파일 제공)
// https://loclhost:4000/1.json
app.use(express.static("src/json"));

// https://locahost:4000/images/1.png
app.use(express.static("src"));

app.listen(PORT, () => {
  console.log(PORT, "번 포트에 백 서버 열림");
});

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

// app.get('*', (req,res)=>)
