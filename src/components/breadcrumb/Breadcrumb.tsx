import './Breadcrumb.css';
import { Children, cloneElement, createContext, isValidElement, useContext, type HTMLAttributes, type ReactNode, type ReactElement } from 'react';
import { Icon } from '../../icons/Icon.js';
import { Popover } from '../popover/Popover.js';
import { useI18n } from '../../i18n/i18n-context.js';

interface BreadcrumbContextValue { separator: string; }
const BreadcrumbContext = createContext<BreadcrumbContextValue>({ separator: '/' });

export interface BreadcrumbItemDef {
  label: ReactNode;
  href?: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  separator?: string;
  items?: BreadcrumbItemDef[] | null;
  maxItems?: number | null;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  showTruncatedDropdown?: boolean;
  children?: ReactNode;
}

interface RenderableItem {
  key: string;
  node: ReactNode;
  label: ReactNode;
  href?: string | null;
  active?: boolean;
  icon?: string;
  onClick?: () => void;
}

export function Breadcrumbs({
  separator = '/',
  items,
  maxItems = null,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  showTruncatedDropdown = true,
  children,
  className = '',
  ...props
}: BreadcrumbsProps) {
  const { t } = useI18n();
  const childItems = Children.toArray(children);
  const dataItems: RenderableItem[] = items
    ? items.map((item, index) => ({ ...item, key: `data-${index}`, label: item.label, node: null }))
    : childItems.map((node, index) => {
      if (isValidElement<BreadcrumbItemProps>(node)) {
        return { key: node.key?.toString() ?? `child-${index}`, node, label: node.props.label ?? node.props.children, href: node.props.href, active: node.props.active, icon: node.props.icon, onClick: node.props.onClick };
      }
      return { key: `child-${index}`, node, label: node, active: false };
    });
  const shouldCollapse = showTruncatedDropdown && maxItems != null && maxItems > 0 && dataItems.length > maxItems;
  const beforeCount = Math.max(0, itemsBeforeCollapse);
  const afterCount = Math.max(0, itemsAfterCollapse);
  const visibleItems = shouldCollapse
    ? [...dataItems.slice(0, beforeCount), ...dataItems.slice(Math.max(beforeCount, dataItems.length - afterCount))]
    : dataItems;
  const hiddenItems = shouldCollapse
    ? dataItems.slice(beforeCount, Math.max(beforeCount, dataItems.length - afterCount))
    : [];

  return (
    <BreadcrumbContext.Provider value={{ separator }}>
      <nav aria-label={t('breadcrumb')} className={className || undefined} {...props}>
        <ol className="sp-breadcrumbs">
          {visibleItems.map((item, index) => {
            if (isValidElement<BreadcrumbItemProps>(item.node) && item.node.type === BreadcrumbItem) {
              return cloneElement(item.node, { key: item.key, isLast: index === visibleItems.length - 1 });
            }
            return <BreadcrumbItem key={item.key} href={item.href} active={item.active} icon={item.icon} onClick={item.onClick} label={item.label} isLast={index === visibleItems.length - 1}>{item.node ?? item.label}</BreadcrumbItem>;
          }).reduce<ReactNode[]>((result, item, index) => {
            if (shouldCollapse && index === beforeCount) {
              result.push(
                <li className="sp-breadcrumbs__item sp-breadcrumbs__collapsed" key="collapsed">
                  <Popover
                    trigger={<button type="button" className="sp-breadcrumbs__ellipsis" aria-label={t('moreActions')} aria-haspopup="menu">…</button>}
                    placement="bottom-start"
                    panelClassName="sp-breadcrumbs__menu-panel"
                    padding="var(--sp-space-1, 4px)"
                  >
                    <div className="sp-breadcrumbs__menu" role="menu" aria-label={t('moreActions')}>
                      {hiddenItems.map((hidden) => (
                        hidden.href ? (
                          <a key={hidden.key} href={hidden.href} role="menuitem" className="sp-breadcrumbs__menu-item" onClick={hidden.onClick}>{hidden.icon && <Icon name={hidden.icon} size={14} aria-hidden="true" />}{hidden.label}</a>
                        ) : (
                          <button key={hidden.key} type="button" role="menuitem" className="sp-breadcrumbs__menu-item" onClick={hidden.onClick}>{hidden.icon && <Icon name={hidden.icon} size={14} aria-hidden="true" />}{hidden.label}</button>
                        )
                      ))}
                    </div>
                  </Popover>
                  <span className="sp-breadcrumbs__sep" aria-hidden="true">{separator}</span>
                </li>,
              );
            }
            result.push(item);
            return result;
          }, [])}
        </ol>
      </nav>
    </BreadcrumbContext.Provider>
  );
}

export interface BreadcrumbItemProps {
  href?: string | null;
  active?: boolean;
  icon?: string;
  label?: ReactNode;
  onClick?: () => void;
  isLast?: boolean;
  children?: ReactNode;
  className?: string;
}

export function BreadcrumbItem({ href = null, active = false, icon, label, onClick, isLast, children, className = '' }: BreadcrumbItemProps) {
  const { separator } = useContext(BreadcrumbContext);
  const content = <>{icon && <Icon name={icon} size={14} aria-hidden="true" />}<span>{children ?? label}</span></>;
  return (
    <li className={['sp-breadcrumbs__item', className].filter(Boolean).join(' ')}>
      {href && !active ? <a href={href} className="sp-breadcrumbs__link" onClick={onClick}>{content}</a>
        : onClick && !active ? <button type="button" className="sp-breadcrumbs__link sp-breadcrumbs__link--button" onClick={onClick}>{content}</button>
          : <span className={['sp-breadcrumbs__text', active && 'sp-breadcrumbs__text--active'].filter(Boolean).join(' ')} aria-current={active ? 'page' : undefined}>{content}</span>}
      {!isLast && <span className="sp-breadcrumbs__sep" aria-hidden="true">{separator}</span>}
    </li>
  );
}

export type BreadcrumbItemElement = ReactElement<BreadcrumbItemProps>;
