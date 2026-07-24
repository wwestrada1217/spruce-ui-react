/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Lightbox.css';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
}

export interface LightboxProps {
  /** Array of images to display. */
  images: LightboxImage[];
  /** Whether the lightbox is open. */
  open: boolean;
  /** Starting image index when opened. */
  startIndex?: number;
  /** Allow zoom in / zoom out. */
  zoomable?: boolean;
  /** Show thumbnail strip at the bottom. */
  showThumbnails?: boolean;
  /** Close when clicking backdrop area. */
  closeOnBackdrop?: boolean;
  /** Called when the lightbox requests to close. */
  onClose: () => void;
  /** Called when the active image changes. */
  onIndexChange?: (index: number) => void;
  /** Additional CSS class name(s). */
  className?: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export function Lightbox({
  images,
  open,
  startIndex = 0,
  zoomable = true,
  showThumbnails = true,
  closeOnBackdrop = true,
  onClose,
  onIndexChange,
  className = '',
}: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  const currentImage = useMemo(
    () => (images.length > 0 ? images[activeIndex] : null),
    [images, activeIndex],
  );

  // Sync startIndex when opening
  useEffect(() => {
    if (open) {
      const clamped = Math.max(0, Math.min(startIndex, images.length - 1));
      setActiveIndex(clamped);
      setZoom(1);
      setLoading(true);
    }
  }, [open, startIndex, images.length]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  const goTo = useCallback(
    (index: number) => {
      const count = images.length;
      if (count === 0) return;
      index = ((index % count) + count) % count;
      setActiveIndex(index);
      setZoom(1);
      setLoading(true);
      onIndexChange?.(index);
    },
    [images.length, onIndexChange],
  );

  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM)),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM)),
    [],
  );
  const resetZoom = useCallback(() => setZoom(1), []);

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const onBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdrop) close();
    },
    [closeOnBackdrop, close],
  );

  const onKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          close();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prev();
          break;
        case 'ArrowRight':
          event.preventDefault();
          next();
          break;
        case '+':
        case '=':
          event.preventDefault();
          zoomIn();
          break;
        case '-':
          event.preventDefault();
          zoomOut();
          break;
        case '0':
          event.preventDefault();
          resetZoom();
          break;
      }
    },
    [close, prev, next, zoomIn, zoomOut, resetZoom],
  );

  const onImageLoad = useCallback(() => setLoading(false), []);

  if (!open) return null;

  const rootClasses = ['sp-lightbox-backdrop', className]
    .filter(Boolean)
    .join(' ');

  const overlay = (
    <div
      className={rootClasses}
      role="dialog"
      aria-roledescription="lightbox"
      aria-label={currentImage?.alt || 'Image viewer'}
      tabIndex={-1}
      onKeyDown={onKeydown}
      ref={(el) => el?.focus()}
    >
      {/* Toolbar */}
      <div className="sp-lightbox__toolbar">
        <span className="sp-lightbox__counter">
          {activeIndex + 1} / {images.length}
        </span>
        <div className="sp-lightbox__actions">
          {zoomable && (
            <>
              <button
                className="sp-lightbox__btn"
                onClick={zoomIn}
                aria-label="Zoom in"
              >
                <Icon name="zoom-in" size={18} />
              </button>
              <button
                className="sp-lightbox__btn"
                onClick={zoomOut}
                aria-label="Zoom out"
              >
                <Icon name="zoom-out" size={18} />
              </button>
              <button
                className="sp-lightbox__btn"
                onClick={resetZoom}
                aria-label="Reset zoom"
              >
                <Icon name="maximize" size={18} />
              </button>
            </>
          )}
          <button
            className="sp-lightbox__btn"
            onClick={close}
            aria-label="Close lightbox"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="sp-lightbox__body" onClick={onBackdropClick}>
        {images.length > 1 && (
          <button
            className="sp-lightbox__nav sp-lightbox__nav--prev"
            onClick={(e) => {
              prev();
              e.stopPropagation();
            }}
            aria-label="Previous image"
          >
            <Icon name="chevron-left" size={24} />
          </button>
        )}

        <div
          className="sp-lightbox__image-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          {loading && (
            <div className="sp-lightbox__spinner">
              <div className="sp-lightbox__spinner-ring" />
            </div>
          )}
          <img
            className="sp-lightbox__image"
            src={currentImage?.src}
            alt={currentImage?.alt || ''}
            style={{
              transform: `scale(${zoom})`,
              opacity: loading ? 0 : 1,
            }}
            onLoad={onImageLoad}
            draggable={false}
          />
        </div>

        {images.length > 1 && (
          <button
            className="sp-lightbox__nav sp-lightbox__nav--next"
            onClick={(e) => {
              next();
              e.stopPropagation();
            }}
            aria-label="Next image"
          >
            <Icon name="chevron-right" size={24} />
          </button>
        )}
      </div>

      {/* Caption */}
      {currentImage?.caption && (
        <div className="sp-lightbox__caption">{currentImage.caption}</div>
      )}

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div
          className="sp-lightbox__thumbnails"
          role="tablist"
          aria-label="Image thumbnails"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              className={[
                'sp-lightbox__thumb',
                activeIndex === i && 'sp-lightbox__thumb--active',
              ]
                .filter(Boolean)
                .join(' ')}
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={img.alt || `Image ${i + 1}`}
              onClick={() => goTo(i)}
            >
              <img
                src={img.thumbnail || img.src}
                alt=""
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return createPortal(overlay, document.body);
}
