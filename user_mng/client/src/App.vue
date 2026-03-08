<script setup>
// vue-router 라이브러리에서 라우팅에 필수적인 두 가지 도구를 가져옵니다.
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="container">
    <header>
      <p><RouterLink to="/user/list">전체회원</RouterLink></p>
    </header>

    <main>
      <RouterView />
    </main>

    <footer></footer>
  </div>
</template>

<style scoped>
/* 전체 레이아웃의 디자인 요소(예: 중앙 정렬, 최대 너비 등)를 여기에 작성하면 됩니다. 
*/
</style>
