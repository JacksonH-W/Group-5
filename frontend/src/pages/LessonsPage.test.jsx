import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LessonsPage from './LessonsPage'

// Mock useAuth so NavBar doesn’t crash in tests
vi.mock('../context/useAuth', () => {
  return {
    useAuth: () => ({
      user: { id: 1, username: 'test' },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    }),
  }
})

describe('LessonsPage', () => {
  it('renders Lessons page', () => {
    render(
      <MemoryRouter>
        <LessonsPage />
      </MemoryRouter>
    )

    // Choose something stable that actually exists on your page.
    // If you have a header like "Lessons", this is ideal:
    expect(screen.getByText(/lessons/i)).toBeInTheDocument()
  })
})