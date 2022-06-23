import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'
import { Loader } from '../../..'

import s from '../../DedicatedServers/InstructionModal/InstructionModal.module.scss'

export default function InstructionModal({ elid, closeFn }) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['vds', 'container', 'other', 'dedicated_servers'])

  const [instruction, setInstruction] = useState('')

  useEffect(() => {
    dispatch(dedicOperations.getServiceInstruction(elid, setInstruction))
  }, [])

  const htmlParser = html => {
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
    const textWithNoHTML = html.replace(htmlRegexG, '')

    const parsedText = textWithNoHTML
      .split(/\r?\n/)
      .map(el => el.replaceAll('\t', ''))
      .filter(element => element)
    const startIndex = parsedText.indexOf(t('instruction_title'))
    const res = parsedText.slice(startIndex)

    const data = {
      service_name: res[0],
      welcome: res[1],
      inform_text: res[2],
      service_info: res[3],
      service_package: res[4],
      setup_date: res[5],
      domain_name: res[6],
      ip_address: res[7],
      access_type: res[8],
      password: res[9],
      vm_manager: res[10],
      vm_desc: res[11],
      link: res[12],
      user: res[13],
      vm_password: res[14],
      vm_password_value: res[15],
      personal_account_info: res[16],
      red_text: res[17],
      red_text_2: res[18],
      red_text_3: res[19],
      conclusion_text: res[20],
    }

    return data
  }

  let instructionObject

  if (instruction) {
    instructionObject = htmlParser(instruction?.$)
  }

  if (!instruction) {
    return <Loader />
  }

  return (
    <>
      <div className={s.instruction_modal}>
        <div className={s.title_wrapper}>
          <div className={s.title}>
            <h3 className={s.modal_title}>
              {t(`${instructionObject?.service_name}`, { ns: 'dedicated_servers' })}
            </h3>
          </div>
          <Cross className={s.icon_cross} onClick={closeFn} width={15} height={15} />
        </div>
        <p className={s.welcome}>{instructionObject?.welcome}</p>
        <p className={s.inform_text}>{instructionObject?.inform_text}</p>
        <p className={s.service_info}>{instructionObject?.service_info}:</p>
        <div className={s.server_info_block}>
          <span className={s.label}>
            {instructionObject?.service_package.split(':')[0]}:
          </span>
          <span className={s.value}>
            {instructionObject?.service_package.split(':')[1]}
          </span>

          <span className={s.label}>{instructionObject?.setup_date.split(':')[0]}:</span>
          <span className={s.value}>{instructionObject?.setup_date.split(':')[1]}</span>

          <span className={s.label}>{instructionObject?.domain_name.split(':')[0]}:</span>
          <span className={s.value}>{instructionObject?.domain_name.split(':')[1]}</span>

          <span className={s.label}>{instructionObject?.ip_address.split(':')[0]}:</span>
          <span className={s.value}>{instructionObject?.ip_address.split(':')[1]}</span>

          <span className={s.label}>{instructionObject?.access_type.split(':')[0]}:</span>
          <span className={s.value}>{instructionObject?.access_type.split(':')[1]}</span>

          <span className={s.label}>{instructionObject?.password.split(':')[0]}:</span>
          <span className={s.value}>{instructionObject?.password.split(':')[1]}</span>
        </div>
        <p className={s.service_info}>{instructionObject?.vm_manager}</p>
        <p className={s.inform_text}>{instructionObject?.vm_desc}</p>
        <div className={s.server_info_block}>
          <span className={s.label}>{instructionObject?.link.split(': ')[0]}:</span>
          <a
            className={s.link}
            href={instructionObject?.link.split(': ')[1]}
            target="_blank"
            rel="noreferrer"
          >
            {instructionObject?.link.split(': ')[1]}
          </a>

          <span className={s.label}>{instructionObject?.user.split(':')[0]}:</span>
          <span className={s.value}>{instructionObject?.user.split(':')[1]}</span>

          <span className={s.label}>{instructionObject?.vm_password}</span>
          <span className={s.value}>{instructionObject?.vm_password_value}</span>
        </div>
        <p className={s.inform_text}>{instructionObject?.personal_account_info}</p>

        <p className={s.warning_text}>
          {instructionObject?.red_text.split(':')[0]}:{' '}
          <a
            className={s.link}
            href={instructionObject?.red_text.split(': ')[1]}
            target="_blank"
            rel="noreferrer"
          >
            {instructionObject?.red_text.split(': ')[1]}
          </a>
          <br />
          {instructionObject?.red_text_2}
          {instructionObject?.red_text_3.split(':')[0]}
          <span className={s.promocode}>
            {instructionObject?.red_text_3.split(':')[1]}
          </span>
        </p>

        <p className={s.conclusion}>
          {instructionObject?.conclusion_text?.split('!')[0]}
        </p>
        <p className={s.signature}>{instructionObject?.conclusion_text?.split('!')[1]}</p>
      </div>
    </>
  )
}
