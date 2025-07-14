<template>
    <table>
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
          <td
            v-for="(cell, cellIndex) in row.cells"
            :key="cellIndex"
            :style="{
              backgroundColor: cell.bgColor,
              padding: '0.5rem',
              whiteSpace: 'nowrap',
              textAlign: 'center'
            }"
          >
            {{ cell.value }}
            <small>{{ cell.msg }}</small>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    guesses: Array
  })
  
  // Format each cell with background color and icon based on comparison result
  function formatCell(value, comparison) {
    const [green, red, yellow] = ['#c8e6c9', '#ffcdd2', '#fff9c4']
    const map = {
      'equal':      [green,   '√'],
      'different':  [red,     '×'],
      'close':      [yellow,  '○'],
      'too high':   [red,     '⇊'],
      'too low':    [red,     '⇈'],
      'too late':   [red,     '⇇'],
      'too soon':   [red,     '⇉'],
      'close high': [yellow,  '↓'],
      'close low':  [yellow,  '↑'],
      'close late': [yellow,  '←'],
      'close soon': [yellow,  '→']
    }
  
    const [bgColor, msg] = map[comparison] || ['#e0e0e0', '❔']
    return { value, msg, bgColor }
  }
  
  // Generate table rows with formatted cells
  const formattedGuesses = computed(() =>
    props.guesses.map(guess => ({
      cells: [
        formatCell(guess.guess.name, guess.comparison.name),
        formatCell(guess.guess.role, guess.comparison.role),
        formatCell(guess.guess.rarity, guess.comparison.rarity),
        formatCell(guess.guess.gender, guess.comparison.gender),
        formatCell(guess.guess.faction, guess.comparison.faction),
        formatCell(guess.guess.position, guess.comparison.position),
        formatCell(guess.guess.race, guess.comparison.race),
        formatCell(guess.guess.release.split('T')[0], guess.comparison.release)
      ]
    }))
  )
  </script>
