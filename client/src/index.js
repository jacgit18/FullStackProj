import React from "react"
import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { SnackbarProvider } from "notistack"
import ReactDOM from "react-dom"
import { I18nextProvider } from "react-i18next"
// import { Provider as ReduxProvider } from "react-redux"
import { BrowserRouter as Router } from "react-router-dom"
// import { persistStore } from "redux-persist"
// import { PersistGate } from "redux-persist/integration/react"
import { ThemeProvider, StyledEngineProvider } from "@mui/material"

import App from "./App"
// import store from "./store"
import theme from "./theme"
// import reportWebVitals from './reportWebVitals';
// import config from "./libs/config"
import common_en from "./translations/en/common.json"
import common_es from "./translations/es/common.json"
import public_en from "./translations/en/public.json"
import public_es from "./translations/es/public.json"
import private_en from "./translations/en/private.json"
import private_es from "./translations/es/private.json"

// document.domain = config.env !== 'development'
//   ? config.app.url.replace("https://", "") // "tracfloapp.com"
//   : document.domain

// let persistor = persistStore(store)

i18next.use(LanguageDetector).init({
  debug: true,
  interpolation: { escapeValue: false },
  react: {
    // https://react.i18next.com/latest/trans-component#trans-props
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ["br", "strong", "b", "i", "ul", "ol", "li"],
  },
  resources: {
    en: {
      common: common_en,
      public: public_en,
      private: private_en,
    },
    es: {
      common: common_es,
      public: public_es,
      private: private_es,
    },
  },
})

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <I18nextProvider i18n={i18next}>
            {/* <ReduxProvider store={store}> */}
              {/* <PersistGate loading={null} persistor={persistor}> */}
                <Router>
                  <App />
                </Router>
              {/* </PersistGate> */}
            {/* </ReduxProvider> */}
          </I18nextProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
