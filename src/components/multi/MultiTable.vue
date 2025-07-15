<template>
    <div class="split left">
        <div class="centered">
            <GuessTable
                :guesses="selfGuesses" />
        </div>
    </div>

    <div class="split right">
        <div class="centered">
            <GuessTable
                :guesses="opponentGuesses" />
            
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import GuessTable from '../GuessTable.vue';
import { 
    selfGuesses,
    opponentCmp, 
    opponentOp
} from './websocket';

const opponentGuesses = ref([]);
function assembleOpponentGuesses() {
    opponentGuesses.value = [];
    for (let i = 0; i < opponentCmp.value.length; i++) {
        const cmp = opponentCmp.value[i];
        if (opponentOp) {
            const op = opponentOp.value[i];
            opponentGuesses.value.push({
                comparison:cmp, guess: op
            })
        } else {
            opponentGuesses.value.push({ 
                comparison: cmp, guess: null
            })
        }
        
    }
}

</script>