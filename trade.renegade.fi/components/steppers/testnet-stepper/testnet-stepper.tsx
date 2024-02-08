import {
  Fade,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay
} from "@chakra-ui/react"
import React, { createContext, useContext, useState } from "react"

import { DefaultStep } from "@/components/steppers/testnet-stepper/steps/default-step"
import { ExitStep } from "@/components/steppers/testnet-stepper/steps/exit-step"
import { LoadingStep } from "@/components/steppers/testnet-stepper/steps/loading-step"

const TestnetStepperInner = () => {
  const { step, onClose } = useStepper()

  return (
    <Modal
      isCentered
      isOpen
      onClose={onClose}
      size="sm"
    >
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent background="surfaces.1" borderRadius="10">
        <Flex justifyContent="center" flexDirection="column" height="288px">
          <Fade
            transition={{ enter: { duration: 0.25 } }}
            in={step === Step.DEFAULT}
          >
            {step === Step.DEFAULT && <DefaultStep />}
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
        </Flex>
      </ModalContent>
    </Modal>
  )
}

export enum Step {
  DEFAULT,
  LOADING,
  EXIT,
}

const StepperContext = createContext<{
  onBack: () => void
  onClose: () => void
  onNext: () => void
  setStep: (step: Step) => void
  setTicker: React.Dispatch<React.SetStateAction<string>>
  step: Step
  ticker: string
}>({
  onBack: () => { },
  onClose: () => { },
  onNext: () => { },
  setStep: () => { },
  setTicker: () => { },
  step: Step.DEFAULT,
  ticker: "WETH",
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
  const [ticker, setTicker] = useState(() => {
    const random = Math.random()
    return random > 0.5 ? "USDC" : "WETH"
  })

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <StepperContext.Provider
      value={{
        onBack: handleBack,
        onClose,
        onNext: handleNext,
        setStep,
        setTicker,
        step,
        ticker,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}

export function TestnetStepper({ onClose }: { onClose: () => void }) {
  return (
    <StepperProvider
      onClose={onClose}
    >
      <TestnetStepperInner />
    </StepperProvider>
  )
}
