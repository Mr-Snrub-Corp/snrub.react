import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DashboardNavbar } from './DashboardNavbar'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/user'

vi.mock('@/stores/auth')
vi.mock('@/components/ui/sidebar', () => ({
  SidebarTrigger: () => null,
}))

const mockUser: User = {
  uid: '1',
  email: 'john@example.com',
  name: 'John Doe',
  role: 'viewer',
  status: 'active',
}

function renderNavbar(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <DashboardNavbar />
    </MemoryRouter>,
  )
}

describe('DashboardNavbar', () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue(null)
  })

  describe('breadcrumb', () => {
    it('shows only home icon at /dashboard with no anchor link', () => {
      renderNavbar('/dashboard')
      // At /dashboard the home icon is the current page — no <a> tag, just a span
      expect(document.querySelector('a[data-slot="breadcrumb-link"]')).toBeNull()
      expect(document.querySelector('svg')).toBeTruthy()
    })

    it('shows capitalised segment label for nested routes', () => {
      renderNavbar('/dashboard/team')
      expect(screen.getByText('Team')).toBeInTheDocument()
    })

    it('links home icon when on a nested route', () => {
      renderNavbar('/dashboard/incidents')
      const homeLink = document.querySelector('a[data-slot="breadcrumb-link"]')
      expect(homeLink).toHaveAttribute('href', '/dashboard')
    })

    it('shows intermediate segments as links', () => {
      renderNavbar('/dashboard/incidents/123')
      expect(screen.getByText('Incidents')).toBeInTheDocument()
      expect(screen.getByText('123')).toBeInTheDocument()
    })
  })

  describe('avatar', () => {
    it('shows first letter of user name as fallback', () => {
      vi.mocked(useAuthStore).mockReturnValue(mockUser)
      renderNavbar('/dashboard')
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('shows "?" fallback when no user is authenticated', () => {
      renderNavbar('/dashboard')
      expect(screen.getByText('?')).toBeInTheDocument()
    })
  })
})
