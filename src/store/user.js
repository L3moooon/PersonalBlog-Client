import { defineStore } from "pinia";
import { countVisited, modifyInfo } from "@/api/user";

const ONEHOUR = 60 * 60 * 1000;
const nickname = JSON.parse(localStorage.getItem("user"))?.name;
const portrait = JSON.parse(localStorage.getItem("user"))?.portrait;
const lastLoginTime = JSON.parse(localStorage.getItem("user"))?.last_login_time;
const address = JSON.parse(localStorage.getItem("user"))?.address;
const identify = localStorage.getItem("deviceId");

export const useUserStore = defineStore("User", {
	state: () => {
		return {
			identify,
			nickname,
			portrait,
			lastLoginTime,
			address,
		};
	},
	actions: {
		//前端时间验证防止频繁发送请求
		checkUserInfo() {
			const now = new Date().getTime();
			//console.log(this.lastLoginTime);
			const last = this.lastLoginTime
				? new Date(this.lastLoginTime).getTime()
				: 0;
			//如果超过1小时未发送 或 从未发送过，则发送统计请求
			if (now - last > ONEHOUR) {
				this.getUserInfo();
			}
		},
		async getUserInfo() {
			const { data, status } = await countVisited({
				identify: this.identify,
				agent: navigator.userAgent,
			});
			if (status == 1) {
				localStorage.setItem("user", JSON.stringify(data));
				this.nickname = data.name;
				this.portrait = data.portrait;
				this.lastLoginTime = data.last_login_time;
				this.location = data.address;
			}
		},
		//修改信息
		async modifyUserInfo(name, portrait) {
			const { code } = await modifyInfo({
				id: this.identify,
				name,
				portrait,
			});
			if (code == 1) {
				this.nickname = name;
				this.portrait = portrait;
				localStorage.setItem(
					"user",
					JSON.stringify({
						name: this.nickname,
						portrait: this.portrait,
						lastLoginTime: this.lastLoginTime,
						address: this.address,
					})
				);

				ElMessage.success("修改成功");
			} else {
				ElMessage.error("修改失败，请稍后再试");
			}
		},
	},
});
