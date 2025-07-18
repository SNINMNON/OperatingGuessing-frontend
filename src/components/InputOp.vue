<template>
	<NAutoComplete v-model:value="value" :options="autoCompleteOptions" placeholder="输入干员名称..." @select="handleSelect"
		@update:value="handleInput" clear-after-select style="max-width: 160px;" size="large"
		:render-label="renderLabel" />
</template>

<script setup>
import { NAutoComplete } from 'naive-ui';
import { computed, ref, h } from 'vue';
import { suggestNames } from '../api.js';

const emit = defineEmits(['select']);

const value = ref('');
const suggestions = ref([]);

// 自定义渲染字体大小
const renderLabel = (option) => h('NText', {
    style: {
        fontSize: '16px'
    }
}, option.label);

const autoCompleteOptions = computed(() => {
	return suggestions.value.map(name => ({
		label: name,
		value: name
	}));
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
		width: 8rem !important;
	}
}
</style>
