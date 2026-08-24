/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Card, Input, Button, Switch } from 'spruce-react';

export default function Settings() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Company Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 500 }}>
              Company Name
              <Input defaultValue="Acme Corporation" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 500 }}>
              Tax ID / EIN
              <Input defaultValue="12-3456789" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 500 }}>
              Primary HR Email
              <Input defaultValue="hr@acme.com" />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 500 }}>
              Headquarters Address
              <Input defaultValue="100 Tech Way, San Francisco, CA" />
            </label>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Notification & Policy Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 13, display: 'block' }}>Automatic Leave Approvals</span>
                <span style={{ fontSize: 12, color: 'var(--sp-text-muted, #64748b)' }}>Auto-approve single-day sick leave requests</span>
              </div>
              <Switch checked onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 13, display: 'block' }}>Payroll Email Notifications</span>
                <span style={{ fontSize: 12, color: 'var(--sp-text-muted, #64748b)' }}>Send payslips automatically to employees upon release</span>
              </div>
              <Switch checked onChange={() => {}} />
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="outline">Reset Changes</Button>
        <Button variant="primary">Save HR Settings</Button>
      </div>
    </div>
  );
}
