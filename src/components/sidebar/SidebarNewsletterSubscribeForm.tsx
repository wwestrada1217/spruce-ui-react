import './SidebarNewsletterSubscribeForm.css';
import { useId, useState, type FormEvent } from 'react';
import { useSidebar } from './SidebarContext.js';
import { useI18n } from '../../i18n/i18n-context.js';

export interface SidebarNewsletterSubscribeFormProps {
  email?: string;
  defaultEmail?: string;
  title?: string;
  description?: string;
  emailLabel?: string;
  submitLabel?: string;
  onEmailChange?: (email: string) => void;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function SidebarNewsletterSubscribeForm({
  email,
  defaultEmail = '',
  title,
  description,
  emailLabel,
  submitLabel,
  onEmailChange,
  onSubmit,
  className = '',
}: SidebarNewsletterSubscribeFormProps) {
  const { t } = useI18n();
  const { collapsed, isMobileOpen } = useSidebar();
  const id = useId();
  const titleId = `${id}-title`;
  const emailId = `${id}-email`;
  const [internalEmail, setInternalEmail] = useState(defaultEmail);
  if (collapsed && !isMobileOpen) return null;
  const resolvedTitle = title ?? t('newsletterTitle');
  const resolvedDescription = description ?? t('newsletterDescription');
  const resolvedEmailLabel = emailLabel ?? t('email');
  const resolvedSubmitLabel = submitLabel ?? t('subscribe');
  const value = email ?? internalEmail;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(value);
  };
  return (
    <section className={['sp-newsletter', className].filter(Boolean).join(' ')} aria-labelledby={titleId}>
      <h2 id={titleId} className="sp-newsletter__title">{resolvedTitle}</h2>
      <p className="sp-newsletter__desc">{resolvedDescription}</p>
      <form className="sp-newsletter__form" onSubmit={handleSubmit}>
        <label className="sp-newsletter__label" htmlFor={emailId}>{resolvedEmailLabel}</label>
        <input id={emailId} type="email" required value={value} className="sp-newsletter__input" onChange={(event) => { if (email === undefined) setInternalEmail(event.target.value); onEmailChange?.(event.target.value); }} />
        <button type="submit" className="sp-newsletter__btn">{resolvedSubmitLabel}</button>
      </form>
    </section>
  );
}
