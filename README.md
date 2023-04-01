# Vue Calendar Graph

A calendar graph vue-component inspired by github's contribution graph. [**Try it out on CodeSandbox**](https://codesandbox.io/p/sandbox/demo-vue-calendar-graph-fhonf3).

![md-1](https://llx.cool/public/calendar-graph/md-1.png)

[See react version](https://www.npmjs.com/package/react-calendar-graph)

## Setup

Install the npm module with yarn or pnpm:

```bash
pnpm add vue-calendar-graph
```

## Usage

Import the component:

```ts
import CalendarGraph from "vue-calendar-graph"
```

Import styles. You can directly import from the module, which requires a CSS loader:

```ts
import "vue-calendar-graph/dist/style.css"
```

## Props
```ts
type TypeProps = {
  year   : number
  isDark?: boolean
  colors?: { [key in (0 | 1 | 2 | 3 | 4)]: string }
  levels?: { [key in (1 | 2 | 3 | 4)]: number }

  /** Sort by days, need consecutive */
  records?: number[]

  recordHandle?: (record: TypeRecord) => any
  renderTootip?: (record: TypeRecord) => string
}

type TypeRecord = {
  days : number
  count: number
}

```

## MIT License
Copyright &copy; 2023 [Longxiang Li](https://llx.cool)

[See more LICENSE](https://github.com/llx-00/react-calendar-graph/blob/main/LICENSE)
