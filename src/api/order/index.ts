import request from "@/utils/request";

/**
 * 获取分类列表
 *
 */
export function getOrderApi(data: any) {
  console.log(data);

  return request({
    url: "/order/order/page",
    method: "get",
    params: data,
  });
}

export function getOrderInfoApi(orderNumber: any) {
  return request({
    url: "/order/order/orderInfo/" + orderNumber,
    method: "get",
  });
}
