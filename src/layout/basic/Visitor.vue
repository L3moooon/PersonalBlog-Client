<template>
	<div class="author">
		<div
			class="info"
			@mousemove="cardTransform"
			@mouseleave="resetCardTransform"
		>
			<div class="img-container flex-center">
				<img
					ref="imgRef"
					:src="userStore.portrait || anonymous"
					id="card-img"
					class="card-img"
				/>
			</div>

			<div class="name flex-center">
				{{ userStore.nickname }}
				<SvgComponent
					@click="dialogVisible = true"
					icon="edit"
					className="icon"
				></SvgComponent>
			</div>
			<div class="greeting">
				{{ getGreeting() }}
				<span class="location">
					{{ computedLocation }}
				</span>
			</div>
		</div>
	</div>
	<el-dialog
		v-model="dialogVisible"
		title="修改个人信息"
		width="500"
		append-to-body
		:lock-scroll="false"
	>
		<div class="sub-title">修改头像</div>
		<el-upload
			class="avatar-uploader"
			action=""
			:show-file-list="false"
			:http-request="handleUpload"
			:before-upload="beforeAvatarUpload"
		>
			<img
				class="avatar-uploader-icon"
				v-if="fileUrl"
				:src="fileUrl"
			/>
			<el-icon
				v-else
				class="avatar-uploader-icon"
				><Plus
			/></el-icon>
		</el-upload>
		<div class="sub-title">修改昵称</div>
		<el-input
			placeholder="请输入新昵称"
			v-model="newName"
		></el-input>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button
					:disabled="!newName && !fileUrl"
					type="primary"
					@click="handleModifyUserInfo"
				>
					确认修改
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { throttle } from "lodash";
import { useUserStore } from "@/store/user";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { upload } from "@/api/user";
import anonymous from "@/assets/icons/personal.png";
import SvgComponent from "@/components/SvgComponent.vue";

const userStore = useUserStore();
const dialogVisible = ref(false);
const fileUrl = ref(null);
const newName = ref(null);

const imgRef = ref(null);

const computedLocation = computed(() => {
	const { country, province, city } = JSON.parse(userStore.address);
	if (city == "内网IP") return "，管理员";
	else if (!country) return;
	else if (country == "中国") return "，来自" + province + city + "的朋友";
	return "，来自" + country + "的朋友";
});

// 检查文件类型
const beforeAvatarUpload = (file) => {
	const isJPG = file.type === "image/jpeg";
	const isPNG = file.type === "image/png";
	const isGIF = file.type === "image/gif";
	const isLt1MB = file.size / 1024 / 1024 < 1;
	if (!isJPG && !isPNG && !isGIF) {
		ElMessage.error("只能上传 JPG、PNG 或 GIF 格式的图片!");
		return false;
	}
	if (!isLt1MB) {
		ElMessage.error("上传图片大小不能超过 1MB!");
		return false;
	}
	return true;
};

//上传头像
const handleUpload = async (e) => {
	try {
		const { file } = e;
		const formData = new FormData();
		formData.append("file", file);
		//console.log(file);
		const { data, status } = await upload(formData);
		if (status === 1) {
			fileUrl.value = data.url;
			//console.log(fileUrl.value);
			ElMessage.success("图片上传成功");
		} else {
			ElMessage.error("图片上传失败: " + (data.message || "未知错误"));
		}
	} catch (error) {
		ElMessage.error("图片上传失败:", error);
	}
};
const handleModifyUserInfo = async () => {
	userStore.modifyUserInfo(newName.value, fileUrl.value);
	dialogVisible.value = false;
};

function getGreeting() {
	const hour = new Date().getHours(); // 获取当前小时数（0-23）
	if (hour >= 5 && hour < 10) {
		return "早上好";
	} else if (hour >= 10 && hour < 12) {
		return "上午好";
	} else if (hour >= 12 && hour < 14) {
		return "中午好";
	} else if (hour >= 14 && hour < 18) {
		return "下午好";
	} else {
		return "晚上好";
	}
}
const cardTransform = (e) => {
	function changePos() {
		const degree = 0.4;
		const box = imgRef.value.getBoundingClientRect();
		//鼠标x位置-box的位置-box中心点x的位置
		let calcY = e.clientX - box.x - box.width / 2;
		let calcX = e.clientY - box.y - box.height / 2;
		calcX = calcX > 0 ? Math.min(calcX, 75) : Math.max(calcX, -75);
		calcY = calcY > 0 ? Math.min(calcY, 75) : Math.max(calcY, -75);
		imgRef.value.style.transform =
			"rotateY(" +
			calcY * degree +
			"deg) " +
			"rotateX(" +
			calcX * -degree +
			"deg) ";
	}
	window.requestAnimationFrame(throttle(changePos, 100));
};
const resetCardTransform = () => {
	window.requestAnimationFrame(function () {
		imgRef.value.style.transform = "rotateX(0) rotateY(0)";
	});
};
onMounted(() => {
	//console.log(userStore.nickname);
});
</script>

<style lang="scss" scoped>
.author {
	width: 100%;
	height: 186px;
	background: linear-gradient(135deg, #83a4d4, #b6fbff);
	opacity: 0.9;
	border-radius: 10px;
	overflow: hidden;
	margin-bottom: 16px;
	.info {
		overflow: hidden;
		.img-container {
			position: relative;
			.card-img {
				width: 96px;
				height: 96px;
				border-radius: 10px;
				margin: 16px auto;
				transition: 0.5s;
				transform-style: preserve-3d;
			}
		}
	}
	.name {
		height: 24px;
		font-size: 16px;
		text-align: center;
		overflow: hidden;
		.icon {
			cursor: pointer;
			margin: 0 0 2px 10px;
			width: 15px;
			height: 15px;
			&:hover {
				color: #55bddf;
				transform: scale(1.2);
			}
		}
	}
	.greeting {
		font-size: 13px;
		font-weight: 500;
		text-align: center;
		margin: 5px;
	}
}
.avatar-uploader-icon {
	width: 100px;
	height: 100px;
	border-radius: 10px;
	border: 1px solid #dcdfe6;
	margin-bottom: 10px;
}
.sub-title {
	margin-bottom: 10px;
}
</style>
