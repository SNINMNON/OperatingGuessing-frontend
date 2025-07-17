<template>
    <NFlex>
        <InputOp @select="onSelect" />
        <NButton type="primary" @click="onRestart">重新开始</NButton>
        <NButton secondary @click="$emit('back')">返回</NButton>
    </NFlex>
    <NFlex vertical align="center">
        <NFlex>
            <NText>红/黄/绿：错误/接近/正确；</NText>
            <NText>→/↑代表谜底干员的时间更晚/星级更高</NText>
            <NText>当前星级：{{showRarity()}}</NText>
        </NFlex>
        <GuessTable :guesses="guesses" />
    </NFlex>
</template>

<script setup>
import { ref } from 'vue';
import { guessName, startGame } from '../../api.js';
import InputOp from '../InputOp.vue';
import GuessTable from '../GuessTable.vue';
import { NFlex, NButton, NText } from 'naive-ui';


const guesses = ref([]);
const props = defineProps(['rarity']);

defineEmits(['back']);


async function onSelect(name) {
    const result = await guessName(name);
    if (result.error) return alert(result.error);
    
    guesses.value.push(result);
}

async function onRestart() {
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
