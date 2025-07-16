import { ref } from 'vue'

let socket = null
let isConnected = false
let currentUserId = ref(crypto.randomUUID())

export const roomId = ref('')
export const inRoom = ref(false)
export const roomStat = ref({
    ready: false, // Whether the player is ready
    gameStarted: 0, // 0 for not started, 1 for started, 2 for ended (showing results)
    opponentJoined: false,
    opponentReady: false
})

export const selfGuesses = ref([]) // List of {guess: Operator, comparison: GuessComparison}s
export const opponentCmp = ref([]) // List of {comparison: GuessComparison}s
export const opponentOp = ref([]) // List of Operators

export const suggestions = ref([])

const listeners = {
    onOpen: () => { 
        console.log("Connected to server.")
    },
    onMessage: (msg) => { 
        console.log("Received message: ", msg.type)
        switch(msg.type) {
            case 'broadcast':
                let fromSelf = msg.userId === currentUserId.value;
                switch(msg.data.message) {
                    case 'join':
                        if (fromSelf) {
                            roomStat.value.gameStarted = 0
                            roomStat.value.opponentJoined = true
                            roomStat.value.opponentReady = false
                            roomId.value = msg.data.roomId;
                            inRoom.value = true
                        } else {
                            roomStat.value.opponentJoined = true;
                            alert('对手已加入房间')
                        }
                        break

                    case 'ready':
                        if (fromSelf) roomStat.value.ready = true
                        else roomStat.value.opponentReady = true
                        break

                    case 'unready':
                        if (fromSelf) roomStat.value.ready = false
                        else roomStat.value.opponentReady = false
                        break

                    case 'start':
                        roomStat.value.gameStarted = 1
                        alert('游戏开始！')
                        break

                    case 'win':
                        roomStat.value.gameStarted = 2
                        roomStat.value.opponentJoined = true
                        roomStat.value.opponentReady = false
                        roomStat.value.ready = false
                        alert(fromSelf ? '你赢了🎉' : '你输了🥲')
                        break

                    case 'disconnect': // opponent disconnected
                        roomStat.value.gameStarted = 2
                        roomStat.value.opponentJoined = false
                        roomStat.value.opponentReady = false
                        roomStat.value.ready = false
                        alert('对手已断开连接')
                        break
                }
                break

            case 'error':
                if (msg.data.message === 'opponent not yet joined') {
                    roomStat.value.ready = false;
                    break;
                }
                close();
                alert(`错误: ${msg.data.message}`);
                break;

            case 'roomId': // created and joined room
                roomId.value = msg.data.payload;
                inRoom.value = true;
                roomStat.value.gameStarted = 0
                roomStat.value.opponentJoined = false // assume opponent has not joined yet
                roomStat.value.opponentReady = false
                break;

            case 'self guess':
                let payload = msg.data.payload;
                payload.guess.release = new Date(payload.guess.release).toISOString();
                selfGuesses.value.push(msg.data.payload);
                break;

            case 'opponent guess':   
                opponentCmp.value.push(msg.data.payload);
                break;

            case 'opponent history':
                for (let i = 0; i < msg.data.payload.length; i++) {
                    let op = msg.data.payload[i];
                    op.release = new Date(op.release).toISOString();
                }
                opponentOp.value = msg.data.payload;
                break;

            case 'suggest':
                suggestions.value = msg.data.payload;
                break;

            default:
                console.warn('Unknown message type:', msg.type);
            
        }
    },
    onClose: () => {
        inRoom.value = false
        roomStat.value.gameStarted = 2
        roomStat.value.opponentJoined = false
        roomStat.value.opponentReady = false
        selfGuesses.value = []
        opponentCmp.value = []
        opponentOp.value = []
        console.log("WebSocket closed.") 
    },
    onError: (e) => { console.error("WebSocket error:", e) },
}

export async function connect(userId = currentUserId.value, customListeners = {}) {
    if (isConnected && socket?.readyState === WebSocket.OPEN) {
        return Promise.reject(new Error('WebSocket is already connected'))
    }

    currentUserId.value = userId
    Object.assign(listeners, customListeners)

    return new Promise((resolve, reject) => {
        socket = new WebSocket('/multiplayer')

        socket.onopen = () => {
            isConnected = true
            listeners.onOpen()
            resolve()
        }

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data)
            listeners.onMessage(msg)
        }

        socket.onclose = () => {
            isConnected = false
            listeners.onClose()
        }

        socket.onerror = (e) => {
            isConnected = false
            listeners.onError(e)
            reject(e)
        }
    })
}

export async function sendMessage(type, data = {}) {
    return new Promise((resolve, reject) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify( {type, userId: currentUserId.value, data} ))
            resolve()
        } else {
            reject(new Error('WebSocket is not connected'))
        }
    })
}

export async function close() {
    return new Promise((resolve) => { 
        if (socket && isConnected) {
            socket.onclose = () => {
                isConnected = false
                listeners.onClose()
            }
            socket.close()
        }
        resolve()
    })
}