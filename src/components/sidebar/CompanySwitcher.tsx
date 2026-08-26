import './CompanySwitcher.css';
import { useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '../../icons/Icon.js';
import { Popover } from '../popover/Popover.js';
import { useI18n } from '../../i18n/i18n-context.js';

export interface CompanyOption {
  readonly id: string;
  readonly name: string;
  readonly code?: string;
  readonly role?: string;
}

export interface CompanySwitcherProps {
  companies?: readonly CompanyOption[];
  activeCompanyId?: string | null;
  label?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCompanyChange?: (companyId: string) => void;
  className?: string;
}

export function CompanySwitcher({
  companies = [],
  activeCompanyId = null,
  label,
  open,
  onOpenChange,
  onCompanyChange,
  className = '',
}: CompanySwitcherProps) {
  const { t } = useI18n();
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [internalOpen, setInternalOpen] = useState(false);
  const active = companies.find((company) => company.id === activeCompanyId);
  const triggerLabel = label ?? t('companySwitcher');
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  if (companies.length === 0) return null;
  if (companies.length === 1) {
    return (
      <span className={['sp-company-switcher__trigger', 'sp-company-switcher__trigger--static', className].filter(Boolean).join(' ')}>
        <Icon name="building" size={14} />
        <span className="sp-company-switcher__name">{companies[0].name}</span>
      </span>
    );
  }

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const current = optionRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    let next = current;
    if (event.key === 'ArrowDown') next = current < companies.length - 1 ? current + 1 : 0;
    else if (event.key === 'ArrowUp') next = current > 0 ? current - 1 : companies.length - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = companies.length - 1;
    else return;
    event.preventDefault();
    optionRefs.current[next]?.focus();
  };

  return (
    <Popover
      placement="bottom-end"
      triggerType="click"
      open={open ?? internalOpen}
      onOpenChange={setOpen}
      trigger={
        <button type="button" className={['sp-company-switcher__trigger', className].filter(Boolean).join(' ')} aria-label={triggerLabel} aria-haspopup="listbox">
          <Icon name="building" size={14} />
          <span className="sp-company-switcher__name">{active?.name ?? t('selectCompany')}</span>
          <Icon name="chevron-down" size={12} />
        </button>
      }
    >
      <ul className="sp-company-switcher__list" role="listbox" aria-label={label ?? t('company')} onKeyDown={onListKeyDown}>
        {companies.map((company, index) => (
          <li key={company.id} role="none">
            <button
              ref={(element) => { optionRefs.current[index] = element; }}
              type="button"
              role="option"
              className={['sp-company-switcher__option', company.id === activeCompanyId && 'sp-company-switcher__option--active'].filter(Boolean).join(' ')}
              aria-selected={company.id === activeCompanyId}
              onClick={() => {
                setOpen(false);
                if (company.id !== activeCompanyId) onCompanyChange?.(company.id);
              }}
            >
              <span className="sp-company-switcher__option-text">
                <span className="sp-company-switcher__option-name">{company.name}</span>
                {(company.code || company.role) && <span className="sp-company-switcher__option-meta">{[company.code, company.role].filter(Boolean).join(' · ')}</span>}
              </span>
              {company.id === activeCompanyId && <Icon name="check" size={14} />}
            </button>
          </li>
        ))}
      </ul>
    </Popover>
  );
}
