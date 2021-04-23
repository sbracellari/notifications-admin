import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { StylesProvider, createGenerateClassName } from '@material-ui/styles'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import store from './store'
import { Provider } from 'react-redux'
import 'react-mde/lib/styles/css/react-mde-all.css'

const project_name = 'notifications-admin'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#b89f74',
      main: '#877148',
      dark: '#58461f',
      contrastText: '#fff'
    },
    secondary: {
      light: '#56a2ea',
      main: '#0074b7',
      dark: '#004987',
      contrastText: '#fff'
    }
  }
})

const generateClassName = createGenerateClassName({
  productionPrefix: project_name,
  disableGlobal: true
})

ReactDOM.render(
  <StylesProvider generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>
  </StylesProvider>,
  document.getElementById(project_name)
)
