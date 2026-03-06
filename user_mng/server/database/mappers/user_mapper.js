// 실제 SQL문을 수행
const { pool } = require("../DAO");
const userSql = require("../sql/users.js");

// 전체조회
const selectAllUser = async () => {
  let conn = null;
  try {
    // connectionPool에서 대기중인 connection 반환
    conn = await pool.getConnection();
    // 해당 connection을 통해 SQL문 실행 및 결과 반호나
    let [rows, fields] = await conn.query(userSql.selectAllUser);
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    // 사용이 끝난 connection을 pool에 돌려줌
    if (conn) conn.release();
  }
};

// 단건조회
const selectUserByNo = async (no) => {
  let conn = null;
  try {
    // connectionPool에서 대기중인 connection 반환
    conn = await pool.getConnection();
    // 해당 connection을 통해 SQL문 실행 및 결과 반호나
    let [result] = await conn.query(userSql.selectUserByNo, no);
    let info = result[0]; // 단건 조회인데 배열로 오는 것도 이상하니 배열을 해제 [0] 첫번 째 들고오는게 단건조회니까
    return info;
  } catch (err) {
    console.log(err);
  } finally {
    // 사용이 끝난 connection을 pool에 돌려줌
    if (conn) conn.release();
  }
};

// 등록
const insertUser = async (userInfo) => {
  // userInfo: [user_id, user_pwd, user_name, user_gender, user_age, join_date]
  let conn = null;
  try {
    conn = await pool.getConnection();
    let [result] = await conn.query(userSql.insertUser, userInfo);
    return result;
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.release();
  }
};

// 수정
const updateUser = async (userNo, updateDta) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // beginTransaction()를 사용하면 Auto Commit이 해제
    let [result] = await conn.query(userSql.updateUser, [updateDta, userNo]); // [SET의 ?, WHERE의 ?] users.js의 순서 중요
    // 추가 DML 실행 => 같은 트랜잭션으로 묶임
    conn.commit();
    return result;
  } catch (err) {
    console.log(err);
    conn.rollback();
  } finally {
    if (conn) conn.release();
  }
};

// 삭제
const deleteUser = () => {};

module.exports = {
  selectAllUser,
  selectUserByNo,
  insertUser,
  updateUser,
  deleteUser,
};
