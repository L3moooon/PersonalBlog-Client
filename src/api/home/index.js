import request from "@/utils/request";
export const getHomeData = () => {
  return request({
    url: '/home/article',
    method: 'get',
  })
}