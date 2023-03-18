<script setup lang="ts">
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { computed, reactive, ref, watch } from 'vue'

import { dF, getMonthDays, getMouthFirstDay, log } from '../tools'


dayjs.extend(dayOfYear)


type TypeRactData = {
  date : number
  count: number
}


const porps = defineProps<{
  year   : number
  colors?: {
    0: string
    1: string
    2: string
    3: string
    4: string
  }
}>()


const FirstDay = computed(() => dayjs().year(porps.year).startOf('y'))
const LastDay  = computed(() => dayjs().year(porps.year).endOf('y'))


function showWeek(week: string) {
  return ['Mon', 'Wed', 'Fri'].includes(week) ? week : null
}

function getMouthColspan(month: number) {
  const days = getMonthDays(porps.year, month)
  // return +dayjs().month(month-1).startOf('M').format('d')
  if (month === 1) {
    return Math.ceil((days+getMouthFirstDay(porps.year, month)) / 7)
  } else {
    return Math.ceil((days) / 7)
  }
}

const dataMap = reactive<{year: number, map : TypeRactData[]}>({
  map : getNewMap(porps.year),
  year: porps.year
})
watch([porps], () => {
  if (porps.year !== dataMap.year) {
    while(dataMap.map.length) dataMap.map.pop()

    dataMap.map.push(...getNewMap(porps.year))
    dataMap.year = porps.year
  }
})
const sortByWeek = computed(() => {
  const data = new Array(7).fill(null).map(_ => ([] as TypeRactData[]))
  dataMap.map.forEach((i, idx) => {data[idx % 7].push(i)})
  return data
})

function getNewMap(year: number) {
  const map           = [] as {count: number, date: number}[]
  const monthFirstDay = getMouthFirstDay(year, 0)

  map.push(...new Array(monthFirstDay).fill(null).map(
    (_, idx) => ({count: 0, date: idx-monthFirstDay})
  ))
  const days = dayjs().year(year).endOf('y').dayOfYear()
  for (let i = 0; i < days; i++) map.push({date: i+1, count: 0})

  return map
}
</script>

<template>
  <!-- <pre>{{ JSON.stringify(porps, null, 2) }}</pre> -->
  <pre>{{ dF(FirstDay) }} - {{ dF(LastDay) }}</pre>
  <pre>{{ dataMap.map.length }}</pre>
  <!-- <ul>
    <li v-for="month of 12" :colspan="4">
      week: {{ getMouthFirstDay(porps.year, month-1) }}
      days: {{ getMonthDays(porps.year, month-1) }}
      col: {{ getMouthColspan(month-1) }}
    </li>
  </ul> -->
  <div class="container">
    <table>
      <thead>
        <tr class="months">
          <td></td>
          <td
            v-for="month of 12"
            :colspan="Math.ceil(getMonthDays(porps.year, month-1) / 7)"
          >
            {{ dayjs().month(month-1).format("MMM") }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week of 7">
          <td class="week">
            {{ showWeek(dayjs().day(week-1).format('ddd')) }}
          </td>
          <td :class="box.date > 0 ? 'box' : null"
            v-for="box of sortByWeek[week-1]"
            @click="e => {if (box.date>0) {log(box)}}"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.container {
  width        : fit-content;
  border       : 1px solid rgba(128, 128, 128, 0.5);
  border-radius: 6px;
  padding      : 6px;
  // border-top-left-radius : 6px;
  // border-top-right-radius: 6px;

  font-size: 12px;

  * {
    box-sizing: border-box;
  }

  table {
    border-collapse: separate;

    thead {
      tr {
        height     : 15px;
        max-height : 15px;
        line-height: 15px;
      }

      td {
        padding: 0;
      }
    }

    tbody {
      tr {
        height     : 11px;
        line-height: 11px;

        td {
          padding: 0;
        }

        td.week {
          padding-right: 5px;
        }

        td.box {
          width        : 11px;
          max-width    : 11px;
          border-radius: 2px;

          border: 1px solid rgba(128, 128, 128, 0.5);
        }
      }
    }
  }
}
</style>
