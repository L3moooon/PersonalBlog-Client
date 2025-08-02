import request from "@/utils/request";

//获取网站运转信息
export const getWebsiteInfo = () => {
  return request({
    url: '/web/website/info',
    method: 'post'
  })
}
//获取网站主题信息
export const getThemeInfo = () => {
  return request({
    url: '/web/website/theme',
    method: 'post'
  })
}