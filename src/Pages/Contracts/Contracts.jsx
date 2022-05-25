import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ContractItem from '../../Components/Contracts/ContractItem/ContractItem'
import contractOperations from '../../Redux/contracts/contractOperations'
import contractsSelectors from '../../Redux/contracts/contractsSelectors'
import { useTranslation } from 'react-i18next'

import s from './Contracts.module.scss'
import { IconButton } from '../../Components'

export default function Contracts() {
  const contracts = useSelector(contractsSelectors.getContractsList)
  const dispatch = useDispatch()
  const { t } = useTranslation(['container', 'contracts', 'other', 'billing'])

  const [selectedContract, setSelectedContract] = useState(null)

  const handlePrintBtn = () => {
    dispatch(contractOperations.getPrintFile(selectedContract?.id?.$))
  }
  const handleDownloadBtn = () => {
    dispatch(
      contractOperations.getPdfFile(selectedContract?.id?.$, selectedContract?.number?.$),
    )
  }

  useEffect(() => {
    dispatch(contractOperations.getContracts())
  }, [])

  return (
    <>
      <h3 className={s.page_title}>{t('profile.contracts')}</h3>

      <div className={s.icons_wrapper}>
        <IconButton
          disabled={!selectedContract}
          icon="print"
          className={s.print_btn}
          onClick={handlePrintBtn}
        />
        <IconButton
          disabled={!selectedContract}
          icon="archive"
          className={s.download_btn}
          onClick={handleDownloadBtn}
        />
      </div>

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
          <span className={s.item_title}>{t('contract_name', { ns: 'contracts' })}:</span>
        </div>
        <div className={s.card_item_wrapper}>
          <span className={s.item_title}>{t('status', { ns: 'other' })}:</span>
        </div>
      </div>

      <div className={s.list}>
        {contracts?.map(item => {
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
    </>
  )
}
