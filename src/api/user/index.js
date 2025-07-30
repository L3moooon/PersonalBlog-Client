import request from "@/utils/request";
export const getUserInfo = () => {
  return request({
    url: '/web/user/info',
    method: 'post'
  })
}