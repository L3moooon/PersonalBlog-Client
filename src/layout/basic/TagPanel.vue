<template>
	<div class="tag">
		<div class="title flex-vertical-center">
			<SvgComponent
				icon="tag"
				className="icon"
			/>
			<div class="title-text">标签云</div>
			<SvgComponent
				v-if="tagStore.activatedTags.size > 0"
				@click="handleClearTags"
				icon="filter-clear"
				className="clear-icon"
			/>
		</div>
		<div class="tag-cloud">
			<div
				v-for="tag in tagsData"
				:key="tag.id"
				class="tag-item"
				:class="tagStore.activatedTags.has(tag.id) ? 'is-active' : ''"
				type="success"
				@click="handleShowArticlesByTag(tag.id)"
			>
				{{ tag.tag_name }}({{ tag.article_count }})
			</div>
		</div>
	</div>
</template>

<script setup>
import SvgComponent from "@/components/SvgComponent.vue";
import { ref, onMounted } from "vue";
import { getTagCloud } from "@/api/article";
import { useTagStore } from "@/store/tag";
const tagStore = useTagStore();

const tagsData = ref([]);
const handleShowArticlesByTag = (tagId) => {
	console.log("Selected tag ID:", tagId);
	tagStore.toggleTag(tagId);
};
const handleClearTags = () => {
	tagStore.clearTags();
};
onMounted(async () => {
	const res = await getTagCloud();
	tagsData.value = res.data;
	console.log(res.data, "tag cloud data");
	console.log(tagsData.value, "tagsData value");
});
</script>

<style lang="scss" scoped>
.tag {
	min-height: 80px;
	background: linear-gradient(135deg, #83a4d4, #b6fbff);
	opacity: 0.9;
	border-radius: 10px;
	overflow: hidden;
	padding: 10px 5px;
	margin-top: 20px;
	.title {
		margin-left: 5px;
	}
	.icon {
		width: 20px;
		height: 20px;
		animation: flip 3s linear infinite;
	}
	.title-text {
		font-weight: bold;
		padding-left: 8px;
	}
	.clear-icon {
		cursor: pointer;
		margin-left: auto;
		margin-right: 10px;
		// color: #702636;
		transition: 0.3s;

		&:hover {
			transform: scale(1.2);
			transition: 0.3s;
		}
	}
}
@keyframes flip {
	from {
		transform: rotateY(0deg);
	}
	to {
		transform: rotateY(360deg);
	}
}
.tag-cloud {
	margin-top: 10px;
}
.tag-item {
	display: inline-block;
	border-radius: 15px;
	padding: 5px 10px;
	margin: 5px;
	font-size: 14px;
	cursor: pointer;
	transition: 0.3s;
	background: #fadfbc;
	// background: linear-gradient(135deg, #4ca1af, #c4e0e5);
	// box-shadow: 2px 2px 5px #876a40;
}
.is-active {
	// background: #409eff;
	background: linear-gradient(135deg, #abdcff, #0396ff);
	color: #fff;
	transition: 0.3s;
}
</style>
