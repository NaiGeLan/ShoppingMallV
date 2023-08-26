import request from "@/utils/request";

/**
 * 获取分类列表
 *
 */
export function getGroupListApi(data: any) {
  console.log(data);

  return request({
    url: "/prod/prodTag/page",
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
export function groupApi(method: any, data: any) {
  // console.log(data);

  return request({
    url: "/prod/prodTag",
    method: method,
    data,
  });
}

/**
 * 获取分类列表
 *
 */
export function groupDelApi(id) {
  // console.log(data);

  return request({
    url: "/prod/prodTag/" + id,
    method: "delete",
  });
}
