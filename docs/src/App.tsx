import { useState, useEffect } from 'react'
import { DocsSidebar } from './components/Sidebar'
import { HomePage } from './pages/HomePage'
import { ColorsPage } from './pages/foundation/Colors'
import { TypographyPage } from './pages/foundation/Typography'
import { SpacingPage } from './pages/foundation/Spacing'
import { ShadowsPage } from './pages/foundation/Shadows'
import { IconographyPage } from './pages/foundation/Iconography'
import { ThemingPage } from './pages/foundation/Theming'
import { ColorHarmonyPage } from './pages/foundation/ColorHarmony'
import { MotionPage } from './pages/foundation/Motion'
import { VoiceAndTonePage } from './pages/foundation/VoiceAndTone'
import { BordersPage } from './pages/foundation/Borders'
import { DensityPage } from './pages/foundation/Density'
import { MotifsPage } from './pages/foundation/Motifs'
import { AccessibilityPage } from './pages/foundation/Accessibility'
import { InternationalizationPage } from './pages/foundation/Internationalization'
import { ButtonPage } from './pages/components/ButtonPage'
import { BadgePage } from './pages/components/BadgePage'
import { CheckboxPage } from './pages/components/CheckboxPage'
import { RadioPage } from './pages/components/RadioPage'
import { AlertPage } from './pages/components/AlertPage'
import { CircularProgressPage } from './pages/components/CircularProgressPage'
import { CardPage } from './pages/components/CardPage'
import { SidebarPage } from './pages/components/SidebarPage'
import { CodeEditorPage } from './pages/components/CodeEditorPage'
import { TooltipPage } from './pages/components/TooltipPage'
import { PopoverPage } from './pages/components/PopoverPage'
import { DropdownPage } from './pages/components/DropdownPage'
import { AvatarPage } from './pages/components/AvatarPage'
import { AvatarGroupPage } from './pages/components/AvatarGroupPage'
import { BreadcrumbPage } from './pages/components/BreadcrumbPage'
import { AccordionPage } from './pages/components/AccordionPage'
import { DataSourcePage } from './pages/data/DataSourcePage'
import { DataContextPage } from './pages/data/DataContextPage'
import { KbdPage } from './pages/components/KbdPage'
import { ProgressBarPage } from './pages/components/ProgressBarPage'
import { StatCardPage } from './pages/components/StatCardPage'
import { SpinnerPage } from './pages/components/SpinnerPage'
import { EmptyPage } from './pages/components/EmptyPage'
import { TimelinePage } from './pages/components/TimelinePage'
import { SwitchPage } from './pages/components/SwitchPage'
import { InputPage } from './pages/components/InputPage'
import { TextareaPage } from './pages/components/TextareaPage'
import { FieldPage } from './pages/components/FieldPage'
import { FormLayoutPage } from './pages/components/FormLayoutPage'
import { InputGroupPage } from './pages/components/InputGroupPage'
import { PasswordInputPage } from './pages/components/PasswordInputPage'
import { PasswordProgressPage } from './pages/components/PasswordProgressPage'
import { OtpInputPage } from './pages/components/OtpInputPage'
import { MaskedInputPage } from './pages/components/MaskedInputPage'
import { CalendarPage } from './pages/components/CalendarPage'
import { DatePickerPage } from './pages/components/DatePickerPage'
import { TimePickerPage } from './pages/components/TimePickerPage'
import { DateTimePickerPage } from './pages/components/DateTimePickerPage'
import { RangeCalendarPage } from './pages/components/RangeCalendarPage'
import { DateRangePickerPage } from './pages/components/DateRangePickerPage'
import { TabsPage } from './pages/components/TabsPage'
import { SplitButtonPage } from './pages/components/SplitButtonPage'
import { StepperPage } from './pages/components/StepperPage'
import { SegmentedControlPage } from './pages/components/SegmentedControlPage'
import { OverflowPage } from './pages/components/OverflowPage'
import { ToolbarPage } from './pages/components/ToolbarPage'
import { SplitterPage } from './pages/components/SplitterPage'
import { DrawerPage } from './pages/components/DrawerPage'
import { ModalPage } from './pages/components/ModalPage'
import { WindowPage } from './pages/components/WindowPage'
import { ToastPage } from './pages/components/ToastPage'
import { SnackbarPage } from './pages/components/SnackbarPage'
import { NotificationCenterPage } from './pages/components/NotificationCenterPage'
import { CommandPalettePage } from './pages/components/CommandPalettePage'
import { ButtonGroupPage } from './pages/components/ButtonGroupPage'
import { SliderRangePage } from './pages/components/SliderRangePage'
import { ScrollbarPage } from './pages/components/ScrollbarPage'
import { GridPage } from './pages/components/GridPage'
import { DockManagerPage } from './pages/components/DockManagerPage'
import { LayoutManagerPage } from './pages/components/LayoutManagerPage'
import { MasonryPage } from './pages/components/MasonryPage'
import { DragDropPage } from './pages/components/DragDropPage'
import { FullscreenPage } from './pages/components/FullscreenPage'
import { HideOnScrollPage } from './pages/components/HideOnScrollPage'
import { SelectPage } from './pages/components/SelectPage'
import { ComboboxPage } from './pages/components/ComboboxPage'
import { GridComboboxPage } from './pages/components/GridComboboxPage'
import { ColorPickerPage } from './pages/components/ColorPickerPage'
import { EmojiPickerPage } from './pages/components/EmojiPickerPage'
import { FormBuilderPage } from './pages/components/FormBuilderPage'
import { LookupsPage } from './pages/components/LookupsPage'
import { DatagridexPage } from './pages/components/DatagridexPage'
import { GanttPage } from './pages/components/GanttPage'
import { SchedulerPage } from './pages/components/SchedulerPage'
import { KanbanPage } from './pages/components/KanbanPage'
import { TreePage } from './pages/components/TreePage'
import { InplaceEditorPage } from './pages/components/InplaceEditorPage'
import { AppHeaderPage } from './pages/components/AppHeaderPage'
import { CompanySwitcherPage } from './pages/components/CompanySwitcherPage'
import { NavMenuPage } from './pages/components/NavMenuPage'
import { PagerPage } from './pages/components/PagerPage'
import { FabPage } from './pages/components/FabPage'
import { PanelPage } from './pages/components/PanelPage'
import { CoachmarkPage } from './pages/components/CoachmarkPage'
import { MessageBarPage } from './pages/components/MessageBarPage'
import { MentionPage } from './pages/components/MentionPage'
import { FilterExpressionPage } from './pages/components/FilterExpressionPage'
import { ListPage } from './pages/components/ListPage'
import { TerminalPage } from './pages/components/TerminalPage'
import { RatingPage } from './pages/components/RatingPage'
import { CarouselPage } from './pages/components/CarouselPage'
import { LightboxPage } from './pages/components/LightboxPage'
import { ImageComparePage } from './pages/components/ImageComparePage'
import { ImageEditorPage } from './pages/components/ImageEditorPage'
import { AspectRatioPage } from './pages/components/AspectRatioPage'
import { CreditCardPage } from './pages/components/CreditCardPage'
import { BarcodeQrPage } from './pages/components/BarcodeQrPage'
import { GitGraphPage } from './pages/components/GitGraphPage'
import { FileUploadPage } from './pages/components/FileUploadPage'
import { EditorPage } from './pages/components/EditorPage'
import { MarkdownEditorPage } from './pages/components/MarkdownEditorPage'
import { BlockEditorPage } from './pages/components/BlockEditorPage'
import { DiffEditorPage } from './pages/components/DiffEditorPage'
import { SignaturePadPage } from './pages/components/SignaturePadPage'
import { AppShellBlockPage } from './pages/blocks/AppShellBlockPage'
import { DashboardBlockPage } from './pages/blocks/DashboardBlockPage'
import { AuthenticationBlockPage } from './pages/blocks/AuthenticationBlockPage'
import { SettingsBlockPage } from './pages/blocks/SettingsBlockPage'
import { EmailBlockPage } from './pages/blocks/EmailBlockPage'
import { FeedsBlockPage } from './pages/blocks/FeedsBlockPage'
import { ProjectWorkspaceBlockPage } from './pages/blocks/ProjectWorkspaceBlockPage'
import { SupportDeskBlockPage } from './pages/blocks/SupportDeskBlockPage'
import { BarChartPage } from './pages/charts/BarChartPage'
import { PieChartPage } from './pages/charts/PieChartPage'
import { LineChartPage } from './pages/charts/LineChartPage'
import { AreaChartPage } from './pages/charts/AreaChartPage'
import { SparklinePage } from './pages/charts/SparklinePage'
import { StackedBarChartPage } from './pages/charts/StackedBarChartPage'
import { StackedAreaChartPage } from './pages/charts/StackedAreaChartPage'
import { GroupedBarChartPage } from './pages/charts/GroupedBarChartPage'
import { BubbleChartPage } from './pages/charts/BubbleChartPage'
import { GaugeChartPage } from './pages/charts/GaugeChartPage'
import { ScatterChartPage } from './pages/charts/ScatterChartPage'
import { HeatmapChartPage } from './pages/charts/HeatmapChartPage'
import { RadarChartPage } from './pages/charts/RadarChartPage'
import { SunburstChartPage } from './pages/charts/SunburstChartPage'
import { SankeyChartPage } from './pages/charts/SankeyChartPage'
import { PolarLineChartPage } from './pages/charts/PolarLineChartPage'
import { WaterfallChartPage } from './pages/charts/WaterfallChartPage'
import { FunnelChartPage } from './pages/charts/FunnelChartPage'
import { CandlestickChartPage } from './pages/charts/CandlestickChartPage'
import { TreemapChartPage } from './pages/charts/TreemapChartPage'
import { BarRaceChartPage } from './pages/charts/BarRaceChartPage'
import { HistogramChartPage } from './pages/charts/HistogramChartPage'
import { CalendarHeatmapChartPage } from './pages/charts/CalendarHeatmapChartPage'
import { ComboChartPage } from './pages/charts/ComboChartPage'
import { OrgChartPage } from './pages/charts/OrgChartPage'
import { CylinderChartPage } from './pages/charts/CylinderChartPage'
import { DiagramEditorPage } from './pages/charts/DiagramEditorPage'
import { FishboneChartPage } from './pages/charts/FishboneChartPage'
import { GraphChartPage } from './pages/charts/GraphChartPage'
import { MapChartPage } from './pages/charts/MapChartPage'
import { PerformanceGraphPage } from './pages/charts/PerformanceGraphPage'
import { PyramidChartPage } from './pages/charts/PyramidChartPage'
import { TinyChartsPage } from './pages/charts/TinyChartsPage'
import { VennChartPage } from './pages/charts/VennChartPage'
import { WheelDiagramPage } from './pages/charts/WheelDiagramPage'
import { ChartKernelPage } from './pages/charts/ChartKernelPage'
import { SparklesPage } from './pages/effects/SparklesPage'
import { ConfettiPage } from './pages/effects/ConfettiPage'
import { ShimmerPage } from './pages/effects/ShimmerPage'
import { RainbowPage } from './pages/effects/RainbowPage'
import { ShinePage } from './pages/effects/ShinePage'
import { GlowPage } from './pages/effects/GlowPage'
import { MarqueePage } from './pages/effects/MarqueePage'
import { FadePage } from './pages/effects/FadePage'
import { FocusUtilitiesPage } from './pages/utils/FocusUtilitiesPage'
import { HighlightPage } from './pages/utils/HighlightPage'
import { CodePreviewUtilPage } from './pages/utils/CodePreviewUtilPage'
import { ChangelogPage } from './pages/ChangelogPage'
import { DevelopmentPage } from './pages/DevelopmentPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { TablePage } from './pages/components/TablePage'
import { ComposeBarPage } from './pages/components/ComposeBarPage'
import { CommentThreadPage } from './pages/components/CommentThreadPage'
import { PropertyPanelPage } from './pages/components/PropertyPanelPage'
import { PdfViewerPage } from './pages/components/PdfViewerPage'
import { TextDiffPage } from './pages/components/TextDiffPage'
import { PlanCardsPage } from './pages/components/PlanCardsPage'
import { FeatureGatePage } from './pages/components/FeatureGatePage'

function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash || '#/')

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#/'
    }
    const handler = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return hash
}

function renderPage(hash: string): React.ReactElement {
  switch (hash) {
    case '#/':
    case '#':
    case '':                            return <HomePage />
    case '#/changelog':                 return <ChangelogPage />
    case '#/development':               return <DevelopmentPage />
    case '#/foundation/colors':         return <ColorsPage />
    case '#/foundation/typography':     return <TypographyPage />
    case '#/foundation/spacing':        return <SpacingPage />
    case '#/foundation/shadows':        return <ShadowsPage />
    case '#/foundation/iconography':    return <IconographyPage />
    case '#/foundation/theming':        return <ThemingPage />
    case '#/foundation/color-harmony':  return <ColorHarmonyPage />
    case '#/foundation/motion':         return <MotionPage />
    case '#/foundation/voice-and-tone': return <VoiceAndTonePage />
    case '#/foundation/borders':        return <BordersPage />
    case '#/foundation/density':        return <DensityPage />
    case '#/foundation/motifs':         return <MotifsPage />
    case '#/foundation/accessibility':  return <AccessibilityPage />
    case '#/foundation/internationalization': return <InternationalizationPage />
    case '#/components/button':         return <ButtonPage />
    case '#/components/badge':          return <BadgePage />
    case '#/components/checkbox':       return <CheckboxPage />
    case '#/components/radio':          return <RadioPage />
    case '#/components/alert':          return <AlertPage />
    case '#/components/circular-progress': return <CircularProgressPage />
    case '#/components/card':           return <CardPage />
    case '#/components/sidebar':        return <SidebarPage />
    case '#/components/code-editor':    return <CodeEditorPage />
    case '#/components/tooltip':        return <TooltipPage />
    case '#/components/popover':        return <PopoverPage />
    case '#/components/dropdown':       return <DropdownPage />
    case '#/components/avatar':         return <AvatarPage />
    case '#/components/avatar-group':   return <AvatarGroupPage />
    case '#/components/breadcrumb':
    case '#/components/breadcrumbs':          return <BreadcrumbPage />
    case '#/components/accordion':            return <AccordionPage />
    case '#/components/popover-tooltip':      return <PopoverPage />
    case '#/components/kbd':                  return <KbdPage />
    case '#/components/progress-bar':         return <ProgressBarPage />
    case '#/components/stat-card':            return <StatCardPage />
    case '#/components/spinner':              return <SpinnerPage />
    case '#/components/empty':                return <EmptyPage />
    case '#/components/timeline':             return <TimelinePage />
    case '#/components/switch':               return <SwitchPage />
    case '#/components/input':                return <InputPage />
    case '#/components/textarea':             return <TextareaPage />
    case '#/components/field':                return <FieldPage />
    case '#/components/form-layout':          return <FormLayoutPage />
    case '#/components/input-group':          return <InputGroupPage />
    case '#/components/password-input':       return <PasswordInputPage />
    case '#/components/password-progress':    return <PasswordProgressPage />
    case '#/components/otp-input':            return <OtpInputPage />
    case '#/components/masked-input':         return <MaskedInputPage />
    case '#/components/calendar':             return <CalendarPage />
    case '#/components/datepicker':           return <DatePickerPage />
    case '#/components/time-picker':          return <TimePickerPage />
    case '#/components/datetime-picker':      return <DateTimePickerPage />
    case '#/components/range-calendar':       return <RangeCalendarPage />
    case '#/components/daterange-picker':     return <DateRangePickerPage />
    case '#/components/tabs':                return <TabsPage />
    case '#/components/split-button':        return <SplitButtonPage />
    case '#/components/stepper':             return <StepperPage />
    case '#/components/segmented-control':
    case '#/components/segmented':           return <SegmentedControlPage />
    case '#/components/overflow':
    case '#/utils/overflow':                 return <OverflowPage />
    case '#/components/toolbar':             return <ToolbarPage />
    case '#/components/splitter':            return <SplitterPage />
    case '#/components/drawer':              return <DrawerPage />
    case '#/components/modal':               return <ModalPage />
    case '#/components/window':              return <WindowPage />
    case '#/components/toast':               return <ToastPage />
    case '#/components/snackbar':            return <SnackbarPage />
    case '#/components/notification-center': return <NotificationCenterPage />
    case '#/components/command-palette':     return <CommandPalettePage />
    case '#/components/button-group':        return <ButtonGroupPage />
    case '#/components/slider':
    case '#/components/range':
    case '#/components/slider-range':        return <SliderRangePage />
    case '#/components/scrollbar':
    case '#/utils/scrollbar':                return <ScrollbarPage />
    case '#/components/grid':
    case '#/layout/grid':                    return <GridPage />
    case '#/components/dock-manager':
    case '#/layout/dock-manager':             return <DockManagerPage />
    case '#/components/layout-manager':
    case '#/layout/layout-manager':           return <LayoutManagerPage />
    case '#/components/masonry':
    case '#/layout/masonry':                  return <MasonryPage />
    case '#/components/drag-drop':
    case '#/utils/drag-drop':                 return <DragDropPage />
    case '#/components/fullscreen':
    case '#/utils/fullscreen':                return <FullscreenPage />
    case '#/components/hide-on-scroll':
    case '#/utils/hide-on-scroll':            return <HideOnScrollPage />
    case '#/components/select':              return <SelectPage />
    case '#/components/combobox':            return <ComboboxPage />
    case '#/components/grid-combobox':       return <GridComboboxPage />
    case '#/components/color-picker':         return <ColorPickerPage />
    case '#/components/emoji-picker':         return <EmojiPickerPage />
    case '#/components/form-builder':         return <FormBuilderPage />
    case '#/components/lookups':              return <LookupsPage />
    case '#/components/datagridex':          return <DatagridexPage />
    case '#/components/gantt':               return <GanttPage />
    case '#/components/scheduler':           return <SchedulerPage />
    case '#/components/kanban':              return <KanbanPage />
    case '#/components/tree':               return <TreePage />
    case '#/components/inplace-editor':     return <InplaceEditorPage />
    case '#/components/app-header':         return <AppHeaderPage />
    case '#/components/company-switcher':   return <CompanySwitcherPage />
    case '#/components/nav-menu':           return <NavMenuPage />
    case '#/components/pager':              return <PagerPage />
    case '#/components/fab':                return <FabPage />
    case '#/components/panel':              return <PanelPage />
    case '#/components/coachmark':          return <CoachmarkPage />
    case '#/components/message-bar':        return <MessageBarPage />
    case '#/components/mention':            return <MentionPage />
    case '#/components/table':               return <TablePage />
    case '#/components/compose-bar':         return <ComposeBarPage />
    case '#/components/comment-thread':
    case '#/components/comments':            return <CommentThreadPage />
    case '#/components/property-panel':      return <PropertyPanelPage />
    case '#/components/pdf-viewer':          return <PdfViewerPage />
    case '#/components/text-diff':           return <TextDiffPage />
    case '#/components/plan-cards':          return <PlanCardsPage />
    case '#/components/feature-gate':
    case '#/components/entitlements':        return <FeatureGatePage />
    case '#/components/filter-expression':  return <FilterExpressionPage />
    case '#/components/list':               return <ListPage />
    case '#/components/terminal':           return <TerminalPage />
    case '#/components/rating':             return <RatingPage />
    case '#/components/carousel':           return <CarouselPage />
    case '#/components/lightbox':           return <LightboxPage />
    case '#/components/image-compare':      return <ImageComparePage />
    case '#/components/image-editor':       return <ImageEditorPage />
    case '#/components/aspect-ratio':       return <AspectRatioPage />
    case '#/components/credit-card':        return <CreditCardPage />
    case '#/components/barcode-qr':         return <BarcodeQrPage />
    case '#/components/git-graph':          return <GitGraphPage />
    case '#/components/file-upload':        return <FileUploadPage />
    case '#/components/editor':             return <EditorPage />
    case '#/components/markdown-editor':    return <MarkdownEditorPage />
    case '#/components/block-editor':       return <BlockEditorPage />
    case '#/components/diff-editor':        return <DiffEditorPage />
    case '#/components/signature-pad':      return <SignaturePadPage />
    case '#/blocks/app-shell':
    case '#/components/app-shell':          return <AppShellBlockPage />
    case '#/blocks/dashboard':               return <DashboardBlockPage />
    case '#/blocks/authentication':          return <AuthenticationBlockPage />
    case '#/blocks/settings':                return <SettingsBlockPage />
    case '#/blocks/email':                   return <EmailBlockPage />
    case '#/blocks/feeds':                   return <FeedsBlockPage />
    case '#/blocks/project-workspace':       return <ProjectWorkspaceBlockPage />
    case '#/blocks/support-desk':            return <SupportDeskBlockPage />
    // Charts
    case '#/charts/chart-kernel':           return <ChartKernelPage />
    case '#/charts/bar-chart':              return <BarChartPage />
    case '#/charts/pie-chart':              return <PieChartPage />
    case '#/charts/line-chart':             return <LineChartPage />
    case '#/charts/area-chart':             return <AreaChartPage />
    case '#/charts/sparkline-chart':        return <SparklinePage />
    case '#/charts/stacked-bar-chart':     return <StackedBarChartPage />
    case '#/charts/stacked-area-chart':    return <StackedAreaChartPage />
    case '#/charts/grouped-bar-chart':     return <GroupedBarChartPage />
    case '#/charts/bubble-chart':          return <BubbleChartPage />
    case '#/charts/gauge-chart':           return <GaugeChartPage />
    case '#/charts/scatter-chart':         return <ScatterChartPage />
    case '#/charts/heatmap-chart':         return <HeatmapChartPage />
    case '#/charts/radar-chart':           return <RadarChartPage />
    case '#/charts/sunburst-chart':        return <SunburstChartPage />
    case '#/charts/sankey-chart':          return <SankeyChartPage />
    case '#/charts/polar-line-chart':      return <PolarLineChartPage />
    case '#/charts/waterfall-chart':       return <WaterfallChartPage />
    case '#/charts/funnel-chart':          return <FunnelChartPage />
    case '#/charts/candlestick-chart':     return <CandlestickChartPage />
    case '#/charts/treemap-chart':         return <TreemapChartPage />
    case '#/charts/bar-race-chart':        return <BarRaceChartPage />
    case '#/charts/histogram-chart':       return <HistogramChartPage />
    case '#/charts/calendar-heatmap-chart':return <CalendarHeatmapChartPage />
    case '#/charts/combo-chart':           return <ComboChartPage />
    case '#/charts/org-chart':             return <OrgChartPage />
    case '#/charts/cylinder-chart':        return <CylinderChartPage />
    case '#/charts/diagram-editor':        return <DiagramEditorPage />
    case '#/charts/fishbone-chart':        return <FishboneChartPage />
    case '#/charts/graph-chart':           return <GraphChartPage />
    case '#/charts/map-chart':             return <MapChartPage />
    case '#/charts/performance-graph':     return <PerformanceGraphPage />
    case '#/charts/pyramid-chart':         return <PyramidChartPage />
    case '#/charts/tiny-charts':           return <TinyChartsPage />
    case '#/charts/venn-chart':            return <VennChartPage />
    case '#/charts/wheel-diagram':         return <WheelDiagramPage />
    // Effects & Animations
    case '#/effects/sparkles':             return <SparklesPage />
    case '#/effects/confetti':             return <ConfettiPage />
    case '#/effects/shimmer':              return <ShimmerPage />
    case '#/effects/rainbow':              return <RainbowPage />
    case '#/effects/shine':                return <ShinePage />
    case '#/effects/glow':                 return <GlowPage />
    case '#/effects/marquee':              return <MarqueePage />
    case '#/effects/fade':                 return <FadePage />
    // Utilities
    case '#/utils/focus-utilities':
    case '#/utils/focus-directives':       return <FocusUtilitiesPage />
    case '#/utils/highlight':              return <HighlightPage />
    case '#/utils/code-preview':           return <CodePreviewUtilPage />
    // Core (data) — support both old and new routes
    case '#/data/data-source':
    case '#/core/data-source':                return <DataSourcePage />
    case '#/data/data-context':
    case '#/core/data-context':               return <DataContextPage />
    default:                                  return <ComingSoonPage />
  }
}

export default function App() {
  const hash = useHash()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [hash])

  return (
    <div className="docs-layout">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="docs-mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`docs-sidebar-wrap${mobileOpen ? ' mobile-open' : ''}`}>
        <DocsSidebar activeHash={hash} />
      </div>

      <main className="docs-main" id="main-content">
        {/* Mobile menu toggle */}
        <button
          className="docs-mobile-menu-btn"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="page-inner">
          {renderPage(hash)}
        </div>
      </main>
    </div>
  )
}
