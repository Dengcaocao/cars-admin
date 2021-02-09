import axios from "axios"
// 创建请求实例
const request = axios.create({
    baseURL: 'dev-api',
    timeout: 5000
})
// 拦截器
request.interceptors.request.use(config => {
    console.log('请求拦截')
    return config
},err => {
    console.log(err)
})
request.interceptors.response.use(res => {
    console.log('响应拦截')
    return res
},err => {
    console.log(err)
})
export default request