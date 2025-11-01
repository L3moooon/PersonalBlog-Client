import request from "@/utils/request";
//发送访客信息
export const countVisited = (data) => {
	return request({
		url: "/web/user/visited",
		method: "post",
		data,
	});
};

export const sendTrackInfo = (data) => {
	return request({
		url: "/web/user/trackInfo",
		method: "post",
		data,
	});
};
