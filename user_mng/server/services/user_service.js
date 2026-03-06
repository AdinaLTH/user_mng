// 사이트에서 제공하는 기능 => 비즈니스 로직
const userMapper = require("../database/mappers/user_mapper");

// 전체 회원조회
const findAll = async () => {
  let list = await userMapper.selectAllUser();
  return list;
};

// 회원 상세조회
const findInfoByNo = async (userNo) => {
  let info = await userMapper.selectUserByNo(userNo);
  return info;
};

// 회원 등록
const createInfo = async (userObj) => {
  // 1. 객체 => 배열 변환
  // 1-1. 객체에서 필요한 값만 가져오기
  const { user_id, user_pwd, user_name, user_gender, user_age, join_date } =
    userObj;
  // 1-2. 해당 값을 이용해 배열로 생성
  let insertData = [
    user_id,
    user_pwd,
    user_name,
    user_gender,
    user_age,
    join_date,
  ];

  // 2. Mapper를 실행
  let result = await userMapper.insertUser(insertData);

  // 3. 결과를 처리
  let resObj = {
    // 성공여부
    status: result.insertId > 0 ? "success" : "fail",
    // primary key(user_no) 반환
    user_no: result.insertId,
  };
  return resObj;
};
// 회원 정보 수정
const modifyInfo = async (no, userInfo) => {
  let result = await userMapper.updateUser(no, userInfo);

  let resObj = {
    // 성공
    status: result.changedRows > 0,
    // 수정 정보
    target: {
      user_no: no,
      ...userInfo,
    },
  };

  return resObj;
};
// 회원 삭제
const removeInfo = () => {};

module.exports = { findAll, findInfoByNo, createInfo, modifyInfo, removeInfo };
