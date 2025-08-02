import request from "@/utils/request";
//获取文章内容
export const getArticle = (data) => {
  return request({
    url: '/web/article/getArticle',
    method: 'post',
    data
  })
}

//获取文章的评论
export const getComments = (data) => {
  return request({
    url: '/web/article/getComment',
    method: 'post',
    data
  })
}

//发表或回复评论
export const comment = (data) => {
  return request({
    url: '/web/article/comment',
    method: 'post',
    data
  })
}

//删除评论
export const delComment = (data) => {
  return request({
    url: '/web/article/delComment',
    method: 'post',
    data
  })
}