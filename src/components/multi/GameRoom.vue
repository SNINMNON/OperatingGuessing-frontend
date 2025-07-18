<template>
    <NFlex vertical align="center" style="padding: 32px;"> 
        <NH1>房间：{{ socket.roomId }}</NH1>
        <NFlex align="center">
            <div v-if="socket.roomStat.gameStarted === 1" style="text-align: center;">
                <InputOp @select="onSelect" />
            </div>
            <NText v-else>对手状态：{{ opponentStat }} </NText>
            <NButton secondary @click="closeTable; $emit('back')">返回</NButton>
        </NFlex>
    </NFlex>

    <div v-if="socket.roomStat.gameStarted === 1 || socket.roomStat.gameStarted === 2">
        <NFlex justify="center">
            <MultiTable />
            <NButton v-if="socket.roomStat.gameStarted === 2" 
                @click="closeTable"
                secondary>
                关闭表格
            </NButton>
        </NFlex>
    </div>

    <div v-else style="text-align: center; margin-top: 16px;">
        <NButton @click="switchReady" 
            :type="readyStyle"
            :disabled="!socket.roomStat.opponentJoined"
            round secondary>
            
            {{readyText}}
        </NButton>
    </div>
</template>

<script setup>
import { onUnmounted, ref, computed, watch } from 'vue'
import MultiTable from './MultiTable.vue'
import { useWebSocketStore } from './websocket'
import InputOp from '../InputOp.vue'
import { NFlex, NH1, useMessage, NButton, NCard, NText } from 'naive-ui'

const message = useMessage()
const socket = useWebSocketStore()
const emit = defineEmits(['back'])

// 监听游戏状态变化
watch(() => socket.roomStat.gameStarted, (newVal, oldVal) => {
    if (newVal === 1 && oldVal !== 1) {
        message.success('游戏开始！')
    }
})

// 监听错误信息
watch(() => socket.errorMsg, (newVal) => {
    if (newVal) {
        message.error(newVal)
        socket.errorMsg = '' // 清除错误信息
    }
})

// 监听info信息
watch(() => socket.infoMsg, (newVal) => {
    if (newVal) {
        message.info(newVal)
        socket.infoMsg = '' // 清除成功信息
    }
})

// ready button
const readyText = computed(() => socket.roomStat.ready ? '取消准备' : '准备')
const readyStyle = computed(() => socket.roomStat.ready ? 'tertiary' : 'primary')

// opponent ready / unready
const opponentStat = computed(() => {
    if (socket.roomStat.opponentJoined) {
        return socket.roomStat.opponentReady ? '已准备' : '未准备'
    } else {
        return '未加入'
    }
})

const query = ref('');
const suggestions = ref([]);

async function switchReady() {
    if (socket.roomStat.ready) {
        await socket.sendMessage('unready')
    } else {
        await socket.sendMessage('ready')
    }
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
.NButton-group {
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
