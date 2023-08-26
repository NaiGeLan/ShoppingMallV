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
export const featureRoutes: RouteRecordRaw[] = [
  {
    path: "/prod",
    // component: prodManagement,
    redirect: "/prod/prod",
    meta: {
      title: "产品管理",
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
          title: "产品管理",
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
      {
        path: "comment",
        component: commentManagement,
        name: "comment",
        meta: {
          title: "评论管理",
          icon: "tree",
          hidden: false,
          keepAlive: true,
        },
      },
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
    redirect: "/mall/notice",
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
        path: "spot",
        component: classifyManagement,
        name: "spot",
        meta: {
          title: "自提点管理",
          icon: "role",
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
        component: groupManagement,
        name: "pics",
        meta: {
          title: "轮播图管理",
          icon: "menu",
          hidden: false,
          keepAlive: true,
        },
      },
      {
        path: "hot-search",
        component: commentManagement,
        name: "hot-search",
        meta: {
          title: "热搜管理",
          icon: "tree",
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

  // 外部链接
  // {
  //   path: "/external-link",
  //   component: Layout,
  //   children: [ {
  //       component: () => import("@/views/external-link/index.vue"),
  //       path: "https://www.cnblogs.com/haoxianrui/",
  //       meta: { title: "外部链接", icon: "link" },
  //     },
  //   ],
  // },
  // 多级嵌套路由
  /* {
         path: '/nested',
         component: Layout,
         redirect: '/nested/level1/level2',
         name: 'Nested',
         meta: {title: '多级菜单', icon: 'nested'},
         children: [
             {
                 path: 'level1',
                 component: () => import('@/views/nested/level1/index.vue'),
                 name: 'Level1',
                 meta: {title: '菜单一级'},
                 redirect: '/nested/level1/level2',
                 children: [
                     {
                         path: 'level2',
                         component: () => import('@/views/nested/level1/level2/index.vue'),
                         name: 'Level2',
                         meta: {title: '菜单二级'},
                         redirect: '/nested/level1/level2/level3',
                         children: [
                             {
                                 path: 'level3-1',
                                 component: () => import('@/views/nested/level1/level2/level3/index1.vue'),
                                 name: 'Level3-1',
                                 meta: {title: '菜单三级-1'}
                             },
                             {
                                 path: 'level3-2',
                                 component: () => import('@/views/nested/level1/level2/level3/index2.vue'),
                                 name: 'Level3-2',
                                 meta: {title: '菜单三级-2'}
                             }
                         ]
                     }
                 ]
             },
         ]
     }*/
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
