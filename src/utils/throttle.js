export const throttle = (func, delay) => {
  let lastTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    // 如果当前时间与上次执行时间的间隔大于设定的延迟，则执行函数
    if (currentTime - lastTime > delay) {
      func.apply(this, args);
      lastTime = currentTime;
    }
  };
}