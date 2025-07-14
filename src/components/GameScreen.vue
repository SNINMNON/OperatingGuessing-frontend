<template>
    <div>
        
        <input v-model="query" placeholder="输入干员名称..." @input="onInput" class="styled-input"/>
        <button @click="$emit('back')">返回首页</button>
        <SuggestList :suggestions="suggestions" @select="onSelect" />
        <GuessTable :guesses="guesses" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { suggestNames, guessName } from '../api.js';
import SuggestList from './SuggestList.vue';
import GuessTable from './GuessTable.vue';

const query = ref('');
const suggestions = ref([]);
const guesses = ref([]);

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
</script>
