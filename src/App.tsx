import { NavLink, Outlet } from 'react-router'
import './App.css'

function App() {
  return (
    <>
      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <Outlet />
    </>
  )
}

export default App
