<template>
	<div style="text-align:center" v-if="mode === 'choose'">
		<h1>猜干员 - 明日方舟</h1>
		<br />
		<button @click="mode = 'single'">单人模式</button>
		<br /> <br />
		<button @click="mode = 'multi'">双人模式</button>
		<br /> <br />
		<div class="row">
			<div style="font-size: 12px; margin: 0;">作者：SNINMNON</div>
			<a style="font-size: 12px; margin: 0;" href="https://github.com/SNINMNON/OperatorGuessing">Github 仓库</a>
		</div>
	</div>
	<div v-else-if="mode === 'single'">
		<SinglePlayerStart @back="mode = 'choose'" />
	</div>
	<div v-else-if="mode === 'multi'">
		<MultiPlayerStart @back="mode = 'choose'" />
	</div>
</template>

<script setup>
import { ref } from 'vue';
import SinglePlayerStart from './components/single/SinglePlayerStart.vue';
import MultiPlayerStart from './components/multi/MultiPlayerStart.vue';

const mode = ref('choose');

</script>

<style scoped>
button {
    width: 200px;
}
</style>
