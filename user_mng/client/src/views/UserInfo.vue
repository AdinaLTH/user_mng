<script setup>
// [라우트 파라미터 수신]
// ★ useRouter vs useRoute 비교 ★
// - useRouter: 페이지를 '이동'시킬 때 쓰는 조종대 (리모컨)
// - useRoute: '현재' 머물고 있는 페이지의 주소 정보나 넘어온 값을 꺼내볼 때 쓰는 정보창 (우편함)
import { useRoute } from "vue-router";
const route = useRoute();

// 이전 화면(UserList.vue)에서 router.push({ params: { no: 15 } }) 로 넘겨준
// 그 '15'라는 숫자를 여기서 꺼냅니다! (주소창의 /user/info/15 에서 15를 추출)
const selectNo = route.params.no;

import { ref, computed, onBeforeMount } from "vue";

// [상태 관리]
// UserList.vue에서는 여러 명이니까 배열([])을 썼지만,
// 여기서는 단 1명의 정보만 가져오니까 빈 객체({})로 초기화해 주는 센스! 아주 좋습니다.
const user = ref({});

// [API 호출 함수 (단건 조회)]
const findByNo = async (userNo) => {
  // 백엔드의 단건 조회 API (GET /users/:no)로 요청을 보냅니다.
  // 백틱(`)을 사용해서 URL 끝에 아까 꺼낸 회원 번호를 자연스럽게 붙여줍니다. (예: /api/users/15)
  let info = await fetch(`/api/users/${userNo}`)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  // DB에서 가져온 1명의 상세 정보 객체를 화면과 연결된 반응형 변수에 쏙 넣어줍니다.
  user.value = info;
};

// [생명주기 훅]
// 화면이 브라우저에 부착되기 직전에, 아까 URL에서 꺼내둔 번호(selectNo)를
// API 호출 함수에 넣어서 실행시킵니다.
onBeforeMount(() => {
  findByNo(selectNo);
});
</script>

<template>
  <div class="container text-center">
    <div class="row">
      <div class="col-4">No.</div>
      <div class="col-8">{{ user.user_no }}</div>
    </div>

    <div class="row">
      <div class="col-4">아이디</div>
      <div class="col-8">{{ user.user_id }}</div>
    </div>

    <div class="row">
      <div class="col-4">비밀번호</div>
      <div class="col-8">{{ user.user_pwd }}</div>
    </div>

    <div class="row">
      <div class="col-4">이름</div>
      <div class="col-8">{{ user.user_name }}</div>
    </div>

    <div class="row">
      <div class="col-4">성별</div>
      <div class="col-8">{{ user.user_gender == "M" ? "남" : "여" }}</div>
    </div>

    <div class="row">
      <div class="col-4">나이</div>
      <div class="col-8">{{ user.user_age }}</div>
    </div>

    <div class="row">
      <div class="col-4">가입일자</div>
      <div class="col-8">{{ user.join_date }}</div>
    </div>

    <div>
      <button class="btn btn-info-border">수정</button>
      <button class="btn btn-light">목록</button>
      <button class="btn btn-warning">삭제</button>
    </div>
  </div>
</template>

<style scoped>
/* 상세 페이지에 필요한 특별한 디자인이 있다면 여기에 추가합니다 */
</style>
