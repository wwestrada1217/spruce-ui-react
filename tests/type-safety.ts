import type {
  SpruceCustomTokenKey,
  SpruceComponentTokenKey,
  SpruceTokenKey,
} from '../src/tokens/index.js'

const globalToken: SpruceTokenKey = '--sp-primary'
const componentToken: SpruceComponentTokenKey = '--sp-chart-series-8'
const customToken: SpruceCustomTokenKey = '--sp-product-status'

void globalToken
void componentToken
void customToken

// @ts-expect-error Built-in token keys are intentionally closed.
const typo: SpruceTokenKey = '--sp-prmary'
void typo
