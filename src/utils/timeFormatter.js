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

  console.log(formattedDate); // 输出: 2025-08-01 11:25:26
  return formattedDate
}

