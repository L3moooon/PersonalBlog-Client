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
//上传头像
export const upload = (data, onUploadProgress) => {
	return request({
		url: "/public/upload",
		method: "post",
		data,
		onUploadProgress,
	});
};
//更改用户信息
export const modifyInfo = (data) => {
	return request({
		url: "/web/user/modifyInfo",
		method: "post",
		data,
	});
};
