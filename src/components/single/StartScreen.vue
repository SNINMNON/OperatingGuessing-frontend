<template>
    <NFlex justify="center">
        <NSelect v-model:value="rarity" 
            filterable tag 
            :options="options" 
            placeholder="任意星级"
            size="large"
        />
        <NButton type="primary" size="large" @click="start">开始猜测</NButton>
        <NButton secondary size="large" @click="$emit('back')"> 返回 </NButton>
    </NFlex>
</template>

<script setup>
import { ref } from 'vue';
import { startGame } from '../../api.js';
import { NButton, NFlex, NSelect } from 'naive-ui';

const emit = defineEmits(['start', 'rarity', 'back']);
const rarity = ref(0);

const options = [
    { label: '任意星级', value: 0, style:"font-size: 16px;" },
    ...Array.from({ length: 6 }, (_, i) => ({ label: `${i + 1}星`, value: i + 1, style:"font-size: 16px;" }))
];

async function start() {
    await startGame(rarity.value);
    emit('rarity', rarity.value);
    emit('start');
}
</script>

<style scoped>

.n-select {
    width: 120px;
    height: 40px;
}

</style>