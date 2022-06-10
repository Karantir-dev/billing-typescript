import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'

import s from './InstructionModal.module.scss'

export default function InstructionModal({ elid, closeFn }) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['vds', 'container', 'other', 'dedicated_servers'])

  const [instruction, setInstruction] = useState('')

  const htmlParser = html => {
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
    const textWithNoHTML = html.replace(htmlRegexG, '')

    const parsedText = textWithNoHTML
      .split(/\r?\n/)
      .map(el => el.replaceAll('\t', ''))
      .filter(element => element)
    const startIndex = parsedText.indexOf('Activation of Dedicated server')
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
      ssh_tip: res[9],
      ssh_server: res[10],
      username: res[11],
      password: res[12],
      'Information about payments and service management': res[13],
      about_service: res[14],
      'tip with payments': res[15],
      'personal account info': res[16],
      ctredits_payments: res[17],
      expenses: res[18],
      current_service: res[19],
      support: res[20],
      recomendations: {
        first_line: res[21],
        second_line: res[23],
        third_line: res[25],
      },
      conclusion_text: res[27],
    }

    return data
  }

  let instructionObject

  if (instruction) {
    instructionObject = htmlParser(instruction?.$)
  }

  useEffect(() => {
    dispatch(dedicOperations.getServiceInstruction(elid, setInstruction))
  }, [])

  return (
    <>
      <div className={s.history_modal}>
        <div className={s.title_wrapper}>
          <div className={s.title}>
            <h3 className={s.modal_title}>
              {t(`${instructionObject.service_name}`, { ns: 'dedicated_servers' })}
            </h3>
            <p className={s.service_name}>{'name of service'}</p>
          </div>
          <Cross className={s.icon_cross} onClick={closeFn} width={15} height={15} />
        </div>
        <p className={s.welcome}>
          {t(`${instructionObject.welcome}`, { ns: 'dedicated_servers' })}
        </p>
        <p className={s.inform_text}>
          {t(`${instructionObject.inform_text}`, { ns: 'dedicated_servers' })}
        </p>

        <p className={s.service_info}>
          {t(`${instructionObject.service_info}`, { ns: 'dedicated_servers' })}
        </p>

        <div className={s.server_info}>
          <span className={s.label}>
            {t(`${instructionObject.service_package.split(':')[0]}`)}:
          </span>
          <span className={s.value}>
            {t(`${instructionObject.service_package.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject.setup_date.split(':')[0]}`)}:
          </span>
          <span className={s.value}>
            {t(`${instructionObject.setup_date.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject.domain_name.split(':')[0]}`)}:
          </span>
          <span className={s.value}>
            {t(`${instructionObject.domain_name.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject.ip_address.split(':')[0]}`)}:
          </span>
          <span className={s.value}>
            {t(`${instructionObject.ip_address.split(':')[1]}`)}
          </span>
        </div>

        <h4 className={s.access_type}>{t(`${instructionObject.access_type}`)}</h4>
        <p className={s.ssh_tip}>{t(`${instructionObject.ssh_tip}`)}</p>

        <div className={s.server_info}>
          <span className={s.label}>
            {t(`${instructionObject.ssh_server.split(':')[0]}`)}:
          </span>
          <span className={s.value}>
            {t(`${instructionObject.ssh_server.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject.username.split(':')[0]}`)}:
          </span>
          <span className={s.value}>
            {t(`${instructionObject.username.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject.password.split(':')[0]}`)}:
          </span>
          <span className={s.value}>
            {t(`${instructionObject.password.split(':')[1]}`)}
          </span>
        </div>
      </div>
    </>
  )
}
