<template>
	<div class="slideshow">
		<el-scrollbar width="100%">
			<div class="top-title">GitHub贡献日历</div>
			<div class="content">
				<div class="middle">
					<div class="week">
						<span>日</span>
						<span>二</span>
						<span>四</span>
						<span>六</span>
					</div>
					<div id="git-calendar">
						<div
							v-for="item in gitContributions"
							:key="item.date"
							class="block"
							:style="{ backgroundColor: gitColor[item.intensity] }"
							@mouseover="moveInBlock($event, item)"
							@mouseleave="visible = false"
						>
							<div
								class="month"
								v-if="item.date.includes('-15')"
							>
								<span>{{ item.date.slice(5, 7) }}月</span>
							</div>
						</div>

						<el-tooltip
							placement="top"
							ref="tooltipRef"
							:visible="visible"
							:popper-options="tooltipOptions"
							:virtual-ref="blockRef"
							virtual-triggering
						>
							<template #content>
								<span
									>{{ tooltipContent.date }}&nbsp;{{ tooltipContent.count }}
									{{
										tooltipContent.count > 1 ? "contributions" : "contribution"
									}}
								</span>
							</template>
						</el-tooltip>
					</div>
				</div>
			</div>
			<div class="bottom">
				<div class="example">
					<span style="margin-right: 0.2rem">Less</span>
					<span
						v-for="i in 5"
						:key="i"
						:style="{ backgroundColor: gitColor[i - 1] }"
						class="example-block"
					></span>
					<span style="margin-left: 0.2rem; margin-right: 1rem">More</span>
				</div>
				<div class="commit-record">
					<div class="last-year">
						<span> 最近一年提交</span>
						<span>{{ commitRecord.LastYearCommit }}</span>
						<span>{{ commitRecord.YearTimeRange }}</span>
					</div>
					<div class="line"></div>
					<div class="last-month">
						<span>最近一月提交</span>
						<span>{{ commitRecord.LastMonthCommit }}</span>
						<span>{{ commitRecord.MonthTimeRange }}</span>
					</div>
					<div class="line"></div>
					<div class="last-week">
						<span>最近一周提交</span>
						<span>{{ commitRecord.LastWeekCommit }}</span>
						<span>{{ commitRecord.WeekTimeRange }}</span>
					</div>
				</div>
			</div>
		</el-scrollbar>
	</div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { getGitCalendar } from "@/api/external";

//tootip单例模式触发
const blockRef = ref();
const tooltipRef = ref();
const visible = ref(false);
const tooltipContent = ref();
const tooltipOptions = {
	modifiers: [
		{
			name: "computeStyles",
			options: {
				adaptive: false,
				enabled: false,
			},
		},
	],
};
//存储接口数据
const gitContributions = ref([]);
const gitColor = {
	0: "#ebedf0",
	1: "#dbedff",
	2: "#79b8ff",
	3: "#0366d6",
	4: "#044289",
};
const commitRecord = reactive({
	startMonth: Number,
	startDay: Number,
	LastYearCommit: Number,
	YearTimeRange: String,
	LastMonthCommit: Number,
	MonthTimeRange: String,
	LastWeekCommit: Number,
	WeekTimeRange: String,
});
const getCommitData = async () => {
	const data = await getGitCalendar("L3moooon");
	gitContributions.value = data.contributions.flat();
	console.log(gitContributions.value);
	commitRecord.startMonth = Number(gitContributions.value[0].date.slice(5, 7)); //月
	commitRecord.startDay = Number(gitContributions.value[0].date.slice(8, 10)); //日
	commitRecord.LastYearCommit = data.total;
	commitRecord.YearTimeRange =
		gitContributions.value[0].date +
		" ~ " +
		gitContributions.value[gitContributions.value.length - 1].date;
	let count = 0;
	const monthArr = gitContributions.value.slice(-30);
	commitRecord.MonthTimeRange =
		monthArr[0].date + " ~ " + monthArr[monthArr.length - 1].date;
	monthArr.forEach((item) => {
		count += item.count;
	});
	commitRecord.LastMonthCommit = count;
	count = 0;
	const weekArr = gitContributions.value.slice(-7);
	commitRecord.WeekTimeRange =
		weekArr[0].date + " ~ " + weekArr[weekArr.length - 1].date;
	gitContributions.value.slice(-7).forEach((item) => {
		count += item.count;
	});
	commitRecord.LastWeekCommit = count;
};

//移入block时记录相关信息，然后在tooltip展示
const moveInBlock = (e, item) => {
	blockRef.value = e.currentTarget;
	visible.value = true;
	tooltipContent.value = { ...item };
};
onMounted(() => {
	getCommitData();
});
</script>

<style lang="scss" scoped>
.slideshow {
	width: 100%;
	background-color: wheat;
	box-sizing: border-box;
	border-radius: 10px;
	position: relative;
	overflow-x: scroll;
	overflow-y: hidden;

	.top-title {
		color: #555555;
		font-weight: 700;
		margin: 8px 20px;
		margin-bottom: 30px;
		text-align: center;
	}
	.content {
		display: flex;
		flex-wrap: wrap;
		justify-items: center;
		justify-content: center;
		color: #a0a0a0;
		font-size: 8px;
		position: relative;

		.month {
			// text-align: center;
			// width: 700px;
			// margin: 6px 40px 6px 66px;
			span {
				display: inline-block;
				width: 24px;
			}
		}
		.middle {
			display: flex;
			.week {
				display: flex;
				flex-direction: column;
				justify-content: center;
				width: 20px;
				text-align: center;
				span:not(:nth-child(1)) {
					display: block;
					margin-top: 19px;
				}
			}
			#git-calendar {
				display: grid;
				grid-auto-flow: column;
				grid-template-columns: repeat(53, 12px);
				grid-template-rows: repeat(7, 12px);
				gap: 2px;
				border-radius: 10px;
				.month {
					position: absolute;
					top: -16px;
				}
			}
		}
	}
	.bottom {
		width: 100%;
		// height: 80px;
		.example {
			overflow: hidden;
			display: flex;
			justify-content: flex-end;
			width: 100%;
			font-size: 8px;
			color: #a0a0a0;
			line-height: 16px;
			margin-top: 10px;
			.example-block {
				display: inline-block;
				width: 12px;
				height: 12px;
				vertical-align: middle;
			}
		}
		.commit-record {
			width: 100%;
			height: 70px;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			.last-year,
			.last-month,
			.last-week {
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				align-items: center;
				font-weight: 500;
				color: #555555;
				font-size: 12px;
				span {
					margin-bottom: 8px;
				}
				span:nth-child(2) {
					font-size: 15px;
				}
			}
			.line {
				width: 2px;
				height: 30px;
				background-color: #222;
			}
		}
	}
}
.block {
	border-radius: 3px;
	transition: 0.5s;
}
.block:hover {
	border: 1px solid black;
}
</style>
