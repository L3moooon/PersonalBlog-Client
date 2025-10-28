function importAll(r) {
	r.keys().forEach(r);
	console.log(r);
}
// 自动导入svg文件
importAll(require.context("@/assets/svg", true, /\.svg$/));
