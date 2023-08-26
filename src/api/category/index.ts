import request from "@/utils/request";

/**
 * 获取分类列表
 *
 */
export function getCategoryListApi(data: any) {
  console.log(data);

  return request({
    url: "/prod/category/table",
    method: "get",
    params: data,
  });
}

/**
 * 获取分类信息
 *
 */
export function getCategoryInfoApi(categoryId: any) {
  // console.log(data);

  return request({
    url: "/prod/category/info/" + categoryId,
    method: "get",
  });
}

/**
 * 获取分类信息
 *
 */
export function getListCategoryApi() {
  // console.log(data);

  return request({
    url: "/prod/category/listCategory",
    method: "get",
  });
}
