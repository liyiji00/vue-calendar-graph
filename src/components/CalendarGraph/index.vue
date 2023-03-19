<script setup lang="ts">
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { computed, reactive, ref, watch } from 'vue'

import { dF, getMonthDays, getMouthFirstDay, log } from '../../tools'
import defalutValue from './default.json'


dayjs.extend(dayOfYear)


type TypeRactData = {
  days : number
  count: number
}


const porps = defineProps<{
  year   : number
  colors?: {'0': string, '1': string, '2': string, '3': string, '4': string}
  /** Sort by days, need consecutive */
  counts?: number[]
}>()

const FirstDay = computed(() => dayjs().year(porps.year).startOf('y'))
const LastDay  = computed(() => dayjs().year(porps.year).endOf('y'))


function showWeek(week: string) {
  return ['Mon', 'Wed', 'Fri'].includes(week) ? week : null
}

function getLevel(count: number) {
  if (count > defalutValue.levels[4]) return 4
  if (count > defalutValue.levels[3]) return 3
  if (count > defalutValue.levels[2]) return 2
  if (count > 0) return 1

  return 0
}
function getFillColor(count: number) {
  return (porps.colors || defalutValue.colors)[getLevel(count)]
}

function getMouthColspan(month: number) {
  const days     = getMonthDays(porps.year, month)
  const firstDay = getMouthFirstDay(porps.year, month)

  return (
    Math.ceil((days - 7 + firstDay) / 7 )
    + (month === 0 ? 1 : 0)
    + (firstDay === 0 && month !== 0 ? 1 : 0)
  )
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
  const map           = [] as {count: number, days: number}[]
  const monthFirstDay = getMouthFirstDay(year, 0)

  map.push(...new Array(monthFirstDay).fill(null).map(
    (_, idx) => ({count: 0, days: idx-monthFirstDay})
  ))

  const days = dayjs().year(year).endOf('y').dayOfYear()
  // 🚩 count 需从 props.counts 拿或设为 0
  // 暂时设置为随机
  for (let i = 0; i < days; i++) map.push({days: i+1, count: Math.random() * 100 >> 0})

  return map
}
</script>

<template>
  <!-- <pre>{{ JSON.stringify(porps, null, 2) }}</pre> -->
  <pre>{{ dF(FirstDay) }} - {{ dF(LastDay) }}</pre>
  <!-- <pre>{{ dataMap.map.length }}</pre> -->
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
            :colspan="getMouthColspan(month-1)"
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
          <template v-for="box of sortByWeek[week-1]">
            <td v-if="box.days > 0"
              class="box"
              :style="{backgroundColor: getFillColor(box.count)}"
              @click="e => {log(dF(dayjs().year(porps.year).dayOfYear(box.days)))}"
            />
            <td v-else class="last-year" />
          </template>
        </tr>
      </tbody>
    </table>
    <div class="footer">
      <div class="palette">
        <span>Less</span>
          <div class="svgs">
            <svg width="10" height="10" v-for="color of porps.colors || defalutValue.colors">
              <rect width="10" height="10" :fill="color" />
            </svg>
          </div>
        <span>More</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width        : fit-content;
  border       : 1px solid rgba(128, 128, 128, 0.5);
  border-radius: 6px;
  padding      : 6px;

  font-size: 12px;

  * {
    box-sizing: border-box;
  }

  > table {
    border-collapse: separate;

    > thead {
      > tr {
        height     : 15px;
        max-height : 15px;
        line-height: 15px;

        > td {
          padding: 0;
        }
      }

    }

    > tbody {
      > tr {
        height     : 11px;
        line-height: 11px;

        > td {
          padding      : 0;
          border-radius: 2px;

          &.week {
            padding-right: 5px;
          }

          &.box {
            width    : 11px;
            max-width: 11px;
            border   : 1px solid rgba(128, 128, 128, 0.2);
          }
        }
      }
    }
  }

  > .footer {
    padding-top: 5px;

    display        : flex;
    justify-content: flex-end;
    align-items    : center;
    > .palette {
      > .svgs {
        display: inline;
        margin : 0 2px;

        svg {
          margin       : 0 1px;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
