import request from "@/utils/request";
//发送访客信息
export const sendUserInfo = (data) => {
  return request({
    url: '/web/visitor/visited',
    method: 'post',
    data
  })
}