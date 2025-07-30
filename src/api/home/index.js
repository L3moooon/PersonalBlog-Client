import request from "@/utils/request";
export const getHomeData = () => {
  return request({
    url: '/public/getAllArticle',
    method: 'post',
  })
}
export const getGitCalendar = (user) => {
  return request({
    url: `https://gh-calendar.rschristian.dev/user/${user}`,
    baseURL: '', // 这里将baseURL设为空字符串，这样会使用绝对路径
    method: 'get',
  })
}
export const getRandomPoem = () => {
  return request({
    url: 'https://v1.jinrishici.com/all.txt',
    baseURL: '', // 这里将baseURL设为空字符串，这样会使用绝对路径
    method: 'get',
  })
}