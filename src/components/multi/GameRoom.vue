<template>
    <div class="row">
        <h3>对手状态：{{ opponentStat }} </h3>
        <div class="spacer-small"></div>
        <h3> 房间：{{ socket.roomId }} </h3>
        <div class="spacer-large"></div>
        <button @click="closeTable; $emit('back')">返回</button>
    </div>
    <div v-if="socket.roomStat.gameStarted === 1" style="text-align: center;">
        <InputOp @select="onSelect" />
    </div>
    <div v-if="socket.roomStat.gameStarted === 1 || socket.roomStat.gameStarted === 2">
        <MultiTable />
        <button v-if="socket.roomStat.gameStarted === 2" @click="closeTable">关闭表格</button>
    </div>
    <div v-else style="text-align: center; margin-top: 16px;">
        <button @click="switchReady" style="width: 150px;">{{readyText}}</button>
    </div>
</template>

<script setup>
import { onUnmounted, ref, computed } from 'vue'
import { suggestNames } from '../../api.js'
import MultiTable from './MultiTable.vue'
import { useWebSocketStore } from './websocket'
import InputOp from '../InputOp.vue'
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

function closeTable() {
    socket.roomStat.ready = false;
    socket.roomStat.gameStarted = 0
    socket.selfGuesses = [];
    socket.opponentOp = [];
    socket.opponentCmp = [];
}

onUnmounted(async () => {
    await socket.close();
})
</script>

<style scoped>
.button-group {
    display: flex;
    gap: 315px;
    justify-content: center;
}

.spacer-small {
    width: 20px;
}

.spacer-large {
    width: 90px;
}

/* 手机端适配 */
@media screen and (max-width: 768px) {
    .spacer-small {
        width: 10px;
    }
    
    .spacer-large {
        width: 30px;
    }
}

@media screen and (max-width: 480px) {
    .spacer-small {
        width: 5px;
    }
    
    .spacer-large {
        width: 15px;
    }
}
</style>
