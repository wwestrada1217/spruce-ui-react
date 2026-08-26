import { describe, expect, it, vi } from 'vitest'
import {
  Card,
  DiffEditor,
  Motif,
  MotifProvider,
  Panel,
  SP_BUILT_IN_MOTIFS,
  Terminal,
  Toolbar,
  Tree,
  Editor,
  MarkdownEditor,
} from '../../src/index.js'
import { expectNoA11yViolations, pressKey, renderWithRtl, renderWithSpruce, renderWithTheme } from '../utils/test-utils.js'

describe('P1.0-09 chrome and motif parity', () => {
  it('ships the complete typed motif library and keeps motifs decorative', () => {
    expect(SP_BUILT_IN_MOTIFS).toHaveLength(117)
    const view = renderWithSpruce(
      <Card chrome="outlined" backgroundMotif="concentric-circles">
        Content
      </Card>,
    )
    const motif = view.container.querySelector('.sp-motif')
    expect(motif).toHaveAttribute('aria-hidden', 'true')
    expect(view.container.querySelector('.sp-card--has-motif')).toBeInTheDocument()
  })

  it('uses physical anchors in RTL and supports custom controlled definitions', () => {
    const view = renderWithRtl(
      <MotifProvider
        motifs={[{
          name: 'test-spark',
          appearance: 'filled',
          svg: '<svg viewBox="0 0 100 100"><circle data-motif-shape cx="50" cy="50" r="30"/></svg>',
        }]}
      >
        <Motif motif="test-spark" position="center-right" size={80} />
      </MotifProvider>,
    )
    expect(view.container.querySelector('.sp-motif__shape')).toHaveStyle({ left: '100%', top: '50%' })
    expect(view.container.querySelector('[data-motif-shape]')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
  })

  it('supports shared chrome, radius, border, and elevation across surface components', () => {
    const view = renderWithSpruce(
      <>
        <Card variant="outlined" chrome="filled" radius="xl" border="strong" elevation="md">Card</Card>
        <Panel chrome="ghost" radius="sm" border="none">Panel</Panel>
        <Terminal chrome="outlined" radius="lg" border="strong" entries={[]} />
        <Tree chrome="filled" radius="md" border="subtle" nodes={[{ id: 'one', label: 'One' }]} />
        <Toolbar chrome="elevated" radius="xl" border="strong" items={[{ label: 'Save' }]} />
      </>,
    )
    expect(view.container.querySelector('.sp-card')).toHaveClass(
      'sp-card--outlined',
      'sp-chrome--filled',
      'sp-radius--xl',
      'sp-border--strong',
      'sp-elevation--md',
    )
    expect(view.container.querySelector('.sp-panel')).toHaveClass('sp-chrome--ghost', 'sp-radius--sm', 'sp-border--none')
    expect(view.container.querySelector('.sp-terminal')).toHaveClass('sp-chrome--outlined', 'sp-radius--lg', 'sp-border--strong')
    expect(view.container.querySelector('.sp-tree')).toHaveClass('sp-chrome--filled', 'sp-radius--md', 'sp-border--subtle')
    expect(view.container.querySelector('.sp-toolbar')).toHaveClass('sp-chrome--elevated', 'sp-radius--xl', 'sp-border--strong')
  })

  it('activates an interactive card with Enter and Space', async () => {
    const clicked = vi.fn()
    const view = renderWithSpruce(<Card interactive onClick={clicked}>Open project</Card>)
    const card = view.getByRole('button', { name: 'Open project' })
    expect(card).toHaveAttribute('tabindex', '0')
    card.focus()
    await pressKey(view.user, 'Enter')
    await pressKey(view.user, ' ')
    expect(clicked).toHaveBeenCalledTimes(2)
  })

  it('keeps editor frames controlled while applying shared chrome', () => {
    const onChange = vi.fn()
    const view = renderWithSpruce(
      <>
        <Editor value="<p>HTML</p>" onChange={onChange} chrome="outlined" radius="lg" border="strong" />
        <DiffEditor oldCode="one" newCode="two" chrome="filled" radius="sm" border="subtle" />
        <MarkdownEditor value="**markdown**" onChange={onChange} chrome="ghost" radius="xl" border="none" />
      </>,
    )
    expect(view.container.querySelector('.sp-editor__container')).toHaveClass('sp-chrome--outlined', 'sp-radius--lg', 'sp-border--strong')
    expect(view.container.querySelector('.sp-diff-editor')).toHaveClass('sp-chrome--filled', 'sp-radius--sm', 'sp-border--subtle')
    expect(view.container.querySelector('.sp-markdown-editor__container')).toHaveClass('sp-chrome--ghost', 'sp-radius--xl', 'sp-border--none')
  })

  it('is axe-clean in dark theme and RTL', async () => {
    const view = renderWithTheme(
      <Card
        chrome="filled"
        backgroundMotif="organic-blob"
        motifColor="var(--sp-primary)"
        aria-label="Decorated card"
      >
        Content
      </Card>,
      'dark',
      { providerProps: { direction: 'rtl', locale: 'ar' } },
    )
    await expectNoA11yViolations(view.container)
  })
})
