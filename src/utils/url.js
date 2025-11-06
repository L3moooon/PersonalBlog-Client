//解决JS中 直接引入图片路径 或 拼接路径 无法被打包工具解析的问题
export const returnCompackUrl = (fileName) => {
	if (!fileName) return;
	// return new URL(urlString, import.meta.url);//vite
	return require(`@/assets/img/${fileName}`); //webpack
	// return require("@/assets/img/default-cover.png");
};
