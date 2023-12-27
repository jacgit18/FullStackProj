import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { thunk } from "redux-thunk"

import companyReducer from "./features/companySlice"
import signupReducer from "./features/signupSlice"
import userReducer from "./features/userSlice"


const persistCompany = {
  key: "company",
  storage,
}

const persistUser = {
  key: "user",
  storage,
}


export const storeReducers = {
  company: persistReducer(persistCompany, companyReducer),
  signup: signupReducer,
  user: persistReducer(persistUser, userReducer),
}

const reducers = combineReducers(storeReducers)

const store = configureStore({
  reducer: reducers,
  middleware: [thunk],
})

export default store
