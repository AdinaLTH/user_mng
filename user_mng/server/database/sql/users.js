// ==========================================
// SQL 쿼리문 관리 파일 (users.js)
// ==========================================

// [전체조회]
// 항상 일정한 순서로 보여주기 위해 PK인 user_no를 기준으로 정렬(ORDER BY)을 추가한 아주 좋은 습관입니다!
const selectAllUser = `
SELECT user_no
    , user_id
    , user_name
    , user_gender
    , user_age
    , join_date
FROM t_users
ORDER BY user_no`;

// [단건조회]
// 왜 WHERE 조건에 값을 직접 적지 않고 '?'(물음표)를 쓸까요? (Prepared Statement)
// 1. 보안: 사용자가 입력한 값을 쿼리문에 그대로 이어 붙이면 'SQL 인젝션'이라는 해킹 공격에 당할 수 있습니다.
// 2. 성능: DB가 쿼리 구조를 미리 분석해두고 값만 쏙쏙 바꿔 끼우기 때문에 훨씬 빠릅니다.
// 이 '?' 자리는 mapper 파일에서 넘겨주는 변수가 안전하게 채워줍니다.
const selectUserByNo = `
SELECT user_no
    , user_id
    , user_pwd
    , user_name
    , user_gender
    , user_age
    , join_date
FROM t_users
WHERE user_no = ?`;

// [등록]
// 컬럼 개수와 VALUES 안의 '?' 개수가 정확히 일치해야 합니다.
// service 계층에서 만들어 mapper로 넘겨준 [id, pwd, name, gender, age, date] 형태의 '배열'이
// 순서대로 '?' 자리에 쏙쏙 들어갑니다.
const insertUser = `
INSERT INTO t_users (
    user_id
    , user_pwd
    , user_name
    , user_gender
    , user_age
    , join_date)
VALUES(?,?,?,?,?,?)`;

// [수정] - ★ mysql2 모듈의 마법 ★
// 보통 SQL에서 수정은 'SET user_id = ?, user_pwd = ?' 처럼 수정할 컬럼을 다 명시해야 하지만,
// 우리가 사용 중인 mysql2 모듈은 'SET ?' 하나만 적어두고 객체(Object)를 넘길 수 있는 마법을 지원합니다.
// 작성하신 주석 내용이 정확합니다!
// mapper에서 넘겨준 { 'user_id': 'hong', 'user_pwd': '1234' } 객체를 모듈이 알아서
// `user_id` = 'hong', `user_pwd` = '1234' 형태의 SQL 문법으로 변환해서 넣어줍니다. 코드가 엄청 간결해지죠!
const updateUser = `
UPDATE t_users
SET ?
WHERE user_no = ?
`;

// [삭제] (비어있던 쿼리 완성)
// 특정 user_no를 기준으로 해당 행을 지웁니다.
const deleteUser = `
DELETE FROM t_users
WHERE user_no = ?
`;

// ==========================================
// 모듈 내보내기
// ==========================================
// 작성한 쿼리문들을 객체로 묶어서 내보냅니다.
// 이 파일은 user_mapper.js에서 require()로 불러와서 사용하게 됩니다.
module.exports = {
  selectAllUser,
  selectUserByNo,
  insertUser,
  updateUser,
  deleteUser,
};
