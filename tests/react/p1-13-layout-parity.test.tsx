import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Container, DockManager, DockPanel, Fullscreen, LayoutManager, Masonry, MasonryItem, Row, Col, DragDrop, HideOnScroll, type DockManagerHandle, type LayoutManagerHandle } from '../../src/index'

function setClientWidth(element: HTMLElement, width: number) {
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: width })
}

describe('P1-13 layout and behavior parity', () => {
  it('preserves the Angular grid API while accepting native attributes', () => {
    render(<Container><Row cols={5} gap={2} data-testid="row"><Col span={2} offset={1}>A</Col><Col span={2}>B</Col></Row></Container>)
    expect(screen.getByTestId('row')).toHaveStyle({ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' })
    expect(screen.getByText('A')).toHaveStyle({ gridColumn: '2 / span 2' })
  })

  it('moves controlled layout items with keyboard callbacks and deletes through the handle', () => {
    const onItemsChange = vi.fn()
    const items = [{ id: 'one', x: 0, y: 0, w: 2, h: 1 }, { id: 'two', x: 2, y: 0, w: 2, h: 1 }]
    const ref = { current: null as LayoutManagerHandle | null }
    render(<LayoutManager ref={ref} items={items} deletable onItemsChange={onItemsChange} renderItem={(item) => item.id} />)
    const tile = screen.getByRole('group', { name: 'one' })
    fireEvent.keyDown(tile, { key: 'ArrowRight' })
    expect(onItemsChange).toHaveBeenCalled()
    expect(ref.current?.deleteItem('one')).toBe(true)
    expect(onItemsChange).toHaveBeenCalledTimes(2)
  })

  it('lays out masonry children after measuring the container and items', async () => {
    render(<Masonry columns={2} gap={8}><MasonryItem>One</MasonryItem><MasonryItem>Two</MasonryItem></Masonry>)
    const root = document.querySelector('.sp-masonry') as HTMLElement
    setClientWidth(root, 400)
    const items = [...document.querySelectorAll<HTMLElement>('.sp-masonry__item')]
    items.forEach((item, index) => {
      Object.defineProperty(item, 'offsetHeight', { configurable: true, value: index ? 120 : 80 })
    })
    window.dispatchEvent(new Event('resize'))
    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 20)) })
    expect(items[0].dataset.masonryIndex).toBe('0')
    expect(items[0].dataset.masonryReady).toBe('true')
  })

  it('uses docking tree semantics, tab accessibility, and JSON persistence methods', () => {
    const onLayoutChange = vi.fn()
    const layout = { root: { type: 'tab' as const, id: 'tabs', panelIds: ['a', 'b'], activeIndex: 0 }, floats: [] }
    const ref = { current: null as DockManagerHandle | null }
    render(<DockManager ref={ref} layout={layout} onLayoutChange={onLayoutChange}><DockPanel panelId="a" title="Alpha">Alpha</DockPanel><DockPanel panelId="b" title="Beta">Beta</DockPanel></DockManager>)
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }))
    expect(onLayoutChange).toHaveBeenCalled()
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true')
    expect(ref.current?.importLayout(ref.current.exportLayout())).toBe(true)
  })

  it('keeps pointer splitter movement aligned across multiple drag frames', () => {
    const frames: Array<FrameRequestCallback> = []
    const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback)
      return frames.length
    })
    const layout = {
      root: {
        type: 'split' as const,
        id: 'split',
        direction: 'h' as const,
        children: [
          { type: 'leaf' as const, id: 'left', panelId: 'a' },
          { type: 'leaf' as const, id: 'right', panelId: 'b' },
        ],
        sizes: [50, 50],
      },
      floats: [],
    }
    render(<DockManager layout={layout}><DockPanel panelId="a" title="Alpha">Alpha</DockPanel><DockPanel panelId="b" title="Beta">Beta</DockPanel></DockManager>)
    const split = document.querySelector('.sp-dock-split') as HTMLElement
    expect(split).toHaveClass('sp-splitter')
    expect(split).toHaveClass('sp-splitter--thin')
    Object.defineProperty(split, 'offsetWidth', { configurable: true, value: 1000 })
    const splitter = screen.getByRole('separator', { name: 'Resize split' })
    expect(splitter).toHaveClass('sp-splitter__gutter')
    fireEvent.pointerDown(splitter, { button: 0, clientX: 500, clientY: 10 })
    fireEvent.pointerMove(window, { clientX: 550, clientY: 10 })
    act(() => { frames.shift()?.(0) })
    fireEvent.pointerMove(window, { clientX: 600, clientY: 10 })
    act(() => { frames.shift()?.(0) })
    fireEvent.pointerUp(window, { clientX: 600, clientY: 10 })
    requestAnimationFrame.mockRestore()
    expect(splitter).toHaveAttribute('aria-valuenow', '60')
  })

  it('fires pointer drop callbacks and exposes drag state semantics', () => {
    const onDropped = vi.fn()
    render(<><DragDrop data="source" group="source" data-testid="source">Source</DragDrop><DragDrop group="target" accepts={['source']} data-testid="target" onDropped={onDropped}>Target</DragDrop></>)
    const source = screen.getByTestId('source')
    const target = screen.getByTestId('target')
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON: () => ({}) })
    Object.defineProperty(document, 'elementsFromPoint', { configurable: true, value: () => [target] })
    fireEvent.pointerDown(source, { button: 0, clientX: 10, clientY: 10 })
    fireEvent.pointerMove(document, { clientX: 100, clientY: 50 })
    fireEvent.pointerUp(document, { clientX: 100, clientY: 50 })
    expect(onDropped).toHaveBeenCalledWith(expect.objectContaining({ data: 'source', target, position: 'inside' }))
  })

  it('exits overlay fullscreen on Escape and reports controlled state', () => {
    const onActiveChange = vi.fn()
    render(<Fullscreen active onActiveChange={onActiveChange}>Full</Fullscreen>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onActiveChange).toHaveBeenCalledWith(false)
  })

  it('hides on downward scroll and reveals on focus', async () => {
    const onHiddenChange = vi.fn()
    const scroller = document.createElement('div')
    document.body.appendChild(scroller)
    render(<HideOnScroll scroller={scroller} onHiddenChange={onHiddenChange}>Toolbar</HideOnScroll>)
    const toolbar = document.querySelector('.sp-hide-on-scroll') as HTMLElement
    Object.defineProperty(scroller, 'scrollTop', { configurable: true, value: 100, writable: true })
    scroller.dispatchEvent(new Event('scroll'))
    await act(async () => { await new Promise((resolve) => window.setTimeout(resolve, 20)) })
    expect(toolbar.dataset.hidden).toBe('true')
    fireEvent.focusIn(toolbar)
    expect(toolbar.dataset.hidden).toBe('false')
    expect(onHiddenChange).toHaveBeenCalledWith(false)
  })
})
