require("dotenv").config({ path: "./database/dbConfig.env" });
const express = require("express");
const app = express();
const port = 3000; // 포트는 충돌대비 변수로 관리(서버의 Port 정보)
// 미들웨어 등록 영역
// body parser
// content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// content-type: application/json
app.use(express.json());

// Server 실행
app.listen(port, () => {
  console.log("Server Start");
  console.log(`http://localhost:${port}`);
});

// 라우팅 등록 영역
// - 기본 라우팅
app.get("/", (req, res) => {
  res.send("Welcome!!");
});

// - 기능별 라우터 모듈 등록
const userRouter = require("./routers/user_router.js");
app.use("/", userRouter);
