<script setup lang="ts">
import { onMounted } from 'vue'
import dayjs from 'dayjs'

import CG from './components/CalendarGraph.vue'


onMounted(() => {
  window['dayjs'] = dayjs
})
</script>

<template>
  <CG :year="(2022)" />
</template>
