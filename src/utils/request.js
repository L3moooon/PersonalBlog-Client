import axios from "axios";
import { ElMessage } from "element-plus";
// import useUserStore from "@/store/modules/user.js";
//创建axios实例

const BASE_API = 'http://localhost:3001'
let request = axios.create({
  baseURL: BASE_API,
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  //获取用户相关的小仓库，获取token，登录成功以后携带给服务器
  // const userStore = useUserStore();

  // if (userStore.token) {
  //   config.headers.token = userStore.token;
  // }
  //config配置对象，headers请求头，经常给服务器端携带公共参数
  //返回配置对象
  return config;
});

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let message = "";
    let status = error.response;
    switch (status) {
      case 401:
        message = "TOKEN过期";
        break;
      case 403:
        message = "无权访问";
        break;
      case 404:
        message = "请求地址错误";
        break;
      case 500:
        message = "服务器错误";
        break;
      default:
        message = "网络出现问题";
        break;
    }
    ElMessage({
      type: "error",
      message,
    });
    return Promise.reject(error);
  }
);

export default request;
