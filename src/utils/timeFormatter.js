//iso格式时间转换
export const timeFormatter = (isoTime) => {
  const date = new Date(isoTime);
  // 转换为本地时间格式
  const formattedDate = date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    // hour12: false // 24小时制
  }).replace(/\//g, "-").replace(", ", " ");
  return formattedDate
}

export const timeFormatter2 = (isoTime) => {
  const date = new Date(isoTime);
  // 转换为本地时间格式
  const formattedDate = date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    // hour12: false // 24小时制
  }).replace(/\//g, "-").replace(", ", " ");
  return formattedDate
}

