import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { Cross } from '../../../../images'
import { dedicOperations } from '../../../../Redux'
import * as route from '../../../../routes'
import { Loader } from '../../..'

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
    // const startIndex = parsedText.indexOf('Activation of Dedicated server')
    const res = parsedText.slice(12)

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
      information_about_payments_and_service_management: res[13],
      about_service: res[14],
      tip_with_payments: res[15],
      personal_account_info: res[16],
      ctredits_payments: res[17],
      expenses: res[18],
      current_service: res[20],
      support: res[21],
      recomendations: {
        first_line: res[22],
        second_line: res[24],
        third_line: res[26],
      },
      conclusion_text: res[28],
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

  if (!instruction) {
    return <Loader />
  }

  return (
    <>
      <div className={s.instruction_modal}>
        <div className={s.title_wrapper}>
          <div className={s.title}>
            <h3 className={s.modal_title}>{instructionObject?.service_name}</h3>
          </div>
          <Cross className={s.icon_cross} onClick={closeFn} width={17} height={17} />
        </div>

        <div className={s.modal_content}>
          <p className={s.welcome}>
            {instructionObject?.welcome?.split(' ')[0]}

            {instructionObject?.welcome?.split(' ')?.slice(1)?.join(' ')}
          </p>

          <p className={s.inform_text}>{instructionObject?.inform_text}</p>

          <p className={s.service_info}>{instructionObject?.service_info}:</p>

          <div className={s.server_info_block}>
            <span className={s.label}>
              {instructionObject?.service_package?.split(':')[0]}:
            </span>
            <span className={s.value}>
              {instructionObject?.service_package?.split(':')[1]}
            </span>

            <span className={s.label}>
              {instructionObject?.setup_date?.split(':')[0]}:
            </span>
            <span className={s.value}>
              {instructionObject?.setup_date?.split(':')[1]}
            </span>

            <span className={s.label}>
              {instructionObject?.domain_name?.split(':')[0]}:
            </span>
            <span className={s.value}>
              {instructionObject?.domain_name?.split(':')[1]}
            </span>

            <span className={s.label}>
              {instructionObject?.ip_address?.split(':')[0]}:
            </span>
            <span className={s.value}>
              {instructionObject?.ip_address?.split(':')[1]}
            </span>
          </div>

          <p className={s.service_info}>{instructionObject?.access_type}</p>

          <p className={s.ssh_tip}>
            {instructionObject?.ssh_tip?.split('-')[0].trim()}
            <a
              className={s.link}
              href="https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html"
              target="_blank"
              rel="noreferrer"
            >
              {instructionObject?.ssh_tip?.split('-')[1]}
            </a>
          </p>

          <div className={s.server_info}>
            <span className={s.label}>
              {instructionObject?.ssh_server?.split(':')[0]}:
            </span>
            <span className={s.value}>
              {instructionObject?.ssh_server?.split(':')[1]}
            </span>

            <span className={s.label}>
              {instructionObject?.username?.split(':')[0].trim()}:
            </span>
            <span className={s.value}>{instructionObject?.username?.split(':')[1]}</span>

            <span className={s.label}>
              {instructionObject?.password?.split(':')[0]?.trim()}:
            </span>
            <span className={s.value}>{instructionObject?.password?.split(':')[1]}</span>
          </div>

          <p className={s.service_info}>
            {instructionObject?.information_about_payments_and_service_management}
          </p>
          <p className={s.text}>{instructionObject?.about_service}</p>
          <p className={s.text}>
            {instructionObject?.tip_with_payments?.split('.')[0]},
            {
              <NavLink className={s.link} to={route.HOME}>
                {t('Member area', {
                  ns: 'dedicated_servers',
                })}
                .
              </NavLink>
            }
            {instructionObject?.tip_with_payments?.split('.')[1]}
          </p>

          <div className={s.important_departments_block}>
            <span className={s.label}>
              {instructionObject?.personal_account_info?.split('-')[0]?.trim()}:
            </span>
            <span className={s.value}>
              {instructionObject?.personal_account_info?.split('-')[1]?.trim()}
            </span>

            <span className={s.label}>
              {instructionObject?.ctredits_payments?.split('-')[0]?.trim()}:
            </span>
            <span className={s.value}>
              {instructionObject?.ctredits_payments?.split('-')[1]}
            </span>

            <span className={s.label}>
              {instructionObject?.expenses?.split('-')[0]?.trim()}:
            </span>
            <span className={s.value}>
              {instructionObject?.expenses?.split('-')[1]?.trim()}
            </span>

            <span className={s.label}>
              {instructionObject?.current_service?.split('-')[0]?.trim()}:
            </span>
            <span className={s.value}>
              {instructionObject?.current_service?.split('-')[1]?.trim()}
            </span>

            <span className={s.label}>
              {instructionObject?.support?.split('-')[0]?.trim()}:
            </span>
            <span className={s.value}>
              {instructionObject?.support?.split('-')[1]?.trim()}
            </span>
          </div>

          <p className={s.warning_text}>
            <span>
              {instructionObject?.recomendations?.first_line
                ?.split('http://zomro.com/storage.html')[0]
                ?.trim()}
            </span>
            <a
              className={s.link}
              href="http://zomro.com/storage.html"
              target="_blank"
              rel="noreferrer"
            >
              http://zomro.com/storage.html.
            </a>
            <span className={s.warning_line}>
              {instructionObject?.recomendations?.second_line?.trim()}
            </span>
            <span className={s.warning_line}>
              {instructionObject?.recomendations?.third_line?.split(':')[0].trim()}:
            </span>
            <span className={s.promocode}>
              {instructionObject?.recomendations?.third_line?.split(':')[1]}
            </span>
          </p>

          <p className={s.conclusion}>
            {instructionObject?.conclusion_text?.split('!')[0]}
          </p>
          <p className={s.signature}>
            {instructionObject?.conclusion_text?.split('!')[1]}
          </p>
        </div>
      </div>
    </>
  )
}
