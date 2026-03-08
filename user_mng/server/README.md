계층형 구조로 작성함

Router Layer
클라이언트의 HTTP 요청을 받는 계층

Service Layer
비즈니스 로직을 구현하는 계층

Data Access Layer
DB와의 연결과 쿼리문을 다루는 계층

계층형 구조의 장점은

단일 책임 원칙에 따라 관심사를 분리 시켜 유지보수와 확장성에 큰 이점을 갖는다.
예를들어, 특정 에러가 발생했을 때 원인에 따라 해당하는 계층의 파일만 수정하면 되는식이다.

클라이언트(Vue): GET /users/5 요청!

app.js (서버 진입점): 요청을 확인하고 라우터로 보냄.

user_router.js (웨이터): URL 파라미터에서 5를 뽑아내고 서비스 호출.

user_service.js (주방장): 비즈니스 로직(데이터 가공/포장) 처리 후 매퍼 호출.

user_mapper.js & DAO.js (연결 통로): 커넥션 풀에서 DB 연결 통로를 하나 빌림.

users.js (주문서): 작성된 SQL 쿼리문(SELECT ... WHERE user_no = ?)을 DB에 날림.

응답: 결과를 역순으로 가져와 예쁘게 포장한 뒤 클라이언트에게 전송!
