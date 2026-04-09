import { Outlet } from 'react-router-dom'
import HeaderNav from './HeaderNav.jsx'
import TimerWidget from './TimerWidget.jsx'

function Layout() {
  return (
    <div className="app-shell">
      <HeaderNav />
      <main className="app-main">
        <Outlet />
      </main>
      <TimerWidget />
    </div>
  )
}

export default Layout
