<template>
    <div>
        <label for="rarity">选择稀有度：</label>
        <select v-model="rarity">
            <option value="0">任意</option>
            <option v-for="n in 6" :key="n" :value="n">{{ n }}星</option>
        </select>
    </div>
    <div>
        <button @click="start">开始猜测</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { startGame } from '../api.js';

const emit = defineEmits(['start']);
const rarity = ref('0');

async function start() {
    await startGame(rarity.value);
    emit('start');
}
</script>