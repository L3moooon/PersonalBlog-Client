import request from "@/utils/request";
export const getHomeData = (data) => {
  return request({
    url: '/home',
    method: 'get',
    data,
  })
}