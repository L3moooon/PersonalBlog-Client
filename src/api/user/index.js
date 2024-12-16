import request from "@/utils/request";
export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'post'
  })
}