export async function generateFingerprint() {
  // 改为异步函数
  const features = [
    navigator.userAgent,
    navigator.hardwareConcurrency,
    navigator.deviceMemory,
    new Date().getTimezoneOffset(),
    screen.colorDepth,
    screen.pixelDepth,
    window.devicePixelRatio,
  ];

  const rawString = features.filter(Boolean).join("|");
  // 等待MD5哈希生成（注意：此处仍用MD5仅为示例，建议替换为SHA-1/SHA-256）
  const hash = await simpleMD5(rawString);
  return hash.substring(0, 10);
}

// 改为异步函数，处理digest的Promise
async function simpleMD5(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  // 改用SHA-1（兼容性更好且被支持），或SHA-256（更安全）
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
