import { tracker } from "@/main.js";
//按钮埋点
export default {
	mounted(el, binding) {
		// 点击事件触发埋点
		const handleClick = () => {
			tracker.trackElementClick("click", binding.value);
		};
		// 绑定点击事件
		el.addEventListener("click", handleClick);
		// 组件卸载时解绑事件（避免内存泄漏）
		el._trackClickHandler = handleClick;
	},
	unmounted(el) {
		if (el._trackClickHandler) {
			el.removeEventListener("click", el._trackClickHandler);
		}
	},
};
