import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    type: "trade",
  },
  company: {},
}

export const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    reset: () => initialState,
    setUser: (state, action) => {
      state.user = action.payload
    },
    resetUser: (state) => {
      state.user = initialState.user
    },
    setCompany: (state, action) => {
      state.company = action.payload
    },
    resetCompany: (state) => {
      state.company = initialState.company
    }
  },
})

export const { reset, setUser, resetUser, setCompany, resetCompany  } =
  signupSlice.actions

export default signupSlice.reducer
