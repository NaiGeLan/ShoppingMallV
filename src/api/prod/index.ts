import request from "@/utils/request";

/**
 * 获取商品列表
 *
 */
export function getProdListApi(data: any) {
  console.log(data);

  return request({
    url: "/prod/prod/page",
    method: "get",
    params: data,
  });
}

export function getTransportListApi(data: any) {
  return request({
    url: "/shop/transport/list",
    method: "get",
    params: data,
  });
}

export function getTransportInfoApi(transportId: any) {
  return request({
    url: "/shop/transport/info/" + transportId,
    method: "get",
  });
}

export function getTagListApi() {
  return request({
    url: "/prod/prodTag/listTagList",
    method: "get",
  });
}

export function getListCategoryApi() {
  return request({
    url: "/prod/category/listCategory",
    method: "get",
  });
}

export function getListSpecValueApi(prodId) {
  return request({
    url: "/prod/spec/listSpecValue/" + prodId,
    method: "get",
  });
}

export function getSpecListApi() {
  return request({
    url: "/prod/spec/list",
    method: "get",
  });
}

export function getListSpecMaxValueIdApi() {
  return request({
    url: "/prod/spec/listSpecMaxValueId",
    method: "get",
  });
}

export function getProdInfoApi(prodId) {
  return request({
    url: "/prod/prod/info/" + prodId,
    method: "get",
  });
}
// export function getListSpecMaxValueIdApi() {
//   return request({
//     url: "/prod/spec/listSpecValue",
//     method: "get",
//   });
// }
