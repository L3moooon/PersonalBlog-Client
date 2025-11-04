import request from "@/utils/request";
//外部-获取github贡献日历
export const getGitCalendar = (user) => {
	return request({
		url: `https://gh-calendar.rschristian.dev/user/${user}`,
		baseURL: "", //
		method: "get",
	});
};
//外部-获取随机古诗句
export const getRandomPoem = () => {
	return request({
		url: "https://v1.jinrishici.com/all.txt",
		baseURL: "", // 这里将baseURL设为空字符串，这样会使用绝对路径
		method: "get",
	});
};
