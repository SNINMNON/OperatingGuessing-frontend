<template>
    <div class="row">
        <button @click="$emit('back')" style="width: 10%;">返回</button>
        <h3>房间：{{ roomId }}</h3>
    </div>
    <div v-if="roomStat.gameStarted">
        <input v-model="query" 
            placeholder="输入干员名称..." 
            @input="onInput" 
            class="styled-input"/>
        <SuggestList :suggestions="suggestions" @select="onSelect" />
        <MultiTable />
    </div>
    <div v-else style="text-align: center; margin-top: 1rem;">
        <button @click="switchReady" style="width: 20%;">{{readyText}}</button>
    </div>
</template>

<script setup>
import { onUnmounted, ref, computed } from 'vue'
import {
    sendMessage, close, 
    roomId, roomStat,
} from './websocket'
import { suggestNames } from '../../api.js'
import SuggestList from '../SuggestList.vue'
import MultiTable from './MultiTable.vue'

const readyText = computed(() => roomStat.value.ready ? '取消准备' : '准备')
const query = ref('');
const suggestions = ref([]);

defineEmits(['back'])

async function switchReady() {
    if (roomStat.value.ready) {
        await sendMessage('unready')
        roomStat.value.ready = false
    } else {
        await sendMessage('ready')
        roomStat.value.ready = true
    }
}

async function onInput() {
    if (!query.value) {
        suggestions.value = [];
        return;
    }
    suggestions.value = await suggestNames(query.value);
}


async function onSelect(name) {
    await sendMessage('guess', { guess: name });
    query.value = '';
    suggestions.value = [];
}

onUnmounted(async () => {
    await close();
})
</script>