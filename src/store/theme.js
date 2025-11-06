import { defineStore } from "pinia";
import { debounce } from "lodash";

const topFlag = JSON.parse(sessionStorage.getItem("TopScreenShow"));
const TopScreenShow = topFlag == undefined ? true : topFlag;

export const useThemeStore = defineStore("Theme", {
	state: () => {
		return {
			isDark: false, //页面主题
			TopScreenShow, // 顶部屏幕显示
			screenWidth: window.innerWidth,
			breakpoints: {
				mobile: 768,
				// tablet: 1024,
			},
		};
	},
	actions: {
		toggleTheme() {
			this.isDark = !this.isDark;
			document.documentElement.classList.toggle("dark", this.isDark);
		},
		setTopStatus(status) {
			this.TopScreenShow = status;
			sessionStorage.setItem("TopScreenShow", status);
		},
		// 是否为移动端
		isMobile() {
			return this.screenWidth < this.breakpoints.mobile;
		},
		// 是否为桌面端
		isDesktop() {
			return this.screenWidth >= this.breakpoints.mobile;
		},
		updateScreenWidth() {
			this.screenWidth = window.innerWidth;
		},
		listenResize() {
			const handleResize = debounce(() => {
				this.updateScreenWidth();
			}, 100);
			window.addEventListener("resize", handleResize);
			return () => {
				window.removeEventListener("resize", handleResize);
			};
		},
	},
});
