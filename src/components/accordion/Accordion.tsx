import './Accordion.css';
import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { Icon } from '../../icons/Icon.js';

/* ── Context ─────────────────────────────────────────────────────────────── */

interface AccordionContextValue {
  multiple: boolean;
  openItems: Set<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

/* ── Accordion ───────────────────────────────────────────────────────────── */

export interface AccordionProps {
  /** Allow multiple items to be open at once. */
  multiple?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Container for `<AccordionItem>` elements. Manages the open/close state
 * and enforces single-open behaviour when `multiple` is `false`.
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionItem header="What is Spruce?">
 *     Spruce is a design system for enterprise apps.
 *   </AccordionItem>
 *   <AccordionItem header="How do I install it?">
 *     Run <code>npm install spruce-react</code>.
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion({ multiple = false, children, className = '' }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!multiple) next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [multiple],
  );

  return (
    <AccordionContext.Provider value={{ multiple, openItems, toggle }}>
      <div className={['sp-accordion', className].filter(Boolean).join(' ')}>{children}</div>
    </AccordionContext.Provider>
  );
}

/* ── AccordionItem ───────────────────────────────────────────────────────── */

export interface AccordionItemProps {
  /** Header label or element shown in the clickable trigger row. */
  header: ReactNode;
  /** Whether the item is open on first render. */
  defaultOpen?: boolean;
  /** Prevents the item from being toggled. */
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * A single collapsible panel inside an `<Accordion>`.
 */
export function AccordionItem({
  header,
  defaultOpen = false,
  disabled = false,
  children,
  className = '',
}: AccordionItemProps) {
  const itemId = useId();
  const ctx = useContext(AccordionContext);

  // Standalone (no Accordion parent) falls back to local state
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const isOpen = ctx ? ctx.openItems.has(itemId) : localOpen;

  // Initialise defaultOpen inside context on mount
  const initialized = useRef(false);
  useLayoutEffect(() => {
    if (defaultOpen && !initialized.current && ctx) {
      initialized.current = true;
      ctx.toggle(itemId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleToggle() {
    if (disabled) return;
    if (ctx) ctx.toggle(itemId);
    else setLocalOpen((v) => !v);
  }

  const headingId = `${itemId}-heading`;
  const panelId = `${itemId}-panel`;

  return (
    <div className={['sp-acc-item', isOpen && 'sp-acc-item--open', className].filter(Boolean).join(' ')}>
      <button
        id={headingId}
        className="sp-acc-item__header"
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={handleToggle}
      >
        <span className="sp-acc-item__title">{header}</span>
        <Icon name="chevron-down" size={14} className="sp-acc-item__icon" />
      </button>
      {isOpen && (
        <div id={panelId} className="sp-acc-item__body" role="region" aria-labelledby={headingId}>
          {children}
        </div>
      )}
    </div>
  );
}
