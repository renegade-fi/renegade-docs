import React, { createContext, useContext, useState } from "react"
import { Fade, Flex, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"

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
      <ModalContent background="surfaces.1" borderRadius="10px">
        <Flex justifyContent="center" flexDirection="column" height="348px">
          <Fade
            transition={{ enter: { duration: 1 } }}
            in={step === Step.DEFAULT}
          >
            {step === Step.DEFAULT && <DefaultStep />}
          </Fade>
          <Fade
            transition={{ enter: { duration: 1 } }}
            in={step === Step.LOADING}
          >
            {step === Step.LOADING && <LoadingStep />}
          </Fade>
          <Fade transition={{ enter: { duration: 1 } }} in={step === Step.EXIT}>
            {step === Step.EXIT && <ExitStep />}
          </Fade>
        </Flex>
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
