<template>
	<NConfigProvider>
	<NMessageProvider>
		<div v-if="mode === 'choose'">
			<NFlex vertical align="center" style="padding: 32px;">
				<NH1>猜干员 - 明日方舟</NH1>
				<n-button type="primary" size="large" @click="mode = 'single'">
					单人模式
				</n-button>
				<n-button type="primary" size="large" @click="mode = 'multi'">
					双人模式
				</n-button>
				<NFlex>
					<NText depth="3" style="font-size: 12px;">作者：SNINMNON</NText>
					<NA href="https://github.com/SNINMNON/OperatorGuessing" style="font-size: 12px;">Github 仓库 </NA>
				</NFlex>
			</NFlex>
		</div>
		<div v-else-if="mode === 'single'">
			<SinglePlayerStart @back="mode = 'choose'" />
		</div>
		<div v-else-if="mode === 'multi'">
			<MultiPlayerStart @back="mode = 'choose'" />
		</div>
	</NMessageProvider>
	</NConfigProvider>
</template>

<script setup>
import { ref } from 'vue';
import SinglePlayerStart from './components/single/SinglePlayerStart.vue';
import MultiPlayerStart from './components/multi/MultiPlayerStart.vue';
import { NFlex, NButton, NConfigProvider, NH1, NText, NA, NMessageProvider } from 'naive-ui';

const mode = ref('choose');

</script>

