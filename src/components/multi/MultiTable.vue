<template>
    <div class="guess‑tables‑flex">
      <div class="table‑wrapper">
        <GuessTable :guesses="selfGuesses" :show-comparison-only="false"/>
      </div>
      <div class="table‑wrapper">
        <GuessTable :guesses="opponentGuesses" :show-comparison-only="showComparisonOnly"/>
      </div>
    </div>
  </template>
  

<script setup>
import { computed, ref } from 'vue';
import GuessTable from '../GuessTable.vue';
import { 
    selfGuesses,
    opponentCmp, 
    opponentOp
} from './websocket';

const opponentGuesses = computed(() => assembleOpponentGuesses())
const showComparisonOnly = ref(true);

function assembleOpponentGuesses() {
    if (opponentOp.value.length === 0) {
        return opponentCmp.value
    } else {
        showComparisonOnly.value = false;
        let guesses = [];
        for (let i = 0; i < opponentOp.value.length; i++) {
            guesses.push({
                guess: opponentOp.value[i],
                comparison: opponentCmp.value[i].comparison
            });
        }
        console.log(guesses);
        return guesses
    }
}
</script>

<style scoped>
.guess‑tables‑flex {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.table‑wrapper {
  flex: 1 1 calc(50% - 1rem);
  min-width: 250px;
}

/* target your GuessTable: you could add a class on the component wrapper */
.table‑wrapper table {
  width: 100%;
  /* make text smaller */
  font-size: 0.75rem;
}
/* tighten up the cell padding too */
.table‑wrapper th,
.table‑wrapper td {
  padding: 0.3rem 0.4rem;
  white-space: nowrap; /* keep each cell on one line */
}
</style>

