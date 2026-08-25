import './NavMenu.css';
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { computePosition, getScrollParents, onClickOutside, type Placement } from '../../utils/positioning.js';
import { Icon } from '../../icons/Icon.js';
import { Popover } from '../popover/Popover.js';
import { useI18n } from '../../i18n/i18n-context.js';

export interface NavMenuLink {
  label: string;
  href?: string;
  icon?: string;
  description?: string;
  onClick?: () => void;
}

export interface NavMenuItem {
  label: string;
  href?: string;
  links?: NavMenuLink[];
  content?: ReactNode;
}

interface NavMenuContextValue { openKey: string | null; setOpenKey: (key: string | null) => void; }
const NavMenuContext = createContext<NavMenuContextValue | null>(null);

export interface NavMenuProps {
  items?: NavMenuItem[];
  children?: ReactNode;
  openIndex?: number | null;
  defaultOpenIndex?: number | null;
  onOpenChange?: (index: number | null) => void;
  ariaLabel?: string;
  placement?: Placement;
  className?: string;
}

export function NavMenu({ items = [], children, openIndex: controlledIndex, defaultOpenIndex = null, onOpenChange, ariaLabel, placement = 'bottom-start', className = '' }: NavMenuProps) {
  const { t, isRtl } = useI18n();
  const [internalIndex, setInternalIndex] = useState<number | null>(defaultOpenIndex);
  const [compoundOpenKey, setCompoundOpenKey] = useState<string | null>(null);
  const openIndex = controlledIndex ?? internalIndex;
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const [ready, setReady] = useState(false);
  const triggerRefs = useRef<(HTMLElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const isCompound = children != null;

  const setIndex = useCallback((next: number | null) => {
    if (controlledIndex === undefined) setInternalIndex(next);
    onOpenChange?.(next);
  }, [controlledIndex, onOpenChange]);
  const clearTimers = useCallback(() => { if (openTimer.current) clearTimeout(openTimer.current); if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  const isDropdown = (item: NavMenuItem) => Boolean((item.links && item.links.length > 0) || item.content != null);
  const open = (index: number) => { clearTimers(); openTimer.current = setTimeout(() => setIndex(index), 150); };
  const close = () => { clearTimers(); closeTimer.current = setTimeout(() => setIndex(null), 150); };
  const positionPanel = useCallback((index: number) => {
    const trigger = triggerRefs.current[index];
    const panel = panelRef.current;
    if (!trigger || !panel) return;
    const result = computePosition(trigger, panel, placement, 6, undefined, isRtl ? 'rtl' : 'ltr');
    setPanelPos({ top: result.top, left: result.left });
    setReady(true);
  }, [isRtl, placement]);

  useEffect(() => {
    if (openIndex == null || isCompound) return;
    const frame = requestAnimationFrame(() => positionPanel(openIndex));
    const trigger = triggerRefs.current[openIndex];
    if (!trigger) return () => cancelAnimationFrame(frame);
    const reposition = () => positionPanel(openIndex);
    const parents = getScrollParents(trigger);
    parents.forEach((parent) => parent.addEventListener('scroll', reposition, { passive: true }));
    window.addEventListener('scroll', reposition, { passive: true });
    return () => { cancelAnimationFrame(frame); parents.forEach((parent) => parent.removeEventListener('scroll', reposition)); window.removeEventListener('scroll', reposition); };
  }, [isCompound, openIndex, positionPanel]);

  useEffect(() => {
    if (openIndex == null || isCompound) return;
    const elements = [triggerRefs.current[openIndex], panelRef.current].filter(Boolean) as HTMLElement[];
    return onClickOutside(elements, () => setIndex(null));
  }, [isCompound, openIndex, setIndex]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const contextValue: NavMenuContextValue = { openKey: compoundOpenKey, setOpenKey: setCompoundOpenKey };
  const rootClasses = ['sp-nav-menu', className].filter(Boolean).join(' ');

  return (
    <NavMenuContext.Provider value={contextValue}>
      <nav ref={rootRef} className={rootClasses} aria-label={ariaLabel ?? t('mainNavigation')}>
        {isCompound ? <ul className="sp-nav-menu__list">{children}</ul> : <ul className="sp-nav-menu__list">{items.map((item, index) => {
          const hasDropdown = isDropdown(item);
          const isOpen = openIndex === index;
          const onTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
            if (event.key === 'ArrowDown' && hasDropdown) { event.preventDefault(); clearTimers(); setIndex(index); }
            if (event.key === 'Escape' && isOpen) { event.preventDefault(); setIndex(null); }
          };
          return <li key={`${item.label}-${index}`} className="sp-nav-menu__item">
            {hasDropdown ? <button ref={(element) => { triggerRefs.current[index] = element; }} type="button" className={['sp-nav-menu__trigger', isOpen && 'sp-nav-menu__trigger--open'].filter(Boolean).join(' ')} aria-expanded={isOpen} aria-haspopup="menu" onClick={() => setIndex(isOpen ? null : index)} onMouseEnter={() => open(index)} onMouseLeave={close} onKeyDown={onTriggerKeyDown}><span>{item.label}</span><Icon name="chevron-down" size={12} className={isOpen ? 'sp-nav-menu__chevron--open' : undefined} aria-hidden="true" /></button>
              : <a ref={(element) => { triggerRefs.current[index] = element; }} href={item.href ?? '#'} className="sp-nav-menu__trigger" onMouseEnter={() => { clearTimers(); setIndex(null); }} onMouseLeave={close} onKeyDown={onTriggerKeyDown}>{item.label}</a>}
          </li>;
        })}</ul>}
        {!isCompound && openIndex != null && items[openIndex] && isDropdown(items[openIndex]) && createPortal(<div ref={panelRef} className="sp-nav-menu__panel" role="menu" aria-label={items[openIndex]?.label} style={{ position: 'fixed', top: panelPos.top, left: panelPos.left, zIndex: 999, opacity: ready ? 1 : 0 }} onMouseEnter={() => clearTimers()} onMouseLeave={close}>
          {items[openIndex]?.content ?? <div className="sp-nav-menu__links">{items[openIndex]?.links?.map((link, linkIndex) => <NavMenuLink key={`${link.label}-${linkIndex}`} {...link}>{link.label}</NavMenuLink>)}</div>}
        </div>, document.body)}
      </nav>
    </NavMenuContext.Provider>
  );
}

export interface NavMenuItemComponentProps {
  label: ReactNode;
  href?: string;
  links?: NavMenuLink[];
  content?: ReactNode;
  value?: string;
  children?: ReactNode;
}

export function NavMenuItem({ label, href, links, content, value, children }: NavMenuItemComponentProps) {
  const ctx = useContext(NavMenuContext);
  const generatedKey = useId();
  const itemKey = value ?? generatedKey;
  const hasDropdown = Boolean(content ?? children ?? (links && links.length > 0));
  const isOpen = ctx?.openKey === itemKey;
  if (!hasDropdown) return <li className="sp-nav-menu__item"><a href={href ?? '#'} className="sp-nav-menu__trigger">{label}</a></li>;
  const panel = content ?? children ?? <div className="sp-nav-menu__links">{links?.map((link, index) => <NavMenuLink key={`${link.label}-${index}`} {...link}>{link.label}</NavMenuLink>)}</div>;
  return <li className="sp-nav-menu__item"><Popover trigger={<button type="button" className={['sp-nav-menu__trigger', isOpen && 'sp-nav-menu__trigger--open'].filter(Boolean).join(' ')} aria-expanded={isOpen} aria-haspopup="menu" onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); ctx?.setOpenKey(itemKey); } }}><span>{label}</span><Icon name="chevron-down" size={12} aria-hidden="true" /></button>} open={isOpen} onOpenChange={(next) => ctx?.setOpenKey(next ? itemKey : null)} placement="bottom-start" offset={6} hoverDelay={150} hoverCloseDelay={150} panelClassName="sp-nav-menu__panel"><div role="menu">{panel}</div></Popover></li>;
}

export interface NavMenuContentProps { children?: ReactNode; className?: string; }
export function NavMenuContent({ children, className = '' }: NavMenuContentProps) { return <div className={['sp-nav-menu__content', className].filter(Boolean).join(' ')}>{children}</div>; }

export interface NavMenuLinkProps extends NavMenuLink { children?: ReactNode; }
export function NavMenuLink({ label, href, icon, description, onClick, children }: NavMenuLinkProps) {
  const content = <>{icon && <span className="sp-nav-menu__link-icon"><Icon name={icon} size={16} aria-hidden="true" /></span>}<span className="sp-nav-menu__link-content"><span className="sp-nav-menu__link-title">{children ?? label}</span>{description && <span className="sp-nav-menu__link-desc">{description}</span>}</span></>;
  return href ? <a href={href} className="sp-nav-menu__link" role="menuitem" onClick={onClick}>{content}</a> : <button type="button" className="sp-nav-menu__link" role="menuitem" onClick={onClick}>{content}</button>;
}
