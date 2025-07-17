<template>
	<NFlex vertical align="center" style="padding: 32px;">
		<NH1>单人模式</NH1>
		<StartScreen v-if="screen === 'start'" 
			@start="screen = 'game'" 
			@rarity="receiveRarity" 
			@back="handleBack" 
		/>
		<GameScreen v-else @back="screen = 'start'" :rarity="rarity" />
	</NFlex>
</template>

<script setup>
import { ref } from 'vue';
import StartScreen from './StartScreen.vue';
import GameScreen from './GameScreen.vue';
import { NFlex, NH1 } from 'naive-ui';

const emit = defineEmits(['back']);

const screen = ref('start');
const rarity = ref(0);

function receiveRarity(value) {
	rarity.value = value;
}

function handleBack() {
	emit('back')
}
</script>