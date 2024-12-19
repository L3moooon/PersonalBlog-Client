import request from "@/utils/request";
export const getHomeData = () => {
  return request({
    url: '/home/article',
    method: 'get',
  })
}
export const getGitCalendar = (user) => {
  return request({
    url: `https://gh-calendar.rschristian.dev/user/${user}`,
    baseURL: '', // 这里将baseURL设为空字符串，这样会使用绝对路径
    method: 'get',
  })
}