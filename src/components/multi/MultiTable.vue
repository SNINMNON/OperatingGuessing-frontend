<template>
	<NFlex class="guess-tables-flex" :wrap="false">
		<div class="table-wrapper">
			<NCard size="small" :bordered="false">
				<template #header>
					<NText strong>我的猜测</NText>
				</template>
				<GuessTable :guesses="socket.selfGuesses" :show-comparison-only="false" />
			</NCard>
		</div>
		<div class="table-wrapper">
			<NCard size="small" :bordered="false">
				<template #header>
					<NText strong>对手猜测</NText>
				</template>
				<GuessTable :guesses="opponentGuesses" :show-comparison-only="showComparisonOnly" />
			</NCard>
		</div>
	</NFlex>
</template>


<script setup>
import { computed, ref } from 'vue';
import { NFlex, NCard, NText } from 'naive-ui';
import GuessTable from '../GuessTable.vue';
import { useWebSocketStore } from './websocket'

const socket = useWebSocketStore()

const opponentGuesses = computed(() => assembleOpponentGuesses())
const showComparisonOnly = ref(true);

function assembleOpponentGuesses() {
	if (socket.opponentOp.length === 0) {
		return socket.opponentCmp
	} else {
		showComparisonOnly.value = false;
		let guesses = [];
		for (let i = 0; i < socket.opponentOp.length; i++) {
			guesses.push({
				guess: socket.opponentOp[i],
				comparison: socket.opponentCmp[i].comparison
			});
		}
		return guesses
	}
}
</script>

<style scoped>
.n-card {
    text-align: center;
}
.guess-tables-flex {
	width: 100%;
}

.table-wrapper {
	flex: 1;
	min-width: 250px;
}

/* 手机端垂直排列 */
@media screen and (max-width: 768px) {
	.guess-tables-flex {
		flex-direction: column !important;
		gap: 16px !important;
	}

	.table-wrapper {
		width: 100%;
		min-width: auto;
	}
}
</style>
