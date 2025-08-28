import request from "@/utils/request";
//获取网站主题信息
export const getThemeInfo = () => {
  return request({
    url: '/web/home/theme',
    method: 'post'
  })
}
//获取首页文章
export const getHomeData = () => {
  return request({
    url: '/web/home/getHomeArticle',
    method: 'post',
  })
}
//获取网站运转信息
export const getWebsiteInfo = () => {
  return request({
    url: '/web/home/info',
    method: 'post'
  })
}
//获取首页推荐文章
export const getRecommendArticle = () => {
  return request({
    url: '/web/home/getRecommendArticle',
    method: 'post'
  })
}
//外部-获取github贡献日历
export const getGitCalendar = (user) => {
  return request({
    url: `https://gh-calendar.rschristian.dev/user/${user}`,
    baseURL: '', //
    method: 'get',
  })
}
//外部-获取随机古诗句
export const getRandomPoem = () => {
  return request({
    url: 'https://v1.jinrishici.com/all.txt',
    baseURL: '', // 这里将baseURL设为空字符串，这样会使用绝对路径
    method: 'get',
  })
}

