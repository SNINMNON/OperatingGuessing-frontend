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
  margin: 0;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 1000;
  width: 25%;
}

.suggestions li {
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.suggestions li:hover {
  background-color: #f0f8ff;
}

</style>