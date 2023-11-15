"use client"

import React, { useEffect, useState } from "react"
import { useApp } from "@/contexts/App/app-context"
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons"
import { Flex, Text } from "@chakra-ui/react"

import { safeLocalStorageGetItem, safeLocalStorageSetItem } from "@/lib/utils"

export const expandedPanelWidth = "calc(6.5 * var(--banner-height))"
export const collapsedPanelWidth = "calc(1.4 * var(--banner-height))"

// Set the scrollbar to hidden after a timeout.
let scrollTimer: NodeJS.Timeout
export function callAfterTimeout(func: () => void, timeout: number) {
  return (...args: any[]) => {
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args)
    }, timeout)
  }
}

interface SinglePanelCollapsedProps {
  displayText: string
  flipDirection: boolean
  isFirst: boolean
}
function SinglePanelCollapsed(props: SinglePanelCollapsedProps) {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexGrow="1"
      width="100%"
      borderColor="border"
      borderBottom={props.isFirst ? "var(--border)" : undefined}
    >
      <Text
        minWidth="200px"
        textAlign="center"
        transform={props.flipDirection ? "rotate(90deg)" : "rotate(-90deg)"}
      >
        {props.displayText}
      </Text>
    </Flex>
  )
}

interface PanelCollapsedProps {
  displayTexts: string[]
  flipDirection: boolean
}
function PanelCollapsed(props: PanelCollapsedProps) {
  return (
    <Flex
      position="relative"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      width={collapsedPanelWidth}
      borderColor="border"
      borderRight={props.flipDirection ? undefined : "var(--border)"}
      borderLeft={props.flipDirection ? "var(--border)" : undefined}
      userSelect="none"
    >
      <Flex
        position="absolute"
        top="9px"
        alignItems="center"
        justifyContent="center"
        width="calc(0.6 * var(--banner-height))"
        height="calc(0.6 * var(--banner-height))"
        borderRadius="100px"
      >
        {props.flipDirection ? (
          <ArrowLeftIcon boxSize="11px" color="white.80" />
        ) : (
          <ArrowRightIcon boxSize="11px" color="white.80" />
        )}
      </Flex>
      <SinglePanelCollapsed
        displayText={props.displayTexts[0]}
        flipDirection={props.flipDirection}
        isFirst={true}
      />
      <SinglePanelCollapsed
        displayText={props.displayTexts[1]}
        flipDirection={props.flipDirection}
        isFirst={false}
      />
    </Flex>
  )
}

interface PanelProps {
  flipDirection: boolean
  isOpenConnectKitModal: boolean
  panelCollapsedDisplayTexts: string[]
  panelExpanded: (
    isLocked: boolean,
    toggleIsLocked: () => void
  ) => React.ReactElement
}

export function Panel({
  flipDirection,
  panelCollapsedDisplayTexts,
  panelExpanded,
}: PanelProps) {
  const key = `${flipDirection ? "right" : "left"}-panel-isLocked`

  const { isOnboarding } = useApp()
  const [isLocked, setIsLocked] = useState(
    safeLocalStorageGetItem(key) === "true" || false
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const lockState = safeLocalStorageGetItem(key) === "true"
    if (isLocked !== lockState) {
      setIsLocked(lockState)
    }
  }, [isLocked, key])

  useEffect(() => {
    if (safeLocalStorageGetItem(key) === "true" && !isOpen) {
      setIsOpen(true)
    }
  }, [isOpen, key])

  const onMouseEnter = () => {
    setIsOpen(true)
  }

  const onMouseLeave = () => {
    setIsOpen(isOnboarding || safeLocalStorageGetItem(key) === "true")
  }

  const toggleIsLocked = () => {
    const nextState = safeLocalStorageGetItem(key) === "true" ? "false" : "true"
    safeLocalStorageSetItem(key, nextState)
    setIsLocked(nextState === "true")
  }

  const isExpanded = isLocked || isOpen

  const collapsedTransform = isExpanded
    ? flipDirection
      ? "translateX(100%)"
      : "translateX(-100%)"
    : "translateX(0)"

  return (
    <Flex
      position="relative"
      justifyContent={flipDirection ? "right" : "left"}
      flexGrow="0"
      flexShrink="0"
      flexBasis={isExpanded ? expandedPanelWidth : collapsedPanelWidth}
      transition="flex-basis 0.15s ease"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Flex
        position="absolute"
        right={flipDirection ? undefined : "0"}
        left={flipDirection ? "0" : undefined}
        height="100%"
      >
        {panelExpanded(isLocked, toggleIsLocked)}
      </Flex>
      <Flex
        background="black"
        transform={collapsedTransform}
        transition="transform 0.15s ease"
      >
        <PanelCollapsed
          displayTexts={panelCollapsedDisplayTexts}
          flipDirection={flipDirection}
        />
      </Flex>
    </Flex>
  )
}

export default Panel
