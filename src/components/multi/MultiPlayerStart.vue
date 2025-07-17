<template>
    <h1>双人模式</h1>
    <div v-if="socket.inRoom">
        <GameRoom @back="handleBack"/>
    </div>
    <div v-else style="text-align:center">
        <div class="button-group" >
            <button @click="find" style="width: 150px;">寻找公共房间</button>
            <button @click="$emit('back')">返回首页</button>
        </div>
        <br /> 
        <input v-model="joinRoomId" placeholder="输入房间号" style="width: 130px;" />
        <button @click="joinRoom">加入房间</button>
        <br />
        <div class="button-group">
            <div class="checkbox-wrapper">
                <input type="checkbox" v-model="createPublic" id="public" />
                <label for="public">公共游戏</label>
            </div>
            <button @click="createRoom">创建房间</button>
        </div>
        <div>{{ socket.findPublicStat }}</div>
    </div>
</template>

<script setup>
import { onUnmounted, ref, nextTick } from 'vue'
import GameRoom from './GameRoom.vue'

import { useWebSocketStore } from './websocket'
const socket = useWebSocketStore()

defineEmits(['back']);

const joinRoomId = ref('')
const createPublic = ref(true);

onUnmounted(async () => {
    await socket.close();
})

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

function handleBack() {
    nextTick(() => {
        socket.inRoom = false;
    });
}
</script>

<style scoped>
.button-group {
    display: flex;
    /* Adjust this value as needed */
    gap:15px;
    justify-content: center;
}
</style>