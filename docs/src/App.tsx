import { useState, useEffect } from 'react'
import { DocsSidebar } from './components/Sidebar'
import { HomePage } from './pages/HomePage'
import { ColorsPage } from './pages/foundation/Colors'
import { TypographyPage } from './pages/foundation/Typography'
import { SpacingPage } from './pages/foundation/Spacing'
import { ShadowsPage } from './pages/foundation/Shadows'
import { IconographyPage } from './pages/foundation/Iconography'
import { ThemingPage } from './pages/foundation/Theming'
import { MotionPage } from './pages/foundation/Motion'
import { VoiceAndTonePage } from './pages/foundation/VoiceAndTone'
import { ButtonPage } from './pages/components/ButtonPage'
import { BadgePage } from './pages/components/BadgePage'
import { CheckboxPage } from './pages/components/CheckboxPage'
import { RadioPage } from './pages/components/RadioPage'
import { AlertPage } from './pages/components/AlertPage'
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
import { CommandPalettePage } from './pages/components/CommandPalettePage'
import { ButtonGroupPage } from './pages/components/ButtonGroupPage'
import { SliderRangePage } from './pages/components/SliderRangePage'
import { ScrollbarPage } from './pages/components/ScrollbarPage'
import { GridPage } from './pages/components/GridPage'
import { SelectPage } from './pages/components/SelectPage'
import { ComboboxPage } from './pages/components/ComboboxPage'
import { GridComboboxPage } from './pages/components/GridComboboxPage'
import { DatagridPage } from './pages/components/DatagridPage'
import { GanttPage } from './pages/components/GanttPage'
import { SchedulerPage } from './pages/components/SchedulerPage'
import { KanbanPage } from './pages/components/KanbanPage'
import { TreePage } from './pages/components/TreePage'
import { InplaceEditorPage } from './pages/components/InplaceEditorPage'
import { AppHeaderPage } from './pages/components/AppHeaderPage'
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
import { AspectRatioPage } from './pages/components/AspectRatioPage'
import { CreditCardPage } from './pages/components/CreditCardPage'
import { BarcodeQrPage } from './pages/components/BarcodeQrPage'
import { GitGraphPage } from './pages/components/GitGraphPage'
import { FileUploadPage } from './pages/components/FileUploadPage'
import { EditorPage } from './pages/components/EditorPage'
import { ChangelogPage } from './pages/ChangelogPage'
import { DevelopmentPage } from './pages/DevelopmentPage'
import { ComingSoonPage } from './pages/ComingSoonPage'

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
    case '#/foundation/motion':         return <MotionPage />
    case '#/foundation/voice-and-tone': return <VoiceAndTonePage />
    case '#/components/button':         return <ButtonPage />
    case '#/components/badge':          return <BadgePage />
    case '#/components/checkbox':       return <CheckboxPage />
    case '#/components/radio':          return <RadioPage />
    case '#/components/alert':          return <AlertPage />
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
    case '#/components/command-palette':     return <CommandPalettePage />
    case '#/components/button-group':        return <ButtonGroupPage />
    case '#/components/slider':
    case '#/components/range':
    case '#/components/slider-range':        return <SliderRangePage />
    case '#/components/scrollbar':
    case '#/utils/scrollbar':                return <ScrollbarPage />
    case '#/components/grid':
    case '#/layout/grid':                    return <GridPage />
    case '#/components/select':              return <SelectPage />
    case '#/components/combobox':            return <ComboboxPage />
    case '#/components/grid-combobox':       return <GridComboboxPage />
    case '#/components/datagrid':            return <DatagridPage />
    case '#/components/gantt':               return <GanttPage />
    case '#/components/scheduler':           return <SchedulerPage />
    case '#/components/kanban':              return <KanbanPage />
    case '#/components/tree':               return <TreePage />
    case '#/components/inplace-editor':     return <InplaceEditorPage />
    case '#/components/app-header':         return <AppHeaderPage />
    case '#/components/nav-menu':           return <NavMenuPage />
    case '#/components/pager':              return <PagerPage />
    case '#/components/fab':                return <FabPage />
    case '#/components/panel':              return <PanelPage />
    case '#/components/coachmark':          return <CoachmarkPage />
    case '#/components/message-bar':        return <MessageBarPage />
    case '#/components/mention':            return <MentionPage />
    case '#/components/filter-expression':  return <FilterExpressionPage />
    case '#/components/list':               return <ListPage />
    case '#/components/terminal':           return <TerminalPage />
    case '#/components/rating':             return <RatingPage />
    case '#/components/carousel':           return <CarouselPage />
    case '#/components/lightbox':           return <LightboxPage />
    case '#/components/image-compare':      return <ImageComparePage />
    case '#/components/aspect-ratio':       return <AspectRatioPage />
    case '#/components/credit-card':        return <CreditCardPage />
    case '#/components/barcode-qr':         return <BarcodeQrPage />
    case '#/components/git-graph':          return <GitGraphPage />
    case '#/components/file-upload':        return <FileUploadPage />
    case '#/components/editor':             return <EditorPage />
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
