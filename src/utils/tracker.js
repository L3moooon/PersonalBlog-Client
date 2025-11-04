//页面埋点
import { sendTrackInfo } from "@/api/user";

export default class Tracker {
	constructor() {
		this.pageStayTimer = null; // 页面停留计时器
		this.queue = []; // 批量上报队列
		this.batchSize = 10; // 批量上报阈值
		this.initEnv(); // 初始化环境信息
	}

	// 初始化环境信息（页面和按钮埋点共用）
	initEnv() {
		this.env = {
			url: window.location.href,
			referrer: document.referrer,
			browser: navigator.userAgent,
			screen: `${window.screen.width}x${window.screen.height}`,
			userId: localStorage.getItem("userId") || "anonymous",
			deviceId: localStorage.getItem("deviceId") || this.generateDeviceId(),
		};
	}

	// 生成设备唯一标识
	generateDeviceId() {
		const deviceId = Math.random().toString(36).slice(2, 12);
		localStorage.setItem("deviceId", deviceId);
		return deviceId;
	}

	// 页面级埋点：记录页面进入（开始计时）
	trackPageEnter(pageName) {
		const enterTime = Date.now();
		// 清除上一次的计时器（防止重复）
		if (this.pageStayTimer) clearTimeout(this.pageStayTimer);
		// 存储当前页面信息
		this.currentPage = { pageName, enterTime };
		// 上报页面加载事件
		this.report({
			type: "page_view",
			pageName,
			enterTime,
		});
	}

	// 页面级埋点：记录页面离开（计算停留时间）
	trackPageLeave() {
		if (!this.currentPage) return;
		const { pageName, enterTime } = this.currentPage;
		const leaveTime = Date.now();
		const stayTime = leaveTime - enterTime; // 停留时间（毫秒）
		// 上报页面离开事件
		this.report({
			type: "page_leave",
			pageName,
			enterTime,
			leaveTime,
			stayTime,
		});
		this.currentPage = null; // 重置当前页面
	}

	// 按钮级埋点：记录元素点击
	trackElementClick(eventName, info) {
		//console.log("eeeeee", eventName, info);
		this.report({
			type: "element_click",
			eventName,
			...info,
		});
	}

	// 统一上报方法（支持批量和立即上报）
	report(data, isImmediate = false) {
		const reportData = {
			...this.env,
			timestamp: Date.now(),
			...data,
		};
		this.queue.push(reportData);

		// 满足条件时立即上报
		if (isImmediate || this.queue.length >= this.batchSize) {
			this.send();
		} else if (!this.timer) {
			// 1秒内无新事件则批量上报
			this.timer = setTimeout(() => this.send(), 1000);
		}
	}

	// 发送上报请求
	send() {
		if (this.queue.length === 0) return;
		const data = this.queue.splice(0, this.batchSize);

		// 使用fetch上报（支持跨域，页面卸载时也能发送）
		// fetch(this.serverUrl, {
		// 	method: "POST",
		// 	headers: { "Content-Type": "application/json" },
		// 	body: JSON.stringify(data),
		// 	keepalive: true, // 关键：确保页面关闭时仍能上报
		// }).catch((err) => {
		// 	console.error("埋点上报失败:", err);
		// 	// 失败重试：将数据放回队列
		// 	this.queue.unshift(...data);
		// });

		// 使用axios上报
		sendTrackInfo({ data }).catch((err) => {
			console.error("埋点上报失败:", err);
			// 失败重试：将数据放回队列
			this.queue.unshift(...data);
		});
		clearTimeout(this.timer);
		this.timer = null;
	}
}
