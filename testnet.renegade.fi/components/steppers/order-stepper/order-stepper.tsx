import React, { createContext, useContext, useState } from "react"
import { Fade, Flex, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"

import { ConfirmStep } from "./steps/confirm-step"
import { ExitStep } from "./steps/exit-step"
import { LoadingStep } from "./steps/loading-step"

const OrderStepperInner = () => {
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
      <ModalContent background="surfaces.1" borderRadius="10px">
        <Flex justifyContent="center" flexDirection="column" height="348px">
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

export enum Step {
  DEFAULT,
  LOADING,
  EXIT,
}

interface StepperContextType {
  midpoint: number
  onBack: () => void
  onClose: () => void
  onNext: () => void
  setMidpoint: (midpoint: number) => void
  setStep: (step: Step) => void
  step: Step
}

const StepperContext = createContext<StepperContextType>({
  midpoint: 0,
  onBack: () => {},
  onClose: () => {},
  onNext: () => {},
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

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <StepperContext.Provider
      value={{
        midpoint,
        onBack: handleBack,
        onClose,
        onNext: handleNext,
        setMidpoint,
        setStep,
        step,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}
