import request from "@/utils/request";

/**
 * 获取分类列表
 *
 */
export function getNoticeApi(data: any) {
  console.log(data);

  return request({
    url: "/shop/notice/page",
    method: "get",
    params: data,
  });
}

/**
 * 获取分类列表
 *
 */
export function noticeApi(method: any, data: any) {
  console.log(data);

  return request({
    url: "/shop/notice",
    method: method,
    data,
  });
}

/**
 * 获取分类列表
 *
 */
export function noticeDelApi(id) {
  return request({
    url: "/shop/notice/" + id,
    method: "delete",
  });
}

/**
 * 获取分类列表
 *
 */
export function getNoticeInfoApi(id) {
  return request({
    url: "/shop/notice/info/" + id,
    method: "get",
  });
}
