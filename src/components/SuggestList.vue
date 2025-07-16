<template>
    <ul id="suggestions" class="suggestions">
        <li v-for="name in suggestions" :key="name" @click="$emit('select', name)">
            {{ name }}
        </li>
    </ul>
</template>

<script setup>
defineProps({
    suggestions: Array
});
</script>

<style scoped>
.suggestions {
  list-style: none;
  margin: 0 auto; /* 这会使列表水平居中 */
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 50%; /* 将列表左边缘定位到中间 */
  transform: translateX(-50%); /* 向左移动自身宽度的一半，实现完美居中 */
  z-index: 1000;
  width: 200px; /* 保持你原有的宽度 */
}

.suggestions li {
  padding: 9px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
}

.suggestions li:hover {
  background-color: #f0f8ff;
}

</style>