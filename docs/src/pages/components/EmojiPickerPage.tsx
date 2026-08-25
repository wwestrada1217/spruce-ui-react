import { useState } from 'react';
import { EmojiPicker, type EmojiPickerEmoji } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const STATUS_EMOJIS: readonly EmojiPickerEmoji[] = [
  { label: 'Done', value: '✅', keywords: ['complete', 'success'] },
  { label: 'Blocked', value: '⛔', keywords: ['stop', 'blocked'] },
  { label: 'Warning', value: '⚠️', keywords: ['risk', 'attention'] },
  { label: 'Launch', value: '🚀', keywords: ['ship', 'release'] },
];

const BASIC_CODE = `const [emoji, setEmoji] = useState('🙂');

<EmojiPicker value={emoji} onChange={setEmoji} label="Reaction" />`;

export function EmojiPickerPage() {
  const [emoji, setEmoji] = useState('🙂');
  const [status, setStatus] = useState('✅');
  const [selected, setSelected] = useState<EmojiPickerEmoji | null>(null);

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Emoji Picker</h1>
        <p className="docs-desc">Searchable emoji selection for reactions, comments, and editor toolbars.</p>

        <section id="basic" className="demo-section">
          <h2>Basic</h2>
          <CodePreview code={BASIC_CODE}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-space-3)' }}>
              <EmojiPicker value={emoji} onChange={setEmoji} onSelected={setSelected} label="Reaction" />
              <span>{emoji} {selected?.label ?? 'No emoji selected'}</span>
            </div>
          </CodePreview>
        </section>

        <section id="custom" className="demo-section">
          <h2>Custom emoji set</h2>
          <CodePreview code={'<EmojiPicker value={status} emojis={statusEmojis} icon={null} onChange={setStatus} />'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-space-3)' }}>
              <EmojiPicker value={status} emojis={STATUS_EMOJIS} icon={null} label="Status" onChange={setStatus} />
              <span>{status}</span>
            </div>
          </CodePreview>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>value</code></td><td><code>string</code></td><td><code>'🙂'</code></td><td>Controlled emoji value.</td></tr>
            <tr><td><code>onChange</code></td><td><code>(value) =&gt; void</code></td><td>—</td><td>Called with the selected emoji character.</td></tr>
            <tr><td><code>onSelected</code></td><td><code>(emoji) =&gt; void</code></td><td>—</td><td>Called with the full selected emoji object.</td></tr>
            <tr><td><code>emojis</code></td><td><code>EmojiPickerEmoji[]</code></td><td>Common emojis</td><td>Choices filtered by label, value, and keywords.</td></tr>
            <tr><td><code>icon</code></td><td><code>string | null</code></td><td><code>'smile'</code></td><td>Pass <code>null</code> to show the current emoji in the trigger.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#basic">Basic</a></li><li><a className="toc-link" href="#custom">Custom emoji set</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}

