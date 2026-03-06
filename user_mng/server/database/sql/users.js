// table: t_users
// 전체조회
const selectAllUser = `
SELECT user_no
		, user_id
    , user_name
    , user_gender
    , user_age
    , join_date
FROM t_users
ORDER BY user_no`;

// 단건조회
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

// 등록
const insertUser = `
INSERT INTO t_users (
    user_id
    , user_pwd
    , user_name
    , user_gender
    , user_age
    , join_date)
VALUES(?,?,?,?,?,?)`; // 받아야 할 데이터가 여러 종류 = 배열로 받아야 함, 기본값을 가져야 함

// 수정
const updateUser = `
UPDATE t_users
SET ?
WHERE user_no = ?
`;
// 2개의 값을 가지는 배열, [ 객체, 기본값 ] 각각 첫번 째 물음표와 두번째 물음표
// {'user_id': 'hong', 'user_pwd': '1234'} | user_id = 'hong', user_pwd: '1234'

// 삭제
const deleteUser = ``;

module.exports = {
  selectAllUser,
  selectUserByNo,
  insertUser,
  updateUser,
  deleteUser,
};
