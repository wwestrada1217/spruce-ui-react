import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import {
  AppHeader,
  Sidebar,
  SidebarAccountSwitcher,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarNewsletterSubscribeForm,
  SidebarPopoverItem,
  SidebarProvider,
  SidebarWorkspaceSwitcher,
} from '../../src/index.js';
import { expectNoA11yViolations, pressKey, renderWithRtl, renderWithSpruce, renderWithTheme, waitFor } from '../utils/test-utils.js';

describe('P1.0-08 shell and sidebar parity', () => {
  it('shares controlled sidebar state with a sibling AppHeader', async () => {
    function Harness() {
      const [collapsed, setCollapsed] = useState(false);
      return (
        <SidebarProvider collapsed={collapsed} onCollapsedChange={setCollapsed}>
          <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed}>
            <SidebarContent><SidebarItem icon="home">Home</SidebarItem></SidebarContent>
          </Sidebar>
          <AppHeader>Dashboard</AppHeader>
        </SidebarProvider>
      );
    }
    const view = renderWithSpruce(<Harness />);
    const toggle = view.getAllByRole('button', { name: 'Collapse' })[1];
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await view.user.click(toggle);
    await waitFor(() => expect(view.getAllByRole('button', { name: 'Expand' })[1]).toHaveAttribute('aria-expanded', 'false'));
    expect(view.container.querySelector('.sp-sidebar--collapsed')).toBeInTheDocument();
  });

  it('supports bounded keyboard resizing and localized RTL layout', async () => {
    const resized = vi.fn();
    const view = renderWithRtl(<Sidebar resizable minWidth={200} maxWidth={270} onExpandedWidthChange={resized}><SidebarContent><SidebarItem icon="home">Home</SidebarItem></SidebarContent></Sidebar>);
    const separator = view.getByRole('separator');
    separator.focus();
    await pressKey(view.user, 'ArrowLeft');
    expect(resized).toHaveBeenCalledWith(264);
    await pressKey(view.user, 'End');
    expect(resized).toHaveBeenLastCalledWith(270);
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  });

  it('uses a native accessible control for collapsible group labels', async () => {
    const changed = vi.fn();
    const view = renderWithSpruce(
      <Sidebar allowResponsive={false}>
        <SidebarContent>
          <SidebarGroup collapsible onExpandedChange={changed}>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarItem>Overview</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>,
    );
    const label = view.getByRole('button', { name: 'Projects' });
    expect(label).toHaveAttribute('aria-expanded', 'true');
    await view.user.click(label);
    expect(changed).toHaveBeenCalledWith(false);
    expect(label).toHaveAttribute('aria-expanded', 'false');
  });

  it('controls workspace, account, popover, and newsletter callbacks', async () => {
    const workspaceChanged = vi.fn();
    const submitted = vi.fn();
    const view = renderWithSpruce(
      <SidebarProvider>
        <Sidebar allowResponsive={false} allowCollapsible={false}>
          <SidebarContent>
            <SidebarWorkspaceSwitcher workspaces={[{ label: 'Personal', value: 'personal' }, { label: 'Team', value: 'team' }]} onValueChange={workspaceChanged} />
            <SidebarAccountSwitcher username="Ada" email="ada@example.com" userMenuItems={[{ label: 'Settings' }, { label: 'Sign out' }]} />
            <SidebarPopoverItem label="Help"><button type="button">Docs</button></SidebarPopoverItem>
            <SidebarNewsletterSubscribeForm onSubmit={submitted} />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );
    await view.user.click(view.getByRole('button', { name: /Personal/ }));
    await view.user.click(view.getByRole('menuitemradio', { name: 'Team' }));
    expect(workspaceChanged).toHaveBeenCalledWith({ label: 'Team', value: 'team' });
    await view.user.click(view.getByRole('button', { name: 'Help' }));
    expect(view.getByRole('region', { name: 'Popover content' })).toBeInTheDocument();
    const input = view.getByLabelText('Email');
    await view.user.type(input, 'ada@example.com');
    await view.user.click(view.getByRole('button', { name: 'Subscribe' }));
    expect(submitted).toHaveBeenCalledWith('ada@example.com');
  });

  it('keeps the shell surfaces axe-clean in RTL and dark themes', async () => {
    const view = renderWithTheme(
      <Sidebar resizable><SidebarContent><SidebarItem icon="home" active>Home</SidebarItem></SidebarContent></Sidebar>,
      'dark',
      { providerProps: { direction: 'rtl', locale: 'ar' } },
    );
    await expectNoA11yViolations(view.container);
  });
});
