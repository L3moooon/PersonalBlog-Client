<template>
	<div class="about-container">
		<div class="t1 flex-center">关于本站</div>
		<div class="description">
			没想到有一天也会做出一个属于自己的网站，目前虽然还有很多地方不完善，但我也在一点点的打磨
			<br />
			以下是一些站点信息，希望本站的一些设计和内容能对你有所启发
		</div>
		<div class="subtitle">1.提交记录</div>
		<GitCalendar />
		<div class="description">
			开发个人博客的想法起始于2024的12月，当时刚入行半年，无意间看到了别人的技术博客，整个网站效果做的非常精美。于是有了自己开发网站的想法。边学边做，最终在2025/8/25
			16:45上线了一个半成品，可以通过域名进行访问了，后面就是不断的完善和升级，与我一同成长
		</div>
		<!-- <GitContribution /> -->
		<div class="subtitle">2.后台地址</div>
		<div class="description">
			冷知识：本站也有后台=>
			<a
				href="http://admin.willisblog.cn"
				target="_blank"
				>时雨博客管理后台</a
			>
		</div>
		<div class="description">
			<strong>后台技术栈</strong>：Vue3/TS/Vite/TailwindCSS/ShadCN/Echarts
			<br />
			主要功能是前台的站点监控、文章发布、用户管理以及一些信息统计和展示
			<br />
			<strong>后端技术栈</strong>：NodeJS/Express/Sequelize/MySQL/Redis
			<br />
			目前后端的知识还比较浅薄，只掌握了使用Node编写基本的接口以及数据库和Redis的基本使用，后续我会尝试学习JAVA，再对整个项目的后端进行重构
		</div>
		<div class="subtitle">3.关于作者</div>
		<div>
			有疑问或者建议欢迎联系我1152818861@qq.com或者
			<a href="/message">留言</a>
		</div>
		<div class="subtitle">4.项目依赖</div>
		以下是根据项目Package.json自动生成的列表
		<div>
			<div class="dev-title">生产依赖 (dependencies)</div>
			<div class="block">
				<div
					class="item"
					v-for="(version, name) in deps"
					:key="name"
				>
					<div class="dev-name">{{ name }}</div>
					<div class="ver flex-center">{{ version }}</div>
				</div>
			</div>
			<div class="dev-title">开发依赖 (devDependencies)</div>
			<div class="block">
				<div
					class="item"
					v-for="(version, name) in devDeps"
					:key="name"
				>
					<div class="dev-name">{{ name }}</div>
					<div class="ver flex-center">{{ version }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import GitCalendar from "./GitCalendar.vue";
import packageJson from "../../../package.json";
// import GitContribution from "./GitContribution.vue";
const deps = packageJson.dependencies || {};
const devDeps = packageJson.devDependencies || {};
</script>

<style lang="scss" scoped>
.about-container {
	padding: 10px;
	.t1 {
		font-size: 24px;
		font-weight: bold;
		margin: 10px 0 20px 0;
	}
	.description {
		// text-indent: 32px;
		line-height: 22px;
		&:last-child {
			margin-bottom: 20px;
		}
	}
	.subtitle {
		font-size: 20px;
		font-weight: bold;
		margin: 10px 0;
	}
}
strong {
	font-weight: 400;
	// color: red;
	background-color: #79b8ff;
}
.dev-title {
	font-size: 16px;
	font-weight: bold;
	margin: 10px 0;
}
.block {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: repeat(auto-fill, 70px);
	gap: 5px;
	.item {
		background-color: antiquewhite;
		border: 1px solid #222;
		height: 70px;
		display: flex;
		flex-direction: column;
		.dev-name {
			margin-left: 5px;
			margin-top: 5px;
		}
		.ver {
			flex: 1;
		}
	}
}
</style>
