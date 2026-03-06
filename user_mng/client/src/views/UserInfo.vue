<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const selectNo = route.params.no;

import { ref, computed, onBeforeMount } from "vue";
const user = ref({});
const findByNo = async (userNo) => {
  // http://localhost:3000/users/1
  let info = await fetch(`/api/users/${userNo}`)
    .then((res) => res.json())
    .catch((err) => console.log(err));
  user.value = info;
};

onBeforeMount(() => {
  findByNo(selectNo);
});
</script>
<template>
  <div class="container text-center">
    <!-- 12칸 -->
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
