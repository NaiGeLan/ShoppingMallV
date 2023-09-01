import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layout/index.vue");
export const prodManagement = () => import("@/views/prodManagement/index.vue");
export const classifyManagement = () =>
  import("@/views/classifyManagement/index.vue");
export const groupManagement = () =>
  import("@/views/groupManagement/index.vue");
// 静态路由
export const commentManagement = () =>
  import("@/views/commentManagement/index.vue");
export const specificationManagement = () =>
  import("@/views/specificationManagement/index.vue");
export const noticeManagement = () =>
  import("@/views/noticeManagement/index.vue");
export const picsManagement = () => import("@/views/picsManagement/index.vue");
export const vipManagement = () => import("@/views/vipManagement/index.vue");
export const orderManagement = () =>
  import("@/views/orderManagement/index.vue");
export const featureRoutes: RouteRecordRaw[] = [
  {
    path: "/prod",
    // component: prodManagement,
    redirect: "/prod/prod",
    meta: {
      title: "商品管理",
      icon: "system",
      hidden: false,
      keepAlive: true,
    },
    children: [
      {
        path: "prod",
        component: prodManagement,
        name: "prod",
        meta: {
          title: "商品管理",
          icon: "user",
          hidden: false,
          keepAlive: true,
        },
      },
      {
        path: "classify",
        component: classifyManagement,
        name: "classify",
        meta: {
          title: "分类管理",
          icon: "role",
          hidden: false,
          keepAlive: true,
        },
      },
      {
        path: "menu",
        component: groupManagement,
        name: "Menu",
        meta: {
          title: "分组管理",
          icon: "menu",
          hidden: false,
          keepAlive: true,
        },
      },
      // {
      //   path: "comment",
      //   component: commentManagement,
      //   name: "comment",
      //   meta: {
      //     title: "评论管理",
      //     icon: "tree",
      //     hidden: false,
      //     keepAlive: true,
      //   },
      // },
      {
        path: "spec",
        component: specificationManagement,
        name: "spec",
        meta: {
          title: "规格管理",
          icon: "dict",
          hidden: false,
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/mall",
    // component: prodManagement,
    redirect: "/mall",
    meta: {
      title: "门店管理",
      icon: "system",
      hidden: false,
      keepAlive: true,
    },
    children: [
      {
        path: "notice",
        component: noticeManagement,
        name: "notice",
        meta: {
          title: "公告管理",
          icon: "user",
          hidden: false,
          keepAlive: true,
        },
      },
      {
        path: "fee",
        component: classifyManagement,
        name: "fee",
        meta: {
          title: "运费模版",
          icon: "role",
          hidden: false,
          keepAlive: true,
        },
      },
      {
        path: "pics",
        component: picsManagement,
        name: "pics",
        meta: {
          title: "轮播图管理",
          icon: "menu",
          hidden: false,
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/vip",
    redirect: "/vip",
    meta: {
      title: "会员管理",
      icon: "system",
      hidden: false,
      keepAlive: true,
    },
    children: [
      {
        path: "vip",
        component: vipManagement,
        name: "vip",
        meta: {
          title: "会员管理",
          icon: "user",
          hidden: false,
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/order",
    redirect: "/order",
    meta: {
      title: "订单管理",
      icon: "system",
      hidden: false,
      keepAlive: true,
    },
    children: [
      {
        path: "order",
        component: orderManagement,
        name: "order",
        meta: {
          title: "订单管理",
          icon: "user",
          hidden: false,
          keepAlive: true,
        },
      },
    ],
  },
];
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
        // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true },
      },
    ].concat(featureRoutes),
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes as RouteRecordRaw[],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
