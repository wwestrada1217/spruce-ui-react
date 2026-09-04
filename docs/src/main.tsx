import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '../../src/tokens/tokens.css'
import '../../src/tokens/motion-patterns.css'
import App from './App.tsx'
import { SpruceProvider } from 'spruce-react'
import { DocsI18nProvider } from './components/DocsI18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpruceProvider>
      <DocsI18nProvider>
        <App />
      </DocsI18nProvider>
    </SpruceProvider>
  </StrictMode>,
)
