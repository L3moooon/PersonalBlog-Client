// 当前网站版本（根据实际版本号修改）
const CURRENT_VERSION = "v0.8.0";
// 需要清理旧数据的最低版本（例如：v1.x 及以下的旧数据需清理）
const CLEAN_VERSION_THRESHOLD = "v0.5.0";

// 检查并清理旧 localStorage 数据
export function checkAndCleanLocalStorage() {
	// 读取本地存储的版本号（首次访问时为 null）
	const storedVersion = localStorage.getItem("app_version");
	// 情况1：无版本记录（旧版本用户，未记录版本）→ 清理
	// 情况2：本地版本低于需要清理的阈值 → 清理
	if (
		!storedVersion ||
		isVersionLower(storedVersion, CLEAN_VERSION_THRESHOLD)
	) {
		console.log("检测到旧版本数据，开始清理...");

		// 方案A：清除所有旧数据（适用于整体重构，旧数据全部无用）
		localStorage.clear();

		// 方案B：清除指定的旧键（适用于部分数据结构变更，保留有用数据）
		// const oldKeys = ["user_info_v1", "config_old", "cache_v1"]; // 需要清理的旧键
		// oldKeys.forEach(key => localStorage.removeItem(key));

		// 清理后，存储当前版本号（标记为已处理）
		localStorage.setItem("app_version", CURRENT_VERSION);
	} else if (storedVersion !== CURRENT_VERSION) {
		// 版本已更新但无需清理 → 仅更新版本号记录
		localStorage.setItem("app_version", CURRENT_VERSION);
	}
}

// 辅助函数：比较版本号（如 "v1.2.3" < "v2.0.0"）
function isVersionLower(version1, version2) {
	// 移除 "v" 前缀，分割为数字数组（如 ["1", "2", "3"]）
	const v1 = version1.replace(/^v/, "").split(".").map(Number);
	const v2 = version2.replace(/^v/, "").split(".").map(Number);

	// 逐位比较版本号
	for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
		const num1 = v1[i] || 0;
		const num2 = v2[i] || 0;
		if (num1 < num2) return true;
		if (num1 > num2) return false;
	}
	return false; // 版本相同
}
