<template>
    <h1>双人模式</h1>
    <div v-if="inRoom">
        <GameRoom @back="inRoom = false"/>
    </div>
    <div v-else style="text-align:center">
        <button @click="createRoom" style="width: 40%;">创建房间</button>
        <button @click="$emit('back')" style="width:20%;">返回首页</button>
        <br /> <br />
        <input v-model="joinRoomId" placeholder="输入房间号" style="width: 45%;" />
        <button @click="joinRoom">加入房间</button>
    </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import {
    connect,
    sendMessage,
    close,
    inRoom
} from './websocket'
import GameRoom from './GameRoom.vue'

defineEmits(['back']);

const joinRoomId = ref('')

onUnmounted(async () => {
    await close();
})

async function createRoom() {
    await connect()
    await sendMessage('create')
}

async function joinRoom() {
    await connect()
    await sendMessage('join', { roomId: joinRoomId.value })
}

</script>
