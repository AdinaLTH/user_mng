import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/user/list",
      name: "userList",
      component: () => import("../views/UserList.vue"),
    },
    {
      path: "/user/info/:no", // params 이용
      name: "userInfo",
      component: () => import("../views/UserInfo.vue"),
    },
  ],
});

export default router;
