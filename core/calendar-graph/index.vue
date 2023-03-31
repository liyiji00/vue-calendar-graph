<script setup lang="ts">
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import { computed, reactive, watch } from 'vue'

import { getDateByDays, dF, getMouthFirstDay, getMouthColspan, showWeek } from '../utils/day'

import defalutValue from './default.json'


dayjs.extend(dayOfYear)


type TypeColorKey = 0 | 1 | 2 | 3 | 4
type TypeLevels   = 1 | 2 | 3 | 4

type TypeRecord = {
  days : number
  count: number
}
type TypeProps = {
  year   : number
  isDark?: boolean
  colors?: { [key in TypeColorKey]: string }
  levels?: { [key in TypeLevels]: number }

  /** Sort by days, need consecutive */
  records?: number[]

  /** The function runs when you click the `<rd/>` element */
  recordHandle?: (record: TypeRecord) => (any)

  /** When you hove `<rd/>` element, the result of running the function is displayed */
  renderTootip?: (record: TypeRecord) => string
}

const props = defineProps<TypeProps>()

function getLevel(count: number) {
  const levels = props.levels || defalutValue.levels
  if (count > levels[4]) return 4
  if (count > levels[3]) return 3
  if (count > levels[2]) return 2
  if (count > levels[1]) return 1
  return 0
}
function getFillColor(count: number) {
  return props.colors
    ? (props.colors[getLevel(count)])
    : defalutValue.colors[getLevel(count)][props.isDark ? 'dark' : 'light']
}
function getPaletteColors() {
  const keys: TypeColorKey[] = [0, 1, 2, 3, 4]
  return props.colors
    ? keys.map(key => props.colors![key])
    : keys.map(key => defalutValue.colors[key][props.isDark ? 'dark' : 'light'])
}

function getMap(year: number) {
  const map = [] as TypeRecord[]
  const day = getMouthFirstDay(year, 0)

  map.push(...new Array(day).fill(null).map(
    (_, idx) => ({ count: 0, days: idx-day })
  ))

  const days = dayjs().year(year).endOf('y').dayOfYear()
  for (let i = 0; i < days; i++) map.push({
    days : i + 1,
    count: props.records?.[i] || 0
  })
  return map
}

function getTootipText(record: TypeRecord) {
  return props.renderTootip
    ? props.renderTootip(record)
    : (
      (record.count || 'No')
      + ' contributions on '
      + dF(getDateByDays(props.year, record.days))
    )
}

const dataMap = reactive<{year: number, map : TypeRecord[]}>({
  map : getMap(props.year),
  year: props.year
})
watch([props], () => {
  if (props.year !== dataMap.year) {
    while(dataMap.map.length) dataMap.map.pop()

    dataMap.map.push(...getMap(props.year))
    dataMap.year = props.year
  }
})
const sortByWeek = computed(() => {
  const data = new Array(7).fill(null).map(_ => ([] as TypeRecord[]))
  dataMap.map.forEach((i, idx) => {data[idx % 7].push(i)})
  return data
})


</script>

<template>
  <div class="calendar-graph-container" :class="isDark ? 'dark' : null">
    <table>
      <thead>
        <tr class="months">
          <td></td>
          <td
            v-for="month of 12"
            :colspan="getMouthColspan(props.year, month-1)"
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
              @click="_ => {
                if (props.recordHandle) {
                  props.recordHandle(record)
                }
              }"
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
.calendar-graph-container {
  font-size       : 12px;
  width           : fit-content;
  border          : 1px solid rgba(128, 128, 128, 0.5);
  border-radius   : 6px;
  padding         : 6px;
  margin          : 10px;
  color           : #000;
  background-color: #fff;

  td.record {
    border: 1px solid rgba(27, 31, 35, 0.06);
  }

  &.dark {
    color           : #eee;
    background-color: #222;

    td.record {
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
  }

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
      * { opacity: 1; };

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
            min-width: 11px;
            max-width: 11px;
          }
        }
      }
    }
  }

  > .footer {
    padding-top    : 5px;
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
