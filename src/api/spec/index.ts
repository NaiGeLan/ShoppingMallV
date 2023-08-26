import request from "@/utils/request";

/**
 * 获取分类列表
 *
 */
export function getSpecListApi(data: any) {
  console.log(data);

  return request({
    url: "/prod/spec/page",
    method: "get",
    params: data,
  });
}

/**
 * 获取分类列表
 *
 */
export function getGroupInfoApi(groupId: any) {
  // console.log(data);

  return request({
    url: "/prod/prodTag/info/" + groupId,
    method: "get",
  });
}

/**
 * 获取分类列表
 *
 */
export function specApi(method: any, data: any) {
  // console.log(data);

  return request({
    url: "/prod/spec",
    method: method,
    data,
  });
}

/**
 * 获取分类列表
 *
 */
export function specDelApi(data: any) {
  console.log(data);

  return request({
    url: "/prod/spec/" + data,
    method: "delete",
  });
}
