import request from "@/utils/request";

//获取所有留言
export const getAllMessage = () => {
	return request({
		url: "/web/message/getAllMessage",
		method: "get",
	});
};

//发表留言
export const addMessage = (data) => {
	return request({
		url: "/web/message/addMessage",
		method: "post",
		data,
	});
};
