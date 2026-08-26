import './SidebarWorkspaceSwitcher.css';
import { useMemo, useState } from 'react';
import { Icon } from '../../icons/Icon.js';
import { Popover } from '../popover/Popover.js';
import { useI18n } from '../../i18n/i18n-context.js';
import { useSidebar } from './SidebarContext.js';

export interface WorkspaceOption {
  label: string;
  sublabel?: string;
  value: string;
}

export interface SidebarWorkspaceSwitcherProps {
  workspaces?: readonly WorkspaceOption[];
  value?: string | null;
  defaultValue?: string;
  showSubLabel?: boolean;
  label?: string;
  onValueChange?: (workspace: WorkspaceOption) => void;
  onWorkspaceChange?: (workspace: WorkspaceOption) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function SidebarWorkspaceSwitcher({
  workspaces,
  value,
  defaultValue,
  showSubLabel = true,
  label,
  onValueChange,
  onWorkspaceChange,
  open,
  onOpenChange,
  className = '',
}: SidebarWorkspaceSwitcherProps) {
  const { t } = useI18n();
  const { collapsed, isMobileOpen } = useSidebar();
  const availableWorkspaces = useMemo(
    () => workspaces ?? [{ label: t('myWorkspace'), sublabel: t('personal'), value: 'default' }],
    [t, workspaces],
  );
  const [internalValue, setInternalValue] = useState(defaultValue ?? availableWorkspaces[0]?.value ?? null);
  const [internalOpen, setInternalOpen] = useState(false);
  const isCollapsedView = collapsed && !isMobileOpen;
  const selected = useMemo(() => availableWorkspaces.find((workspace) => workspace.value === (value ?? internalValue)) ?? availableWorkspaces[0], [availableWorkspaces, internalValue, value]);
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const select = (workspace: WorkspaceOption) => {
    if (value === undefined) setInternalValue(workspace.value);
    onValueChange?.(workspace);
    onWorkspaceChange?.(workspace);
    setOpen(false);
  };

  return (
    <Popover
      placement="top-start"
      offset={4}
      open={open ?? internalOpen}
      onOpenChange={setOpen}
      trigger={<button type="button" className={['sp-workspace__btn', isCollapsedView && 'sp-workspace__btn--centered', className].filter(Boolean).join(' ')} aria-label={isCollapsedView ? (label ?? t('workspace')) : undefined} aria-haspopup="menu">
        <span className="sp-workspace__icon"><Icon name="menu" size={14} /></span>
        <span className={['sp-workspace__info', isCollapsedView && 'sp-workspace__info--collapsed'].filter(Boolean).join(' ')}>
          <span className="sp-workspace__name">{selected?.label}</span>
          {showSubLabel && selected?.sublabel && <span className="sp-workspace__sub">{selected.sublabel}</span>}
        </span>
        <Icon name="chevron-down" size={12} className={isCollapsedView ? 'sp-workspace__chevron--collapsed' : undefined} />
      </button>}
    >
      <div className="sp-workspace__menu" role="menu" aria-label={label ?? t('workspace')}>
        {availableWorkspaces.map((workspace) => (
          <button key={workspace.value} type="button" role="menuitemradio" aria-checked={selected?.value === workspace.value} className={['sp-workspace__option', selected?.value === workspace.value && 'sp-workspace__option--active'].filter(Boolean).join(' ')} onClick={() => select(workspace)}>
            <span className="sp-workspace__option-label">{workspace.label}</span>
            {workspace.sublabel && <span className="sp-workspace__option-sub">{workspace.sublabel}</span>}
          </button>
        ))}
      </div>
    </Popover>
  );
}
