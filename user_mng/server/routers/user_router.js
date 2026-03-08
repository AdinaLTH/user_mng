// ==========================================
// 1. 라우터(Router) 초기화 영역
// ==========================================
// 라우팅 = 클라이언트의 요청(URI + HTTP METHOD)을 파악하여
// 알맞은 서비스(비즈니스 로직)로 연결하고, 그 결과를 응답(Response)하는 역할(Controller 역할)

const express = require("express");

// 왜 app 대신 Router()를 사용할까요?
// app.js에서 모든 라우팅을 처리하면 코드가 너무 비대해집니다.
// express.Router()를 사용하면 기능별(예: 회원, 게시판, 상품 등)로
// 라우팅 모듈을 쪼개서 파일로 분리할 수 있어 유지보수가 훨씬 쉬워집니다.
const router = express.Router();

// ==========================================
// 2. 서비스(Service) 모듈 호출 영역
// ==========================================
// 왜 DB 로직을 여기서 직접 안 짜고 Service를 부를까요? (관심사의 분리)
// 라우터는 '요청을 받고 응답하는 일'에만 집중하고,
// 실제 데이터 검증이나 가공 같은 복잡한 '비즈니스 로직'은 Service에게 떠넘기기 위함입니다.
const userService = require("../services/user_service.js");

// ==========================================
// 3. API 엔드포인트(Endpoint) 정의 영역
// ==========================================
// async / await를 사용하는 이유:
// DB 조회나 저장은 시간이 걸리는 작업(비동기)입니다.
// await를 걸어주지 않으면 DB에서 데이터를 다 가져오기도 전에 다음 코드가 실행되어
// 빈 값을 클라이언트에게 응답하게 됩니다. 따라서 결과를 '기다리도록' 만들어 줍니다.

// [전체조회] | URI(/users) + METHOD(GET)
// 역할: DB에 있는 모든 유저 목록을 가져와서 응답합니다.
router.get("/users", async (req, res) => {
  // Service 계층의 findAll 함수를 호출하고, 완료될 때까지 대기(await)합니다.
  let result = await userService.findAll();
  // 가져온 결과(배열 등)를 클라이언트(Vue 등)에게 JSON 형태로 보냅니다.
  res.send(result);
});

// [단건조회] | URI(/users/:no) + METHOD(GET)
// 역할: 특정 유저 1명의 상세 정보를 조회합니다.
router.get("/users/:no", async (req, res) => {
  // req.params.no: URL 경로에 포함된 변수(:no)를 추출합니다.
  // 예: GET /users/15 로 요청이 오면 req.params.no는 '15'가 됩니다.
  const target = req.params.no;
  let result = await userService.findInfoByNo(target);
  res.send(result);
});

// [등록] | URI(/users) + METHOD(POST)
// 역할: 클라이언트가 보낸 새로운 유저 정보를 받아 DB에 저장합니다.
router.post("/users", async (req, res) => {
  // req.body: 클라이언트가 HTTP Body에 담아 보낸 데이터(보통 JSON 객체)입니다.
  // app.js에서 설정한 app.use(express.json()) 미들웨어가 있어야만 이 값을 읽을 수 있습니다.
  let target = req.body;
  let result = await userService.createInfo(target);
  res.send(result);
});

// [수정] | URI(/users/:no) + METHOD(PUT)
// 역할: 특정 유저의 정보를 클라이언트가 보낸 새로운 데이터로 덮어씁니다.
router.put("/users/:no", async (req, res) => {
  // 누구를 수정할지(userNo)는 URL에서 찾고,
  let userNo = req.params.no;
  // 어떤 내용으로 수정할지(target)는 HTTP Body에서 찾습니다.
  let target = req.body;
  let result = await userService.modifyInfo(userNo, target);
  res.send(result);
});

// [삭제] | URI(/users/:no) + METHOD(DELETE)
// 역할: 특정 유저를 DB에서 삭제합니다.
router.delete("/users/:no", async (req, res) => {
  // 삭제할 대상의 번호를 URL 파라미터에서 추출합니다.
  let userNo = req.params.no;
  // 서비스 계층에 해당 번호를 넘겨 삭제 처리를 요청합니다.
  let result = await userService.deleteInfo(userNo);
  res.send(result);
});

// ==========================================
// 4. 모듈 내보내기
// ==========================================
// 이 파일에서 세팅한 router 객체를 밖으로 내보내야,
// app.js에서 require('./routers/user_router.js')로 불러와서 사용할 수 있습니다.
module.exports = router;
