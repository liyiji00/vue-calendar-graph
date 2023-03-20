<script setup lang="ts">
import { onMounted } from 'vue'
import dayjs from 'dayjs'

import CG from './components/CalendarGraph'


onMounted(() => {
  window['dayjs'] = dayjs
})

</script>

<template>
  <!-- <CG :year="(2020)" /> -->
  <!-- <CG :year="(2021)" /> -->
  <CG :year="(2022)"
    :render-tootip="(days: number, count: number) => `days: ${days}, count: ${count}`"
  />
  <CG :year="(2023)" />
</template>
