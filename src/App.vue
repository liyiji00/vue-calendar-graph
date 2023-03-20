<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'

import CG from './components/CalendarGraph'
import { dF } from './tools'


function getRandomRecords(year: number) {
  const map: number[] = []

  const days = dayjs().year(year).endOf('y').dayOfYear()
  for (let i = 0; i < days; i++) map.push(Math.random() * 100 >> 0)

  return map
}

const year     = ref<number>(2023)
const FirstDay = computed(() => dayjs().year(year.value).startOf('y'))
const LastDay  = computed(() => dayjs().year(year.value).endOf('y'))
</script>

<template>
  <div class="header">
    <select v-model="year">
      <option :value="2020">2020</option>
      <option :value="2021">2021</option>
      <option :value="2022">2022</option>
      <option :value="2023" selected>2023</option>
    </select>
    <pre>{{ dF(FirstDay) }} - {{ dF(LastDay) }}</pre>
  </div>
  <CG
    class="calendar-graph"
    :year="(year)"
    :records="getRandomRecords(2023)"
  />
  <CG
    class="calendar-graph"
    :year="(year)"
  />
</template>

<style lang="scss">
.header {
  display        : flex;
  justify-content: center;
  align-items    : center;
}

.calendar-graph {
  margin: 10px;
}
</style>
