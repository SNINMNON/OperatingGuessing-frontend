<template>
    <div style="text-align:center">
        <label for="rarity">选择稀有度：</label>
        <select v-model="rarity">
            <option value="0">任意</option>
            <option v-for="n in 6" :key="n" :value="n">{{ n }}星</option>
        </select>
        <button @click="start">开始猜测</button>
        <button @click="$emit('back')">返回首页</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { startGame } from '../../api.js';

const emit = defineEmits(['start', 'rarity', 'back']);
const rarity = ref('0');

async function start() {
    await startGame(rarity.value);
    emit('rarity', rarity.value);
    emit('start');
}
</script>