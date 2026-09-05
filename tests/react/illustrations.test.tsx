import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ALL_ILLUSTRATIONS,
  Illustration,
  ILLUSTRATIONS_BY_NAME,
  illustrationNotFound,
} from '../../src/index.js'

describe('illustrations', () => {
  it('ships the complete Angular illustration catalog', () => {
    expect(ALL_ILLUSTRATIONS).toHaveLength(144)
    expect(new Set(ALL_ILLUSTRATIONS.map(item => item.name)).size).toBe(144)
    expect(ILLUSTRATIONS_BY_NAME['not-found']).toBe(illustrationNotFound)
  })

  it('renders direct and name-based definitions with accessible labeling', () => {
    const { container } = render(
      <Illustration name="not-found" illustrations={ILLUSTRATIONS_BY_NAME} ariaLabel="Page not found" size="sm" />,
    )
    const illustration = container.querySelector('[data-illustration="not-found"]')
    expect(illustration).toHaveAttribute('role', 'img')
    expect(illustration).toHaveAttribute('aria-label', 'Page not found')
    expect(illustration?.querySelector('svg')).not.toBeNull()
  })
})
