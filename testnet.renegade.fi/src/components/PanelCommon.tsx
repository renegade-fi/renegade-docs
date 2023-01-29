import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export const expandedPanelWidth = "calc(7 * var(--banner-height))";
export const collapsedPanelWidth = "calc(1.5 * var(--banner-height))";

interface SinglePanelCollapsedProps {
  displayText: string;
  flipDirection: boolean;
  isFirst: boolean;
}
function SinglePanelCollapsed(props: SinglePanelCollapsedProps) {
  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexGrow="1"
      borderBottom={props.isFirst ? "var(--border)" : undefined}
      borderColor="border"
    >
      <Text
        minWidth="200px"
        textAlign="center"
        transform={props.flipDirection ? "rotate(90deg)" : "rotate(-90deg)"}
      >
        {props.displayText}
      </Text>
    </Flex>
  );
}

interface PanelCollapsedProps {
  displayTexts: string[];
  flipDirection: boolean;
}
function PanelCollapsed(props: PanelCollapsedProps) {
  return (
    <Flex
      width={collapsedPanelWidth}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      borderLeft={props.flipDirection ? "var(--border)" : undefined}
      borderRight={props.flipDirection ? undefined : "var(--border)"}
      borderColor="border"
      userSelect="none"
      position="relative"
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        position="absolute"
        top="9px"
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
  );
}

interface PanelProps {
  panelExpanded: (
    isLocked: boolean,
    toggleIsLocked: () => void,
  ) => React.ReactElement;
  panelCollapsedDisplayTexts: string[];
  isOpenGlobalModal: boolean;
  isOpenConnectKitModal: boolean;
  flipDirection: boolean;
}
interface PanelState {
  isHovering: boolean;
  isLocked: boolean;
  isOpenModalWhenLeft: boolean;
  isModalJustClosed: boolean;
}
export class Panel extends React.Component<PanelProps, PanelState> {
  constructor(props: PanelProps) {
    super(props);
    this.state = {
      isHovering: false,
      isLocked: false,
      isOpenModalWhenLeft: false,
      isModalJustClosed: false,
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.toggleIsLocked = this.toggleIsLocked.bind(this);
  }

  componentDidUpdate(prevProps: PanelProps) {
    if (
      (!this.props.isOpenGlobalModal && prevProps.isOpenGlobalModal) ||
      (!this.props.isOpenConnectKitModal && prevProps.isOpenConnectKitModal)
    ) {
      this.setState({ isModalJustClosed: true });
      setTimeout(() => this.setState({ isModalJustClosed: false }), 750);
    }
  }

  onMouseEnter() {
    this.setState({
      isHovering: true,
      isOpenModalWhenLeft: false,
    });
  }

  onMouseLeave() {
    this.setState({
      isHovering: false,
      isOpenModalWhenLeft:
        this.props.isOpenGlobalModal || this.props.isOpenConnectKitModal,
    });
  }

  toggleIsLocked() {
    this.setState({
      isLocked: !this.state.isLocked,
    });
  }

  render() {
    const isExpanded =
      this.state.isHovering ||
      this.state.isLocked ||
      (this.state.isOpenModalWhenLeft &&
        (this.props.isOpenGlobalModal ||
          this.props.isOpenConnectKitModal ||
          this.state.isModalJustClosed));
    const collapsedTransform = isExpanded
      ? this.props.flipDirection
        ? "translateX(100%)"
        : "translateX(-100%)"
      : "translateX(0)";
    return (
      <Flex
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        justifyContent={this.props.flipDirection ? "right" : "left"}
        width={isExpanded ? expandedPanelWidth : collapsedPanelWidth}
        transition="width 0.15s ease"
        position="relative"
      >
        <Flex
          height="100%"
          position="absolute"
          right={this.props.flipDirection ? undefined : "0"}
          left={this.props.flipDirection ? "0" : undefined}
        >
          {this.props.panelExpanded(this.state.isLocked, this.toggleIsLocked)}
        </Flex>
        <Flex
          transform={collapsedTransform}
          transition="transform 0.15s ease"
          bg="black"
        >
          <PanelCollapsed
            displayTexts={this.props.panelCollapsedDisplayTexts}
            flipDirection={this.props.flipDirection}
          />
        </Flex>
      </Flex>
    );
  }
}
