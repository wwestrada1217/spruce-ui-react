import { useState, useEffect, useRef } from 'react';
import { Card, Input, PasswordInput, Button, Checkbox, Icon } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Section { id: string; label: string }
const SECTIONS: Section[] = [
  { id: 'login',    label: 'Sign In' },
  { id: 'register', label: 'Create Account' },
  { id: 'code',     label: 'Source Code' },
];

export function AuthenticationBlockPage() {
  const [activeSection, setActiveSection] = useState('login');
  const mainRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.3 },
    );
    const sections = mainRef.current?.querySelectorAll('[id]') ?? [];
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const AUTH_CODE = `import { Card, Input, PasswordInput, Button, Checkbox } from 'spruce-react';

export function SignInForm() {
  return (
    <Card style={{ maxWidth: 420, margin: '0 auto', padding: 32 }}>
      <div style={{ textAlignment: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Welcome back</h2>
        <p style={{ color: 'var(--sp-text-subtle)', fontSize: 14 }}>Sign in to your Spruce workspace</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email address</label>
          <Input type="email" placeholder="name@company.com" value={email} onChange={setEmail} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
          <PasswordInput value={password} onChange={setPassword} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Checkbox checked={remember} onChange={setRemember} label="Remember me for 30 days" />
          <a href="#/blocks/authentication" style={{ fontSize: 13, color: 'var(--sp-primary)', textDecoration: 'none' }}>Forgot password?</a>
        </div>

        <Button variant="primary" style={{ width: '100%', marginTop: 8 }}>Sign In</Button>
      </form>
    </Card>
  );
}`;

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>Authentication Block</h1>
        <p className="docs-desc">
          Ready-to-use login, registration, and user authentication flow patterns.
        </p>

        <section id="login" className="demo-section">
          <h2>Sign In Card</h2>
          <div style={{ display: 'grid', placeItems: 'center', padding: '40px 16px', background: 'var(--sp-bg-secondary)', borderRadius: 8, border: '1px solid var(--sp-border-subtle)' }}>
            <Card style={{ width: '100%', maxWidth: 420, padding: 32 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--sp-primary)', display: 'grid', placeItems: 'center', color: '#fff', margin: '0 auto 12px auto' }}>
                  <Icon name="logo" size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Welcome back</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--sp-text-subtle)', fontSize: 14 }}>Enter your credentials to access your account</p>
              </div>

              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email address</label>
                  <Input type="email" placeholder="name@company.com" value={email} onChange={setEmail} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
                  <PasswordInput value={password} onChange={setPassword} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Checkbox checked={remember} onChange={(v) => setRemember(v)}>
                    Remember me
                  </Checkbox>
                  <a href="#/blocks/authentication" style={{ fontSize: 13, color: 'var(--sp-primary)', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
                </div>

                <Button variant="primary" style={{ width: '100%', marginTop: 8 }}>Sign In</Button>

                <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--sp-text-subtle)' }}>
                  Don't have an account? <a href="#/blocks/authentication" style={{ color: 'var(--sp-primary)', textDecoration: 'none', fontWeight: 600 }}>Create an account</a>
                </div>
              </form>
            </Card>
          </div>
        </section>

        <section id="register" className="demo-section">
          <h2>Create Account Form</h2>
          <div style={{ display: 'grid', placeItems: 'center', padding: '40px 16px', background: 'var(--sp-bg-secondary)', borderRadius: 8, border: '1px solid var(--sp-border-subtle)' }}>
            <Card style={{ width: '100%', maxWidth: 440, padding: 32 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Get started with Spruce</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--sp-text-subtle)', fontSize: 14 }}>Create your 14-day free trial workspace</p>
              </div>

              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Full name</label>
                  <Input placeholder="John Doe" value={regName} onChange={setRegName} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Work email</label>
                  <Input type="email" placeholder="john@company.com" value={regEmail} onChange={setRegEmail} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Password</label>
                  <PasswordInput value={regPassword} onChange={setRegPassword} />
                </div>

                <Button variant="primary" style={{ width: '100%', marginTop: 8 }}>Create Account</Button>
              </form>
            </Card>
          </div>
        </section>

        <section id="code" className="demo-section">
          <h2>Source Code</h2>
          <CodePreview code={AUTH_CODE}>
            <div style={{ padding: 12, color: 'var(--sp-text-subtle)', fontSize: 13 }}>
              Use this layout block for user authentication and onboarding pages.
            </div>
          </CodePreview>
        </section>
      </div>

      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                className={`toc-link${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
