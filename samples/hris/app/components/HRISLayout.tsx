/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  AppShell,
  AppShellHamburger,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
  SidebarSeparator,
  AppHeader,
  Button,
  Badge,
  Avatar,
  Input,
  Modal,
  Select,
} from 'spruce-react';

export function HRISLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const currentPath = location.pathname;

  function getPageHeaderInfo() {
    switch (currentPath) {
      case '/employees':
        return { title: 'Employee Directory', subtitle: 'Manage staff, roles, and department allocations' };
      case '/time-off':
        return { title: 'Time Off & Leave', subtitle: 'Review leave balances and approve requests' };
      case '/payroll':
        return { title: 'Payroll & Compensation', subtitle: 'Monthly payroll summary and salary distribution' };
      case '/performance':
        return { title: 'Performance Reviews', subtitle: 'Employee evaluations and KPI tracking' };
      case '/attendance':
        return { title: 'Time & Attendance', subtitle: 'Daily clock-in logs and timesheet verification' };
      case '/settings':
        return { title: 'HR System Settings', subtitle: 'Configure company policies, roles, and integrations' };
      default:
        return { title: 'HR Dashboard', subtitle: 'Real-time workforce metrics and executive overview' };
    }
  }

  const { title, subtitle } = getPageHeaderInfo();

  return (
    <>
      <AppShell
        headerHeight={52}
        sidebar={
          <Sidebar>
            {/* Sidebar Header */}
            <SidebarHeader showBorders>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', width: '100%', height: 44 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'var(--sp-primary, #2563eb)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  🌲
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                    Spruce HRIS
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--sp-text-muted, #64748b)', whiteSpace: 'nowrap' }}>
                    Enterprise HR Suite
                  </span>
                </div>
              </div>
            </SidebarHeader>

            {/* Sidebar Navigation Items */}
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                <SidebarItem
                  icon="layout-dashboard"
                  active={currentPath === '/'}
                  onClick={() => navigate('/')}
                >
                  Dashboard
                </SidebarItem>
                <SidebarItem
                  icon="users"
                  active={currentPath === '/employees'}
                  onClick={() => navigate('/employees')}
                >
                  Employees
                </SidebarItem>
                <SidebarItem
                  icon="calendar"
                  active={currentPath === '/time-off'}
                  onClick={() => navigate('/time-off')}
                >
                  Time Off & Leave
                </SidebarItem>
                <SidebarItem
                  icon="credit-card"
                  active={currentPath === '/payroll'}
                  onClick={() => navigate('/payroll')}
                >
                  Payroll
                </SidebarItem>
                <SidebarItem
                  icon="award"
                  active={currentPath === '/performance'}
                  onClick={() => navigate('/performance')}
                >
                  Performance
                </SidebarItem>
              </SidebarGroup>

              <SidebarSeparator />

              <SidebarGroup>
                <SidebarGroupLabel>Organization</SidebarGroupLabel>
                <SidebarItem
                  icon="clock"
                  active={currentPath === '/attendance'}
                  onClick={() => navigate('/attendance')}
                >
                  Attendance
                </SidebarItem>
              </SidebarGroup>

              <SidebarSeparator />

              <SidebarGroup>
                <SidebarGroupLabel>System</SidebarGroupLabel>
                <SidebarItem
                  icon="settings"
                  active={currentPath === '/settings'}
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </SidebarItem>
              </SidebarGroup>
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter showBorders>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 6px',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  <Avatar name="Sarah Jenkins" size="sm" />
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                      Sarah Jenkins
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--sp-text-muted, #64748b)', whiteSpace: 'nowrap' }}>
                      HR Director
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" iconLeft="log-out" aria-label="Sign Out" />
              </div>
            </SidebarFooter>
          </Sidebar>
        }
        header={
          <AppHeader
            height={52}
            logo={<AppShellHamburger />}
            title={title}
            subtitle={subtitle}
            actions={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 180, display: 'none' }} className="md:block">
                  <Input placeholder="Search employee..." size="sm" />
                </div>
                <Badge variant="success">Online</Badge>
                <Button size="sm" variant="primary" iconLeft="plus" onClick={() => setAddModalOpen(true)}>
                  Add Employee
                </Button>
              </div>
            }
          />
        }
      >
        <Outlet />
      </AppShell>

      {/* Modal for Adding Employees */}
      {addModalOpen && (
        <Modal
          open={addModalOpen}
          title="Add New Employee"
          onClose={() => setAddModalOpen(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 8 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 500 }}>
              Full Name
              <Input placeholder="e.g. Michael Scott" />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 500 }}>
              Email Address
              <Input placeholder="e.g. michael.scott@acme.com" type="email" />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 500 }}>
              Job Title
              <Input placeholder="e.g. Regional Manager" />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 500 }}>
              Department
              <Select
                value="Engineering"
                options={[
                  { value: 'Engineering', label: 'Engineering' },
                  { value: 'Product', label: 'Product' },
                  { value: 'Design', label: 'Design' },
                  { value: 'Human Resources', label: 'Human Resources' },
                  { value: 'Sales', label: 'Sales' },
                ]}
                onChange={() => {}}
              />
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <Button variant="ghost" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setAddModalOpen(false)}>
                Create Employee
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
