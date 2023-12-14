import React, { createContext, useContext, useEffect, useState } from "react"
import {
    Fade,
    Flex,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react"

import { ErrorStep } from "@/components/steppers/order-stepper/steps/error-step"

import { ConfirmStep } from "./steps/confirm-step"
import { ExitStep } from "./steps/exit-step"
import { LoadingStep } from "./steps/loading-step"

const OrderStepperInner = () => {
    const { step, onClose } = useStepper()

    return (
        <Modal isCentered isOpen onClose={onClose} size="sm">
            <ModalOverlay
                background="rgba(0, 0, 0, 0.25)"
                backdropFilter="blur(8px)"
            />
            <ModalContent background="surfaces.1" borderRadius="10px">
                <ModalCloseButton />
                <Flex
                    justifyContent="center"
                    flexDirection="column"
                    height="348px"
                >
                    <Fade
                        transition={{ enter: { duration: 0.25 } }}
                        in={step === Step.DEFAULT}
                    >
                        {step === Step.DEFAULT && <ConfirmStep />}
                    </Fade>
                    <Fade
                        transition={{ enter: { duration: 0.25 } }}
                        in={step === Step.LOADING}
                    >
                        {step === Step.LOADING && <LoadingStep />}
                    </Fade>
                    <Fade
                        transition={{ enter: { duration: 0.25 } }}
                        in={step === Step.EXIT}
                    >
                        {step === Step.EXIT && <ExitStep />}
                    </Fade>
                    <Fade
                        transition={{ enter: { duration: 0.25 } }}
                        in={step === Step.ERROR}
                    >
                        {step === Step.ERROR && <ErrorStep />}
                    </Fade>
                </Flex>
            </ModalContent>
        </Modal>
    )
}

export function OrderStepper({ onClose }: { onClose: () => void }) {
    return (
        <StepperProvider onClose={onClose}>
            <OrderStepperInner />
        </StepperProvider>
    )
}

export enum ErrorType {
    ORDERBOOK_FULL = "ORDERBOOK_FULL",
    WALLET_LOCKED = "WALLET_LOCKED",
}

export enum Step {
    DEFAULT,
    LOADING,
    EXIT,
    ERROR,
}

interface StepperContextType {
    error?: ErrorType
    midpoint: number
    onBack: () => void
    onClose: () => void
    onNext: () => void
    setError: (error: ErrorType) => void
    setMidpoint: (midpoint: number) => void
    setStep: (step: Step) => void
    step: Step
}

const StepperContext = createContext<StepperContextType>({
    midpoint: 0,
    onBack: () => {},
    onClose: () => {},
    onNext: () => {},
    setError: () => {},
    setMidpoint: () => {},
    setStep: () => {},
    step: Step.DEFAULT,
})

export const useStepper = () => useContext(StepperContext)

const StepperProvider = ({
    children,
    onClose,
}: {
    children: React.ReactNode
    onClose: () => void
}) => {
    const [step, setStep] = useState(Step.DEFAULT)
    const [midpoint, setMidpoint] = useState(0)
    const [error, setError] = useState<ErrorType>()

    const handleNext = () => {
        setStep(step + 1)
    }

    const handleBack = () => {
        setStep(step - 1)
    }

    useEffect(() => {
        if (error) setStep(Step.ERROR)
    }, [error])

    return (
        <StepperContext.Provider
            value={{
                error,
                midpoint,
                onBack: handleBack,
                onClose,
                onNext: handleNext,
                setError,
                setMidpoint,
                setStep,
                step,
            }}
        >
            {children}
        </StepperContext.Provider>
    )
}
