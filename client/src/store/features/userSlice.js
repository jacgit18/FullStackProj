import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import config from "../../libs/config";
import http from "../../libs/http";

const initialState = {
  companies: [],
  drawerOpen: true,
  email: "",
  exp: {
    companies: "",
    user: "",
  },
  firstName: "",
  iat: "",
  id: null,
  is_admin: false,
  isLoggedIn: false,
  lastName: "",
  name: "",
  status: {
    companies: "idle",
    login: "idle",
    logout: "idle",
    newPassword: "idle",
  },
  token: "",
}

const setupUserFromToken = (token) => {
  const user = jwtDecode(token)
  return { user, token }
}

export const newPassword = createAsyncThunk(
  "user/new-password",
  async ({ password, token }, thunkAPI) => {
    const response = await http({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "patch",
      url: config.auth.newPassword,
      data: { password },
    })
    const { data } = response
    if (response.status === 200 && data.success) {
      return setupUserFromToken(data.data.jwt)
    } else {
      return thunkAPI.rejectWithValue(data)
    }
  }
)
export const resetPassword = createAsyncThunk(
  "user/reset-password",
  async ({ email }, thunkAPI) => {
    const response = await http.post(config.auth.resetPassword, {
      email,
    })
    const { data } = response
    if (response.status === 200) {
    } else {
      return thunkAPI.rejectWithValue(data)
    }
  }
)

export const login = createAsyncThunk("user/login", async ({ email, password }, thunkAPI) => {
  const response = await http.post(config.auth.login, {
    email,
    password,
  })
  const { data } = response
  if (response.status === 200 && data.success) {
    return setupUserFromToken(data.data.jwt)
  } else {
    return thunkAPI.rejectWithValue(data)
  }
})

export const validate = createAsyncThunk("user/validate", async ({ token }, thunkAPI) => {
  const response = await http.get(config.auth.validate, {
    JWT: token,
  })
  const { data } = response
  if (response.status === 200 && data.success) {
    return true
  } else {
    return thunkAPI.rejectWithValue(false)
  }
})

export const refresh = createAsyncThunk("user/refresh", async ({ token }, thunkAPI) => {
  const response = await http.post(config.auth.refresh, {
    JWT: token,
  })
  const { data } = response
  if (response.status === 200 && data.success) {
    const { jwt } = data.data
    const user = jwtDecode(jwt)
    return { user, token: jwt }
  } else {
    return thunkAPI.rejectWithValue(data)
  }
})

export const loadUserCompanies = createAsyncThunk(
  "user/loadUserCompanies",
  async (args, thunkAPI) => {
    const { user } = await thunkAPI.getState()
    const { token } = user
    const response = await axios({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "get",
      timeout: 20000,
      url: `${config.api.url}/user/companies`,
    })
    if (response.status === 200) {
      const { data } = response
      return data
    } else {
      return thunkAPI.rejectWithValue(response)
    }
  },
  {
    // Make sure the user's companies are not already loaded or loading
    // And don't reload until expired
    condition: (args, { getState, extra }) => {
      const { user } = getState()
      const status = user.status.companies
      const expiration = user.exp.companies
      const now = Math.floor(Date.now() / 1000)
      if (expiration > now && (status === "fulfilled" || status === "loading")) {
        return false
      }
    },
  }
)


export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const newUserInfo = action.payload
      Object.keys(newUserInfo).forEach((key, index) => {
        state[key] = newUserInfo[key]
      })
    },
    resetUser: () => initialState,
    addCompany: (state, action) => {
      const newCompanies = state.companies
      newCompanies.unshift(action.payload)
      state.companies = newCompanies.sort((a, b) => (a.name > b.name ? 1 : -1))
    },
    updateCompany: (state, action) => {
      const updatedCompany = action.payload
      if (updatedCompany && updatedCompany.id) {
        state.companies = state.companies.map((item) => {
          if (item.id === updatedCompany.id) {
            return {
              ...item,
              ...updatedCompany,
            }
          } else {
            return item
          }
        })
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status.login = "loading"
      })
      .addCase(login.rejected, (state) => {
        state.status.login = "idle"
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = action.payload
        state.isLoggedIn = true
        state.token = token
        state.exp.user = user.exp
        delete user.exp
        Object.keys(user).forEach((key, index) => {
          state[key] = user[key]
        })
        state.status.login = "fulfilled"
      })
      .addCase(loadUserCompanies.pending, (state) => {
        state.status.companies = "loading"
      })
      .addCase(loadUserCompanies.rejected, (state) => {
        state.status.companies = "idle"
      })
      .addCase(loadUserCompanies.fulfilled, (state, action) => {
        if (action.payload && action.payload.length) {
          // Move dev sites to the top
          const companiesList = action.payload
          state.companies = [...companiesList]
          // Set expiration
          const now = Math.floor(Date.now() / 1000)
          state.exp.companies = now + 60 * 60 * 24 // one day
        }
        state.status.companies = "fulfilled"
      })
      .addCase(newPassword.pending, (state) => {
        state.status.newPassword = "loading"
      })
      .addCase(newPassword.rejected, (state) => {
        state.status.newPassword = "idle"
      })
      .addCase(newPassword.fulfilled, (state, action) => {
        const { token, user } = action.payload
        state.isLoggedIn = true
        state.token = token
        state.exp.user = user.exp
        delete user.exp
        Object.keys(user).forEach((key, index) => {
          state[key] = user[key]
        })
        state.status.newPassword = "fulfilled"
      })
  },
})

export const {
  setUser,
  resetUser,
  showDrawer,
  setCompany,
  resetCompany,
  setCompanies,
  updateCompany,
  addCompany,
} = userSlice.actions

export const getUser = (state) => state.user
export const listUserCompanies = (state) => state.user.companies

export default userSlice.reducer
