# Vue Calendar Graph

A calendar graph vue-component inspired by github's contribution graph. [**Try it out on CodeSandbox**](https://codesandbox.io/p/sandbox/charming-meninsky-fhonf3).

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

| Name | Type *(Required) | Description |
| ---- | ---- | ----------- |
| `year` | * `number` |  |
| `isDark` | `boolean` |  |
| `records` | `number[]` | Sort by days, need consecutive |

## MIT License
Copyright (c) 2023 Longxiang Li

[See more LICENSE](https://github.com/llx-00/vue-calendar-graph/blob/main/LICENSE)
