<template>
    <div class="row">
        <h3>对手状态：{{ opponentStat }} </h3>
        <div style="width: 8%;"></div>
        <h3> 房间：{{ socket.roomId }} </h3>
        <div style="width: 12%;"></div>
        <button @click="$emit('back')">返回</button>
    </div>
    <div v-if="socket.roomStat.gameStarted === 1" style="text-align: center;">
        <input v-model="query" 
            placeholder="输入干员名称..." 
            @input="onInput" 
            class="styled-input"/>
        <SuggestList :suggestions="suggestions" @select="onSelect" />
    </div>
    <div v-if="socket.roomStat.gameStarted === 1 || socket.roomStat.gameStarted === 2">
        <MultiTable />
        <button v-if="socket.roomStat.gameStarted === 2" @click="socket.roomStat.gameStarted=0">关闭表格</button>
    </div>
    <div v-else style="text-align: center; margin-top: 1rem;">
        <button @click="switchReady" style="width: 20%;">{{readyText}}</button>
    </div>
</template>

<script setup>
import { onUnmounted, ref, computed } from 'vue'
import { suggestNames } from '../../api.js'
import SuggestList from '../SuggestList.vue'
import MultiTable from './MultiTable.vue'
import { useWebSocketStore } from './websocket'
const socket = useWebSocketStore()

const readyText = computed(() => socket.roomStat.ready ? '取消准备' : '准备')
const opponentStat = computed(() => {
    if (socket.roomStat.opponentJoined) {
        return socket.roomStat.opponentReady ? '已准备' : '未准备'
    } else {
        return '未加入'
    }
})
const query = ref('');
const suggestions = ref([]);

const emit = defineEmits(['back'])

async function switchReady() {
    if (socket.roomStat.ready) {
        await socket.sendMessage('unready')
    } else {
        await socket.sendMessage('ready')
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
    await socket.sendMessage('guess', { guess: name });
    query.value = '';
    suggestions.value = [];
}

onUnmounted(async () => {
    await socket.close();
})
</script>

<style scoped>
  .button-group {
    display: flex;
    gap: 31.5%; /* Adjust this value as needed */
    justify-content: center;
  }
</style>