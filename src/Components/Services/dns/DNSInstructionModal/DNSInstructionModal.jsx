import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
// import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Cross } from '../../../../images'
import { dnsOperations } from '../../../../Redux'

import Loader from '../../../ui/Loader/Loader'

import s from './DNSInstructionModal.module.scss'

export default function DNSInstructionModal({ elid, closeFn }) {
  const dispatch = useDispatch()

  // const { t } = useTranslation(['vds', 'container', 'other', 'dedicated_servers', 'ftp'])

  const [instruction, setInstruction] = useState('')

  const htmlParser = html => {
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
    const textWithNoHTML = html.replace(htmlRegexG, '')

    const parsedText = textWithNoHTML
      .split(/\r?\n/)
      .map(el => el.replaceAll('\t', ''))
      .filter(element => element.replace(/\s/g, '').trim())

    let trimmedText = parsedText.map(el => el.trim())
    const startIndex = trimmedText.indexOf('Активация услуги DNS хостинг')
    const res = trimmedText.slice(startIndex)

    const data = {
      service_name: res[0],
      welcome: res[1],
      inform_text: res[2],
      service_info: res[3],
      service_package: res[4],
      setup_date: res[5],
      access_type: res[7],
      link: res[8],
      user: res[9],
      password: res[10],
      ns1: res[11],
      ns2: res[12],
      ns3: res[13],
      ns4: res[14],
      conclusion_text: res[15],
    }

    return data
  }

  let instructionObject

  if (instruction) {
    instructionObject = htmlParser(instruction?.$)
  }

  useEffect(() => {
    dispatch(dnsOperations.getServiceInstruction(elid, setInstruction))
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
          <Cross className={s.icon_cross} onClick={closeFn} width={15} height={15} />
        </div>

        <p className={s.welcome}>
          {instructionObject?.welcome?.split(' ')[0]?.trim()}
          {instructionObject?.welcome?.split(' ')?.slice(1)?.join(' ')}
        </p>

        <p className={s.inform_text}>{instructionObject?.inform_text}</p>

        <p className={s.service_info}>{instructionObject?.service_info}:</p>

        <div className={s.server_info_block}>
          <span className={s.label}>
            {instructionObject?.service_package?.trim()?.split(':')[0]}:
          </span>
          <span className={s.value}>
            {instructionObject?.service_package?.trim()?.split(':')[1]}
          </span>

          <span className={s.label}>{instructionObject?.setup_date?.split(':')[0]}:</span>
          <span className={s.value}>{instructionObject?.setup_date?.split(':')[1]}</span>
        </div>

        <p className={s.service_info}>{instructionObject?.access_type}</p>

        <div className={s.server_info}>
          <span className={s.label}>{instructionObject?.link?.split(':')[0]}:</span>
          <a
            href={instructionObject?.link?.split(':')?.slice(1)?.join(':')}
            target="_blank"
            rel="noreferrer"
            className={classNames({ [s.value]: true, [s.link]: true })}
          >
            {instructionObject?.link?.split(':')?.slice(1)?.join(':')}
          </a>
          <span className={s.label}>{instructionObject?.user?.split(':')[0]}:</span>
          <span className={s.value}>{instructionObject?.user?.split(':')[1]}</span>

          <span className={s.label}>
            {instructionObject?.password?.split(':')[0]?.trim()}:
          </span>
          <span className={s.value}>{instructionObject?.password?.split(':')[1]}</span>

          <span className={s.label}>{instructionObject?.ns1?.split(':')[0]}</span>
          <span className={s.value}>{instructionObject?.ns1?.split(':')[1]}</span>

          <span className={s.label}>{instructionObject?.ns2?.split(':')[0]}:</span>
          <span className={s.value}>
            {instructionObject?.ns2?.split(':')?.slice(1).join('')}
          </span>
          <span className={s.label}>{instructionObject?.ns3?.split(':')[0]}:</span>
          <span className={s.value}>{instructionObject?.ns3?.split(':')[1]}</span>

          <span className={s.label}>
            {instructionObject?.ns4?.split(':')[0]?.trim()}:
          </span>
          <span className={s.value}>{instructionObject?.ns4?.split(':')[1]}</span>
        </div>

        <p className={s.conclusion}>
          {instructionObject?.conclusion_text?.split('!')[0]?.trim()}!
        </p>
        <p className={s.signature}>{instructionObject?.conclusion_text?.split('!')[1]}</p>
      </div>
    </>
  )
}
