import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import {
  supportReducer,
  userReducer,
  authReducer,
  accessLogsReducer,
  usersReducer,
  settingsReducer,
  billingReducer,
  payersReducer,
  domainsReducer,
  cloudVpsReducer,
  contractsReducer,
  cartReducer,
  vhostReducer,
  ftpReducer,
  dnsReducer,
  affiliateReducer,
  dedicReducer,
  forexReducer,
  siteCareReducer,
  vpnReducer,
} from '@redux'
import {
  theme,
  isLoading,
  pinned,
  scrollForbidden,
  online,
  blockingModalShown,
  promotionsList,
} from '@redux/reducer'

const rootPersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['theme', 'pinned'],
}
const authPersistConfig = {
  key: 'login',
  storage,
  whitelist: ['isLogined', 'geoData'],
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  access_logs: accessLogsReducer,
  currentUserInfo: userReducer,
  users: usersReducer,
  support: supportReducer,
  settings: settingsReducer,
  billing: billingReducer,
  payers: payersReducer,
  domains: domainsReducer,
  cloudVps: cloudVpsReducer,
  contracts: contractsReducer,
  cart: cartReducer,
  vhost: vhostReducer,
  dedic: dedicReducer,
  ftp: ftpReducer,
  dns: dnsReducer,
  forex: forexReducer,
  sitecare: siteCareReducer,
  vpn: vpnReducer,
  affiliateProgram: affiliateReducer,
  theme,
  isLoading,
  pinned,
  scrollForbidden,
  online,
  blockingModalShown,
  promotionsList,
})

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV === 'development',
})

const persistor = persistStore(store)

const entireStore = { store, persistor }
export default entireStore

export type AppDispatch = typeof store.dispatch
