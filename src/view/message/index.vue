<template>
	<div class="message-board">
		<!-- 留言列表 -->
		<div class="message-list">
			<div class="t1">留言板</div>
			<div
				class="message-item"
				v-for="(msg, index) in messages"
				:key="index"
			>
				<div class="msg-username">{{ msg.username }}</div>
				<div class="msg-content">{{ msg.content }}</div>
				<div
					class="msg-time"
					v-time="msg.time"
				></div>
			</div>
			<!-- 无留言提示 -->
			<div
				class="empty-tip"
				v-if="messages.length === 0"
			>
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
				class="input-content"
			/>
			<el-button
				type="primary"
				@click="submitMessage"
			>
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
const messages = ref([
	{
		username: "访客A",
		content: "这个网站的设计很有特色！",
		time: new Date("2025-11-01 10:30:00"),
	},
	{
		username: "开发者",
		content: "欢迎大家留言交流～",
		time: new Date("2025-11-02 15:20:00"),
	},
]);

// 新留言表单数据
const content = ref();

// 提交留言
const submitMessage = async () => {
	if (!newMsg.value.username || !newMsg.value.content) {
		ElMessage.error("昵称和内容不能为空");
		return;
	}
	const { code, data } = await addMessage({
		user_id: userStore.identify,
		content: content.value,
	});
	if (code == 1) {
		getList();
		ElMessage.success("留言提交成功！");
	}
	content.value = "";
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

.msg-time {
	font-size: 12px;
	color: #999;
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
