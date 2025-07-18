<template>
	<NAutoComplete
		v-model:value="value" 
		:options="autoCompleteOptions" 
		placeholder="输入干员名称..."
		@select="handleSelect"
		@update:value="handleInput"
		clear-after-select
		style="width: 200px;" 
	/>
</template>

<script setup>
import { NAutoComplete } from 'naive-ui';
import { computed, ref } from 'vue';
import { suggestNames } from '../api.js';

const emit = defineEmits(['select']);

const value = ref('');
const suggestions = ref([]);

const autoCompleteOptions = computed(() => {
	return suggestions.value.map(name => ({ label: name, value: name }));
});

async function handleInput() {
	if (!value.value) {
		suggestions.value = [];
		return;
	}
	suggestions.value = await suggestNames(value.value);
}

function handleSelect(selectedValue) {
	emit('select', selectedValue);
	value.value = '';
	suggestions.value = [];
}
</script>

<style scoped>
@media screen and (max-width: 768px) {
	.n-auto-complete {
		width: 10rem !important;
	}
}
</style>

