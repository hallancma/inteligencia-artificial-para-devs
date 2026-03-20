import { describe, it, expect } from 'vitest'
import app from './index'

describe('Health endpoint', () => {
  it('returns healthy status', async () => {
    const res = await app.fetch(new Request('http://localhost:3000/health'))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.status).toBe('healthy')
    expect(json.timestamp).toBeDefined()
  })
})
