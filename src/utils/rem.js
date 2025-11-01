import { throttle } from "lodash";
// 基准大小
// const baseSize = 16;
// 设置 rem 函数
const setRem = () => {
	// const scale = document.documentElement.clientWidth / 1920;
	// let fontSize =
	//   baseSize * Math.min(scale, 2) > 12 ? baseSize * Math.min(scale, 2) : 12;
	// document.documentElement.style.fontSize = fontSize + "px";
	let designWidth, baseFontSize;
	const screenWidth = window.innerWidth;

	// 屏幕宽度 > 1024px 视为 PC 端
	if (screenWidth > 1024) {
		designWidth = 1920;
		baseFontSize = 16;
	} else {
		// 移动端
		designWidth = 750;
		baseFontSize = 8;
	}
	document.documentElement.style.fontSize =
		(screenWidth / designWidth) * baseFontSize + "px";
};
export const throttledSetRem = throttle(setRem, 200);
