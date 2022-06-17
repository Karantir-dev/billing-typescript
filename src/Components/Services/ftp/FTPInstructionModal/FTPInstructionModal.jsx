import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Cross } from '../../../../images'
import { ftpOperations } from '../../../../Redux'

import Loader from '../../../ui/Loader/Loader'

import s from './FTPInstructionModal.module.scss'

export default function FTPInstructionModal({ elid, closeFn }) {
  const dispatch = useDispatch()

  const { t } = useTranslation(['vds', 'container', 'other', 'dedicated_servers', 'ftp'])

  const [instruction, setInstruction] = useState('')

  const htmlParser = html => {
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g
    const textWithNoHTML = html.replace(htmlRegexG, '')

    const parsedText = textWithNoHTML
      .split(/\r?\n/)
      .map(el => el.replaceAll('\t', ''))
      .filter(element => element.replace(/\s/g, '').trim())

    let trimmedText = parsedText.map(el => el.trim())
    const startIndex = trimmedText.indexOf('External FTP storage activation')
    const res = trimmedText.slice(startIndex)

    const data = {
      service_name: res[0],
      welcome: res[1],
      inform_text: res[2],
      service_info: res[3],
      service_package: res[4],
      service_package2: res[5],
      setup_date: res[6],
      access_type: res[7],
      ftp_server: res[8],
      ftp_user: res[9],
      ftp_password: res[10],
      access_type2: res[11],
      webdav_address: res[12],
      webdav_user: res[13],
      webdav_pswd: res[14],
      conclusion_text: res[15],
    }

    return data
  }

  let instructionObject

  if (instruction) {
    instructionObject = htmlParser(instruction?.$)
  }

  useEffect(() => {
    dispatch(ftpOperations.getServiceInstruction(elid, setInstruction))
  }, [])

  if (!instruction) {
    return <Loader />
  }

  return (
    <>
      <div className={s.instruction_modal}>
        <div className={s.title_wrapper}>
          <div className={s.title}>
            <h3 className={s.modal_title}>
              {t(`${instructionObject?.service_name}`, { ns: 'ftp' })}
            </h3>
          </div>
          <Cross className={s.icon_cross} onClick={closeFn} width={15} height={15} />
        </div>

        <p className={s.welcome}>
          {`${t(`${instructionObject?.welcome?.split(' ')[0]?.trim()}`, {
            ns: 'ftp',
          })} `}

          {t(`${instructionObject?.welcome?.split(' ')?.slice(1)?.join(' ')}`, {
            ns: 'dedicated_servers',
          })}
        </p>

        <p className={s.inform_text}>
          {t(`${instructionObject?.inform_text}`, { ns: 'ftp' })}
        </p>

        <p className={s.service_info}>
          {t(`${instructionObject?.service_info}`, { ns: 'ftp' })}:
        </p>

        <div className={s.server_info_block}>
          <span className={s.label}>
            {t(`${instructionObject?.service_package?.trim()}`, {
              ns: 'ftp',
            })}
            :
          </span>
          <span className={s.value}>
            {t(
              `${instructionObject?.service_package2?.replace(
                'хранилище на',
                t('storage', { ns: 'ftp' }),
              )}`,
            )}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.setup_date?.split(':')[0]}`, {
              ns: 'ftp',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.setup_date?.split(':')[1]}`)}
          </span>
        </div>

        <p className={s.service_info}>
          {instructionObject?.access_type?.replace(
            'access',
            t('access', { ns: 'dedicated_servers' }),
          )}
        </p>

        <div className={s.server_info}>
          <span className={s.label}>
            {t(`${instructionObject?.ftp_server?.split(':')[0]}`, {
              ns: 'ftp',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.ftp_server?.split(':')[1]}`, {
              ns: 'ftp',
            })}
          </span>
          <span className={s.label}>
            {t(`${instructionObject?.ftp_user?.split(':')[0]}`, {
              ns: 'ftp',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.ftp_user?.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.ftp_password?.split(':')[0]?.trim()}`, {
              ns: 'ftp',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.ftp_password?.split(':')[1]}`)}
          </span>
        </div>

        <p className={s.service_info}>
          {instructionObject?.access_type2?.replace(
            'access',
            t('access', { ns: 'dedicated_servers' }),
          )}
        </p>

        <div className={s.server_info}>
          <span className={s.label}>
            {t(`${instructionObject?.webdav_address?.split(':')[0]}`, {
              ns: 'ftp',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.webdav_address?.split(':')?.slice(1).join('')}`, {
              ns: 'ftp',
            })}
          </span>
          <span className={s.label}>
            {t(`${instructionObject?.webdav_user?.split(':')[0]}`, {
              ns: 'ftp',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.webdav_user?.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.webdav_pswd?.split(':')[0]?.trim()}`, {
              ns: 'ftp',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.webdav_pswd?.split(':')[1]}`)}
          </span>
        </div>

        <p className={s.conclusion}>
          {t(`${instructionObject?.conclusion_text?.split('!')[0]?.trim()}`, {
            ns: 'ftp',
          })}
          !
        </p>
        <p className={s.signature}>
          {t(`${instructionObject?.conclusion_text?.split('!')[1]}`, {
            ns: 'ftp',
          })}
        </p>
      </div>
    </>
  )
}
