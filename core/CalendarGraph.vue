<script setup lang="ts">
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { computed, reactive, watch } from 'vue'

import { dF, getMonthDays, getMouthFirstDay, getDateByDays, log } from './tools'
import defalutValue from './default.json'


dayjs.extend(dayOfYear)


type TypeRecord = {
  days : number
  count: number
}


const porps = defineProps<{
  year   : number
  colors?: {'0': string, '1': string, '2': string, '3': string, '4': string}
  /** Sort by days, need consecutive */
  records?: number[]
  renderTootip?: (days: number, count: number) => string
  isDark?: boolean
}>()



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
  return porps.colors
    ? (porps.colors[getLevel(count)])
    : defalutValue.colors[getLevel(count)][porps.isDark ? 'dark' : 'light']
}
function getPaletteColors() {
  const keys: ('0'|'1'|'2'|'3'|'4')[] = ['0', '1', '2', '3', '4']
  return porps.colors
    ? keys.map(key => porps.colors![key])
    : keys.map(key => defalutValue.colors[key][porps.isDark ? 'dark' : 'light'])
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

const dataMap = reactive<{year: number, map : TypeRecord[]}>({
  map : getMap(porps.year),
  year: porps.year
})
watch([porps], () => {
  if (porps.year !== dataMap.year) {
    while(dataMap.map.length) dataMap.map.pop()

    dataMap.map.push(...getMap(porps.year))
    dataMap.year = porps.year
  }
})
const sortByWeek = computed(() => {
  const data = new Array(7).fill(null).map(_ => ([] as TypeRecord[]))
  dataMap.map.forEach((i, idx) => {data[idx % 7].push(i)})
  return data
})

function getMap(year: number) {
  const map           = [] as {count: number, days: number}[]
  const monthFirstDay = getMouthFirstDay(year, 0)

  map.push(...new Array(monthFirstDay).fill(null).map(
    (_, idx) => ({count: 0, days: idx-monthFirstDay})
  ))

  const days = dayjs().year(year).endOf('y').dayOfYear()
  for (let i = 0; i < days; i++) map.push({
    days : i+1,
    count: porps.records?.[i] || 0
  })

  return map
}

function getTootipText(record: {days: number, count: number}) {
  return (
    porps.renderTootip
    ? porps.renderTootip(record.days, record.count)
    : `${record.count || 'No'} contributions on ${dF(getDateByDays(porps.year, record.days))}`
  )
}
</script>

<template>
  <div class="container" :class="isDark ? 'dark' : null">
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
          <template v-for="record of sortByWeek[week-1]">
            <td v-if="record.days > 0"
              class="record"
              :title="getTootipText(record)"
              :style="{backgroundColor: getFillColor(record.count)}"
              @click="_ => {log(dF(getDateByDays(porps.year, record.days)))}"
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
            <svg width="10" height="10" v-for="color of getPaletteColors()">
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
  margin       : 10px;
  color: rgba(128, 128, 128, 0.5);

  background-color: #fff;

  td.record {
    border: 1px solid rgba(27, 31, 35, 0.06);
  }

  &.dark {
    background-color: #111;

    td.record {
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }


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
      * { opacity: 1; }
      > tr {
        height     : 11px;
        line-height: 11px;

        > td {
          padding      : 0;
          border-radius: 2px;

          &.week {
            padding-right: 5px;
          }

          &.record {
            width    : 11px;
            max-width: 11px;
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
