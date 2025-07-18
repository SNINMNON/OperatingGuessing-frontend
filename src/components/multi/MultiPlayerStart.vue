<template>
    <GameRoom v-if="socket.inRoom" @back="handleBack" />
    <NFlex v-else vertical align="center" style="padding: 32px;">
        <NH1 style="text-align: center;">双人模式</NH1>

        <NFlex justify="center" :size="10">
            <NButton type="primary" size="large" @click="find">寻找公共房间</NButton>
            <NButton secondary size="large" @click="$emit('back')">返回</NButton>
        </NFlex>

        <NCard>
            <NFlex justify="center" :size="5">
                <NInput v-model:value="joinRoomId" placeholder="输入房间号" style="width: 120px;" />
                <NButton type="primary" size="large" @click="joinRoom">加入房间</NButton>
            </NFlex>
        </NCard>

        <NCard size="small">
            <NCheckbox v-model:checked="createPublic" size="large">公共游戏</NCheckbox>
            <NButton type="primary" size="large" @click="createRoom">创建房间</NButton>
        </NCard>
    </NFlex>
</template>

<script setup>
import { onUnmounted, ref, nextTick, watch } from 'vue'
import GameRoom from './GameRoom.vue'
import { useWebSocketStore } from './websocket'
import { NFlex, NH1, NButton, NInput, NCheckbox, useMessage, NCard } from 'naive-ui';
const socket = useWebSocketStore()
const message = useMessage()

defineEmits(['back']);

const joinRoomId = ref('')
const createPublic = ref(true);

async function createRoom() {
    await socket.connect()
    await socket.sendMessage('create', { public: createPublic.value })
}

async function joinRoom() {
    await socket.connect()
    await socket.sendMessage('join', { roomId: joinRoomId.value })
}

async function find() {
    await socket.connect();
    await socket.sendMessage('find');
}

watch(() => socket.findPublicFailed, (newVal) => {
    if (newVal) {
        socket.findPublicFailed = false
        message.error('没有可用的公共房间，请稍后再试')
    }
})

function handleBack() {
    nextTick(() => {
        socket.inRoom = false;
    });
}

onUnmounted(async () => {
    await socket.close();
})
</script>

<style scoped>
.n-input {
    font-size: 16px;
}

.n-card {
    text-align: center;
    max-width: 300px;
}
</style>