import { t } from 'i18next'

export default function autoprolongList() {
  return [
    {
      label: t('Disabled', { ns: 'autoprolong' }),
      value: 'off',
    },
    { label: t('on', { ns: 'autoprolong' }), value: 'on' },
  ]
}
