"use client"

import { useEffect, useRef } from "react"
import { useWindowSize } from "@react-hook/window-size"
import { MotionValue } from "framer-motion"
import { useRafLoop } from "react-use"

export const MarqueeItem = ({
  children,
  speed,
}: {
  children: React.ReactNode
  speed: MotionValue<any>
}) => {
  const item = useRef<HTMLDivElement>(null)
  const rect = useRef<DOMRect | undefined>()
  const x = useRef(0)

  const [width, height] = useWindowSize()

  const setX = () => {
    if (!item.current || !rect.current) return
    const xPercentage = (x.current / rect.current.width) * 100
    if (xPercentage < -100) x.current = 0
    if (xPercentage > 0) x.current = -rect.current.width
    item.current.style.transform = `translate3d(${xPercentage}%, 0, 0)`
  }

  useEffect(() => {
    rect.current = item.current?.getBoundingClientRect()
  }, [width, height])

  const loop = () => {
    x.current -= speed.get()
    setX()
  }

  useRafLoop(loop, true)

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginRight: "6px",
      }}
      ref={item}
    >
      {children}
    </div>
  )
}
