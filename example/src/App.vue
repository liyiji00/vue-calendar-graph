<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'

import CalendarGraph from '@lib/core'
import { dF, log } from './tools'


function getRandomRecords(year: number) {
  const days = dayjs().year(year).endOf('y').dayOfYear()

  function getRandom() {
    return Math.max(0, Math.random()*20 - Math.random()*5 >> 0)
  }

  return (new Array(days).fill(null).map(_ => getRandom()))
}

const thisYear = new Date().getFullYear()
const year     = ref<number>(thisYear)
const FirstDay = computed(() => dayjs().year(year.value).startOf('y'))
const LastDay  = computed(() => dayjs().year(year.value).endOf('y'))
const isDark   = ref<boolean>(false)
const records  = computed(() => getRandomRecords(year.value))
</script>

<template>
  <div class="header">
    <select v-model="year">
      <option v-for="_y in 4" :value="(thisYear-_y+1)">
        {{ thisYear-_y+1 }}
      </option>
    </select>
    <pre>{{ dF(FirstDay) }} - {{ dF(LastDay) }}</pre>
    <button @click="isDark=!isDark">{{ isDark ? 'dark' : 'light' }}</button>
  </div>
  <CalendarGraph
    :year="(year)"
    :is-dark="isDark"
    :records="records"
    :record-handle="r => {log(r)}"
  />
  <CalendarGraph
    :year="(year)"
    :is-dark="!isDark"
    :records="records"
  />
</template>

<style lang="scss">
.header {
  display        : flex;
  justify-content: center;
  align-items    : center;
}

a {
  color          : inherit;
  text-decoration: none;
}
</style>
