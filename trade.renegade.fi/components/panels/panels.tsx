import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons"
import { Flex, Text } from "@chakra-ui/react"
import React from "react"

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
  panelExpanded: (
    isLocked: boolean,
    toggleIsLocked: () => void
  ) => React.ReactElement
  panelCollapsedDisplayTexts: string[]
  isOpenConnectKitModal: boolean
  flipDirection: boolean
}
interface PanelState {
  isHovering: boolean
  isLocked: boolean
  isOpenModalWhenLeft: boolean
  isModalJustClosed: boolean
}
export class Panel extends React.Component<PanelProps, PanelState> {
  constructor(props: PanelProps) {
    super(props)
    this.state = {
      isHovering: false,
      isLocked:
        localStorage.getItem(this.getLocalStorageKey()) === "true" || false,
      isOpenModalWhenLeft: false,
      isModalJustClosed: false,
    }
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.toggleIsLocked = this.toggleIsLocked.bind(this)
  }

  componentDidUpdate(prevProps: PanelProps) {
    if (!this.props.isOpenConnectKitModal && prevProps.isOpenConnectKitModal) {
      this.setState({ isModalJustClosed: true })
      setTimeout(
        () =>
          this.setState({
            isModalJustClosed: false,
            isOpenModalWhenLeft: false,
          }),
        750
      )
    }
  }

  getLocalStorageKey() {
    return `renegade-is-locked-${this.props.flipDirection ? "right" : "left"}`
  }

  onMouseEnter() {
    this.setState({
      isHovering: true,
      isOpenModalWhenLeft: false,
    })
  }

  onMouseLeave() {
    this.setState({
      isHovering: false,
      isOpenModalWhenLeft: this.props.isOpenConnectKitModal,
    })
  }

  toggleIsLocked() {
    localStorage.setItem(
      this.getLocalStorageKey(),
      (!this.state.isLocked).toString()
    )
    this.setState({
      isLocked: !this.state.isLocked,
    })
  }

  render() {
    const isExpanded =
      this.state.isHovering ||
      this.state.isLocked ||
      (this.state.isOpenModalWhenLeft &&
        (this.props.isOpenConnectKitModal || this.state.isModalJustClosed))
    const collapsedTransform = isExpanded
      ? this.props.flipDirection
        ? "translateX(100%)"
        : "translateX(-100%)"
      : "translateX(0)"
    return (
      <Flex
        position="relative"
        justifyContent={this.props.flipDirection ? "right" : "left"}
        flexGrow="0"
        flexShrink="0"
        flexBasis={isExpanded ? expandedPanelWidth : collapsedPanelWidth}
        transition="flex-basis 0.15s ease"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Flex
          position="absolute"
          right={this.props.flipDirection ? undefined : "0"}
          left={this.props.flipDirection ? "0" : undefined}
          height="100%"
        >
          {this.props.panelExpanded(this.state.isLocked, this.toggleIsLocked)}
        </Flex>
        <Flex
          background="black"
          transform={collapsedTransform}
          transition="transform 0.15s ease"
        >
          <PanelCollapsed
            displayTexts={this.props.panelCollapsedDisplayTexts}
            flipDirection={this.props.flipDirection}
          />
        </Flex>
      </Flex>
    )
  }
}
