<template>
	<NDataTable
		:columns="columns"
		:data="formattedGuesses"
		:bordered="true"
		size="small"
		:scroll-x="800"
		class="guess-table">
		<template #empty>
		</template>
	</NDataTable>

</template>

<script setup>
import { computed, h } from 'vue'
import { NDataTable } from 'naive-ui'

const props = defineProps({
	guesses: Array, // Array of {guess: Operator, comparison: Comparison}
	showComparisonOnly: Boolean, // Whether to show only comparison icons
})

// 表格字段配置
const tableFields = [
	{ key: 'name', title: '姓名' },
	{ key: 'role', title: '职业' },
	{ key: 'rarity', title: '星级' },
	{ key: 'gender', title: '性别' },
	{ key: 'faction', title: '阵营' },
	{ key: 'position', title: '站位' },
	{ key: 'race', title: '种族' },
	{ key: 'release', title: '实装时间' }
]

// 动态生成列配置
const columns = computed(() => {
	const columnList = []
	
	for (let i = 0; i < tableFields.length; i++) {
		const field = tableFields[i]
		const column = {
			title: field.title,
			key: field.key,
			align: 'center',
			render: (row) => {
				const cellData = row[field.key]
				return h('span', [ cellData.value, ' ', cellData.msg ])
			},
			cellProps: (row) => {
				const cellData = row[field.key]
				return {
					style: {
						backgroundColor: cellData.bgColor
					}
				}
			}
		}
		columnList.push(column)
	}
	return columnList
})

// Format each cell with background color and icon
function formatCell(value, comparison) {
	const [green, red, yellow] = ['#c8e6c9', '#ffcdd2', '#fff9c4']
	const map = {
		'equal': [green, '✓'],
		'different': [red, '×'],
		'close': [yellow, '○'],
		'too high': [red, '⇊'],
		'too low': [red, '⇈'],
		'too late': [red, '⇇'],
		'too soon': [red, '⇉'],
		'close high': [yellow, '↓'],
		'close low': [yellow, '↑'],
		'close late': [yellow, '←'],
		'close soon': [yellow, '→']
	}

	const [bgColor, msg] = map[comparison] || ['#e0e0e0', '❔']
	return { value, msg, bgColor }
}

const formattedGuesses = computed(() => {
	const result = []
	
	for (let i = 0; i < props.guesses.length; i++) {
		const guessItem = props.guesses[i]
		const guess = guessItem.guess
		const comparison = guessItem.comparison
		
		const rowData = {}
		
		for (let j = 0; j < tableFields.length; j++) {
			const field = tableFields[j]
			let value = ""
			
			if (!props.showComparisonOnly && guess) {
				if (field.key === 'release' && guess.release) {
					value = guess.release.slice(2, 10)
				} else {
					value = guess[field.key] || ""
				}
			}
			
			const comparisonValue = comparison[field.key]
			rowData[field.key] = formatCell(value, comparisonValue)
		}
		result.push(rowData)
	}
	return result
})
</script>

<style scoped>

@media screen and (max-width: 768px) {
	.guess-table {
		font-size: 11px;
	}
}

@media screen and (max-width: 480px) {
	.guess-table {
		font-size: 10px;
	}
}
</style>
