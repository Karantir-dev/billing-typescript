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
      information_about_payments_and_service_management: res[13],
      about_service: res[14],
      tip_with_payments: res[15],
      personal_account_info: res[16],
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

        <p className={s.welcome}>
          {`${t(`${instructionObject?.welcome?.split(' ')[0]}`, {
            ns: 'dedicated_servers',
          })} `}

          {t(`${instructionObject?.welcome?.split(' ')?.slice(1)?.join(' ')}`, {
            ns: 'dedicated_servers',
          })}
        </p>

        <p className={s.inform_text}>
          {t(`${instructionObject?.inform_text}`, { ns: 'dedicated_servers' })}
        </p>

        <p className={s.service_info}>
          {t(`${instructionObject?.service_info}`, { ns: 'dedicated_servers' })}:
        </p>

        <div className={s.server_info_block}>
          <span className={s.label}>
            {t(`${instructionObject?.service_package.split(':')[0]}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.service_package.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.setup_date.split(':')[0]}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.setup_date.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.domain_name.split(':')[0]}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.domain_name.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.ip_address.split(':')[0]}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.ip_address.split(':')[1]}`)}
          </span>
        </div>

        <p className={s.service_info}>
          {instructionObject?.access_type?.replace(
            'access',
            t('access', { ns: 'dedicated_servers' }),
          )}
        </p>

        <p className={s.ssh_tip}>
          {t(`${instructionObject?.ssh_tip?.split('-')[0].trim()}`, {
            ns: 'dedicated_servers',
          })}
          <a
            className={s.link}
            href="https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html"
            target="_blank"
            rel="noreferrer"
          >
            {t(`${instructionObject?.ssh_tip?.split('-')[1]}`)}
          </a>
        </p>

        <div className={s.server_info}>
          <span className={s.label}>
            {t(`${instructionObject?.ssh_server.split(':')[0]}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.ssh_server.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.username.split(':')[0].trim()}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.username.split(':')[1]}`)}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.password.split(':')[0].trim()}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.password.split(':')[1]}`)}
          </span>
        </div>

        <p className={s.service_info}>
          {t(`${instructionObject?.information_about_payments_and_service_management}`, {
            ns: 'dedicated_servers',
          })}
        </p>
        <p className={s.text}>
          {t(
            `${instructionObject?.about_service?.replaceAll(
              '"',
              String.fromCharCode(39),
            )}`,
            {
              ns: 'dedicated_servers',
            },
          )}
        </p>
        <p className={s.text}>
          {`${t(
            `${instructionObject?.tip_with_payments
              ?.split('.')[0]
              ?.replace('Member area', '')
              .trim()}`,
            {
              ns: 'dedicated_servers',
            },
          )} `}
          {
            <NavLink className={s.link} to={route.HOME}>
              {t('Member area', {
                ns: 'dedicated_servers',
              })}
              .
            </NavLink>
          }
          {t(`${instructionObject?.tip_with_payments?.split('.')[1]}`, {
            ns: 'dedicated_servers',
          })}
        </p>

        <div className={s.important_departments_block}>
          <span className={s.label}>
            {t(`${instructionObject?.personal_account_info.split('-')[0].trim()}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.personal_account_info.split('-')[1].trim()}`, {
              ns: 'dedicated_servers',
            })}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.ctredits_payments.split('-')[0].trim()}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(
              `${instructionObject?.ctredits_payments
                .split('-')[1]
                ?.replaceAll('"', String.fromCharCode(39))
                .trim()}`,
              {
                ns: 'dedicated_servers',
              },
            )}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.expenses.split('-')[0].trim()}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.expenses.split('-')[1].trim()}`, {
              ns: 'dedicated_servers',
            })}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.current_service.split('-')[0].trim()}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.current_service.split('-')[1].trim()}`, {
              ns: 'dedicated_servers',
            })}
          </span>

          <span className={s.label}>
            {t(`${instructionObject?.support.split('-')[0].trim()}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.value}>
            {t(`${instructionObject?.support.split('-')[1].trim()}`, {
              ns: 'dedicated_servers',
            })}
          </span>
        </div>

        <p className={s.warning_text}>
          <span>
            {t(
              `${instructionObject?.recomendations?.first_line
                ?.split('http://zomro.com/storage.html')[0]
                .trim()}`,
              {
                ns: 'dedicated_servers',
              },
            )}
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
            {t(`${instructionObject?.recomendations?.second_line.trim()}`, {
              ns: 'dedicated_servers',
            })}
          </span>
          <span className={s.warning_line}>
            {t(`${instructionObject?.recomendations?.third_line?.split(':')[0].trim()}`, {
              ns: 'dedicated_servers',
            })}
            :
          </span>
          <span className={s.promocode}>
            {t(`${instructionObject?.recomendations?.third_line?.split(':')[1]}`)}
          </span>
        </p>

        <p className={s.conclusion}>
          {t(`${instructionObject?.conclusion_text?.split('!')[0]}`, {
            ns: 'dedicated_servers',
          })}
        </p>
        <p className={s.signature}>
          {t(`${instructionObject?.conclusion_text?.split('!')[1]}`, {
            ns: 'dedicated_servers',
          })}
        </p>
      </div>
    </>
  )
}
