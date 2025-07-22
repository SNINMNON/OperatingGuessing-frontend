<template>
    <NFlex class="game-button-flex" size="small" justify="center" align="center">
        <InputOp @select="onSelect" />
        <NFlex size="small" justify="center" align="center">
            <NButton type="primary" size="large" @click="onRestart">重新开始</NButton>
            <NButton secondary size="large"  @click="$emit('back')">返回</NButton>
        </NFlex>
    </NFlex>
    <NFlex vertical align="center">
        <NCard :bordered="false" >
            <template #footer>
                <NPopover placement="bottom-start" trigger="hover">
                    <template #trigger>
                        <NButton size="large" >一些提示</NButton>
                    </template>
                    <NFlex vertical>
                        <NText>红/黄/绿：错误/接近/正确</NText>
                        <NText>→/↑代表谜底干员的时间更晚/星级更高</NText>
                        <NText>当前星级：{{showRarity()}}</NText>
                    </NFlex>
                </NPopover>
            </template>
            <GuessTable :guesses="guesses" />
        </NCard>
    </NFlex>
    <GameOverModal :show-modal="showModal" 
        :message="modalMsg" 
        :answer="answer" 
        @close="onModalClose" 
        type="success"/>
</template>

<script setup>
import { ref } from 'vue';
import { guessName, startGame } from '../../api.js';
import InputOp from '../InputOp.vue';
import GuessTable from '../GuessTable.vue';
import { NFlex, NButton, NText, useMessage, NCard, NPopover } from 'naive-ui';
import GameOverModal from '../GameOverModal.vue';

const guesses = ref([]);
const props = defineProps(['rarity']);

defineEmits(['back']);
const message = useMessage();

const showModal = ref(false);
const modalMsg = ref('');
const answer = ref({});

function onModalClose() {
    showModal.value = false;
    modalMsg.value = '';
    answer.value = {};
}

async function onSelect(name) {
    const result = await guessName(name);
    if (result.error) return alert(result.error);
    
    guesses.value.push(result);
    if (result.correct) {
        modalMsg.value = '你猜对了'
        answer.value = result.guess
        showModal.value = true
    }
}

async function onRestart() {
    guesses.value = [];
    await startGame(props.rarity);
    message.info('已按当前稀有度重新设置谜底干员')
}

function showRarity() {
    return props.rarity === 0 ? '任意' : props.rarity;
}
</script>

<style scoped>
@media screen and (max-width: 768px) {
	.game-button-flex {
        flex-direction: column !important;
    }
}
</style>
