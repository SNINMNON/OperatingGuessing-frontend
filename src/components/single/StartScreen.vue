<template>
    <NFlex justify="center">
        <NSelect v-model:value="rarity" 
            filterable tag 
            :options="options" 
            placeholder="任意星级"
            style="width: 120px;" 
        />
        <NButton type="primary" @click="start">开始猜测</NButton>
        <NButton secondary @click="$emit('back')"> 返回 </NButton>
    </NFlex>
</template>

<script setup>
import { ref } from 'vue';
import { startGame } from '../../api.js';
import { NButton, NFlex, NSelect } from 'naive-ui';

const emit = defineEmits(['start', 'rarity', 'back']);
const rarity = ref(0);

const options = [
    { label: '任意星级', value: 0 },
    ...Array.from({ length: 6 }, (_, i) => ({ label: `${i + 1}星`, value: i + 1 }))
];

async function start() {
    await startGame(rarity.value);
    emit('rarity', rarity.value);
    emit('start');
}
</script>
