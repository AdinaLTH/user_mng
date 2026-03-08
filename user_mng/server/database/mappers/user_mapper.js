// ==========================================
// 1. 모듈 및 SQL 쿼리문 호출 영역
// ==========================================
// DAO 파일에서 만들어둔 '커넥션 풀(수영장)'을 가져옵니다.
const { pool } = require("../DAO");
// 길고 복잡한 SQL 쿼리문들을 이 파일에 직접 쓰지 않고,
// 별도의 파일(users.js)로 분리해서 가져옵니다. (가독성 및 유지보수 향상)
const userSql = require("../sql/users.js");

// ==========================================
// 2. 실제 SQL문 수행 함수 영역 (DB 통신)
// ==========================================

// [전체조회]
const selectAllUser = async () => {
  // conn(커넥션) 변수를 미리 null로 선언해두는 이유:
  // try 블록 안에서 선언하면 finally 블록에서 접근할 수 없기 때문입니다.
  let conn = null;
  try {
    // 1. connectionPool에서 대기 중인 connection(연결 통로)을 하나 빌려옵니다.
    // (렌터카 업체에서 차를 한 대 빌리는 것과 같습니다)
    conn = await pool.getConnection();

    // 2. 해당 connection을 통해 SQL문 실행
    // mysql2 모듈은 결과를 배열로 반환합니다. 첫 번째 요소는 실제 데이터(rows),
    // 두 번째 요소는 테이블의 필드 정보(fields)입니다.
    // 우리는 데이터만 필요하므로 배열 구조 분해 할당 '[rows, fields]'을 사용해 rows만 챙깁니다.
    let [rows, fields] = await conn.query(userSql.selectAllUser);
    return rows;
  } catch (err) {
    console.log(err); // 에러 발생 시 콘솔에 출력
  } finally {
    // 3. (가장 중요★) 사용이 끝난 connection을 pool에 반드시 돌려줍니다.
    // finally 블록은 에러가 나든 안 나든 무조건 마지막에 실행됩니다.
    // 여기서 반납(release)하지 않으면, 빌려간 통로가 반납되지 않아
    // 결국 DB 연결이 꽉 차서 서버가 뻗어버립니다(Connection Timeout).
    if (conn) conn.release();
  }
};

// [단건조회]
const selectUserByNo = async (no) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    // SQL문에 조건(?)이 있다면 두 번째 인자로 값을 넘겨줍니다.
    let [result] = await conn.query(userSql.selectUserByNo, no);

    // 작성해주신 주석이 정확합니다!
    // DB에서 단 1건을 조회하더라도 무조건 '배열' 형태로 [ {id: 1, name: '태호', ...} ] 이렇게 옵니다.
    // 따라서 서비스나 라우터에서 쓰기 편하게 배열 포장을 뜯어서 첫 번째 객체(result[0])만 반환하는 센스입니다.
    let info = result[0];
    return info;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// [등록]
const insertUser = async (userInfo) => {
  // userInfo는 service.js에서 넘어온 배열 형식입니다: [user_id, user_pwd, user_name, user_gender, user_age, join_date]
  let conn = null;
  try {
    conn = await pool.getConnection();
    // userInfo 배열의 값들이 SQL문의 INSERT INTO ... VALUES (?, ?, ?, ?, ?, ?) 의 '?' 자리에 순서대로 쏙쏙 들어갑니다.
    let [result] = await conn.query(userSql.insertUser, userInfo);
    return result; // insertId 등이 담긴 결과 객체 반환
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// [수정] - ★ 트랜잭션(Transaction) 적용 ★
// 트랜잭션이란? 여러 개의 DB 작업을 "전부 다 성공하거나, 아니면 전부 다 취소해라!" 라고 묶는 작업 단위입니다.
// 은행 송금(내 돈 빼기 -> 상대방 돈 늘리기)을 생각하면 쉽습니다. 중간에 멈추면 안 되니까요.
const updateUser = async (userNo, updateDta) => {
  let conn = null;
  try {
    conn = await pool.getConnection();

    // 1. 트랜잭션 시작 (Auto Commit 해제)
    // "지금부터 내가 내리는 명령들은 내가 확정(commit)하기 전까지는 DB에 완전히 반영하지 말고 대기해!"
    await conn.beginTransaction();

    // [SET의 ?, WHERE의 ?] users.js의 순서대로 매핑되도록 배열로 넘겨줍니다.
    let [result] = await conn.query(userSql.updateUser, [updateDta, userNo]);

    // 이 자리에서 추가로 다른 DML(INSERT, UPDATE 등)을 실행해도 모두 하나의 작업으로 묶입니다.

    // 2. 트랜잭션 확정
    // "모든 에러 없이 잘 끝났으니, 이제 DB에 진짜로 덮어써도 좋아!"
    await conn.commit();
    return result;
  } catch (err) {
    console.log(err);
    // 3. 트랜잭션 취소
    // 중간에 하나라도 에러가 나면 이 catch 블록으로 빠집니다.
    // "작업하다 에러 났어! 지금까지 했던 거 다 취소하고 원래 상태로 되돌려!"
    if (conn) await conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};

// [삭제]
// selectUserByNo 와 구조가 거의 동일합니다.
const deleteUser = async (no) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    // 삭제할 유저 번호를 넘겨 DELETE 쿼리를 실행합니다.
    let [result] = await conn.query(userSql.deleteUser, no);
    return result; // affectedRows(삭제된 행 개수) 등이 담긴 객체 반환
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// ==========================================
// 3. 모듈 내보내기
// ==========================================
module.exports = {
  selectAllUser,
  selectUserByNo,
  insertUser,
  updateUser,
  deleteUser,
};
