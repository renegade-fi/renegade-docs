import React, { createContext, useContext, useEffect, useState } from "react"
import { Fade, Flex, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"

import { ErrorStep } from "@/components/steppers/deposit-stepper/steps/error-step"

import { DefaultStep } from "./steps/default-step"
import { ExitStep } from "./steps/exit-step"
import { LoadingStep } from "./steps/loading-step"

const DepositStepperInner = () => {
  const { step, onClose } = useStepper()

  return (
    <Modal
      closeOnOverlayClick={false}
      isCentered
      isOpen
      onClose={onClose}
      size="sm"
    >
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent background="surfaces.1" borderRadius="10px" paddingY="6">
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

export function DepositStepper({ onClose }: { onClose: () => void }) {
  return (
    <StepperProvider onClose={onClose}>
      <DepositStepperInner />
    </StepperProvider>
  )
}

export enum ErrorType {
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
  onBack: () => void
  onClose: () => void
  onNext: () => void
  setError: (error: ErrorType) => void
  setStep: (step: Step) => void
  step: Step
}

const StepperContext = createContext<StepperContextType>({
  onBack: () => {},
  onClose: () => {},
  onNext: () => {},
  setError: () => {},
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
        onBack: handleBack,
        onClose,
        onNext: handleNext,
        setError,
        setStep,
        step,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}
