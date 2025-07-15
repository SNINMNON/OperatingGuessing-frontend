<template>
    <div style="text-align:center">
        <input v-model="query" 
            placeholder="输入干员名称..." 
            @input="onInput" 
            class="styled-input"/>
        <button @click="onRestart">重新开始</button>
        <button @click="$emit('back')">返回</button>
        <span style="white-space: pre;">红/黄/绿：错误/接近/正确；       →/↑代表谜底干员的时间更晚/星级更高;            当前星级：{{showRarity()}}</span>
        <SuggestList :suggestions="suggestions" @select="onSelect" />
        <GuessTable :guesses="guesses" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { suggestNames, guessName, startGame } from '../../api.js';
import SuggestList from '../SuggestList.vue';
import GuessTable from '../GuessTable.vue';

const query = ref('');
const suggestions = ref([]);
const guesses = ref([]);
const props = defineProps(['rarity']);

defineEmits(['back']);

async function onInput() {
    if (!query.value) {
        suggestions.value = [];
        return;
    }
    suggestions.value = await suggestNames(query.value);
}

async function onSelect(name) {
    query.value = '';
    suggestions.value = [];

    const result = await guessName(name);
    if (result.error) return alert(result.error);
    
    guesses.value.push(result);
}

async function onRestart() {
    query.value = '';
    suggestions.value = [];
    guesses.value = [];
    await startGame(props.rarity);
}

function showRarity() {
    if (props.rarity === '0') {
        return '任意';
    } else {
        return props.rarity;
    }
}
</script>
