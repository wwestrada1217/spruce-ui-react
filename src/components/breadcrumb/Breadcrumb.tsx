/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Breadcrumb.css';
import { createContext, useContext, type ReactNode, type HTMLAttributes } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';

/* ── Context ─────────────────────────────────────────────────────────────── */

interface BreadcrumbContextValue {
  separator: string;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue>({ separator: '/' });

/* ── Breadcrumbs ─────────────────────────────────────────────────────────── */

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Separator character rendered between items. Defaults to `'/'`. */
  separator?: string;
  children?: ReactNode;
}

/**
 * Navigation breadcrumb trail. Wrap `<BreadcrumbItem>` elements as children.
 *
 * @example
 * ```tsx
 * <Breadcrumbs>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
 *   <BreadcrumbItem active>Profile</BreadcrumbItem>
 * </Breadcrumbs>
 * ```
 */
export function Breadcrumbs({
  separator = '/',
  children,
  className = '',
  ...props
}: BreadcrumbsProps) {
  const { t } = useI18n();
  return (
    <BreadcrumbContext.Provider value={{ separator }}>
      <nav aria-label={t('breadcrumb')} className={className || undefined} {...props}>
        <ol className="sp-breadcrumbs">{children}</ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
}

/* ── BreadcrumbItem ──────────────────────────────────────────────────────── */

export interface BreadcrumbItemProps {
  /** Navigate to this URL when clicked. Omit for non-interactive items. */
  href?: string | null;
  /** Marks this item as the current page (`aria-current="page"`). */
  active?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * A single item in a `<Breadcrumbs>` trail.
 */
export function BreadcrumbItem({
  href = null,
  active = false,
  children,
  className = '',
}: BreadcrumbItemProps) {
  const { separator } = useContext(BreadcrumbContext);

  return (
    <li className={['sp-breadcrumbs__item', className].filter(Boolean).join(' ')}>
      {href && !active ? (
        <a href={href} className="sp-breadcrumbs__link">
          {children}
        </a>
      ) : (
        <span
          className={['sp-breadcrumbs__text', active && 'sp-breadcrumbs__text--active']
            .filter(Boolean)
            .join(' ')}
          aria-current={active ? 'page' : undefined}
        >
          {children}
        </span>
      )}
      <span className="sp-breadcrumbs__sep" aria-hidden="true">
        {separator}
      </span>
    </li>
  );
}
