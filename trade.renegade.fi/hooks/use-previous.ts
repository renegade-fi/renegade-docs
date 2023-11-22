import React from "react"

export function usePrevious(value: any) {
  const [current, setCurrent] = React.useState(value)
  const [previous, setPrevious] = React.useState(null)

  if (value !== current) {
    setPrevious(current)
    setCurrent(value)
  }

  return previous
}
