<template>
	<div class="message-board">
		<!-- 留言列表 -->
		<div class="message-list">
			<div class="t1">留言板</div>
			<div
				class="message-item flex"
				v-for="(msg, index) in messages"
				:key="index">
				<div class="portrait">
					<img
						:src="msg.portrait"
						alt="" />
				</div>
				<div class="detail">
					<div class="msg-username">{{ msg.name }}</div>

					<div class="msg-content">{{ msg.content }}</div>
					<div class="bottom flex">
						<div
							class="msg-time flex-center"
							v-time="msg.create_time"></div>
						<div class="msg-address flex-center">
							{{ getLocation(msg.address) }}
						</div>
					</div>
				</div>
			</div>
			<!-- 无留言提示 -->
			<div
				class="empty-tip"
				v-if="messages.length === 0">
				暂无留言，快来成为第一个留言的人吧～
			</div>
		</div>

		<!-- 留言表单 -->
		<div class="message-form">
			<el-input
				v-model="content"
				type="textarea"
				rows="3"
				placeholder="请输入留言内容"
				class="input-content" />
			<el-button
				type="primary"
				@click="submitMessage">
				提交留言
			</el-button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getAllMessage, addMessage } from "@/api/message";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
// 模拟留言数据（实际项目中可替换为接口请求）
const messages = ref([]);

// 新留言表单数据
const content = ref();

// 提交留言
const submitMessage = async () => {
	if (!content.value) {
		ElMessage.error("昵称和内容不能为空");
		return;
	}
	const { code, data } = await addMessage({
		user_id: userStore.identify,
		content: content.value,
	});
	if (code == 1) {
		messages.value = data;
		getList();
		ElMessage.success("留言提交成功！");
	}
	content.value = "";
};
const getLocation = (address) => {
	if (!address) return;
	console.log(address);

	const { country, province, city } = JSON.parse(address);
	if (city == "内网IP") return "湖北";
	else if (!country) return;
	else if (country == "中国") return "" + province + city;
	return country;
};
const getList = async () => {
	const { code, data } = await getAllMessage();
	if (code == 1) {
		messages.value = data;
	}
};
onMounted(() => {
	getList();
});
</script>

<style scoped>
.message-board {
	width: 90%;
	/* max-width: 600px; */
	margin: 20px auto;
	padding: 20px;
	border-radius: 8px;
	/* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
}

.message-list {
	margin-bottom: 20px;
}

.message-list .t1 {
	font-size: 40px;
	/* margin-bottom: 40px; */
	border-bottom: 1px solid #eee;
	padding-bottom: 40px;
}

.message-item {
	border-bottom: 1px dashed #eee;
	padding: 10px 0;
	.portrait {
		img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
		}
	}
	.detail {
		margin-left: 10px;
	}
}

.msg-username {
	font-weight: bold;
	color: #1f5a5c;
	margin-bottom: 5px;
}

.msg-content {
	line-height: 1.5;
	margin-bottom: 5px;
}
.bottom {
	margin-left: auto;
	font-size: 14px;
	color: #999;
}

.msg-address {
	margin-left: 10px;
}

.empty-tip {
	text-align: center;
	color: #999;
	padding: 20px 0;
}

.message-form .input-username {
	margin-bottom: 10px;
}

.message-form .input-content {
	margin-bottom: 10px;
}
</style>
