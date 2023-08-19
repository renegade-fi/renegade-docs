"use client"

import { useRef } from "react"
import { motion, useSpring } from "framer-motion"
import normalizeWheel from "normalize-wheel"
import { useRafLoop } from "react-use"

import { MarqueeItem } from "@/app/[base]/[quote]/marquee-item"

const _ = {
  userSelect: "none",
  speed: 0.4,
  threshold: 0.014,
  wheelFactor: 1,
  dragFactor: 1.2,
}

export const InteractiveMarquee = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const marquee = useRef<HTMLDivElement>(null)
  const slowDown = useRef(false)
  const isScrolling = useRef<ReturnType<typeof setTimeout>>()
  const x = useRef(0)
  const speed = useSpring(_.speed, {
    damping: 40,
    stiffness: 90,
    mass: 5,
  })

  const loop = () => {
    if (slowDown.current || Math.abs(x.current) < _.threshold) return
    x.current *= 0.66
    if (x.current < 0) {
      x.current = Math.min(x.current, 0)
    } else {
      x.current = Math.max(x.current, 0)
    }
    speed.set(_.speed + x.current)
  }

  const onWheel = (e: React.WheelEvent) => {
    const normalized = normalizeWheel(e)
    x.current = normalized.pixelY * _.wheelFactor

    window.clearTimeout(isScrolling.current)
    isScrolling.current = setTimeout(function () {
      speed.set(_.speed)
    }, 30)
  }

  const onDragStart = () => {
    slowDown.current = true
    marquee.current?.classList.add("drag")
    speed.set(0)
  }

  // @ts-ignore
  const onDrag = (e, info) => {
    speed.set(_.dragFactor * -info.delta.x)
  }

  const onDragEnd = () => {
    slowDown.current = false
    marquee.current?.classList.remove("drag")
    x.current = _.speed
  }

  useRafLoop(loop, true)

  return (
    <motion.div
      style={{
        cursor: "-webkit-grab",
        display: "flex",
        height: "var(--banner-height)",
        alignItems: "center",
        overflow: "hidden",
      }}
      ref={marquee}
      onWheel={onWheel}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      dragElastic={0.001}
    >
      <MarqueeItem speed={speed}>{children}</MarqueeItem>
      <MarqueeItem speed={speed}>{children}</MarqueeItem>
    </motion.div>
  )
}
