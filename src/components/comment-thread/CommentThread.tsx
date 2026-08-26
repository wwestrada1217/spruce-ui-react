import './CommentThread.css';
/* eslint-disable react-refresh/only-export-components */
import { useRef, useState, type CSSProperties } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { Icon } from '../../icons/Icon.js';
import { Avatar } from '../avatar/Avatar.js';
import { Button } from '../button/Button.js';
import { Mention, type MentionInsertEvent, type MentionItem } from '../mention/Mention.js';
import { Popover } from '../popover/Popover.js';

export interface CommentAuthor {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface CommentReaction {
  emoji: string;
  userIds: string[];
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  body: string;
  createdAt: string;
  reactions?: CommentReaction[];
  replies?: Comment[];
}

export interface CommentSubmitEvent {
  body: string;
  parentId: string | null;
  mentions: string[];
}

export interface ReactionToggleEvent {
  commentId: string;
  emoji: string;
}

export const DEFAULT_REACTION_PALETTE: readonly string[] = ['👍', '❤️', '😂', '🎉', '😮', '😢'];

export interface CommentThreadProps {
  comments?: readonly Comment[];
  currentUser: CommentAuthor;
  mentionItems?: readonly MentionItem[];
  reactionPalette?: readonly string[];
  allowReplies?: boolean;
  placeholder?: string;
  replyPlaceholder?: string;
  emptyText?: string;
  draft?: string;
  onDraftChange?: (value: string) => void;
  replyDraft?: string;
  onReplyDraftChange?: (value: string) => void;
  replyingTo?: string | null;
  onReplyingToChange?: (commentId: string | null) => void;
  onCommentSubmit?: (event: CommentSubmitEvent) => void;
  onReactionToggle?: (event: ReactionToggleEvent) => void;
  onCommentDelete?: (event: { commentId: string }) => void;
  className?: string;
  style?: CSSProperties;
}

/** Escapes a comment body and highlights known @mention labels safely. */
export function renderCommentBody(body: string, mentionLabels: readonly string[]): string {
  const escaped = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const labels = [...mentionLabels].filter(Boolean).sort((left, right) => right.length - left.length);
  if (labels.length === 0) return escaped;
  const pattern = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return escaped.replace(new RegExp(`@(${pattern})`, 'g'), '<span class="sp-comment__mention">@$1</span>');
}

/** Formats a comment timestamp with the active locale and a short relative style. */
export function formatRelativeTime(iso: string, now: number, locale?: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Math.max(0, now - then);
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'narrow' });
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return relative.format(0, 'second');
  if (minutes < 60) return relative.format(-minutes, 'minute');
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return relative.format(-hours, 'hour');
  const days = Math.floor(hours / 24);
  if (days < 7) return relative.format(-days, 'day');
  return new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

interface CommentItemProps {
  comment: Comment;
  isReply: boolean;
  currentUser: CommentAuthor;
  mentionItems: readonly MentionItem[];
  reactionPalette: readonly string[];
  allowReplies: boolean;
  onReactionToggle?: (event: ReactionToggleEvent) => void;
  onCommentDelete?: (event: { commentId: string }) => void;
  onStartReply: (commentId: string) => void;
  locale: string;
  now: number;
  t: ReturnType<typeof useI18n>['t'];
}

function CommentItem({
  comment,
  isReply,
  currentUser,
  mentionItems,
  reactionPalette,
  allowReplies,
  onReactionToggle,
  onCommentDelete,
  onStartReply,
  locale,
  now,
  t,
}: CommentItemProps) {
  return (
    <article className="sp-comment__item">
      <Avatar src={comment.author.avatar} name={comment.author.name} size="sm" />
      <div className="sp-comment__main">
        <div className="sp-comment__head">
          <span className="sp-comment__name">{comment.author.name}</span>
          {comment.author.email && <span className="sp-comment__email">{comment.author.email}</span>}
          <time className="sp-comment__time" dateTime={comment.createdAt}>{formatRelativeTime(comment.createdAt, now, locale)}</time>
        </div>
        <div className="sp-comment__body" dangerouslySetInnerHTML={{ __html: renderCommentBody(comment.body, mentionItems.map((item) => item.label)) }} />
        <div className="sp-comment__actions">
          {(comment.reactions ?? []).map((reaction) => {
            if (reaction.userIds.length === 0) return null;
            const mine = reaction.userIds.includes(currentUser.id);
            return (
              <button
                type="button"
                className={['sp-comment__chip', mine && 'sp-comment__chip--mine'].filter(Boolean).join(' ')}
                aria-pressed={mine}
                aria-label={`${reaction.emoji} ${reaction.userIds.length}`}
                key={reaction.emoji}
                onClick={() => onReactionToggle?.({ commentId: comment.id, emoji: reaction.emoji })}
              >
                {reaction.emoji} {reaction.userIds.length}
              </button>
            );
          })}
          <Popover
            trigger={<button type="button" className="sp-comment__react" aria-label={t('addReaction')} aria-haspopup="menu"><Icon name="smile" size={15} /></button>}
            placement="top-start"
            padding="4px"
            panelAriaLabel={t('addReaction')}
          >
            <div className="sp-comment__palette" role="menu">
              {reactionPalette.map((emoji) => (
                <button type="button" role="menuitem" className="sp-comment__palette-btn" aria-label={`React ${emoji}`} key={emoji} onClick={() => onReactionToggle?.({ commentId: comment.id, emoji })}>{emoji}</button>
              ))}
            </div>
          </Popover>
          {allowReplies && !isReply && (
            <button type="button" className="sp-comment__link" onClick={() => onStartReply(comment.id)}>
              <Icon name="corner-up-left" size={14} /> {t('reply')}
            </button>
          )}
          {comment.author.id === currentUser.id && (
            <button type="button" className="sp-comment__link" onClick={() => onCommentDelete?.({ commentId: comment.id })}>
              <Icon name="trash-2" size={14} /> {t('delete')}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/** A presentational comment conversation with one reply level and reactions. */
export function CommentThread({
  comments = [],
  currentUser,
  mentionItems = [],
  reactionPalette = DEFAULT_REACTION_PALETTE,
  allowReplies = true,
  placeholder,
  replyPlaceholder,
  emptyText,
  draft: controlledDraft,
  onDraftChange,
  replyDraft: controlledReplyDraft,
  onReplyDraftChange,
  replyingTo: controlledReplyingTo,
  onReplyingToChange,
  onCommentSubmit,
  onReactionToggle,
  onCommentDelete,
  className = '',
  style,
}: CommentThreadProps) {
  const { direction, locale, t } = useI18n();
  const [now] = useState(() => Date.now());
  const [internalDraft, setInternalDraft] = useState('');
  const [internalReplyDraft, setInternalReplyDraft] = useState('');
  const [internalReplyingTo, setInternalReplyingTo] = useState<string | null>(null);
  const draft = controlledDraft ?? internalDraft;
  const replyDraft = controlledReplyDraft ?? internalReplyDraft;
  const replyingTo = controlledReplyingTo ?? internalReplyingTo;
  const draftMentions = useRef(new Set<string>());
  const replyMentions = useRef(new Set<string>());

  function setDraft(value: string): void {
    if (controlledDraft === undefined) setInternalDraft(value);
    onDraftChange?.(value);
  }
  function setReplyDraft(value: string): void {
    if (controlledReplyDraft === undefined) setInternalReplyDraft(value);
    onReplyDraftChange?.(value);
  }
  function setReplyingTo(value: string | null): void {
    if (controlledReplyingTo === undefined) setInternalReplyingTo(value);
    onReplyingToChange?.(value);
  }
  function collectMentions(tracked: Set<string>, body: string): string[] {
    const labels = new Map(mentionItems.map((item) => [item.id, item.label]));
    return [...tracked].filter((id) => {
      const label = labels.get(id);
      return label ? body.includes(`@${label}`) : false;
    });
  }
  function submitTop(): void {
    const body = draft.trim();
    if (!body) return;
    onCommentSubmit?.({ body, parentId: null, mentions: collectMentions(draftMentions.current, body) });
    setDraft('');
    draftMentions.current.clear();
  }
  function startReply(commentId: string): void {
    setReplyingTo(commentId);
    setReplyDraft('');
    replyMentions.current.clear();
  }
  function cancelReply(): void {
    setReplyingTo(null);
    setReplyDraft('');
    replyMentions.current.clear();
  }
  function submitReply(parentId: string): void {
    const body = replyDraft.trim();
    if (!body) return;
    onCommentSubmit?.({ body, parentId, mentions: collectMentions(replyMentions.current, body) });
    cancelReply();
  }
  function handleMention(event: MentionInsertEvent, isReply: boolean): void {
    (isReply ? replyMentions.current : draftMentions.current).add(event.item.id);
  }

  return (
    <div className={['sp-comment-thread', className].filter(Boolean).join(' ')} style={style} dir={direction} role="region" aria-label={t('comment')}>
      <div className="sp-comment-thread__list">
        {comments.length === 0 && <p className="sp-comment-thread__empty">{emptyText ?? t('noCommentsYet')}</p>}
        {comments.map((comment) => (
          <div className="sp-comment" key={comment.id}>
            <CommentItem comment={comment} isReply={false} currentUser={currentUser} mentionItems={mentionItems} reactionPalette={reactionPalette} allowReplies={allowReplies} onReactionToggle={onReactionToggle} onCommentDelete={onCommentDelete} onStartReply={startReply} locale={locale} now={now} t={t} />
            {comment.replies && comment.replies.length > 0 && (
              <div className="sp-comment__replies">
                {comment.replies.map((reply) => <CommentItem comment={reply} isReply currentUser={currentUser} mentionItems={mentionItems} reactionPalette={reactionPalette} allowReplies={allowReplies} onReactionToggle={onReactionToggle} onCommentDelete={onCommentDelete} onStartReply={startReply} locale={locale} now={now} t={t} key={reply.id} />)}
              </div>
            )}
            {allowReplies && replyingTo === comment.id && (
              <div className="sp-comment__composer sp-comment__composer--reply">
                <Mention items={[...mentionItems]} value={replyDraft} rows={2} ariaLabel={t('reply')} placeholder={replyPlaceholder ?? t('writeReply')} onValueChange={setReplyDraft} onInsert={(event) => handleMention(event, true)} />
                <div className="sp-comment__composer-actions">
                  <Button variant="ghost" size="sm" onClick={cancelReply}>{t('cancel')}</Button>
                  <Button variant="primary" size="sm" iconLeft="send" disabled={!replyDraft.trim()} onClick={() => submitReply(comment.id)}>{t('reply')}</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="sp-comment-thread__composer">
        <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
        <div className="sp-comment-thread__composer-body">
          <Mention items={[...mentionItems]} value={draft} rows={2} ariaLabel={t('comment')} placeholder={placeholder ?? t('addCommentPrompt')} onValueChange={setDraft} onInsert={(event) => handleMention(event, false)} />
          <div className="sp-comment__composer-actions">
            <Button variant="primary" size="sm" iconLeft="send" disabled={!draft.trim()} onClick={submitTop}>{t('comment')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type SpComment = Comment;
export type SpCommentThreadProps = CommentThreadProps;
export type SpCommentAuthor = CommentAuthor;
export type SpCommentReaction = CommentReaction;
export type SpCommentSubmitEvent = CommentSubmitEvent;
export type SpReactionToggleEvent = ReactionToggleEvent;
