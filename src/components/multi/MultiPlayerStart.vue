<template>
    <h1>双人模式</h1>
    <button @click="">创建房间</button>
    <button @click="">加入房间</button>
    <button @click="$emit('back')">返回首页</button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const screen = ref('start');
  const rarity = ref(0);
  
  function receiveRarity(value) {
    rarity.value = value;
  }
  </script>