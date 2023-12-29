import { useEffect, useState } from 'react'
import { Button, Icon, LoaderDots } from '@components'
import s from './Steps.module.scss'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'

export default function Steps({ steps, passedSteps, setPassedSteps }) {
  const { t } = useTranslation(['cart'])
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (steps[activeStep].openOnce && passedSteps[activeStep]) {
      setActiveStep(activeStep + 1)
      return
    }

    if (steps[activeStep].onOpenHandler) {
      steps[activeStep].onOpenHandler()
    }
  }, [activeStep])

  useEffect(() => {
    if (passedSteps[activeStep] && activeStep + 1 < steps.length) {
      setActiveStep(activeStep + 1)
    }
  }, [passedSteps])

  return (
    <>
      {steps.map((step, i) => {
        return (
          <div
            className={cn(s.step, {
              [s.opened]: activeStep === i && !step.isLoading,
            })}
            key={i}
          >
            <button
              className={cn(s.step_header, {
                [s.step_header__completed]: step.openOnce && passedSteps[i],
              })}
              onClick={() => setActiveStep(i)}
              disabled={i && !passedSteps[i - 1]}
            >
              {passedSteps[i] ? (
                <Icon name="CheckRound" color="#45a884" />
              ) : (
                <span className={s.step_number}>{i + 1}</span>
              )}
              <p className={s.step_title}>{step.title}</p>
              {step.isLoading && activeStep === i && (
                <LoaderDots classname={s.step_loader} />
              )}
              {!(step.openOnce && passedSteps[i]) && (
                <Icon name="Shevron" className={cn(s.step_icon, s.step_shevron)} />
              )}
            </button>
            <div className={cn(s.step_body)}>
              <div className={s.step_body__content}>
                {((passedSteps[i - 1] && !step.isUpdateOnOpen) ||
                  (activeStep === i && step.isUpdateOnOpen) ||
                  !i) &&
                  step.body}
              </div>
              <Button
                type="submit"
                isShadow
                label={step.nextButton.label || t('next')}
                className={s.step_next}
                onClick={() => {
                  !step.nextButton.form &&
                    setPassedSteps(prev => ({ ...prev, [i]: true }))
                }}
                form={step.nextButton.form}
              />
            </div>
          </div>
        )
      })}
    </>
  )
}
