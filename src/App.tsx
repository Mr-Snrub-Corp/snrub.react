import { NavLink, Outlet } from 'react-router'

function App() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <nav className="mb-8 flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-primary underline' : 'text-muted-foreground hover:text-foreground'
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'text-primary underline' : 'text-muted-foreground hover:text-foreground'
          }
        >
          Settings
        </NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

export default App
