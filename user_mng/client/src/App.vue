<script setup>
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

<style scoped></style>
