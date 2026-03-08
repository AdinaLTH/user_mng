// ==========================================
// 1. DB 드라이버 및 Promise 모듈 호출
// ==========================================
// DAO (Data Access Object): 실제 DB에 접근해서 데이터를 넣고 빼는 작업을 전담하는 객체입니다.

// 왜 그냥 'mysql'이 아니라 'mysql2/promise'를 쓸까요?
// 1. mysql2: 기존 mysql 모듈보다 속도가 빠르고 보안(Prepared Statement)에 더 최적화되어 있습니다.
// 2. /promise: 우리가 라우터와 서비스에서 지겹도록(?) 봤던 async/await을 쓰기 위함입니다!
// 이 모듈을 쓰지 않으면 DB 작업이 끝날 때까지 기다리게 만들기 위해
// 보기 힘든 콜백(Callback) 함수를 써야 하지만, 이 모듈 덕분에 코드를 아주 깔끔하게 유지할 수 있습니다.
const mysql = require("mysql2/promise");

// ==========================================
// 2. 커넥션 풀(Connection Pool) 생성
// ==========================================
// 왜 createConnection이 아니라 createPool을 쓸까요? (매우 중요)
// - createConnection: 요청이 올 때마다 DB와 연결 통로를 만들고, 다 쓰면 부수는 방식입니다.
//   (비효율적이고 서버에 무리가 많이 갑니다.)
// - createPool: 서버가 켜질 때 미리 DB와 연결된 통로(커넥션)를 여러 개 만들어 두고 '풀(수영장)'에 보관합니다.
//   요청이 오면 만들어둔 통로를 빌려주고, 작업이 끝나면 다시 반납받아 재사용합니다.
//   훨씬 빠르고 안정적이죠!
const connectionPool = mysql.createPool({
  // 여기서 process.env.* 값들은 아까 app.js 맨 위에서
  // require("dotenv").config(...)를 통해 읽어온 dbConfig.env 파일 안의 값들입니다.
  // 소스코드에 DB 비밀번호가 노출되는 것을 막기 위한 최고의 방법입니다.
  host: process.env.DB_HOST, // DB 서버의 주소 (예: localhost 또는 IP 주소)
  port: process.env.DB_PORT, // DB 서버의 포트 (MySQL은 보통 3306)
  user: process.env.DB_USERNAME, // DB 접속 아이디
  password: process.env.DB_PASSWORD, // DB 접속 비밀번호
  database: process.env.DB_DATABASE, // 사용할 특정 데이터베이스 이름

  // connectionLimit: 풀(Pool)에 미리 만들어둘 연결 통로의 최대 개수입니다.
  // 여기서는 5개로 설정했으므로, 동시에 6개의 요청이 오면
  // 5명은 바로 DB 통로를 이용하고, 1명은 누군가 통로를 반납할 때까지 대기하게 됩니다.
  // 서비스 규모에 따라 이 숫자를 조절합니다.
  connectionLimit: 5,
});

// ==========================================
// 3. 모듈 내보내기
// ==========================================
// 잘 만들어진 커넥션 풀 객체를 내보냅니다.
// 이제 SQL 쿼리문을 작성하는 Mapper 파일들에서 이 pool을 불러와서
// pool.query("SELECT * FROM users") 같은 식으로 DB에 명령을 내리게 됩니다.
module.exports = {
  pool: connectionPool,
};
