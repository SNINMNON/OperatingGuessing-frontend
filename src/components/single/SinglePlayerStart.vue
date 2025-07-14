<template>
    <h1>单人模式</h1>
      <StartScreen v-if="screen === 'start'" 
        @start="screen='game'"
        @rarity="receiveRarity"
        @back="$emit('back')" />
      <GameScreen v-else @back="screen = 'start'"  :rarity="rarity"/>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import StartScreen from './StartScreen.vue';
  import GameScreen from './GameScreen.vue';
  
  const screen = ref('start');
  const rarity = ref(0);
  
  function receiveRarity(value) {
    rarity.value = value;
  }
  </script>