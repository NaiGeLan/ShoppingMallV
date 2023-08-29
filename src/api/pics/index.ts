import request from "@/utils/request";

/**
 * 获取分类列表
 *
 */
export function getPicsApi(data: any) {
  console.log(data);

  return request({
    url: "/admin/indexImg/page",
    method: "get",
    params: data,
  });
}
