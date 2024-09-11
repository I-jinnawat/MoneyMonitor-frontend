import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/report",
    element: <Report />,
  }
]);


import App from './App.tsx'
import Report from './report.tsx'
import './index.css'
import Navbar from './components/navbar.tsx'

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Navbar />  {/* Include Navbar component here */}
    <RouterProvider router={router} />
  </StrictMode>,
)
