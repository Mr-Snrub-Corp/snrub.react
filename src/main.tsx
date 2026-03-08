import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import AuthLayout from './layouts/AuthLayout.tsx'
import DashboardLayout from './layouts/DashboardLayout.tsx'
import HomeView from './pages/HomeView.tsx'
import Login from './pages/auth/Login.tsx'
import DashboardHome from './pages/dashboard/DashboardHome.tsx'
import Team from './pages/dashboard/Team.tsx'
import Incidents from './pages/dashboard/Incidents.tsx'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/', element: <HomeView /> },
      { path: '/auth/login', element: <Login /> },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <DashboardHome /> },
      { path: '/dashboard/team', element: <Team /> },
      { path: '/dashboard/incidents', element: <Incidents /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
