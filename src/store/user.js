import { defineStore } from "pinia";
import { countVisited } from "@/api/user";

const STORAGE_KEY = "last_visit_stat";
const ONEHOUR = 60 * 60 * 1000;

const nickname = "游客 " + JSON.parse(localStorage.getItem("user"))?.name;
const portrait = JSON.parse(localStorage.getItem("user"))?.portrait;
export const useUserStore = defineStore("User", {
	state: () => {
		return {
			nickname: nickname,
			portrait: portrait,
		};
	},
	actions: {
		async checkUserInfo() {
			const NOW = new Date().getTime();
			// 获取检查上次发送时间
			const lastStats = JSON.parse(
				localStorage.getItem(STORAGE_KEY) || '{"time": 0}'
			);
			// 如果超过1小时未发送 或 从未发送过，则发送统计请求
			if (NOW - lastStats.time > ONEHOUR) {
				const identify = localStorage.getItem("deviceId");
				const { data, status } = await countVisited({
					identify,
					agent: navigator.userAgent,
				});
				if (status == 1) {
					localStorage.setItem(STORAGE_KEY, JSON.stringify({ time: NOW }));
					localStorage.setItem("user", JSON.stringify(data));
					this.nickname = data.name;
					this.portrait = data.portrait;
				}
			}
		},
		async modifyInfo(nickname, portrait) {
			const { status } = await modifyUserInfo({
				nickname,
				portrait,
			});
			if (status == 1) {
				this.nickname = nickname;
				this.portrait = portrait;
			}
		},
		getUserInfo() {},
	},
});
