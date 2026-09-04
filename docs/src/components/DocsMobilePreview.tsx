import { type ReactNode } from 'react';
import { Icon } from 'spruce-react';
import { useDocsI18n } from './DocsI18n';
import './DocsMobilePreview.css';

export type MobilePreviewAlign = 'top' | 'center' | 'bottom' | 'fill';

export interface DocsMobilePreviewProps {
  readonly children: ReactNode;
  readonly align?: MobilePreviewAlign;
  readonly statusBar?: boolean;
  readonly time?: string;
  readonly ariaLabel?: string;
}

/** Renders a touch-sized example in a fixed, scrollable phone shell. */
export function DocsMobilePreview({
  children,
  align = 'top',
  statusBar = true,
  time = '9:41',
  ariaLabel,
}: DocsMobilePreviewProps) {
  const docs = useDocsI18n();
  return (
    <div className="docs-mobile-preview" aria-label={ariaLabel ?? docs.t('mobilePreview')}>
      <div className="docs-mobile-preview__device">
        <span className="docs-mobile-preview__button docs-mobile-preview__button--silent" aria-hidden="true" />
        <span className="docs-mobile-preview__button docs-mobile-preview__button--volup" aria-hidden="true" />
        <span className="docs-mobile-preview__button docs-mobile-preview__button--voldn" aria-hidden="true" />
        <span className="docs-mobile-preview__button docs-mobile-preview__button--power" aria-hidden="true" />
        <div className="docs-mobile-preview__screen">
          {statusBar && (
            <div className="docs-mobile-preview__statusbar" aria-hidden="true">
              <span>{time}</span>
              <span className="docs-mobile-preview__statusbar-right">
                <span className="docs-mobile-preview__signal"><i /><i /><i /><i /></span>
                <Icon name="wifi" size={14} aria-hidden="true" />
                <span className="docs-mobile-preview__battery"><span /></span>
              </span>
            </div>
          )}
          <div className="docs-mobile-preview__content" data-align={align}>{children}</div>
          <span className="docs-mobile-preview__home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export const MobilePreview = DocsMobilePreview;
