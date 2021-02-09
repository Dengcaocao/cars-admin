import request from "@/utils/request.js"
// 登录
export function Login(data) {
    return request({
        method: 'post',
        url: '/login/',
        data
    })
}
// 获取验证码
export function GetCode(data) {
    return request({
        method: "post",
        url: `/getCode/`,
        data
    })
}
// 注册
export function Register(data) {
    return request({
        method: 'post',
        url: '/register/',
        data
    })
}