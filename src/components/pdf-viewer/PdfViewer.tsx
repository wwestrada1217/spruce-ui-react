import './PdfViewer.css';
import { useEffect, useState, type CSSProperties, type SyntheticEvent } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { Icon } from '../../icons/Icon.js';

export interface PdfViewerProps {
  src?: string | null;
  title?: string;
  height?: string;
  toolbar?: boolean;
  showOpen?: boolean;
  showDownload?: boolean;
  openLabel?: string;
  downloadLabel?: string;
  downloadFileName?: string;
  loadingLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onLoaded?: () => void;
  onFailed?: (event: SyntheticEvent<HTMLIFrameElement>) => void;
  className?: string;
  style?: CSSProperties;
}

/** A native-browser PDF preview with tokenized toolbar, loading, and empty states. */
export function PdfViewer({
  src = null,
  title,
  height = '640px',
  toolbar = true,
  showOpen = true,
  showDownload = true,
  openLabel,
  downloadLabel,
  downloadFileName = '',
  loadingLabel,
  emptyTitle,
  emptyDescription,
  onLoaded,
  onFailed,
  className = '',
  style,
}: PdfViewerProps) {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const resolvedTitle = title ?? t('document');

  useEffect(() => {
    setIsLoading(Boolean(src));
  }, [src]);

  function handleLoad(): void {
    setIsLoading(false);
    onLoaded?.();
  }

  function handleError(event: SyntheticEvent<HTMLIFrameElement>): void {
    setIsLoading(false);
    onFailed?.(event);
  }

  return (
    <section
      className={['sp-pdf-viewer', className].filter(Boolean).join(' ')}
      style={{ ...style, '--sp-pdf-viewer-height': height } as CSSProperties}
      aria-busy={isLoading}
    >
      {toolbar && (
        <header className="sp-pdf-viewer__toolbar">
          <div className="sp-pdf-viewer__title">
            <Icon name="file-text" size={18} />
            <span>{resolvedTitle}</span>
          </div>
          {src && (
            <div className="sp-pdf-viewer__actions">
              {showOpen && (
                <a className="sp-pdf-viewer__action" href={src} target="_blank" rel="noopener noreferrer">
                  <Icon name="external-link" size={14} />
                  <span>{openLabel ?? t('open')}</span>
                </a>
              )}
              {showDownload && (
                <a className="sp-pdf-viewer__action" href={src} download={downloadFileName || undefined}>
                  <Icon name="download" size={14} />
                  <span>{downloadLabel ?? t('download')}</span>
                </a>
              )}
            </div>
          )}
        </header>
      )}
      <div className="sp-pdf-viewer__body">
        {src ? (
          <>
            {isLoading && (
              <div className="sp-pdf-viewer__loading" role="status">
                <Icon name="loader" size={20} />
                <span>{loadingLabel ?? t('loadingPdf')}</span>
              </div>
            )}
            <iframe
              className="sp-pdf-viewer__frame"
              src={src}
              title={`${resolvedTitle} PDF preview`}
              onLoad={handleLoad}
              onError={handleError}
            />
          </>
        ) : (
          <div className="sp-pdf-viewer__empty" role="status">
            <span className="sp-pdf-viewer__empty-icon"><Icon name="file-text" size={24} /></span>
            <span className="sp-pdf-viewer__empty-title">{emptyTitle ?? t('noPdfSelected')}</span>
            <span className="sp-pdf-viewer__empty-description">{emptyDescription ?? t('providePdfSource')}</span>
          </div>
        )}
      </div>
    </section>
  );
}

export type SpPdfViewerProps = PdfViewerProps;
