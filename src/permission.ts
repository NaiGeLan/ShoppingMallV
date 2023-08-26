import router from "@/router";
import { useUserStoreHook } from "@/store/modules/user";
import { usePermissionStoreHook } from "@/store/modules/permission";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false }); // 进度条

const permissionStore = usePermissionStoreHook();

// 白名单路由
const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const hasToken = localStorage.getItem("accessToken");
  console.log(hasToken);
  console.log(to);

  if (hasToken) {
    if (to.path === "/login") {
      // 如果已登录，跳转首页
      next({ path: "/" });
      NProgress.done();
    } else {
      // const userStore = useUserStoreHook();
      // const hasRoles = userStore.roles && userStore.roles.length > 0;
      // if (hasRoles) {
      //   // 未匹配到任何路由，跳转404
      //   if (to.matched.length === 0) {
      //     from.name ? next({ name: from.name }) : next("/404");
      //   } else {
      //     next();
      //   }
      // } else {
      //   await userStore.resetToken();
      //   next(`/login?redirect=${to.path}`);
      //   NProgress.done();
      // }
      console.log(to.matched.length);

      // console.log(next());
      next();
      // next(to.matched[to.matched.length - 1]);
    }
  } else {
    // 未登录可以访问白名单页面
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
