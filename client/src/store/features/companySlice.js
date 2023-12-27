import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

import config from "../../libs/config"

const companyApi = `${config.api.url}/company`
const initialState = {
  exp: {
    projects: "",
  },
  id: null,
  logo_url: "",
  name: "",
  company_user_role: "",
  status: {
    company: "idle",
  },
  type: "",
  url: "",
}

export const loadCompany = createAsyncThunk(
  "company/loadCompany",
  async ({ id, token }, thunkAPI) => {
    const response = await axios({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "get",
      timeout: 20000,
      url: `${companyApi}/${id}`,
    })
    const { data } = response
    if (response.status === 200) {
      return data
    } else {
      return thunkAPI.rejectWithValue(data)
    }
  }
)


export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action) => {
      const company = action.payload
      Object.keys(company).forEach((key, index) => {
        state[key] = company[key]
      })
      state.status.company = "set"
    },
    resetCompany: () => initialState,
    resetProjects: (state) => {
      state.projects = initialState.projects
      state.status.projects = initialState.status.projects
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCompany.pending, (state) => {
        state.status.company = "loading"
      })
      .addCase(loadCompany.rejected, (state) => {
        state.status.company = "idle"
      })
      .addCase(loadCompany.fulfilled, (state, action) => {
        Object.keys(initialState).forEach((key) => {
          state[key] = initialState[key]
        })
        const company = action.payload
        Object.keys(company).forEach((key, index) => {
          state[key] = company[key]
        })
        state.status.company = "fulfilled"
      })
  },
})

export const { setCompany, resetCompany, resetProjects } = companySlice.actions

export const getCompany = (state) => state.company

export default companySlice.reducer
