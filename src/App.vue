<template>
  <div>
    <h1>猜干员 - 明日方舟</h1>
    <StartScreen v-if="screen === 'start'" @start="onStart" />
    <GameScreen v-else @back="screen = 'start'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StartScreen from './components/StartScreen.vue';
import GameScreen from './components/GameScreen.vue';

const screen = ref('start');

function onStart() {
  screen.value = 'game';
}
</script>
