export function log(...arg: any) {
  console.log(...arg)
}

export function classNames(names: any[]) {
  return names.filter(i => i).join(' ')
}
