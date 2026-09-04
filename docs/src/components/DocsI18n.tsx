/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Icon,
  SP_I18N_LOCALES,
  useI18n,
  type SpDirection,
  type SpI18nLocale,
} from 'spruce-react';
import './DocsI18n.css';

export interface DocsLabels {
  appearance: string;
  backToTop: string;
  brandSubtitle: string;
  closeLanguageSettings: string;
  direction: string;
  documentationSearch: string;
  firstDay: string;
  friday: string;
  home: string;
  internationalization: string;
  languageSettings: string;
  leftToRight: string;
  locale: string;
  monday: string;
  noMatchingDocs: string;
  onThisPage: string;
  packageCopied: string;
  packageCopyImport: string;
  recentlyOpened: string;
  rightToLeft: string;
  saturday: string;
  searchDocs: string;
  searchDocumentation: string;
  sunday: string;
  syncDocumentLangAndDir: string;
  toggleNavigationMenu: string;
  code: string;
  copied: string;
  copyCode: string;
  codeFiles: string;
  changelog: string;
  development: string;
  documentationNavigation: string;
  mobilePreview: string;
  hideLanguageSettings: string;
  hideDetails: string;
  sectionActionsNavigation: string;
  sectionBlocks: string;
  sectionCharts: string;
  sectionCore: string;
  sectionDataDisplay: string;
  sectionEffectsAnimations: string;
  sectionFormsInputs: string;
  sectionFoundations: string;
  sectionLayoutOverlays: string;
  sectionUtilities: string;
}

const EN_US: DocsLabels = {
  appearance: 'Appearance',
  backToTop: 'Back to top',
  brandSubtitle: 'Design System',
  closeLanguageSettings: 'Close language settings',
  direction: 'Direction',
  documentationSearch: 'Documentation search',
  firstDay: 'First day',
  friday: 'Friday',
  home: 'Home',
  internationalization: 'Internationalization',
  languageSettings: 'Language settings',
  leftToRight: 'Left to right',
  locale: 'Locale',
  monday: 'Monday',
  noMatchingDocs: 'No matching docs found.',
  onThisPage: 'On this page',
  packageCopied: 'Copied',
  packageCopyImport: 'Copy import statement',
  recentlyOpened: 'Recently opened',
  rightToLeft: 'Right to left',
  saturday: 'Saturday',
  searchDocs: 'Search docs…',
  searchDocumentation: 'Search documentation',
  sunday: 'Sunday',
  syncDocumentLangAndDir: 'Sync document lang and dir',
  toggleNavigationMenu: 'Toggle navigation menu',
  code: 'Code',
  copied: 'Copied',
  copyCode: 'Copy code',
  codeFiles: 'Code files',
  changelog: 'Changelog',
  development: 'Development',
  documentationNavigation: 'Documentation navigation',
  mobilePreview: 'Mobile component preview',
  hideLanguageSettings: 'Hide language settings',
  hideDetails: 'Hide details',
  sectionActionsNavigation: 'Actions & Navigation',
  sectionBlocks: 'Blocks',
  sectionCharts: 'Charts',
  sectionCore: 'Core',
  sectionDataDisplay: 'Data Display',
  sectionEffectsAnimations: 'Effects & Animations',
  sectionFormsInputs: 'Forms & Inputs',
  sectionFoundations: 'Foundations',
  sectionLayoutOverlays: 'Layout & Overlays',
  sectionUtilities: 'Utilities',
};

const DOC_LABEL_OVERRIDES: Record<string, Partial<DocsLabels>> = {
  'fr-FR': {
    appearance: 'Apparence', backToTop: 'Retour en haut', brandSubtitle: 'Système de design',
    closeLanguageSettings: 'Fermer les paramètres de langue', direction: 'Sens de lecture',
    documentationSearch: 'Recherche dans la documentation', firstDay: 'Premier jour', friday: 'Vendredi',
    home: 'Accueil', internationalization: 'Internationalisation', languageSettings: 'Paramètres de langue',
    leftToRight: 'De gauche à droite', locale: 'Langue', monday: 'Lundi', noMatchingDocs: 'Aucune page correspondante.',
    onThisPage: 'Sur cette page', packageCopied: 'Copié', packageCopyImport: 'Copier l’import', recentlyOpened: 'Récemment consultés',
    rightToLeft: 'De droite à gauche', saturday: 'Samedi', searchDocs: 'Rechercher dans la doc…',
    searchDocumentation: 'Rechercher dans la documentation', sunday: 'Dimanche', syncDocumentLangAndDir: 'Synchroniser lang et dir du document',
    toggleNavigationMenu: 'Afficher ou masquer le menu de navigation', code: 'Code', copied: 'Copié', copyCode: 'Copier le code',
    codeFiles: 'Fichiers de code', changelog: 'Historique', development: 'Développement', documentationNavigation: 'Navigation de la documentation', mobilePreview: 'Aperçu mobile du composant', hideLanguageSettings: 'Masquer les paramètres de langue', hideDetails: 'Masquer les détails',
    sectionActionsNavigation: 'Actions et navigation', sectionBlocks: 'Blocs', sectionCharts: 'Graphiques', sectionCore: 'Base',
    sectionDataDisplay: 'Affichage des données', sectionEffectsAnimations: 'Effets et animations', sectionFormsInputs: 'Formulaires et saisie',
    sectionFoundations: 'Fondations', sectionLayoutOverlays: 'Mise en page et overlays', sectionUtilities: 'Utilitaires',
  },
  'de-DE': { appearance: 'Darstellung', backToTop: 'Nach oben', home: 'Startseite', languageSettings: 'Spracheinstellungen', locale: 'Sprache', direction: 'Leserichtung', searchDocs: 'Dokumentation durchsuchen…', searchDocumentation: 'Dokumentationssuche', code: 'Code', copied: 'Kopiert', copyCode: 'Code kopieren', codeFiles: 'Codedateien' },
  'es-ES': { appearance: 'Apariencia', backToTop: 'Volver arriba', home: 'Inicio', languageSettings: 'Configuración de idioma', locale: 'Idioma', direction: 'Dirección', searchDocs: 'Buscar documentación…', searchDocumentation: 'Búsqueda en la documentación', code: 'Código', copied: 'Copiado', copyCode: 'Copiar código', codeFiles: 'Archivos de código' },
  'fil-PH': { appearance: 'Hitsura', backToTop: 'Bumalik sa itaas', home: 'Home', languageSettings: 'Mga setting ng wika', locale: 'Wika', direction: 'Direksyon', searchDocs: 'Maghanap sa docs…', searchDocumentation: 'Paghahanap sa dokumentasyon', code: 'Code', copied: 'Nakopya', copyCode: 'Kopyahin ang code', codeFiles: 'Mga code file' },
  ar: { appearance: 'المظهر', backToTop: 'العودة إلى الأعلى', home: 'الرئيسية', languageSettings: 'إعدادات اللغة', locale: 'اللغة', direction: 'الاتجاه', searchDocs: 'البحث في الوثائق…', searchDocumentation: 'البحث في الوثائق', code: 'رمز', copied: 'تم النسخ', copyCode: 'نسخ الرمز', codeFiles: 'ملفات الرمز' },
  'ja-JP': { appearance: '外観', backToTop: '上へ戻る', home: 'ホーム', languageSettings: '言語設定', locale: 'ロケール', direction: '方向', searchDocs: 'ドキュメントを検索…', searchDocumentation: 'ドキュメント検索', code: 'コード', copied: 'コピーしました', copyCode: 'コードをコピー', codeFiles: 'コードファイル' },
};

const SECTION_LABELS: Record<string, keyof DocsLabels> = {
  Foundations: 'sectionFoundations', Core: 'sectionCore', 'Data Display': 'sectionDataDisplay',
  'Forms & Inputs': 'sectionFormsInputs', 'Actions & Navigation': 'sectionActionsNavigation',
  'Layout & Overlays': 'sectionLayoutOverlays', Charts: 'sectionCharts',
  'Effects & Animations': 'sectionEffectsAnimations', Utilities: 'sectionUtilities', Blocks: 'sectionBlocks',
};

export interface DocsI18nContextValue {
  readonly locale: string;
  readonly direction: SpDirection;
  readonly firstDayOfWeek: number;
  readonly isRtl: boolean;
  readonly syncDocument: boolean;
  readonly availableLocales: readonly SpI18nLocale[];
  readonly t: (key: keyof DocsLabels) => string;
  readonly section: (label: string) => string;
  readonly setLocale: (locale: string) => void;
  readonly setDirection: (direction: SpDirection) => void;
  readonly setFirstDayOfWeek: (day: number) => void;
  readonly setSyncDocument: (sync: boolean) => void;
  readonly formatDate: (value: string | Date) => string;
  readonly formatNumber: (value: number) => string;
}

const STORAGE_KEY = 'spruce-docs-i18n';

interface StoredDocsI18n {
  locale?: string;
  direction?: SpDirection;
  firstDayOfWeek?: number;
  syncDocument?: boolean;
}

function readStored(): StoredDocsI18n {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return {};
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed as StoredDocsI18n : {};
  } catch {
    return {};
  }
}

function labelsFor(locale: string): DocsLabels {
  const exact = DOC_LABEL_OVERRIDES[locale];
  const base = DOC_LABEL_OVERRIDES[locale.split('-')[0]];
  return { ...EN_US, ...base, ...exact };
}

function useDocsI18nContext(): DocsI18nContextValue {
  const i18n = useI18n();
  const labels = useMemo(() => labelsFor(i18n.locale), [i18n.locale]);
  const storedRef = useRef<StoredDocsI18n | null>(null);

  useEffect(() => {
    const stored = storedRef.current ?? readStored();
    storedRef.current = stored;
    if (stored.locale && stored.locale !== i18n.locale) {
      i18n.setConfig({ locale: stored.locale, direction: stored.direction });
      return;
    }
    if (stored.direction && stored.direction !== i18n.direction) i18n.setConfig({ direction: stored.direction });
    if (stored.firstDayOfWeek !== undefined && stored.firstDayOfWeek !== i18n.firstDayOfWeek) i18n.setConfig({ firstDayOfWeek: stored.firstDayOfWeek });
    if (stored.syncDocument !== undefined && stored.syncDocument !== i18n.syncDocument) i18n.setConfig({ syncDocument: stored.syncDocument });
  }, [i18n]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        locale: i18n.locale,
        direction: i18n.direction,
        firstDayOfWeek: i18n.firstDayOfWeek,
        syncDocument: i18n.syncDocument,
      } satisfies StoredDocsI18n));
    } catch {
      // Preferences are best effort in private browsing contexts.
    }
  }, [i18n.direction, i18n.firstDayOfWeek, i18n.locale, i18n.syncDocument]);

  return useMemo(() => ({
    locale: i18n.locale,
    direction: i18n.direction,
    firstDayOfWeek: i18n.firstDayOfWeek,
    isRtl: i18n.isRtl,
    syncDocument: i18n.syncDocument,
    availableLocales: SP_I18N_LOCALES,
    t: (key: keyof DocsLabels) => labels[key] ?? key,
    section: (label: string) => {
      const key = SECTION_LABELS[label];
      return key ? labels[key] : label;
    },
    setLocale: (locale: string) => i18n.setLocale(locale),
    setDirection: (direction: SpDirection) => i18n.setConfig({ direction }),
    setFirstDayOfWeek: (firstDayOfWeek: number) => i18n.setConfig({ firstDayOfWeek }),
    setSyncDocument: (syncDocument: boolean) => i18n.setConfig({ syncDocument }),
    formatDate: (value: string | Date) => i18n.formatDate(value),
    formatNumber: (value: number) => i18n.formatNumber(value),
  }), [i18n, labels]);
}

export function DocsI18nProvider({ children }: { children: ReactNode }) {
  return <DocsI18nContextBridge>{children}</DocsI18nContextBridge>;
}

function DocsI18nContextBridge({ children }: { children: ReactNode }) {
  const value = useDocsI18nContext();
  return <DocsI18nContext.Provider value={value}>{children}</DocsI18nContext.Provider>;
}

const DocsI18nContext = createContext<DocsI18nContextValue | null>(null);

export function useDocsI18n(): DocsI18nContextValue {
  const context = useContext(DocsI18nContext);
  const i18n = useI18n();
  const labels = useMemo(() => labelsFor(i18n.locale), [i18n.locale]);
  const fallback = useMemo<DocsI18nContextValue>(() => ({
    locale: i18n.locale,
    direction: i18n.direction,
    firstDayOfWeek: i18n.firstDayOfWeek,
    isRtl: i18n.isRtl,
    syncDocument: i18n.syncDocument,
    availableLocales: SP_I18N_LOCALES,
    t: (key: keyof DocsLabels) => labels[key] ?? key,
    section: (label: string) => {
      const key = SECTION_LABELS[label];
      return key ? labels[key] : label;
    },
    setLocale: (locale: string) => i18n.setLocale(locale),
    setDirection: (direction: SpDirection) => i18n.setConfig({ direction }),
    setFirstDayOfWeek: (firstDayOfWeek: number) => i18n.setConfig({ firstDayOfWeek }),
    setSyncDocument: (syncDocument: boolean) => i18n.setConfig({ syncDocument }),
    formatDate: (value: string | Date) => i18n.formatDate(value),
    formatNumber: (value: number) => i18n.formatNumber(value),
  }), [i18n, labels]);
  return context ?? fallback;
}

export interface DocsI18nPickerProps {
  className?: string;
}

export function DocsI18nPicker({ className = '' }: DocsI18nPickerProps) {
  const docs = useDocsI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const dayOptions = [
    [0, docs.t('sunday')], [1, docs.t('monday')], [5, docs.t('friday')], [6, docs.t('saturday')],
  ] as const;

  return (
    <div ref={rootRef} className={['docs-i18n-picker', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="docs-i18n-picker__trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={docs.t('languageSettings')}
        title={docs.t('languageSettings')}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="globe" size={16} aria-hidden="true" />
        <span className="docs-i18n-picker__trigger-label">{docs.locale}</span>
      </button>

      {open && (
        <section className="docs-i18n-picker__panel" role="dialog" aria-label={docs.t('languageSettings')}>
          <div className="docs-i18n-picker__header">
            <h2>{docs.t('internationalization')}</h2>
            <button type="button" className="docs-i18n-picker__close" onClick={() => setOpen(false)} aria-label={docs.t('closeLanguageSettings')}>
              <Icon name="x" size={14} aria-hidden="true" />
            </button>
          </div>

          <label>
            <span>{docs.t('locale')}</span>
            <select value={docs.locale} onChange={(event) => docs.setLocale(event.target.value)}>
              {docs.availableLocales.map((locale) => <option key={locale.code} value={locale.code}>{locale.nativeLabel}</option>)}
            </select>
          </label>
          <label>
            <span>{docs.t('direction')}</span>
            <select value={docs.direction} onChange={(event) => docs.setDirection(event.target.value as SpDirection)}>
              <option value="ltr">{docs.t('leftToRight')}</option>
              <option value="rtl">{docs.t('rightToLeft')}</option>
            </select>
          </label>
          <label>
            <span>{docs.t('firstDay')}</span>
            <select value={docs.firstDayOfWeek} onChange={(event) => docs.setFirstDayOfWeek(Number(event.target.value))}>
              {dayOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="docs-i18n-picker__check">
            <input type="checkbox" checked={docs.syncDocument} onChange={(event) => docs.setSyncDocument(event.target.checked)} />
            <span>{docs.t('syncDocumentLangAndDir')}</span>
          </label>
          <div className="docs-i18n-picker__meta" aria-live="polite">
            <span>{docs.locale}</span><span>{docs.direction.toUpperCase()}</span>
          </div>
        </section>
      )}
    </div>
  );
}

export { EN_US as DOCS_LABELS_EN_US };
