import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import {
  BlockEditor,
  CodeEditor,
  DiffEditor,
  Editor,
  InplaceEditor,
  MarkdownEditor,
  type BlockEditorDocument,
  type BlockEditorHandle,
} from '../../src/index.js';
import { expectDocumentDirection, pressKey, renderWithRtl, renderWithSpruce, waitFor } from '../utils/test-utils.js';

describe('P1.0-10 editor parity', () => {
  it('keeps CodeEditor controlled and applies indentation, brackets, and completion keyboard behavior', async () => {
    const onCodeChange = vi.fn();
    const completion = [{ label: 'useState', insertText: 'useState' }];
    const view = renderWithSpruce(
      <CodeEditor
        code=""
        language="typescript"
        tabSize={4}
        showMinimap={false}
        completionItems={completion}
        onCodeChange={onCodeChange}
        ariaLabel="Source code"
      />,
    );
    const textarea = view.getByRole('textbox', { name: 'Source code' });

    textarea.focus();
    await pressKey(view.user, 'Tab');
    expect(onCodeChange).toHaveBeenLastCalledWith('    ');

    await view.user.clear(textarea);
    fireEvent.keyDown(textarea, { key: ' ', code: 'Space', ctrlKey: true });
    expect(view.getByRole('listbox', { name: /suggestions/i })).toBeInTheDocument();
    await view.user.click(view.getByRole('option', { name: 'useState' }));
    expect(onCodeChange).toHaveBeenLastCalledWith('useState');

    await view.user.clear(textarea);
    fireEvent.keyDown(textarea, { key: '{', code: 'BracketLeft' });
    expect(onCodeChange).toHaveBeenLastCalledWith('{}');
  });

  it('exposes CodeEditor diagnostics and read-only semantics in RTL', async () => {
    const view = renderWithRtl(
      <CodeEditor
        code="const value = 1;"
        readonly
        showMinimap={false}
        diagnostics={[{ line: 1, startCol: 1, endCol: 6, message: 'Unused value', severity: 'warning' }]}
        ariaLabel="Read-only source"
      />,
    );
    const textarea = view.getByRole('textbox', { name: 'Read-only source' });
    expect(textarea).toHaveAttribute('readonly');
    expect(view.container.querySelector('.sp-code-editor__diagnostics')).toHaveTextContent('Unused value');
    expectDocumentDirection('rtl');
    await waitFor(() => expect(view.container.querySelector('.sp-code-editor-host--rtl')).toBeInTheDocument());
  });

  it('supports DiffEditor mode, navigation, editable panes, and splitter keyboard controls', async () => {
    const onModeChange = vi.fn();
    const onModifiedChange = vi.fn();
    const view = renderWithSpruce(
      <DiffEditor
        original={'one\ntwo'}
        modified={'one\nthree'}
        showSplitter
        changeNavigation
        editable
        onModeChange={onModeChange}
        onModifiedChange={onModifiedChange}
        originalLabel="Before"
        modifiedLabel="After"
      />,
    );

    expect(view.getByRole('region', { name: /diff editor/i })).toBeInTheDocument();
    const splitter = view.getByRole('separator', { name: /resizable split view/i });
    splitter.focus();
    await pressKey(view.user, 'ArrowRight');
    expect(splitter).toHaveAttribute('aria-orientation', 'vertical');

    expect(view.getByRole('textbox', { name: 'Before' })).toHaveAttribute('readonly');
    const modified = view.getByRole('textbox', { name: 'After' });
    expect(modified).not.toHaveAttribute('readonly');
    await view.user.click(modified);
    await view.user.type(modified, '!');
    expect(onModifiedChange).toHaveBeenCalled();

    await view.user.click(view.getByRole('button', { name: /side by side/i }));
    expect(onModeChange).toHaveBeenCalledWith('inline');
    expect(view.getByRole('textbox', { name: /diff editor/i })).toHaveAttribute('readonly');
  });

  it('opens Editor mention suggestions and inserts the selected item with callbacks', async () => {
    const onChange = vi.fn();
    const onMention = vi.fn();
    const onMentionSearch = vi.fn();
    const view = renderWithSpruce(
      <Editor
        value=""
        onChange={onChange}
        mentionItems={[{ id: 'ada', label: 'Ada Lovelace', description: 'Mathematician' }]}
        onMention={onMention}
        onMentionSearch={onMentionSearch}
        label="Comment"
      />,
    );
    const editor = view.getByRole('textbox', { name: 'Comment' });
    await view.user.click(editor);
    await view.user.type(editor, '@Ada');
    expect(onMentionSearch).toHaveBeenCalledWith('Ada');
    expect(view.getByRole('listbox', { name: /mention suggestions/i })).toBeInTheDocument();
    await pressKey(view.user, 'Enter');
    expect(onMention).toHaveBeenCalledWith(expect.objectContaining({ item: expect.objectContaining({ id: 'ada' }) }));
    expect(onChange).toHaveBeenCalled();
  });

  it('enforces MarkdownEditor max length and exposes validation, count, and touched state', async () => {
    const onChange = vi.fn();
    const onTouched = vi.fn();
    function ControlledMarkdown() {
      const [text, setText] = useState('Hi');
      return <MarkdownEditor value={text} maxLength={5} showCount rows={4} invalid errors={[{ message: 'Markdown is invalid', code: 'invalid' }]} ariaLabel="Markdown body" onChange={(next) => { setText(next); onChange(next); }} onTouched={onTouched} />;
    }
    const view = renderWithSpruce(
      <ControlledMarkdown />,
    );
    const textarea = view.getByRole('textbox', { name: 'Markdown body' });
    expect(textarea).toHaveAttribute('rows', '4');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(view.getByRole('alert')).toHaveTextContent('Markdown is invalid');
    await view.user.clear(textarea);
    await view.user.type(textarea, '123456');
    expect(onChange).toHaveBeenLastCalledWith('12345');
    expect(view.getByText('5/5')).toBeInTheDocument();
    await view.user.tab();
    expect(onTouched).toHaveBeenCalled();
  });

  it('supports BlockEditor persistence and undo through its controlled ref surface', async () => {
    const ref = createRef<BlockEditorHandle>();
    const document: BlockEditorDocument = { version: 1, blocks: [{ id: 'one', type: 'paragraph', content: 'Saved' }] };
    function Host() {
      const [blocks, setBlocks] = useState([] as BlockEditorDocument['blocks']);
      return <BlockEditor ref={ref} blocks={blocks} onChange={setBlocks} label="Document blocks" />;
    }
    const view = renderWithSpruce(<Host />);

    ref.current?.loadDocument(document);
    await waitFor(() => expect(ref.current?.saveJSON()).toContain('Saved'));
    expect(ref.current?.save()).toEqual(document);
    ref.current?.undo();
    await waitFor(() => expect(ref.current?.save().blocks).toHaveLength(0));
    ref.current?.redo();
    await waitFor(() => expect(ref.current?.save().blocks[0]?.content).toBe('Saved'));
    expect(view.container.querySelector('.sp-block-editor')).toBeInTheDocument();
  });

  it('covers InplaceEditor number editing and explicit accept/discard actions', async () => {
    const onValueChange = vi.fn();
    const view = renderWithSpruce(
      <InplaceEditor value={3} type="number" showActions editLabel="Edit quantity" onValueChange={onValueChange} />,
    );
    await view.user.click(view.getByRole('button', { name: 'Edit quantity' }));
    const input = view.getByRole('spinbutton', { name: 'Edit quantity' });
    await view.user.clear(input);
    await view.user.type(input, '7');
    await view.user.click(view.getByRole('button', { name: /accept/i }));
    expect(onValueChange).toHaveBeenCalledWith(7);

    await view.user.click(view.getByRole('button', { name: 'Edit quantity' }));
    await view.user.clear(view.getByRole('spinbutton', { name: 'Edit quantity' }));
    await view.user.type(view.getByRole('spinbutton', { name: 'Edit quantity' }), '9');
    await view.user.click(view.getByRole('button', { name: /discard/i }));
    expect(onValueChange).not.toHaveBeenLastCalledWith(9);
  });

  it('keeps editor parity surfaces accessible in the dark theme', async () => {
    const view = renderWithSpruce(
      <>
        <CodeEditor code="const dark = true;" readonly showMinimap={false} ariaLabel="Dark code" />
        <DiffEditor original="a" modified="b" ariaLabel="Dark diff" />
        <MarkdownEditor value="# Dark markdown" ariaLabel="Dark markdown" />
      </>,
      { providerProps: { defaultTheme: 'dark' } },
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(view.getByRole('textbox', { name: 'Dark code' })).toBeInTheDocument();
    expect(view.getByRole('region', { name: 'Dark diff' })).toBeInTheDocument();
    expect(view.getByRole('textbox', { name: 'Dark markdown' })).toBeInTheDocument();
  });
});
