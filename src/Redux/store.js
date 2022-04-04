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

import { authReducer } from './auth/authReducer'
import { userReducer } from './userInfo/userReducer'
import { theme, isLoading } from './reducer'

const rootPersistConfig = {
  key: 'theme',
  storage,
  whitelist: ['theme'],
}
const authPersistConfig = {
  key: 'sessionId',
  storage,
  whitelist: ['sessionId'],
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  currentUserInfo: userReducer,
  theme,
  isLoading,
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
