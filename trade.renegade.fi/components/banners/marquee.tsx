import React, {
  CSSProperties,
  Children,
  FC,
  Fragment,
  MutableRefObject,
  ReactNode,
  RefAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import "@/styles/marquee.css"

type MarqueeProps = {
  style?: CSSProperties
  className?: string
  autoFill?: boolean
  play?: boolean
  pauseOnHover?: boolean
  direction?: "left" | "right" | "up" | "down"
  speed?: number
  delay?: number
  loop?: number
  children?: ReactNode
} & RefAttributes<HTMLDivElement>

const Marquee: FC<MarqueeProps> = forwardRef(function Marquee(
  {
    style = {},
    className = "",
    autoFill = false,
    play = true,
    pauseOnHover = false,
    direction = "left",
    speed = 50,
    delay = 0,
    loop = 0,
    children,
  },
  ref
) {
  const [containerWidth, setContainerWidth] = useState(0)
  const [marqueeWidth, setMarqueeWidth] = useState(0)
  const [multiplier, setMultiplier] = useState(1)
  const [isMounted, setIsMounted] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const containerRef = (ref as MutableRefObject<HTMLDivElement>) || rootRef
  const marqueeRef = useRef<HTMLDivElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsDragging(true)
      setStartX(event.clientX)
    },
    []
  )

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging) return
      const currentX = event.clientX
      const deltaX = currentX - startX
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: -deltaX })
        setStartX(currentX)
      }
    },
    [containerRef, isDragging, startX]
  )

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [isDragging, onMouseMove, onMouseUp])

  // Calculate width of container and marquee and set multiplier
  const calculateWidth = useCallback(() => {
    if (marqueeRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const marqueeRect = marqueeRef.current.getBoundingClientRect()
      let containerWidth = containerRect.width
      let marqueeWidth = marqueeRect.width

      // Swap width and height if direction is up or down
      if (direction === "up" || direction === "down") {
        containerWidth = containerRect.height
        marqueeWidth = marqueeRect.height
      }

      if (autoFill && containerWidth && marqueeWidth) {
        setMultiplier(
          marqueeWidth < containerWidth
            ? Math.ceil(containerWidth / marqueeWidth)
            : 1
        )
      } else {
        setMultiplier(1)
      }

      setContainerWidth(containerWidth)
      setMarqueeWidth(marqueeWidth)
    }
  }, [autoFill, containerRef, direction])

  // Calculate width and multiplier on mount and on window resize
  useEffect(() => {
    if (!isMounted) return

    calculateWidth()
    if (marqueeRef.current && containerRef.current) {
      const resizeObserver = new ResizeObserver(() => calculateWidth())
      resizeObserver.observe(containerRef.current)
      resizeObserver.observe(marqueeRef.current)
      return () => {
        if (!resizeObserver) return
        resizeObserver.disconnect()
      }
    }
  }, [calculateWidth, containerRef, isMounted])

  // Recalculate width when children change
  useEffect(() => {
    calculateWidth()
  }, [calculateWidth, children])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Animation duration
  const duration = useMemo(() => {
    if (autoFill) {
      return (marqueeWidth * multiplier) / speed
    } else {
      return marqueeWidth < containerWidth
        ? containerWidth / speed
        : marqueeWidth / speed
    }
  }, [autoFill, containerWidth, marqueeWidth, multiplier, speed])

  const containerStyle = useMemo(
    () => ({
      ...style,
      ["--pause-on-hover" as string]:
        !play || pauseOnHover ? "paused" : "running",
      ["--pause-on-click" as string]:
        !play || pauseOnHover ? "paused" : "running",
      ["--width" as string]:
        direction === "up" || direction === "down" ? `100vh` : "100%",
      ["--transform" as string]:
        direction === "up"
          ? "rotate(-90deg)"
          : direction === "down"
          ? "rotate(90deg)"
          : "none",
    }),
    [style, play, pauseOnHover, direction]
  )

  const marqueeStyle = useMemo(
    () => ({
      ["--play" as string]: play ? "running" : "paused",
      ["--direction" as string]: direction === "left" ? "normal" : "reverse",
      ["--duration" as string]: `${duration}s`,
      ["--delay" as string]: `${delay}s`,
      ["--iteration-count" as string]: !!loop ? `${loop}` : "infinite",
      ["--min-width" as string]: autoFill ? `auto` : "100%",
    }),
    [play, direction, duration, delay, loop, autoFill]
  )

  const childStyle = useMemo(
    () => ({
      ["--transform" as string]:
        direction === "up"
          ? "rotate(90deg)"
          : direction === "down"
          ? "rotate(-90deg)"
          : "none",
    }),
    [direction]
  )

  // Render {multiplier} number of children
  const multiplyChildren = useCallback(
    (multiplier: number) => {
      return [
        ...Array(
          Number.isFinite(multiplier) && multiplier >= 0 ? multiplier : 0
        ),
      ].map((_, i) => (
        <Fragment key={i}>
          {Children.map(children, (child) => {
            return (
              <div style={childStyle} className="rfm-child">
                {child}
              </div>
            )
          })}
        </Fragment>
      ))
    },
    [childStyle, children]
  )

  return !isMounted ? null : (
    <div
      ref={containerRef}
      style={containerStyle}
      className={"rfm-marquee-container " + className}
      onMouseDown={onMouseDown}
    >
      <div className="rfm-marquee" style={marqueeStyle}>
        <div className="rfm-initial-child-container" ref={marqueeRef}>
          {Children.map(children, (child) => {
            return (
              <div style={childStyle} className="rfm-child">
                {child}
              </div>
            )
          })}
        </div>
        {multiplyChildren(multiplier - 1)}
      </div>
      <div className="rfm-marquee" style={marqueeStyle}>
        {multiplyChildren(multiplier)}
      </div>
    </div>
  )
})

export default Marquee
