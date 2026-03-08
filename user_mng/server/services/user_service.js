// ==========================================
// 1. Mapper(DB 접근 계층) 호출 영역
// ==========================================
// 왜 서비스 파일이 필요한가?
// 라우터(Router)는 HTTP 요청/응답(req, res)만 신경 쓰고,
// 매퍼(Mapper)는 SQL 쿼리문만 신경 쓰게 하기 위해서입니다.
// 서비스(Service)는 그 사이에서 클라이언트가 보낸 데이터를 DB가 좋아하는 형태로 가공하거나,
// DB에서 온 투박한 데이터를 클라이언트가 보기 좋게 예쁘게 포장하는 '비즈니스 로직'을 전담합니다.
const userMapper = require("../database/mappers/user_mapper");

// [전체 회원조회]
const findAll = async () => {
  // DB에서 유저 목록을 가져올 때까지 대기(await)한 후, 그대로 라우터로 반환합니다.
  let list = await userMapper.selectAllUser();
  return list;
};

// [회원 상세조회]
const findInfoByNo = async (userNo) => {
  // 특정 유저 번호(userNo)를 매퍼에 전달하여 1명의 정보만 가져옵니다.
  let info = await userMapper.selectUserByNo(userNo);
  return info;
};

// [회원 등록]
const createInfo = async (userObj) => {
  // 1. 객체 => 배열 변환 (데이터 가공)
  // 1-1. '구조 분해 할당(Destructuring)' 문법
  // 클라이언트가 보낸 통짜 객체(userObj)에서 필요한 속성만 쏙쏙 뽑아내는 아주 유용한 ES6 문법입니다.
  const { user_id, user_pwd, user_name, user_gender, user_age, join_date } =
    userObj;

  // 1-2. 해당 값을 이용해 배열로 생성
  // 왜 굳이 배열로 만드나요?
  // Node.js에서 DB(주로 MySQL)에 데이터를 넣을 때, SQL 쿼리의 '?'(바인딩 변수) 자리에
  // 값을 매핑하기 위해서는 데이터를 배열 형태로 넘겨주어야 하기 때문입니다. (SQL 인젝션 해킹 방지 효과도 있음)
  let insertData = [
    user_id,
    user_pwd,
    user_name,
    user_gender,
    user_age,
    join_date,
  ];

  // 2. Mapper를 실행하여 DB에 실제 INSERT (시간이 걸리므로 await)
  let result = await userMapper.insertUser(insertData);

  // 3. 결과를 처리 (클라이언트에게 친절한 응답 만들기)
  // DB에서 INSERT를 성공하면 새롭게 생성된 데이터의 PK(Primary Key) 값을 insertId라는 변수에 담아 돌려줍니다.
  let resObj = {
    // 성공여부: 새롭게 생성된 ID가 0보다 크면 성공, 아니면 실패로 판단
    status: result.insertId > 0 ? "success" : "fail",
    // 프론트엔드에서 바로 새 유저의 번호를 활용할 수 있도록 돌려줍니다.
    user_no: result.insertId,
  };
  return resObj;
};

// [회원 정보 수정]
const modifyInfo = async (no, userInfo) => {
  // 유저 번호(no)와 수정할 내용(userInfo)을 DB에 넘겨 UPDATE 쿼리를 실행합니다.
  let result = await userMapper.updateUser(no, userInfo);

  let resObj = {
    // 성공 여부: DB에서 UPDATE를 실행했을 때 '실제로 변경된 행의 개수(changedRows)'가
    // 0보다 크면 무언가 수정되었다는 뜻이므로 true를 반환합니다.
    status: result.changedRows > 0,

    // 수정 정보 반환
    target: {
      user_no: no,
      // '스프레드 연산자(...)' 문법
      // userInfo 객체 안에 있는 키와 값들을 이 자리에 쫙 펼쳐서(복사해서) 넣어줍니다.
      // 일일이 user_name: userInfo.user_name 처럼 쓰지 않아도 돼서 매우 편리합니다.
      ...userInfo,
    },
  };

  return resObj;
};

// [회원 삭제]
const removeInfo = async (no) => {
  // 삭제할 대상의 번호를 매퍼에 전달하여 DELETE 쿼리를 실행합니다.
  let result = await userMapper.deleteUser(no);

  let resObj = {
    // 성공 여부: DELETE 쿼리가 실행되어 '영향을 받은 행의 개수(affectedRows)'가
    // 0보다 크면 실제로 데이터가 지워졌다는 뜻입니다.
    status: result.affectedRows > 0 ? "success" : "fail",
    target_no: no, // 어떤 번호가 지워졌는지 친절하게 알려줍니다.
  };

  return resObj;
};

// ==========================================
// 4. 모듈 내보내기
// ==========================================
// 위에서 만든 함수들을 객체로 묶어서 밖으로 내보냅니다.
// 그래야 user_router.js에서 require로 불러와서 사용할 수 있습니다.
module.exports = { findAll, findInfoByNo, createInfo, modifyInfo, removeInfo };
