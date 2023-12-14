import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskType } from "@/contexts/Renegade/types"
import {
    Button,
    Flex,
    HStack,
    ModalBody,
    ModalFooter,
    Text,
} from "@chakra-ui/react"
import { Token } from "@renegade-fi/renegade-js"
import { Repeat2 } from "lucide-react"

import { getNetwork } from "@/lib/utils"
import { renegade } from "@/app/providers"

import { useStepper } from "../testnet-stepper"

export function DefaultStep() {
    const { accountId, setTask } = useRenegade()
    const { onNext, setTicker, ticker } = useStepper()

    const amount = ticker === "USDC" ? 10000 : 10

    const handleDeposit = async () => {
        if (!accountId) return
        renegade.task
            .deposit(
                accountId,
                new Token({ ticker, network: getNetwork() }),
                BigInt(amount)
            )
            .then(([taskId]) => setTask(taskId, TaskType.Deposit))
            .then(() => onNext())
    }

    return (
        <>
            <ModalBody>
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    gap="8px"
                    textAlign="center"
                >
                    <Text
                        color="white.50"
                        fontFamily="Favorit Extended"
                        fontSize="1.3em"
                        fontWeight="200"
                    >
                        Deposit test funds into your Renegade account
                    </Text>
                    <HStack
                        gap="2"
                        _hover={{
                            opacity: 0.6,
                        }}
                        cursor="pointer"
                        transition="opacity 0.2s ease-in-out"
                        onClick={() =>
                            setTicker((t) => (t === "USDC" ? "WETH" : "USDC"))
                        }
                    >
                        <Text fontFamily="Aime" fontSize="3em" fontWeight="700">
                            {`${amount === 10000 ? "10,000" : "10"} ${ticker}`}
                        </Text>
                        <Repeat2 size={24} />
                    </HStack>
                </Flex>
            </ModalBody>
            <ModalFooter justifyContent="center">
                <Button
                    padding="20px"
                    color="white.80"
                    fontSize="1.2em"
                    fontWeight="200"
                    borderWidth="thin"
                    borderColor="white.40"
                    borderRadius="100px"
                    _hover={{
                        borderColor: "white.60",
                        color: "white",
                    }}
                    _focus={{
                        backgroundColor: "transparent",
                    }}
                    transition="0.15s"
                    backgroundColor="transparent"
                    onClick={handleDeposit}
                >
                    Deposit
                </Button>
            </ModalFooter>
        </>
    )
}
