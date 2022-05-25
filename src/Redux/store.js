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
  contractsReducer,
} from '.'
import { theme, isLoading, pinned } from './reducer'
import { affiliateProgram } from './affiliateProgram/reducer'
import dedicReducer from './dedicatedServers/dedicReducer'

const rootPersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['theme', 'pinned'],
}
const authPersistConfig = {
  key: 'sessionId',
  storage,
  whitelist: ['sessionId'],
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
  contracts: contractsReducer,
  affiliateProgram,
  theme,
  isLoading,
  pinned,
  dedic: dedicReducer,
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
