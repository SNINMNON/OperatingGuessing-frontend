<template>
    <h1>双人模式</h1>
    <div v-if="inRoom">
        <GameRoom @back="handleBack"/>
    </div>
    <div v-else style="text-align:center">
        <div class="button-group" style="gap:9.5%">
            <button @click="find" style="width: 12%;">寻找公共房间</button>
            <button @click="$emit('back')">返回首页</button>
        </div>
        <br /> 
        <input v-model="joinRoomId" placeholder="输入房间号" style="width: 20%;" />
        <button @click="joinRoom">加入房间</button>
        <br /> <br />
        <div class="button-group"  style="gap:3%;">
            <div class="checkbox-wrapper">
                <input type="checkbox" v-model="createPublic" id="public" />
                <label for="public">公共游戏</label>
            </div>
            <button @click="createRoom" style="width: 12%;">创建房间</button>
        </div>
        <div>{{ findPublicStat }}</div>
    </div>
</template>

<script setup>
import { onUnmounted, ref, nextTick } from 'vue'
import {
    connect,
    sendMessage,
    close,
    inRoom,
    findPublicStat
} from './websocket'
import GameRoom from './GameRoom.vue'

defineEmits(['back']);

const joinRoomId = ref('')
const createPublic = ref(false);

onUnmounted(async () => {
    await close();
})

async function createRoom() {
    await connect()
    await sendMessage('create', { public: createPublic.value })
}

async function joinRoom() {
    await connect()
    await sendMessage('join', { roomId: joinRoomId.value })
}

async function find() {
    await connect();
    await sendMessage('find');
}

function handleBack() {
    nextTick(() => {
        inRoom.value = false;
    });
}
</script>

<style scoped>
.button-group {
    display: flex;
    /* Adjust this value as needed */
    justify-content: center;
}
</style>