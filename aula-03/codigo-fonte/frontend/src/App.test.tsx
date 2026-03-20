import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
      )
    )
  })

  it('renders the main heading', () => {
    render(<App />)
    expect(screen.getByText('IA para Devs')).toBeInTheDocument()
  })

  it('renders the API status indicator', () => {
    render(<App />)
    expect(screen.getByText('API Status')).toBeInTheDocument()
  })
})
