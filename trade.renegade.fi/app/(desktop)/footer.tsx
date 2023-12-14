"use client"

import React from "react"
import Image from "next/image"
import logoDark from "@/icons/logo_dark.svg"
import { Box, Flex, Link, Text } from "@chakra-ui/react"

interface FooterState {
    logoRef: React.RefObject<HTMLDivElement>
    showDownloadPrompt: boolean
}
export class Footer extends React.Component<
    Record<string, never>,
    FooterState
> {
    constructor(props: Record<string, never>) {
        super(props)
        this.state = {
            logoRef: React.createRef(),
            showDownloadPrompt: false,
        }
        this.handleContextMenu = this.handleContextMenu.bind(this)
    }

    componentDidMount() {
        document.addEventListener("contextmenu", this.handleContextMenu)
    }

    componentWillUnmount() {
        document.removeEventListener("contextmenu", this.handleContextMenu)
    }

    handleContextMenu(e: MouseEvent) {
        if (!this.state.logoRef.current) {
            return
        }
        // If the context menu click does not intersect the logo, ignore.
        const boundingBox = this.state.logoRef.current.getBoundingClientRect()
        if (
            boundingBox.left > e.pageX ||
            boundingBox.right < e.pageX ||
            boundingBox.top > e.pageY ||
            boundingBox.bottom < e.pageY
        ) {
            return
        }
        e.preventDefault()
        this.setState({ showDownloadPrompt: true })
    }

    render() {
        return (
            <Flex
                position="relative"
                alignItems="center"
                width="100%"
                height="120px"
                onClick={() => this.setState({ showDownloadPrompt: false })}
            >
                <Flex
                    alignItems="center"
                    gap="30px"
                    width="30%"
                    marginLeft="2%"
                    userSelect="none"
                >
                    <Box ref={this.state.logoRef}>
                        <Image alt="Renegade Logo" height="30" src={logoDark} />
                    </Box>
                    <Link
                        color="white.90"
                        fontSize="1.1em"
                        fontWeight="300"
                        opacity={this.state.showDownloadPrompt ? 1 : 0}
                        transform={
                            this.state.showDownloadPrompt ?
                                "translateX(0px)"
                            :   "translateX(-15px)"
                        }
                        pointerEvents={
                            this.state.showDownloadPrompt ? undefined : "none"
                        }
                        transition="0.2s"
                        href="https://renegade.fi/logos.zip"
                        isExternal
                    >
                        Download Logo Pack
                    </Link>
                </Flex>
                <Box
                    position="absolute"
                    right="0"
                    left="0"
                    display="grid"
                    placeContent="center"
                >
                    <Text color="white.90" fontSize="1.1em" fontWeight="300">
                        TESTNET
                    </Text>
                </Box>
            </Flex>
        )
    }
}
