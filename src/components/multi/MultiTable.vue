<template>
    <div class="guess‑tables‑flex">
      <div class="table‑wrapper">
        <GuessTable :guesses="socket.selfGuesses" :show-comparison-only="false"/>
      </div>
      <div class="table‑wrapper">
        <GuessTable :guesses="opponentGuesses" :show-comparison-only="showComparisonOnly"/>
      </div>
    </div>
  </template>
  

<script setup>
import { computed, ref } from 'vue';
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
        //console.log(guesses);
        return guesses
    }
}
</script>

<style scoped>
.guess‑tables‑flex {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.table‑wrapper {
  flex: 1 1 calc(50% - 16px);
  min-width: 250px;
}

.table‑wrapper table {
  width: 100%;
  font-size: 12px;
}

.table‑wrapper th,
.table‑wrapper td {
  padding: 5px 6px;
  white-space: nowrap;
}
</style>

