import { useState } from 'react';
import { CommentThread, type Comment, type CommentAuthor, type MentionItem } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const CURRENT_USER: CommentAuthor = { id: 'me', name: 'Mina Reyes', avatar: 'https://i.pravatar.cc/80?img=32' };
const COMMENTS: Comment[] = [
  { id: 'c1', author: { id: 'a1', name: 'Alex Chen' }, body: 'The new table is ready for review, @Mina.', createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), reactions: [{ emoji: '👍', userIds: ['a1', 'a2'] }] },
  { id: 'c2', author: { id: 'a2', name: 'Jordan Lee' }, body: 'I will check the keyboard flow today.', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), replies: [] },
];
const MENTIONS: MentionItem[] = [{ id: 'me', label: 'Mina' }, { id: 'alex', label: 'Alex' }];

export function CommentThreadPage() {
  const [comments, setComments] = useState(COMMENTS);
  const [lastEvent, setLastEvent] = useState('No events yet');
  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Comment Thread</h1>
        <p className="docs-desc">Threaded comments with mentions, replies, reactions, relative dates, and controlled lifecycle callbacks.</p>

        <section id="conversation" className="demo-section">
          <h2>Conversation</h2>
          <CodePreview code={'<CommentThread comments={comments} currentUser={user} mentionItems={people} onCommentSubmit={handleSubmit} />'}>
            <CommentThread comments={comments} currentUser={CURRENT_USER} mentionItems={MENTIONS} onCommentSubmit={(event) => { setLastEvent(`Submitted: ${event.body}`); setComments((items) => [...items, { id: `new-${items.length}`, author: CURRENT_USER, body: event.body, createdAt: new Date().toISOString() }]); }} onReactionToggle={(event) => setLastEvent(`Reaction ${event.emoji} on ${event.commentId}`)} onCommentDelete={(event) => { setComments((items) => items.filter((comment) => comment.id !== event.commentId)); setLastEvent(`Deleted ${event.commentId}`); }} />
            <p className="section-desc">Last event: <code>{lastEvent}</code></p>
          </CodePreview>
        </section>

        <section id="controlled" className="demo-section">
          <h2>Controlled composers and empty state</h2>
          <CodePreview code={'<CommentThread comments={[]} currentUser={user} allowReplies={false} placeholder="Start a discussion" />'}>
            <CommentThread comments={[]} currentUser={CURRENT_USER} allowReplies={false} placeholder="Start a discussion" emptyText="No discussion started" />
          </CodePreview>
        </section>

        <section id="accessibility" className="demo-section">
          <h2>Accessibility</h2>
          <p className="section-desc">Comments use labelled regions, semantic dates, keyboard-focusable reaction controls, native text entry through <code>Mention</code>, and explicit labels on destructive actions. The palette is a keyboard-operable menu and follows document direction.</p>
        </section>

        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap"><table className="api-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
            <tr><td><code>comments</code></td><td><code>Comment[]</code></td><td><code>[]</code></td><td>Top-level comments with optional replies and reactions.</td></tr>
            <tr><td><code>currentUser</code></td><td><code>CommentAuthor</code></td><td>required</td><td>Author for the composer and delete ownership checks.</td></tr>
            <tr><td><code>mentionItems</code> / <code>palette</code></td><td><code>MentionItem[]</code> / <code>string[]</code></td><td><code>[]</code> / common palette</td><td>People available for mentions and reaction choices.</td></tr>
            <tr><td><code>allowReplies</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enables reply controls and reply composers.</td></tr>
            <tr><td><code>draft</code> / <code>onDraftChange</code> / <code>replyingTo</code></td><td>controlled values / callbacks</td><td>—</td><td>Optional controlled composer state.</td></tr>
            <tr><td><code>onCommentSubmit</code> / <code>onReactionToggle</code> / <code>onCommentDelete</code></td><td>callbacks</td><td>—</td><td>Submit, reaction, and own-comment delete events.</td></tr>
          </tbody></table></div>
        </section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#conversation">Conversation</a></li><li><a className="toc-link" href="#controlled">Controlled state</a></li><li><a className="toc-link" href="#accessibility">Accessibility</a></li><li><a className="toc-link" href="#api">API</a></li></ul></nav>
    </div>
  );
}
