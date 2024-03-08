import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Routes from '@routes/Routes'
import UserContextProvider from "@contexts/Users";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  </React.StrictMode>,
)
