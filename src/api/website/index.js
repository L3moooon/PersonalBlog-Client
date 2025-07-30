import request from "@/utils/request";
export const getWebsiteInfo = () => {
  return request({
    url: '/web/website/info',
    method: 'post'
  })
}