<script setup>
// Vue 3의 핵심 도구들을 가져옵니다.
// ref: 값이 바뀌면 화면도 같이 바뀌게(반응형) 만들어주는 마법사
// onBeforeMount: 화면이 그려지기 '직전'에 실행할 코드를 예약하는 타이머
// computed: 기존 데이터를 가공해서 새로운 값을 계산해두는 똑똑한 계산기
import { ref, onBeforeMount, computed } from "vue";

// [상태 관리]
// 빈 배열([])을 ref로 감싸서 반응형 데이터로 만듭니다.
// 나중에 서버에서 데이터를 받아와서 여기에 넣으면, Vue가 알아서 화면을 업데이트합니다!
const users = ref([]);

// [계산된 속성]
// users 배열의 길이(회원 수)를 계산합니다.
// computed를 쓰면 users 데이터가 변할 때만 다시 계산하므로 성능에 아주 좋습니다.
const count = computed(() => {
  return users.value.length; // ref로 선언한 변수는 script 안에서 항상 '.value'를 붙여야 접근할 수 있습니다.
});

// [API 호출 함수]
// 백엔드(http://localhost:3000/users -> 프록시를 통해 /api/users로 요청)에서 데이터를 가져옵니다.
const findAllList = async () => {
  // fetch API를 사용해 백엔드에 요청을 보냅니다. (이전에 만든 GET /users 라우터가 응답하겠죠!)
  let list = await fetch(`/api/users`)
    .then((res) => res.json()) // 받아온 JSON 텍스트를 자바스크립트 객체/배열로 변환합니다.
    .catch((err) => console.log(err)); // 에러가 나면 콘솔에 출력합니다.

  users.value = list; // 받아온 진짜 데이터를 반응형 변수에 쏙 집어넣습니다. (이 순간 화면이 그려집니다!)
};

// [데이터 가공 함수 (날짜 포맷)]
// DB에서 온 투박한 날짜(예: 2024-03-09T15:00:00.000Z)를 우리가 보기 편한 'yyyy-MM-dd' 형태로 예쁘게 다듬어줍니다.
const dateFormat = (dateVal) => {
  let newDate = new Date(dateVal);
  let year = newDate.getFullYear();
  // 월/일이 1자리 수일 때 앞에 '0'을 붙여주기 위한 아주 좋은 테크닉입니다. (예: 0+3 = 03)
  let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
  let day = ("0" + newDate.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

// [프로그래매틱 라우팅 (자바스크립트로 페이지 이동하기)]
import { useRouter } from "vue-router";
const router = useRouter(); // 라우터(안내원) 객체를 소환합니다.

// 특정 회원의 줄(<tr>)을 클릭했을 때 실행되는 함수입니다.
// <RouterLink>가 HTML 태그(버튼)를 클릭해서 이동하는 거라면,
// router.push()는 자바스크립트 코드 안에서 "택시 기사님, userInfo 화면으로 가주세요!" 하고 명령을 내리는 것입니다.
const goToDetail = (userNo) => {
  // router/index.js에서 이름(name)을 'userInfo'라고 지어둔 길로 이동하면서,
  // URL 파라미터(:no) 자리에 클릭한 사람의 번호(userNo)를 실어서 보냅니다.
  router.push({ name: "userInfo", params: { no: userNo } });
};

// [생명주기 훅 (Lifecycle Hook)]
// "Vue야, 이 화면 컴포넌트를 브라우저에 부착(Mount)하기 직전(Before)에 이 함수 좀 실행해줘!"
// 즉, 화면이 뜨기 전에 백엔드에서 미리 유저 목록을 싹 다 가져오라고 지시하는 곳입니다.
onBeforeMount(() => {
  findAllList();
});
</script>

<template>
  <div class="container">
    <table class="table text-center">
      <caption>
        Total:
        {{
          count
        }}
      </caption>
      <thead>
        <tr class="table-primary">
          <th>NO.</th>
          <th>아이디</th>
          <th>이름</th>
          <th>성별</th>
          <th>가입날짜</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="info in users" @click="goToDetail(info.user_no)">
          <td>{{ info.user_no }}</td>
          <td>{{ info.user_id }}</td>
          <td>{{ info.user_name }}</td>

          <td>{{ info.user_gender == "M" ? "남" : "여" }}</td>

          <td>{{ dateFormat(info.join_date) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
