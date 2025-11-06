<template>
	<dic class="container">
		<div class="title flex-center">友情链接</div>
		<div class="friends">
			<a
				v-for="person in friends"
				:href="person.url"
				target="_blank"
				class="person flex-vertical-center"
			>
				<div class="cover">
					<img
						:src="returnCompackUrl(person.cover)"
						alt=""
					/>
				</div>
				<div class="content">
					<div class="name">{{ person.name }}</div>
					<div class="desc">{{ person.introduce }}</div>
				</div>
			</a>
			<div
				class="empty-friends"
				v-if="friends.length === 0"
			>
				<div class="empty-icon">🔗</div>
				<div class="empty-text">暂无友情链接，快来申请成为第一个吧～</div>
			</div>
		</div>

		<div class="friend-link-form">
			<h2>申请友链</h2>
			<el-form
				:model="form"
				:rules="rules"
				ref="formRef"
				label-width="100px"
			>
				<el-form-item
					label="网站名称"
					prop="siteName"
				>
					<el-input
						v-model="form.siteName"
						placeholder="输入您网站的名称"
					/>
				</el-form-item>
				<el-form-item
					label="网站地址"
					prop="siteUrl"
				>
					<el-input
						v-model="form.siteUrl"
						placeholder="输入您网站的链接"
					/>
				</el-form-item>
				<el-form-item
					label="网站介绍"
					prop="siteDesc"
				>
					<el-input
						v-model="form.siteDesc"
						placeholder="简单介绍一下您的网站"
					/>
				</el-form-item>
				<el-form-item
					label="网站logo"
					prop="siteLogo"
				>
					<el-upload
						class="avatar-uploader"
						action=""
						:show-file-list="false"
						:http-request="handleUpload"
						:before-upload="beforeAvatarUpload"
					>
						<el-button type="primary">点击上传</el-button>
						<template #tip>
							<div class="el-upload__tip">jpg或png格式，500KB以内</div>
						</template>
					</el-upload>
				</el-form-item>
				<el-form-item
					label="电子邮箱"
					prop="email"
				>
					<el-input
						v-model="form.email"
						placeholder="审核结果会以邮件的方式通知您，请注意查收"
					/>
				</el-form-item>
				<el-form-item>
					<el-button
						type="primary"
						@click="submitForm"
						>提交申请</el-button
					>
				</el-form-item>
			</el-form>
		</div>
	</dic>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { returnCompackUrl } from "@/utils/url";
import { getAllLink, applyForLink } from "@/api/friendship";
const friends = ref([
	{
		id: "1",
		name: "杨间",
		url: "",
		introduce: "我要荡平这世间的所有恶鬼",
		cover: "default-cover.png",
		email: "",
	},
	{
		id: "2",
		name: "柳三",
		url: "",
		introduce: "这是我的一个纸人",
		cover: "default-cover.png",
		email: "",
	},
	{
		id: "3",
		name: "李军",
		url: "",
		introduce: "借个火",
		cover: "default-cover.png",
		email: "",
	},
	{
		id: "4",
		name: "周登",
		url: "",
		introduce: "电瓶车不错",
		cover: "default-cover.png",
		email: "",
	},
	{
		id: "5",
		name: "卫景",
		url: "",
		introduce: "调停只有一次",
		cover: "",
		email: "",
	},
	{ id: "6", name: "曹洋", url: "", introduce: "", cover: "", email: "" },
	{ id: "7", name: "陆志文", url: "", introduce: "", cover: "", email: "" },
	{ id: "8", name: "沈林", url: "", introduce: "", cover: "", email: "" },
	{ id: "9", name: "何银儿", url: "", introduce: "", cover: "", email: "" },
	{ id: "10", name: "王察林", url: "", introduce: "", cover: "", email: "" },
	{ id: "11", name: "张隼", url: "", introduce: "", cover: "", email: "" },
	{ id: "12", name: "李乐平", url: "", introduce: "", cover: "", email: "" },
]);
const formRef = ref(null);
const form = reactive({
	siteName: "",
	siteUrl: "",
	siteDesc: "",
	siteLogo: "",
	email: "",
});

const rules = {
	siteName: [{ required: true, message: "请输入网站名称", trigger: "blur" }],
	siteUrl: [
		{ required: true, message: "请输入网站地址", trigger: "blur" },
		{ type: "url", message: "请输入有效的网址", trigger: "blur" },
	],
	siteDesc: [{ required: true, message: "请输入网站介绍", trigger: "blur" }],
	siteLogo: [
		{ required: true, message: "请上传网站logo图片", trigger: "blur" },
		{ type: "url", message: "请输入有效的logo地址", trigger: "blur" },
	],
	email: [{ type: "email", message: "请输入有效的邮箱地址", trigger: "blur" }],
};

// 检查文件类型
const beforeAvatarUpload = (file) => {
	const isJPG = file.type === "image/jpeg";
	const isPNG = file.type === "image/png";
	const sizeLimit = file.size / 1024 < 500;
	if (!isJPG && !isPNG) {
		ElMessage.error("只能上传 JPG、PNG 格式的图片!");
		return false;
	}
	if (!sizeLimit) {
		ElMessage.error("上传图片大小不能超过 500KB!");
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
			form.siteUrl = data.url;
			//console.log(fileUrl.value);
			ElMessage.success("logo上传成功");
		} else {
			ElMessage.error("图片上传失败: " + (data.message || "未知错误"));
		}
	} catch (error) {
		ElMessage.error("图片上传失败:", error);
	}
};
const submitForm = () => {
	formRef.value.validate(async (valid) => {
		if (valid) {
			const { code, data } = await applyForLink({
				name: form.siteName,
				url: form.siteUrl,
				introduce: form.siteDesc,
				cover: form.siteLogo,
				email: form.email,
			});
			if (code == 1) {
				ElMessage.success("提交成功，等待审核");
			}
			// 可在此处重置表单：formRef.value.resetFields();
		} else {
			ElMessage.error("请完善表单信息后提交");
			return false;
		}
	});
};
const getList = async () => {
	const { code, data } = await getAllLink();
	if (code == 1) {
		friends.value = data;
	}
};
onMounted(() => {
	getList();
});
</script>

<style scoped>
.container {
	.title {
		font-size: 40px;
		margin: 40px 0;
	}
	.friends {
		width: 90%;
		min-height: 200px;
		padding: 20px;
		border: 1px solid #eee;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: 100px; /* 后续自动创建的行，均为100px */
		grid-template-rows: 100px;
		justify-content: center;

		gap: 10px;
		.person {
			border: 1px solid #dcdfe6;
			border-radius: 10px;
			padding: 0 10px;
			.cover {
				flex-shrink: 0;
				width: 60px;
				height: 60px;
				border-radius: 50%;
				overflow: hidden;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.content {
				margin-left: 10px;
				.name {
				}
				.desc {
					color: #a8abb2;
					margin-top: 10px;
					font-size: 14px;
					white-space: wrap;
				}
			}
		}
		.empty-friends {
			grid-column: 1 / -1;
			height: 200px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border: 1px dashed #e0e0e0;
			border-radius: 10px;
			color: #999;
			background-color: #fafafa;

			.empty-icon {
				font-size: 40px;
				margin-bottom: 15px;
				opacity: 0.7;
			}

			.empty-text {
				font-size: 16px;
				line-height: 1.5;
			}
		}
	}
}
.friend-link-form {
	width: 90%;
	margin: 20px auto;
	padding: 20px;
	border: 1px solid #eee;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.friend-link-form h2 {
	text-align: center;
	margin-bottom: 30px;
}
a {
	/* 去除下划线 */
	text-decoration: none;
	/* 继承父元素的文字颜色（避免默认蓝色） */
	color: inherit;
	/* 去除点击时的边框（部分浏览器） */
	outline: none;
}

/* 可选：去除hover/focus/active状态的样式 */
a:hover,
a:focus,
a:active {
	text-decoration: none; /* 确保 hover 时也没有下划线 */
	color: inherit; /* 保持与正常状态一致的颜色 */
}
</style>
