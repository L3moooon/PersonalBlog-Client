import request from "@/utils/request";
export const getWebsiteInfo = () => {
  return request({
    url: '/website/info',
    method: 'post'
  })
}