import { io } from "socket.io-client";

export default class WebSocketService {
	constructor() {
		this.socket = null; // 存储 socket.io 实例
		this.url = "/webWS";
		this.isConnected = false;
		this.callbacks = new Map(); // 存储事件回调
	}

	// 连接方法（支持指定命名空间）
	connect() {
		if (this.isConnected) return;
		// 创建 socket.io 实例（自动处理协议升级和重连）
		console.log("开始连接 Socket.io，目标地址：", this.url); // 新增日志
		this.socket = io(this.url, {
			reconnection: true, // 自动重连
			reconnectionAttempts: 5, // 重连次数
			reconnectionDelay: 1000, // 重连间隔
			reconnectionDelayMax: 5000, // 最大重连间隔
			timeout: 20000, // 连接超时时间
		});
		// 连接成功
		this.socket.on("connect", () => {
			console.log("Socket.io 连接成功（ID：", this.socket.id, "）");
			this.isConnected = true;
			this.trigger("open");
		});
		// 连接断开
		this.socket.on("disconnect", (reason) => {
			console.log("Socket.io 连接断开：", reason);
			this.isConnected = false;
			this.trigger("close", reason);
		});
		// 错误处理
		this.socket.on("error", (error) => {
			console.error("Socket.io 错误：", error);
			this.trigger("error", error);
		});

		// 接收消息（通用事件监听，转发给回调）
		this.socket.onAny((eventType, data) => {
			// 忽略 socket.io 内置事件（如 'connect' 'disconnect'）
			if (!["connect", "disconnect", "error"].includes(eventType)) {
				console.log(`收到事件 ${eventType}：`, data);
				this.trigger(eventType, data); // 触发对应事件的回调
			}
		});
	}

	// 发送消息（支持指定事件类型）
	emit(eventType, data) {
		if (!this.isConnected || !this.socket) {
			console.error("Socket 未连接，无法发送消息");
			return;
		}
		this.socket.emit(eventType, data); // 发送事件到后端
	}

	// 关闭连接
	close() {
		if (this.socket) {
			this.socket.disconnect(); // socket.io 断开方法
			this.socket = null;
			this.isConnected = false;
		}
	}

	// 注册事件回调
	on(eventType, callback) {
		this.callbacks.set(eventType, callback);
	}

	// 移除事件回调
	off(eventType) {
		this.callbacks.delete(eventType);
	}

	// 触发回调
	trigger(eventType, data) {
		const callback = this.callbacks.get(eventType);
		if (callback) {
			callback(data);
		}
	}
}
