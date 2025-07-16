import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWebSocketStore = defineStore('websocket', () => {
	let socket = null
	let isConnected = false

	const currentUserId = ref(crypto.randomUUID())
	const roomId = ref('')
	const inRoom = ref(false)
	const roomStat = ref({
		ready: false,
		gameStarted: 0,
		opponentJoined: false,
		opponentReady: false
	})

	const selfGuesses = ref([])
	const opponentCmp = ref([])
	const opponentOp = ref([])
	const suggestions = ref([])
	const findPublicStat = ref('')

	const listeners = {
		onOpen: () => console.log('Connected to server.'),
		onMessage: (msg) => {
			console.log('Received message:', msg.type)
			const fromSelf = msg.userId === currentUserId.value

			switch (msg.type) {
				case 'broadcast':
					switch (msg.data.message) {
						case 'join':
							roomStat.value.gameStarted = 0
							roomStat.value.opponentJoined = true
							roomStat.value.opponentReady = false
							if (fromSelf) {
								roomId.value = msg.data.roomId
								inRoom.value = true
							} else {
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
						case 'disconnect':
							roomStat.value.gameStarted = 2
							roomStat.value.opponentJoined = false
							roomStat.value.opponentReady = false
							roomStat.value.ready = false
							alert('对手已断开连接')
							break
					}
					break

				case 'error':
					switch (msg.data.message) {
						case 'opponent not yet joined':
							roomStat.value.ready = false
							break
						case 'no available public room':
							findPublicStat.value = '没有可用的公共房间，请稍后再试'
							setTimeout(() => { findPublicStat.value = '' }, 3000)
							break
						default:
							close()
							alert(`错误: ${msg.data.message}`)
							break
					}
					break

				case 'roomId':
					roomId.value = msg.data.payload
					inRoom.value = true
					roomStat.value.gameStarted = 0
					roomStat.value.opponentJoined = false
					roomStat.value.opponentReady = false
					break

				case 'self guess':
					msg.data.payload.guess.release = new Date(msg.data.payload.guess.release).toISOString()
					selfGuesses.value.push(msg.data.payload)
					break

				case 'opponent guess':
					opponentCmp.value.push(msg.data.payload)
					break

				case 'opponent history':
					msg.data.payload.forEach(op => {
						op.release = new Date(op.release).toISOString()
					})
					opponentOp.value = msg.data.payload
					break

				case 'suggest':
					suggestions.value = msg.data.payload
					break

				default:
					console.warn('Unknown message type:', msg.type)
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
			console.log('WebSocket closed.')
		},
		onError: (e) => {
			console.error('WebSocket error:', e)
		}
	}

	async function connect(userId = currentUserId.value, customListeners = {}) {
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

	async function sendMessage(type, data = {}) {
		return new Promise((resolve, reject) => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ type, userId: currentUserId.value, data }))
				resolve()
			} else {
				reject(new Error('WebSocket is not connected'))
			}
		})
	}

	async function close() {
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

	return {
		// State
		currentUserId, roomId, inRoom, roomStat,
		selfGuesses, opponentCmp, opponentOp,
		suggestions, findPublicStat,

		// Methods
		connect, sendMessage, close,
	}
})
