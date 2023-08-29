import request from "@/utils/request";

/**
 * 获取分类列表
 *
 */
export function getVipsApi(data: any) {
  console.log(data);

  return request({
    url: "/admin/user/page",
    method: "get",
    params: data,
  });
}

/**
 * 获取分类列表
 *
 */
export function getVipInfoApi(userId: any) {
  return request({
    url: "/admin/user/info/" + userId,
    method: "get",
  });
}

export function vipApi(data: any, method: any) {
  return request({
    url: "/admin/user",
    method,
    data,
  });
}
