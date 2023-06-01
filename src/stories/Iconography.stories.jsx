import { IconGallery, IconItem } from '@storybook/addon-docs/'
import cn from 'classnames'
import s from './Icons.module.scss'

import * as Icons from '@images'
import { Provider } from 'react-redux'
import entireStore from '@redux/store'

export default {
  title: 'Docs/IconGallery',
  component: IconGallery,
  parameters: {
    previewTabs: {
      canvas: { hidden: true },
    },
    viewMode: 'docs',
  },
}

export const defaultStyle = () => (
  <Provider store={entireStore.store}>
    <IconGallery>
      <IconItem name={'ArrowSign.jsx'}>
        <Icons.ArrowSign className={s.iconStroke} />
      </IconItem>
      <IconItem name={'Bell.jsx'}>
        <Icons.Bell className={s.icon} />
      </IconItem>
      <IconItem name={'Box.jsx'}>
        <Icons.Box width={25} height={25} className={cn(s.icon, s.bigIcon)} />
      </IconItem>
      <IconItem name={'Calendar.jsx'}>
        <Icons.Calendar className={s.icon} />
      </IconItem>
      <IconItem name={'CalendarArrow.jsx'}>
        <Icons.CalendarArrow className={s.icon} />
      </IconItem>
      <IconItem name={'CalendarArrowDouble.jsx'}>
        <Icons.CalendarArrowDouble className={s.icon} />
      </IconItem>
      <IconItem name={'Chats.jsx'}>
        <Icons.Chats className={s.icon} />
      </IconItem>
      <IconItem name={'Check.jsx'}>
        <Icons.Check className={s.iconStroke} />
      </IconItem>
      <IconItem name={'Clip.jsx'}>
        <Icons.Clip className={cn(s.icon, s.bigIcon)} />
      </IconItem>
      <IconItem name={'Clock.jsx'}>
        <Icons.Clock className={s.icon} />
      </IconItem>
      <IconItem name={'Copy.jsx'}>
        <Icons.Copy className={s.icon} />
      </IconItem>
      <IconItem name={'Cross.jsx'}>
        <Icons.Cross className={s.icon} />
      </IconItem>

      <IconItem name={'CsvDoc.jsx'}>
        <Icons.CsvDoc className={cn(s.icon, s.bigIcon)} />
      </IconItem>
      <IconItem name={'Delete.jsx'}>
        <Icons.Delete className={s.icon} />
      </IconItem>
      <IconItem name={'DisLike.jsx'}>
        <Icons.DisLike className={s.icon} />
      </IconItem>
      <IconItem name={'DomainsListName.jsx'}>
        <Icons.DomainsListName className={s.icon} />
      </IconItem>

      <IconItem name={'Download.jsx'}>
        <Icons.Download className={s.icon} />
      </IconItem>
      <IconItem name={'DownloadWithFolder.jsx'}>
        <Icons.DownloadWithFolder className={s.icon} />
      </IconItem>
      <IconItem name={'Edit.jsx'}>
        <Icons.Edit className={s.icon} />
      </IconItem>

      <IconItem name={'Envelope.jsx'}>
        <Icons.Envelope className={s.icon} />
      </IconItem>
      <IconItem name={'Error404_dt.jsx'}>
        <Icons.Error404_dt className={s.bigIcon} />
      </IconItem>
      <IconItem name={'Error404_lt.jsx'}>
        <Icons.Error404_lt className={s.bigIcon} />
      </IconItem>

      <IconItem name={'ErrorPay.jsx'}>
        <Icons.ErrorPay className={s.SuccessPay} />
      </IconItem>
      <IconItem name={'ExitSign.jsx'}>
        <Icons.ExitSign className={cn(s.icon, s.bigIcon)} />
      </IconItem>
      <IconItem name={'Eye.jsx'}>
        <Icons.Eye className={s.icon} />
      </IconItem>

      <IconItem name={'EyeClosed.jsx'}>
        <Icons.EyeClosed className={s.icon} />
      </IconItem>
      <IconItem name={'Facebook.jsx'}>
        <Icons.Facebook className={s.bigIcon} />
      </IconItem>
      <IconItem name={'FacebookSmall.jsx'}>
        <Icons.FacebookSmall className={s.icon} />
      </IconItem>

      <IconItem name={'FilledEnvelope.jsx'}>
        <Icons.FilledEnvelope className={s.icon} />
      </IconItem>
      <IconItem name={'Filter.jsx'}>
        <Icons.Filter className={s.icon} />
      </IconItem>
      <IconItem name={'Google.jsx'}>
        <Icons.Google className={s.bigIcon} />
      </IconItem>

      <IconItem name={'Info.jsx'}>
        <Icons.Info className={s.icon} />
      </IconItem>
      <IconItem name={'Key.jsx'}>
        <Icons.Key className={s.icon} />
      </IconItem>
      <IconItem name={'Like.jsx'}>
        <Icons.Like className={s.icon} />
      </IconItem>

      <IconItem name={'Logo.jsx'}>
        <Icons.Logo className={s.bigIcon} />
      </IconItem>
      <IconItem name={'Moon.jsx'}>
        <Icons.Moon className={s.icon} />
      </IconItem>
      <IconItem name={'MoreDots.jsx'}>
        <Icons.MoreDots className={cn(s.iconOther, s.bigIcon)} />
      </IconItem>

      <IconItem name={'Padlock.jsx'}>
        <Icons.Padlock className={s.icon} />
      </IconItem>
      <IconItem name={'Pay.jsx'}>
        <Icons.Pay className={s.icon} />
      </IconItem>
      <IconItem name={'Pdf.jsx'}>
        <Icons.Pdf className={cn(s.icon, s.bigIcon)} />
      </IconItem>

      <IconItem name={'Person.jsx'}>
        <Icons.Person className={s.icon} />
      </IconItem>
      <IconItem name={'Pin.jsx'}>
        <Icons.Pin className={cn(s.icon, s.bigIcon)} />
      </IconItem>
      <IconItem name={'Print.jsx'}>
        <Icons.Print className={s.icon} />
      </IconItem>

      <IconItem name={'Profile.jsx'}>
        <Icons.Profile className={s.icon} />
      </IconItem>
      <IconItem name={'Refund.jsx'}>
        <Icons.Refund className={s.icon} />
      </IconItem>
      <IconItem name={'Search.jsx'}>
        <Icons.Search className={s.icon} />
      </IconItem>

      <IconItem name={'SendArchive.jsx'}>
        <Icons.SendArchive className={s.icon} />
      </IconItem>
      <IconItem name={'Settings.jsx'}>
        <Icons.Settings className={s.icon} />
      </IconItem>
      <IconItem name={'Shevron.jsx'}>
        <Icons.Shevron className={s.iconStroke} />
      </IconItem>

      <IconItem name={'Social.jsx'}>
        <Icons.Social className={cn(s.icon, s.bigIcon)} />
      </IconItem>
      <IconItem name={'SuccessPay.jsx'}>
        <Icons.SuccessPay className={s.SuccessPay} />
      </IconItem>
      <IconItem name={'Sun.jsx'}>
        <Icons.Sun className={cn(s.icon, s.bigIcon)} />
      </IconItem>

      <IconItem name={'Support.jsx'}>
        <Icons.Support className={cn(s.bigIcon)} />
      </IconItem>
      <IconItem name={'Transfer.jsx'}>
        <Icons.Transfer className={s.icon} />
      </IconItem>
      <IconItem name={'Vk.jsx'}>
        <Icons.Vk className={s.bigIcon} />
      </IconItem>

      <IconItem name={'VkSmall.jsx'}>
        <Icons.VkSmall className={s.icon} />
      </IconItem>
      <IconItem name={'Wallet.jsx'}>
        <Icons.Wallet className={s.icon} />
      </IconItem>
      <IconItem name={'Whois.jsx'}>
        <Icons.Whois className={s.icon} />
      </IconItem>
      <IconItem name={'IP.jsx'}>
        <Icons.IP />
      </IconItem>
      <IconItem name={'PassChange.jsx'}>
        <Icons.PassChange />
      </IconItem>
      <IconItem name={'Reload.jsx'}>
        <Icons.Reload />
      </IconItem>
      <IconItem name={'Attention.jsx'}>
        <Icons.Attention />
      </IconItem>
      <IconItem name={'InProgress.jsx'}>
        <Icons.InProgress />
      </IconItem>
      <IconItem name={'CheckCircle.jsx'}>
        <Icons.CheckCircle />
      </IconItem>
    </IconGallery>
  </Provider>
)
