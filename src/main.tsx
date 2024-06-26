import React from 'react'
import ReactDOM from 'react-dom/client'
import Index from './pages/Index.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import IndexError from './pages/IndexError.tsx'
import { indexLoader } from './loaders.ts'

const router = createBrowserRouter(createRoutesFromElements(
  <Route
    path='/'
    element={<Index />}
    errorElement={<IndexError />}
    loader={indexLoader}
  />
))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
