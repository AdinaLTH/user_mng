// ==========================================
// 1. Vue Router 모듈 불러오기
// ==========================================
import { createRouter, createWebHistory } from "vue-router";

// ==========================================
// 2. 라우터 객체 생성 및 설정
// ==========================================
const router = createRouter({
  // [history 설정]
  // createWebHistory는 브라우저의 기본 주소창 형태(예: domain.com/user/list)를
  // 쓰겠다는 의미입니다. (과거에는 주소에 #이 들어가는 Hash 모드를 많이 썼습니다.)
  history: createWebHistory(import.meta.env.BASE_URL),

  // [routes 배열] - ★가장 중요한 경로 규칙★
  routes: [
    {
      // 사용자가 이 주소로 들어오면
      path: "/user/list",
      // 이 경로의 별명을 'userList'로 부르기로 하고 (나중에 화면 이동할 때 이름으로 이동 가능)
      name: "userList",
      // ★ 지연 로딩 (Lazy Loading) ★
      // component: UserList 라고 바로 쓰지 않고, () => import(...) 함수 형태로 쓴 이유:
      // 처음 홈페이지에 접속했을 때 모든 화면 파일(js)을 다 다운받으면 로딩이 너무 느려집니다.
      // 이렇게 함수 형태로 적어두면, "사용자가 실제로 /user/list 주소에 접속했을 때만!"
      // UserList.vue 파일을 다운로드해서 보여주기 때문에 성능이 훨씬 좋아집니다.
      component: () => import("../views/UserList.vue"),
    },
    {
      // [동적 라우팅] 백엔드의 req.params.no 와 완벽하게 똑같은 개념입니다!
      // 콜론(:)이 붙은 :no는 고정된 글자가 아니라 '변수'입니다.
      // 즉, /user/info/1, /user/info/15 등으로 접속해도 모두 이 규칙을 탑니다.
      path: "/user/info/:no",
      name: "userInfo",
      component: () => import("../views/UserInfo.vue"),
    },
  ],
});

// ==========================================
// 3. 라우터 내보내기
// ==========================================
// 만들어진 규칙표를 밖으로 내보내야, 위에서 본 main.js가 이 규칙표를 가져다 쓸 수 있습니다.
export default router;
