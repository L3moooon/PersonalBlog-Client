export async function generateFingerprint() {
	let deviceId = localStorage.getItem("deviceId");
	if (!deviceId) {
		deviceId = Math.random().toString(36).slice(2, 12);
		localStorage.setItem("deviceId", deviceId);
	}
	return deviceId;
}
