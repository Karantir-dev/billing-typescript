import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Pagination, ContractItem } from '@components'
import { contractOperations, contractsSelectors } from '@redux'
import { useTranslation } from 'react-i18next'

import s from './Contracts.module.scss'
import { checkServicesRights, usePageRender } from '@utils'
import * as route from '@src/routes'
import { useNavigate } from 'react-router-dom'
import { SendArchive } from '@images'
import { useMediaQuery } from 'react-responsive'

export default function Contracts() {
  const isAllowedToRender = usePageRender('customer', 'contract')

  const contractsRenderData = useSelector(contractsSelectors.getContractsList)
  const contractsCount = useSelector(contractsSelectors.getContractsCount)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation(['container', 'contracts', 'other', 'billing'])

  const [selectedContract, setSelectedContract] = useState(null)

  const [p_cnt, setP_cnt] = useState(10)
  const [p_num, setP_num] = useState(1)

  const mobile = useMediaQuery({ query: '(max-width: 1023px)' })

  // const handlePrintBtn = () => {
  //   dispatch(contractOperations.getPrintFile(selectedContract?.id?.$))
  // }
  const handleDownloadBtn = () => {
    dispatch(
      contractOperations.getPdfFile(selectedContract?.id?.$, selectedContract?.number?.$),
    )
  }

  let rights = checkServicesRights(contractsRenderData?.contractsPageRights?.toolgrp)

  useEffect(() => {
    if (isAllowedToRender) {
      const data = { p_num, p_cnt }
      dispatch(contractOperations.getContracts(data))
    } else {
      navigate(route.SERVICES, { replace: true })
    }
  }, [p_num, p_cnt])

  return (
    <>
      <h3 className={s.page_title}>{t('profile.contracts')}</h3>
      {contractsRenderData?.contracts?.length > 0 && !mobile &&(
        <div className={s.icons_wrapper}>
          {/* <IconButton
          disabled={!selectedContract || !rights?.print || !rights?.download}
          icon="print"
          className={s.print_btn}
          onClick={handlePrintBtn}
        /> */}
          <IconButton
            disabled={!selectedContract || !rights?.download || !rights?.print}
            icon="download-folder"
            className={s.download_btn}
            onClick={handleDownloadBtn}
          />
        </div>
      )}

      {contractsRenderData?.contracts?.length > 0 && (
        <div className={s.table_title}>
          <div className={s.card_item_wrapper}>
            <span className={s.item_title}>{t('Number', { ns: 'other' })}:</span>
          </div>
          <div className={s.card_item_wrapper}>
            <span className={s.item_title}>{t('signdate', { ns: 'contracts' })}:</span>
          </div>
          <div className={s.card_item_wrapper}>
            <span className={s.item_title}>{t('enddate', { ns: 'contracts' })}:</span>
          </div>
          <div className={s.card_item_wrapper}>
            <span className={s.item_title}>{t('Payer', { ns: 'other' })}:</span>
          </div>
          <div className={s.card_item_wrapper}>
            <span className={s.item_title}>{t('company', { ns: 'contracts' })}:</span>
          </div>
          <div className={s.card_item_wrapper}>
            <span className={s.item_title}>
              {t('contract_name', { ns: 'contracts' })}:
            </span>
          </div>
          <div className={s.card_item_wrapper}>
            <span className={s.item_title}>{t('status', { ns: 'other' })}:</span>
          </div>
        </div>
      )}

      {contractsRenderData?.contracts?.length === 0 && (
        <div className={s.no_service_wrapper}>
          {/* <img
            src={require('@images/services/no_dns.png')}
            alt="dns"
            className={s.dns_img}
          /> */}
          <SendArchive />
          <p className={s.no_service_title}>
            {t('YOU DO NOT HAVE CONTRACTS YET', { ns: 'contracts' })}
          </p>
          <p className={s.no_service_description}>
            {t('no services description', { ns: 'contracts' })}
          </p>
        </div>
      )}

      <div className={s.list}>
        {contractsRenderData?.contracts?.map(item => {
          const {
            client_name,
            company_name,
            contract_name,
            id,
            number,
            signdate,
            end_date,
            status,
          } = item

          const onItemClick = () => setSelectedContract(item)

          const selected = selectedContract?.id?.$ === id?.$

          return (
            <ContractItem
              rights={rights}
              key={id.$}
              contractNumber={number?.$}
              clientName={client_name?.$}
              contractName={contract_name?.$}
              id={id?.$}
              signDate={signdate?.$}
              endDate={end_date?.$}
              companyName={company_name?.$}
              status={status?.$}
              selectedContract={selected}
              setSelectedContract={onItemClick}
            />
          )
        })}
      </div>
      {contractsCount > 1 && (
        <div className={s.pagination}>
          <Pagination
            totalCount={Number(contractsCount)}
            currentPage={p_num}
            pageSize={p_cnt}
            onPageChange={page => setP_num(page)}
            onPageItemChange={items => setP_cnt(items)}
            paginationItemClassName={s.pagination_item}
          />
        </div>
      )}
    </>
  )
}
