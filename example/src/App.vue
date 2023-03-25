<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'

import CalendarGraph from '@lib/core'
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
const isDark   = ref<boolean>(false)
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
    <div class="flex-center">
      <div>
        dark
        <input type="radio" :checked="isDark" @click="isDark=true" >
      </div>
      <div>
        light
        <input type="radio" :checked="!isDark" @click="isDark=false" >
      </div>
    </div>
  </div>
  <CalendarGraph
    :year="(year)"
    :is-dark="isDark"
    :records="getRandomRecords(year)"
  />
  <CalendarGraph
    :year="(year)"
    :is-dark="isDark"
  />
</template>

<style lang="scss">
.header {
  display        : flex;
  justify-content: center;
  align-items    : center;
}

.flex-center {
  display        : flex;
  justify-content: center;
  align-items    : center;
}
</style>
