import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CaptchaResult, LoginData, LoginResult } from "./types";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(data: any): AxiosPromise<LoginResult> {
  const formData = new FormData();
  formData.append("userName", data.username);
  formData.append("passWord", data.password);
  // formData.append("verifyCodeKey", data.verifyCodeKey || "");
  // formData.append("verifyCode", data.verifyCode || "");
  return request({
    url: "/adminLogin",
    method: "post",
    data: formData,
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
  });
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: "/logOut",
    method: "post",
  });
}

/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: "/api/v1/auth/captcha",
    method: "get",
  });
}
