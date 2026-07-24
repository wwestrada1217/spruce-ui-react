import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '../../src/tokens/tokens.css'
import '../../src/tokens/motion-patterns.css'
import App from './App.tsx'
import { SpruceProvider } from 'spruce-react'
import type { SpruceProviderProps } from 'spruce-react'

// Seed the provider with the persisted docs preference so the first
// theme application matches what the pre-paint script in index.html set —
// otherwise the provider stamps its default before the switcher restores.
function initialTheme(): NonNullable<SpruceProviderProps['defaultTheme']> {
  try {
    return (localStorage.getItem('spruce-docs-theme-preference') ?? 'system') as NonNullable<
      SpruceProviderProps['defaultTheme']
    >
  } catch {
    return 'system'
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpruceProvider defaultTheme={initialTheme()}>
      <App />
    </SpruceProvider>
  </StrictMode>,
)
