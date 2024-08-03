import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './redux'
import GlobalModal from './components/modal/globalModal'
import { BrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import './index.css'
const store = configureStore({
  reducer: rootReducer,
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Suspense fallback={<p>Loading...</p>}>
    <BrowserRouter>
      <Provider store={store}>
        <GlobalModal />
        <App />
      </Provider>
    </BrowserRouter>
  </Suspense>,
)
