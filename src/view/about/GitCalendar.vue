<template>
	<div class="slideshow">
		<div class="top-title">GitHub贡献日历</div>
		<div class="content">
			<div class="month">
				<span
					v-for="i in 12"
					:key="i"
					>{{ gitMounth[(i + commitRecord.startMonth - 1) % 12] }}</span
				>
			</div>
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
					></div>
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
				<span style="margin-left: 0.2rem">More</span>
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
const gitMounth = [
	"十二月",
	"一月",
	"二月",
	"三月",
	"四月",
	"五月",
	"六月",
	"七月",
	"八月",
	"九月",
	"十月",
	"十一月",
];
const getCommitData = async () => {
	const data = await getGitCalendar("L3moooon");
	console.log(3333);
	gitContributions.value = data.contributions.flat();
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
	// //console.log(commitRecord);
};

//移入block时记录相关信息，然后在tooltip展示
const moveInBlock = (e, item) => {
	blockRef.value = e.currentTarget;
	visible.value = true;
	tooltipContent.value = { ...item };
};
onMounted(async () => {
	await getCommitData();
	const degree = commitRecord.startDay / 30;
	const month = document.getElementsByClassName("month")[0];
	month.style.marginLeft = 4.5 - 4.5 * degree + "rem";
});
</script>

<style lang="scss" scoped>
.slideshow {
	height: 250px;
	overflow: hidden;
	background-color: wheat;
	padding: 10px;
	border-radius: 10px;
	position: relative;
	.top-title {
		color: #555555;
		font-weight: 700;
		margin: 8px auto;
		text-align: center;
	}
	.content {
		display: flex;
		flex-wrap: wrap;
		justify-items: center;
		justify-content: center;
		color: #a0a0a0;
		font-size: 8px;
		.month {
			text-align: center;
			width: 700px;
			margin: 6px 40px 6px 66px;
			span {
				display: inline-block;
				width: 24px;
				margin: 0 17px;
			}
		}
		.middle {
			display: flex;
			.week {
				display: flex;
				flex-direction: column;
				justify-content: center;
				width: 32px;
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
			}
		}
	}
	.bottom {
		width: 100%;
		height: 80px;
		.example {
			position: absolute;
			right: 32px;
			bottom: 80px;
			font-size: 8px;
			color: #a0a0a0;
			line-height: 16px;
			.example-block {
				display: inline-block;
				width: 12px;
				height: 12px;
				vertical-align: middle;
			}
		}
		.commit-record {
			width: 100%;
			height: 90px;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			margin-top: 30px;
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
