// 日期格式化工具函数
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';

  // 处理字符串类型日期
  const targetDate = typeof date === 'string' ? new Date(date) : date;

  // 日期无效时返回原始值
  if (isNaN(targetDate.getTime())) return date;

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  // 简单格式化逻辑（可根据需要扩展）
  if (format === 'YYYY-MM-DD') {
    return targetDate.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  }

  // 完整格式
  return targetDate.toLocaleString('zh-CN', options).replace(/\//g, '-');
};

// 定义日期指令
export default {
  mounted(el, binding) {
    const date = binding.value;
    const format = binding.arg || 'YYYY-MM-DD HH:mm:ss';
    el.textContent = formatDate(date, format);
  },
  updated(el, binding) {
    // 与mounted逻辑一致，确保数据更新时重新格式化
    const date = binding.value;
    const format = binding.arg || 'YYYY-MM-DD HH:mm:ss';
    el.textContent = formatDate(date, format);
  }
};
