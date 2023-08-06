import React, { createContext, useContext, useState } from "react"
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"

import DefaultStep from "./steps/confirm-step"
import ExitStep from "./steps/exit-step"
import LoadingStep from "./steps/loading-step"

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
      <ModalContent
        paddingTop="6"
        paddingBottom="4"
        background="surfaces.1"
        borderRadius="10px"
      >
        {step === Step.DEFAULT && <DefaultStep />}
        {step === Step.LOADING && <LoadingStep />}
        {step === Step.EXIT && <ExitStep />}
      </ModalContent>
    </Modal>
  )
}

export default function OrderStepper({ onClose }: { onClose: () => void }) {
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
  onNext: () => void
  onBack: () => void
  step: Step
  setStep: (step: Step) => void
  onClose: () => void
}

const StepperContext = createContext<StepperContextType>({
  onNext: () => {},
  onBack: () => {},
  step: Step.DEFAULT,
  setStep: () => {},
  onClose: () => {},
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

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <StepperContext.Provider
      value={{ onNext: handleNext, onBack: handleBack, step, setStep, onClose }}
    >
      {children}
    </StepperContext.Provider>
  )
}
