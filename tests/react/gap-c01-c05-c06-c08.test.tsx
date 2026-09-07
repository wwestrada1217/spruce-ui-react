import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Anchor,
  AnchorItem,
  AnchorTarget,
  ContentTransition,
  FlipCard,
  TreeCombobox,
  TreeGridCombobox,
  type TreeComboboxNode,
  type TreeGridComboboxColumn,
  type TreeGridComboboxOption,
  type IReadableDataSource,
} from '../../src/index.js';
import { expectNoA11yViolations, renderWithSpruce, waitFor } from '../utils/test-utils.js';

const treeNodes: TreeComboboxNode[] = [
  { value: 'engineering', label: 'Engineering', children: [
    { value: 'web', label: 'Web platform' },
    { value: 'mobile', label: 'Mobile' },
  ] },
  { value: 'design', label: 'Design' },
];

describe('C-01 Anchor navigation', () => {
  it('supports declarative nesting, aliases, keyboard focus, and active callbacks', async () => {
    const onActiveChange = vi.fn();
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: scrollTo });
    const { getByRole, getAllByRole, user } = renderWithSpruce(<>
      <Anchor variant="bracket" activeId="intro" onActiveChange={onActiveChange} showTitle>
        <AnchorItem target="intro" label="Introduction" />
        <AnchorItem target="details" label="Details" badge="new" />
      </Anchor>
      <main>
        <AnchorTarget id="intro"><h2>Intro</h2></AnchorTarget>
        <AnchorTarget id="details"><h2>Details</h2></AnchorTarget>
      </main>
    </>);

    expect(getByRole('navigation')).toHaveClass('sp-anchor--stepped');
    const links = getAllByRole('link');
    links[0].focus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(links[1]).toHaveFocus();
    expect(onActiveChange).toHaveBeenCalledWith('details');
    expect(scrollTo).toHaveBeenCalled();
    await expectNoA11yViolations(document.body);
  });

  it('renders scrubber geometry and accessible tick names', () => {
    const { getByRole, getAllByRole } = renderWithSpruce(<Anchor items={treeNodes.map((node) => ({ id: node.value, label: node.label }))} variant="magnifier" />);
    expect(getByRole('navigation')).toHaveClass('sp-anchor--scrubber');
    expect(getAllByRole('link').map((link) => link.getAttribute('aria-label'))).toEqual(['Engineering', 'Design']);
  });
});

describe('C-05 TreeCombobox', () => {
  it('implements tree keyboard expansion and controlled single selection', async () => {
    const onChange = vi.fn();
    const { getByRole, user } = renderWithSpruce(<TreeCombobox nodes={treeNodes} value="" onChange={onChange} label="Team" />);
    const input = getByRole('combobox', { name: 'Team' });
    await user.click(input);
    await waitFor(() => expect(getByRole('tree')).toBeInTheDocument());
    await user.keyboard('{ArrowRight}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('web');
    expect(input).toHaveFocus();
  });

  it('cascades multiple selection and exposes mixed/checked tree semantics', async () => {
    function Harness() {
      const [value, setValue] = useState<string[]>([]);
      return <TreeCombobox nodes={treeNodes} multiple value={value} onChange={setValue} expandAll showLines ariaLabel="Teams" />;
    }
    const { container, getByRole, user } = renderWithSpruce(<Harness />);
    await user.click(getByRole('combobox', { name: 'Teams' }));
    const parent = await waitFor(() => getByRole('treeitem', { name: /Engineering/ }));
    await user.click(parent);
    expect(parent).toHaveAttribute('aria-checked', 'true');
    expect(getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
    await expectNoA11yViolations(container);
  });

  it('loads and searches existing readable data-source adapters', async () => {
    const page = (data: TreeComboboxNode[]) => ({ pageNumber: 1, pageSize: 20, totalPages: 1, totalRecords: data.length, data, hasPrevious: false, hasNext: false });
    const source: IReadableDataSource<TreeComboboxNode> = {
      read: vi.fn(async () => page(treeNodes)),
      search: vi.fn(async () => page([{ value: 'mobile', label: 'Mobile' }])),
      getById: vi.fn(async (value) => treeNodes.find((node) => node.value === value) ?? treeNodes[0]),
    };
    const { getByRole, user } = renderWithSpruce(<TreeCombobox source={source} searchFields={['label']} ariaLabel="Remote teams" />);
    const input = getByRole('combobox', { name: 'Remote teams' });
    await user.click(input);
    await waitFor(() => expect(source.read).toHaveBeenCalled());
    await user.type(input, 'mob');
    await waitFor(() => expect(source.search).toHaveBeenLastCalledWith('mob', ['label'], expect.objectContaining({ searchTerm: 'mob' })));
    expect(await waitFor(() => getByRole('treeitem', { name: /Mobile/ }))).toBeInTheDocument();
  });
});

describe('C-06 TreeGridCombobox', () => {
  const columns: TreeGridComboboxColumn[] = [
    { key: 'label', label: 'Name', resizable: true },
    { key: 'kind', label: 'Kind' },
  ];
  const options: TreeGridComboboxOption[] = [
    { value: 'src', label: 'src', kind: 'Folder', children: [{ value: 'index', label: 'index.ts', kind: 'TypeScript' }] },
  ];

  it('uses treegrid roles, datagrid-style columns, resize handles, and hierarchy navigation', async () => {
    const onChange = vi.fn();
    const { getByRole, getAllByRole, user } = renderWithSpruce(<main><TreeGridCombobox columns={columns} options={options} value="" onChange={onChange} resizableColumns label="File" /></main>);
    const input = getByRole('combobox', { name: 'File' });
    await user.click(input);
    await waitFor(() => expect(getByRole('treegrid')).toBeInTheDocument());
    expect(getAllByRole('columnheader')).toHaveLength(2);
    expect(getByRole('button', { name: /Resize.*Name|Name.*column/i })).toBeInTheDocument();
    await user.keyboard('{ArrowRight}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('index');
    await expectNoA11yViolations(document.body);
  });

  it('reports cascade selection with an indeterminate-capable parent row', async () => {
    const onChange = vi.fn();
    const { getByRole, user } = renderWithSpruce(<TreeGridCombobox columns={columns} options={options} multiple value={[]} onChange={onChange} expandAll ariaLabel="Files" />);
    await user.click(getByRole('combobox', { name: 'Files' }));
    const parent = await waitFor(() => getByRole('row', { name: /src Folder/ }));
    await user.click(parent);
    expect(onChange).toHaveBeenLastCalledWith(['src', 'index']);
    expect(getByRole('treegrid')).toHaveAttribute('aria-multiselectable', 'true');
  });
});

describe('C-08 ContentTransition and FlipCard', () => {
  it('supports click and keyboard triggers while hiding the inactive face', async () => {
    const onChange = vi.fn();
    const { getByRole, getByText, user } = renderWithSpruce(<FlipCard trigger="click" onActiveChange={onChange} ariaLabel="Reveal details" front="Front" back="Back" />);
    const card = getByRole('button', { name: 'Reveal details' });
    expect(getByText('Back')).toHaveAttribute('aria-hidden', 'true');
    card.focus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(true);
    expect(getByText('Front')).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports controlled manual state and all transition classes', () => {
    const { rerender, getByText } = renderWithSpruce(<ContentTransition trigger="manual" active={false} type="slide-left" front="Primary" back="Secondary" />);
    expect(getByText('Primary').closest('.sp-content-transition')).toHaveClass('sp-transition--slide-left');
    rerender(<ContentTransition trigger="manual" active type="zoom" front="Primary" back="Secondary" />);
    expect(getByText('Secondary')).toHaveAttribute('aria-hidden', 'false');
    expect(getByText('Secondary').closest('.sp-content-transition')).toHaveClass('sp-content-transition--active', 'sp-transition--zoom');
  });
});
