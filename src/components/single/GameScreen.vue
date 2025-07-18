<template>
    <NFlex>
        <InputOp @select="onSelect" />
        <NButton type="primary" @click="onRestart">重新开始</NButton>
        <NButton secondary @click="$emit('back')">返回</NButton>
    </NFlex>
    <NFlex vertical align="center">
        <NCard :bordered="false" >
            <template #footer>
                <NPopover placement="bottom-end" trigger="hover">
                    <template #trigger>
                        <NButton>一些提示</NButton>
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
</template>

<script setup>
import { ref } from 'vue';
import { guessName, startGame } from '../../api.js';
import InputOp from '../InputOp.vue';
import GuessTable from '../GuessTable.vue';
import { NFlex, NButton, NText, useMessage, NCard, NPopover } from 'naive-ui';

const guesses = ref([]);
const props = defineProps(['rarity']);

defineEmits(['back']);
const message = useMessage();

async function onSelect(name) {
    const result = await guessName(name);
    if (result.error) return alert(result.error);
    
    guesses.value.push(result);
    if (result.correct) {
        message.success('猜对了！')
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
	.clue {
        flex-direction: column !important;
        gap: 8px !important;
    }
}
</style>
