import { agentsDarkTheme } from './agents-dark.js';
import { agentsTheme } from './agents.js';
import { bumblebeeDarkTheme } from './bumblebee-dark.js';
import { bumblebeeTheme } from './bumblebee.js';
import { comicDarkTheme } from './comic-dark.js';
import { comicTheme } from './comic.js';
import { corporateDarkTheme } from './corporate-dark.js';
import { corporateTheme } from './corporate.js';
import { dimTheme } from './dim.js';
import { draculaTheme } from './dracula.js';
import { forestTheme } from './forest.js';
import { liquidGlassDarkTheme } from './liquid-glass-dark.js';
import { liquidGlassTheme } from './liquid-glass.js';
import { materialDarkTheme } from './material-dark.js';
import { materialTheme } from './material.js';
import { modernDarkTheme } from './modern-dark.js';
import { modernTheme } from './modern.js';
import { monokaiLightTheme } from './monokai-light.js';
import { monokaiTheme } from './monokai.js';
import { nightTheme } from './night.js';
import { nordTheme } from './nord.js';
import { oceanTheme } from './ocean.js';
import { retroTheme } from './retro.js';
import { roseTheme } from './rose.js';
import { shadcnDarkTheme } from './shadcn-dark.js';
import { shadcnTheme } from './shadcn.js';
import { spruceCharcoalDarkTheme } from './spruce-charcoal-dark.js';
import { spruceCharcoalTheme } from './spruce-charcoal.js';
import { spruceDarkTheme } from './spruce-dark.js';
import { spruceSlateDarkTheme } from './spruce-slate-dark.js';
import { spruceSlateTheme } from './spruce-slate.js';
import { spruceTheme } from './spruce.js';
import { visualStudioDarkTheme } from './visual-studio-dark.js';
import { visualStudioTheme } from './visual-studio.js';

/** Every shipped preset, in the order used by the appearance switcher. */
export const SPRUCE_THEME_PRESETS = [
  spruceTheme,
  spruceDarkTheme,
  spruceSlateTheme,
  spruceSlateDarkTheme,
  spruceCharcoalTheme,
  spruceCharcoalDarkTheme,
  visualStudioTheme,
  visualStudioDarkTheme,
  corporateTheme,
  corporateDarkTheme,
  modernTheme,
  modernDarkTheme,
  agentsTheme,
  agentsDarkTheme,
  oceanTheme,
  forestTheme,
  roseTheme,
  retroTheme,
  bumblebeeTheme,
  bumblebeeDarkTheme,
  comicTheme,
  comicDarkTheme,
  liquidGlassTheme,
  liquidGlassDarkTheme,
  nightTheme,
  draculaTheme,
  dimTheme,
  nordTheme,
  shadcnTheme,
  shadcnDarkTheme,
  monokaiLightTheme,
  monokaiTheme,
  materialTheme,
  materialDarkTheme,
] as const;
