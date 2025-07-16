<template>
	<div class="table-container">
		<table class="guess-table">
			<thead>
				<tr>
					<th>姓名</th>
					<th>职业</th>
					<th>星级</th>
					<th>性别</th>
					<th>阵营</th>
					<th>站位</th>
					<th>种族</th>
					<th>实装时间</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, rowIndex) in formattedGuesses" :key="rowIndex">
					<td v-for="(cell, cellIndex) in row.cells" :key="cellIndex" :style="{
						backgroundColor: cell.bgColor,
						padding: '8px',
						whiteSpace: 'nowrap',
						textAlign: 'center'
					}">
						{{ cell.value }}
						<small>{{ cell.msg }}</small>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	guesses: Array, // Array of {guess: Operator, comparison: Comparison}
	showComparisonOnly: Boolean, // Whether to show only comparison icons
})

// Format each cell with background color and icon based on comparison result
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

// Generate table rows with formatted cells
const formattedGuesses = computed(() => {
	return props.guesses.map(({ guess, comparison }) => {
		// if we're only showing comparison icons, force value to ""
		const getValue = field =>
			props.showComparisonOnly
				? ""
				: (guess ? guess[field] : "")
		return {
			cells: [
				formatCell(getValue('name'), comparison.name),
				formatCell(getValue('role'), comparison.role),
				formatCell(getValue('rarity'), comparison.rarity),
				formatCell(getValue('gender'), comparison.gender),
				formatCell(getValue('faction'), comparison.faction),
				formatCell(getValue('position'), comparison.position),
				formatCell(getValue('race'), comparison.race),
				formatCell(
					props.showComparisonOnly
						? ""
						: (guess && guess.release ? guess.release.split('T')[0] : ""),
					comparison.release
				)
			]
		}
	})
})
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.guess-table {
  min-width: 600px;
}

/* 手机端表格适中缩小，保持可读性 */
@media screen and (max-width: 768px) {
  .table-container {
    overflow-x: auto; /* 恢复横向滚动 */
  }
  
  .guess-table {
    min-width: 500px; /* 适当减少最小宽度 */
    font-size: 12px; /* 调大字体 */
  }
  
  .guess-table th,
  .guess-table td {
    padding: 4px 3px; /* 适中的内边距 */
    font-size: 11px; /* 可读的字体大小 */
    white-space: nowrap;
  }
}

/* 超小屏幕稍微再缩小 */
@media screen and (max-width: 480px) {
  .guess-table {
    min-width: 450px;
    font-size: 11px;
  }
  
  .guess-table th,
  .guess-table td {
    padding: 3px 2px;
    font-size: 10px;
  }
}
</style>
