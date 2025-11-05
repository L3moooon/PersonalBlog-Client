import request from "@/utils/request";
//获取网站主题信息
export const getThemeInfo = () => {
	return request({
		url: "/web/home/theme",
		method: "post",
	});
};
//获取首页文章
export const getHomeData = (data) => {
	return request({
		url: "/web/home/getHomeArticle",
		method: "get",
		params: data,
	});
};
//获取网站运转信息
export const getWebsiteInfo = () => {
	return request({
		url: "/web/home/info",
		method: "post",
	});
};
//获取首页推荐文章
export const getRecommendArticle = () => {
	return request({
		url: "/web/home/getRecommendArticle",
		method: "post",
	});
};
//全局搜索
export const getSearchData = (params) => {
	return request({
		url: "/web/home/search",
		method: "get",
		params,
	});
};
