import request from "@/utils/request";

//获取所有友链信息
export const getAllLink = () => {
	return request({
		url: "/web/friendship/getAllLink",
		method: "get",
	});
};

//申请友链
export const applyForLink = (data) => {
	return request({
		url: "/web/friendship/applyForLink",
		method: "post",
		data,
	});
};
