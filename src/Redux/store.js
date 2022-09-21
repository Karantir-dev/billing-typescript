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
} from '.'
import { theme, isLoading, pinned, scrollForbidden } from './reducer'

const rootPersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['theme', 'pinned'],
}
const authPersistConfig = {
  key: 'sessionId',
  storage,
  whitelist: ['sessionId', 'isLogined', 'geoData'],
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
