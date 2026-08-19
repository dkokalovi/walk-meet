import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase.js";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Profile from "../views/Profile.vue";
import UserDetails from "../views/UserDetails.vue";
import Messages from "../views/Messages.vue";

const routes = [
  { path: "/", component: Home, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/user/:username", component: UserDetails, meta: { requiresAuth: true } },
  { path: "/messages", component: Messages, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    return "/login";
  }
  return true;
});

export default router;