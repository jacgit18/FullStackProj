
import { resetCompany } from "./features/companySlice"
import { reset as resetSignup } from "./features/signupSlice"
import { resetUser } from "./features/userSlice"

import { storeReducers } from "./store"

const storeResetActions = {
  user: resetUser,
  signup: resetSignup,
  company: resetCompany,
}

// we need to check that all store items are represented here
function compareResetToStore() {
  // first compare store to reset actions
  for (let reducerKey of Object.keys(storeReducers)) {
    if (!storeResetActions[reducerKey]) {
      const message = `NEED TO ADD RESET ACTION TO resetStoreService: ${reducerKey}`
      console.log(message)
      throw new Error(message)
    }
  }
  // then compare reset actions to store
  for (let resetKey of Object.keys(storeResetActions)) {
    if (!storeReducers[resetKey]) {
      const message = `NEED TO ADD REDUCER TO store: ${resetKey}`
      console.log(message)
      throw new Error(message)
    }
  }
}

compareResetToStore()

export const resetStore = (dispatch) => {
  for (let resetAction of Object.keys(storeResetActions)) {
    dispatch(storeResetActions[resetAction]())
  }
}
