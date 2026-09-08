import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  TreeCombobox,
  TreeGridCombobox,
  type TreeComboboxNode,
  type TreeGridComboboxColumn,
  type TreeGridComboboxOption,
} from '../../src/index.js';
import { renderWithSpruce, waitFor } from '../utils/test-utils.js';

const mockNodes: TreeComboboxNode[] = [
  {
    value: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        value: 'app',
        label: 'app',
        icon: 'folder',
        children: [
          { value: 'app.component.ts', label: 'app.component.ts', icon: 'package' },
          { value: 'app.module.ts', label: 'app.module.ts', icon: 'package' },
        ],
      },
      { value: 'main.ts', label: 'main.ts', icon: 'package' },
    ],
  },
  {
    value: 'public',
    label: 'public',
    icon: 'folder',
    children: [{ value: 'favicon.ico', label: 'favicon.ico', icon: 'package' }],
  },
];

const mockColumns: TreeGridComboboxColumn[] = [
  { key: 'label', label: 'Name', width: '200px' },
  { key: 'type', label: 'Type', width: '100px' },
  { key: 'size', label: 'Size', width: '80px', align: 'end' },
];

const mockGridOptions: TreeGridComboboxOption[] = [
  {
    value: 'projects',
    label: 'Projects',
    type: 'Directory',
    size: '--',
    icon: 'folder',
    children: [
      {
        value: 'spruce',
        label: 'Spruce UI',
        type: 'Library',
        size: '1.2 MB',
        icon: 'package',
        children: [
          {
            value: 'core',
            label: 'Core',
            type: 'Module',
            size: '420 KB',
            icon: 'package',
          },
        ],
      },
    ],
  },
  {
    value: 'docs',
    label: 'Docs',
    type: 'Documentation',
    size: '500 KB',
    icon: 'folder',
  },
];

describe('TreeCombobox (Angular parity)', () => {
  it('renders input with placeholder and opens dropdown showing top-level tree nodes', async () => {
    const { container, user } = renderWithSpruce(
      <TreeCombobox nodes={mockNodes} placeholder="Select item" />,
    );

    const input = container.querySelector('input.sp-tc__input') as HTMLInputElement;
    expect(input.placeholder).toBe('Select item');
    expect(document.querySelector('.sp-tc__dropdown')).toBeNull();

    await user.click(input);
    await waitFor(() => expect(document.querySelector('.sp-tc__dropdown')).not.toBeNull());

    const rows = document.querySelectorAll('.sp-tc__row');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('src');
    expect(rows[1].textContent).toContain('public');
  });

  it('expands and collapses nodes when toggle is clicked', async () => {
    const { container, user } = renderWithSpruce(
      <TreeCombobox nodes={mockNodes} placeholder="Select item" />,
    );

    const input = container.querySelector('input.sp-tc__input') as HTMLInputElement;
    await user.click(input);

    await waitFor(() => expect(document.querySelectorAll('.sp-tc__row').length).toBe(2));

    const toggle = document.querySelector('.sp-tc__toggle') as HTMLButtonElement;
    await user.click(toggle);

    await waitFor(() => {
      const rows = document.querySelectorAll('.sp-tc__row');
      expect(rows.length).toBe(4);
      expect(rows[1].textContent).toContain('app');
      expect(rows[2].textContent).toContain('main.ts');
    });

    const activeToggle = document.querySelector('.sp-tc__toggle') as HTMLButtonElement;
    await user.click(activeToggle);

    await waitFor(() => {
      const rows = document.querySelectorAll('.sp-tc__row');
      expect(rows.length).toBe(2);
    });
  });

  it('selects single node and closes dropdown', async () => {
    const onChange = vi.fn();
    const onSelectedItem = vi.fn();
    const { container, user } = renderWithSpruce(
      <TreeCombobox
        nodes={mockNodes}
        placeholder="Select item"
        onChange={onChange}
        onSelectedItem={onSelectedItem}
      />,
    );

    const input = container.querySelector('input.sp-tc__input') as HTMLInputElement;
    await user.click(input);

    const rows = await waitFor(() => {
      const r = document.querySelectorAll('.sp-tc__row');
      expect(r.length).toBe(2);
      return r;
    });

    await user.click(rows[0]);
    expect(onChange).toHaveBeenCalledWith('src');
    expect(onSelectedItem).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'src', label: 'src' }),
    );
    await waitFor(() => expect(document.querySelector('.sp-tc__dropdown')).toBeNull());
  });

  it('supports multi-selection with checkboxes and chips', async () => {
    function MultiHarness() {
      const [val, setVal] = useState<string[]>([]);
      return (
        <TreeCombobox
          nodes={mockNodes}
          multiple
          expandAll
          value={val}
          onChange={setVal}
          placeholder="Select items"
        />
      );
    }

    const { container, user } = renderWithSpruce(<MultiHarness />);
    const input = container.querySelector('input.sp-tc__input') as HTMLInputElement;
    await user.click(input);

    await waitFor(() => {
      const cb = document.querySelectorAll('.sp-tc__checkbox');
      expect(cb.length).toBeGreaterThan(0);
    });

    // Check favicon.ico
    const rows = Array.from(document.querySelectorAll('.sp-tc__row'));
    const faviconRow = rows.find((r) => r.textContent?.includes('favicon.ico'));
    expect(faviconRow).toBeDefined();

    const favCheckbox = faviconRow!.querySelector('.sp-tc__checkbox') as HTMLElement;
    await user.click(favCheckbox);

    await waitFor(() => {
      const chips = container.querySelectorAll('.sp-tc__chip');
      expect(chips.length).toBe(1);
      expect(chips[0].textContent).toContain('favicon.ico');
    });

    // Remove chip
    const chipRemove = container.querySelector('.sp-tc__chip-remove') as HTMLElement;
    await user.click(chipRemove);

    await waitFor(() => {
      expect(container.querySelectorAll('.sp-tc__chip').length).toBe(0);
    });
  });

  it('renders tree guide lines when showLines is true', async () => {
    const { container, user } = renderWithSpruce(
      <TreeCombobox nodes={mockNodes} showLines expandAll />,
    );

    const input = container.querySelector('input.sp-tc__input') as HTMLInputElement;
    await user.click(input);

    await waitFor(() => {
      const guides = document.querySelectorAll('.sp-tc__guides');
      expect(guides.length).toBeGreaterThan(0);
    });
  });

  it('filters tree nodes based on search query and maintains hierarchy', async () => {
    const { container, user } = renderWithSpruce(<TreeCombobox nodes={mockNodes} />);

    const input = container.querySelector('input.sp-tc__input') as HTMLInputElement;
    await user.click(input);
    await user.type(input, 'favicon');

    await waitFor(() => {
      const rows = document.querySelectorAll('.sp-tc__row');
      expect(rows.length).toBe(2); // 'public' (ancestor) and 'favicon.ico' (match)
      expect(rows[0].textContent).toContain('public');
      expect(rows[1].textContent).toContain('favicon.ico');
    });
  });

  it('renders custom template when renderOption is provided', async () => {
    const { container, user } = renderWithSpruce(
      <TreeCombobox
        nodes={mockNodes}
        renderOption={({ node, selected }) => (
          <span className="custom-node-tpl">
            {node.label} [{selected ? 'YES' : 'NO'}]
          </span>
        )}
      />,
    );

    const input = container.querySelector('input.sp-tc__input') as HTMLInputElement;
    await user.click(input);

    await waitFor(() => {
      const customNodes = document.querySelectorAll('.custom-node-tpl');
      expect(customNodes.length).toBe(2);
      expect(customNodes[0].textContent).toContain('src [NO]');
    });
  });
});

describe('TreeGridCombobox (Angular parity)', () => {
  it('renders input with placeholder and opens datagrid dropdown showing column headers and tree items', async () => {
    const { container, user } = renderWithSpruce(
      <TreeGridCombobox
        columns={mockColumns}
        options={mockGridOptions}
        placeholder="Select file"
      />,
    );

    const input = container.querySelector('input.sp-tgc__input') as HTMLInputElement;
    expect(input.placeholder).toBe('Select file');
    expect(document.querySelector('.sp-tgc__dropdown')).toBeNull();

    await user.click(input);
    await waitFor(() => expect(document.querySelector('.sp-tgc__dropdown')).not.toBeNull());

    const headers = document.querySelectorAll('.sp-tgc__header-cell');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('Name');
    expect(headers[1].textContent).toContain('Type');
    expect(headers[2].textContent).toContain('Size');

    const rows = document.querySelectorAll('.sp-tgc__row');
    expect(rows.length).toBe(2);
  });

  it('expands nested children and renders columns across rows', async () => {
    const { container, user } = renderWithSpruce(
      <TreeGridCombobox columns={mockColumns} options={mockGridOptions} />,
    );

    const input = container.querySelector('input.sp-tgc__input') as HTMLInputElement;
    await user.click(input);

    await waitFor(() => expect(document.querySelectorAll('.sp-tgc__row').length).toBe(2));

    const toggle = document.querySelector('.sp-tgc__toggle') as HTMLButtonElement;
    await user.click(toggle);

    await waitFor(() => {
      const rows = document.querySelectorAll('.sp-tgc__row');
      expect(rows.length).toBe(3);
      expect(rows[1].textContent).toContain('Spruce UI');
      expect(rows[1].textContent).toContain('1.2 MB');
    });
  });

  it('selects option and closes dropdown in single mode', async () => {
    const onChange = vi.fn();
    const onSelectedItem = vi.fn();
    const { container, user } = renderWithSpruce(
      <TreeGridCombobox
        columns={mockColumns}
        options={mockGridOptions}
        onChange={onChange}
        onSelectedItem={onSelectedItem}
      />,
    );

    const input = container.querySelector('input.sp-tgc__input') as HTMLInputElement;
    await user.click(input);

    const rows = await waitFor(() => {
      const r = document.querySelectorAll('.sp-tgc__row');
      expect(r.length).toBe(2);
      return r;
    });

    await user.click(rows[0]);
    expect(onChange).toHaveBeenCalledWith('projects');
    expect(onSelectedItem).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'projects', label: 'Projects' }),
    );
    await waitFor(() => expect(document.querySelector('.sp-tgc__dropdown')).toBeNull());
  });

  it('supports multi-selection with checkboxes and chips', async () => {
    function MultiGridHarness() {
      const [val, setVal] = useState<string[]>([]);
      return (
        <TreeGridCombobox
          columns={mockColumns}
          options={mockGridOptions}
          multiple
          expandAll
          value={val}
          onChange={setVal}
        />
      );
    }

    const { container, user } = renderWithSpruce(<MultiGridHarness />);
    const input = container.querySelector('input.sp-tgc__input') as HTMLInputElement;
    await user.click(input);

    const rows = await waitFor(() => {
      const r = Array.from(document.querySelectorAll('.sp-tgc__row'));
      expect(r.length).toBeGreaterThan(0);
      return r;
    });

    const docsRow = rows.find((r) => r.textContent?.includes('Docs'));
    expect(docsRow).toBeDefined();

    const checkbox = docsRow!.querySelector('.sp-tgc__checkbox') as HTMLElement;
    await user.click(checkbox);

    await waitFor(() => {
      const chips = container.querySelectorAll('.sp-tgc__chip');
      expect(chips.length).toBe(1);
      expect(chips[0].textContent).toContain('Docs');
    });
  });

  it('shows resizers when resizableColumns is enabled', async () => {
    const { container, user } = renderWithSpruce(
      <TreeGridCombobox
        columns={mockColumns}
        options={mockGridOptions}
        resizableColumns
      />,
    );

    const input = container.querySelector('input.sp-tgc__input') as HTMLInputElement;
    await user.click(input);

    await waitFor(() => {
      const resizers = document.querySelectorAll('.sp-tgc__resizer');
      expect(resizers.length).toBe(2);
    });
  });

  it('renders custom template when renderOption is provided', async () => {
    const { container, user } = renderWithSpruce(
      <TreeGridCombobox
        columns={mockColumns}
        options={mockGridOptions}
        renderOption={({ opt }) => (
          <div className="custom-grid-tpl">
            {opt.label} - {String(opt['size'])}
          </div>
        )}
      />,
    );

    const input = container.querySelector('input.sp-tgc__input') as HTMLInputElement;
    await user.click(input);

    await waitFor(() => {
      const customNodes = document.querySelectorAll('.custom-grid-tpl');
      expect(customNodes.length).toBe(2);
      expect(customNodes[0].textContent).toContain('Projects - --');
    });
  });
});
