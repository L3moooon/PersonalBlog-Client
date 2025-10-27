import { throttle } from "lodash";
// 基准大小
const baseSize = 16;
// 设置 rem 函数
function setRem() {
  // const scale = document.documentElement.clientWidth / 1920;
  // let fontSize =
  //   baseSize * Math.min(scale, 2) > 12 ? baseSize * Math.min(scale, 2) : 12;
  // document.documentElement.style.fontSize = fontSize + "px";
  let designWidth, baseFontSize;
  const screenWidth = window.innerWidth;

  // 屏幕宽度 > 1024px 视为 PC 端，使用 1920px 设计稿
  if (screenWidth > 1024) {
    designWidth = 1920;
    baseFontSize = 16; // 1920/10 = 192px（1rem = 192px 设计稿尺寸）
  } else {
    // 移动端使用 750px 设计稿
    designWidth = 750;
    baseFontSize = 8;
  }
  document.documentElement.style.fontSize =
    (screenWidth / designWidth) * baseFontSize + "px";
}
//初始化
setRem();
const throttledSetRem = throttle(setRem, 200);
//改变窗口大小时重新设置 rem,这里最好加上节流
window.onresize = throttledSetRem;
