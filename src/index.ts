// ─── Design Tokens ───────────────────────────────────────────────────────────
import './tokens/tokens.css';
import './tokens/motion-patterns.css';
import './chrome/chrome.css';
export * from './tokens/index.js';

// ─── Shared surface chrome ─────────────────────────────────────────────────
export type {
  Border,
  Chrome,
  Elevation,
  Radius,
  SpBorder,
  SpChrome,
  SpElevation,
  SpRadius,
  SurfaceChromeProps,
} from './chrome/chrome.js';
export { surfaceChromeClasses } from './chrome/chrome.js';

// ─── Root Provider ────────────────────────────────────────────────────────────
export { SpruceProvider } from './SpruceProvider.js';

// ─── Components ───────────────────────────────────────────────────────────────
export { Button } from './components/button/Button.js';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/button/Button.js';

export { Badge } from './components/badge/Badge.js';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/badge/Badge.js';

export { Checkbox } from './components/checkbox/Checkbox.js';
export type { CheckboxProps } from './components/checkbox/Checkbox.js';

export { RadioGroup, Radio } from './components/radio/Radio.js';
export type { RadioGroupProps, RadioProps } from './components/radio/Radio.js';

export { Alert } from './components/alert/Alert.js';
export type { AlertProps, AlertVariant, AlertSize } from './components/alert/Alert.js';

// ─── Decorative motifs ───────────────────────────────────────────────────────
export { useReducedMotion } from './effects/effect-utils.js';
export { Motif } from './components/motif/Motif.js';
export type {
  MotifProps,
  SpDecorativeBackground,
  SpMotifAppearanceOption,
  SpMotifPosition,
} from './components/motif/Motif.js';
export { MotifProvider, useMotifRegistry } from './components/motif/Motif.js';
export type { MotifProviderProps } from './components/motif/Motif.js';
export { resolveDecorativeBackground } from './components/motif/motif-utils.js';
export {
  CIRCLE_MOTIFS,
  DOT_MOTIFS,
  FRAME_MOTIFS,
  GEOMETRIC_MOTIFS,
  GRID_MOTIFS,
  LINE_MOTIFS,
  ORGANIC_MOTIFS,
  SP_BUILT_IN_MOTIFS,
  SP_BUILT_IN_MOTIF_NAMES,
} from './components/motif/motif-definitions.js';
export * from './components/motif/collections/index.js';
export type {
  SpBuiltInMotif,
  SpBuiltInMotifDefinition,
  SpMotifAppearance,
  SpMotifDefinition,
  SpMotifName,
} from './components/motif/motif-definitions.js';

export { Card, CardHeader, CardMedia, CardFooter } from './components/card/Card.js';
export type { CardProps, CardVariant, CardPadding, CardHeaderProps, CardMediaProps, CardFooterProps } from './components/card/Card.js';
export type { SpruceProviderProps } from './SpruceProvider.js';

// ─── Internationalization ───────────────────────────────────────────────────
export { SpruceI18nProvider, useI18n, useSpruceI18n, applyI18nToDocument } from './i18n/i18n-context.js';
export type {
  SpDirection,
  SpI18nConfig,
  SpI18nConfigInput,
  SpI18nLabelKey,
  SpI18nLabelParams,
  SpI18nLabels,
  SpI18nLocale,
  SpruceI18nContextValue,
  SpruceI18nProviderProps,
} from './i18n/index.js';
export {
  SP_I18N_DEFAULT_CONFIG,
  SP_I18N_DEFAULT_LABELS,
  SP_I18N_LOCALES,
  findSpruceLocale,
  SP_I18N_LABELS_AR,
  SP_I18N_LABELS_DE_DE,
  SP_I18N_LABELS_EN_GB,
  SP_I18N_LABELS_ES_ES,
  SP_I18N_LABELS_FIL_PH,
  SP_I18N_LABELS_FR_FR,
  SP_I18N_LABELS_HI_IN,
  SP_I18N_LABELS_IT_IT,
  SP_I18N_LABELS_JA_JP,
  SP_I18N_LABELS_KO_KR,
  SP_I18N_LABELS_NL_NL,
  SP_I18N_LABELS_PT_BR,
  SP_I18N_LABELS_ZH_CN,
  SP_I18N_LABELS_ZH_TW,
} from './i18n/index.js';

// ─── Tooltip ─────────────────────────────────────────────────────────────────
export { Tooltip, TooltipGroup } from './components/tooltip/Tooltip.js';
export type { TooltipProps, TooltipGroupProps } from './components/tooltip/Tooltip.js';

// ─── Popover ──────────────────────────────────────────────────────────────────
export { Popover } from './components/popover/Popover.js';
export type { PopoverProps, PopoverTriggerType } from './components/popover/Popover.js';

// ─── Dropdown ─────────────────────────────────────────────────────────────────
export { Dropdown } from './components/dropdown/Dropdown.js';
export type { DropdownProps, DropdownItem } from './components/dropdown/Dropdown.js';

// ─── Select ──────────────────────────────────────────────────────────────────
export { Select } from './components/select/Select.js';
export type { SelectProps, SelectOption, SelectSize, SelectSource } from './components/select/Select.js';

// ─── Avatar ───────────────────────────────────────────────────────────────────
export { Avatar } from './components/avatar/Avatar.js';
export type { AvatarProps, AvatarSize, AvatarShape, AvatarStatus } from './components/avatar/Avatar.js';

// ─── AvatarGroup ──────────────────────────────────────────────────────────────
export { AvatarGroup } from './components/avatar-group/AvatarGroup.js';
export type { AvatarGroupProps, AvatarGroupItem } from './components/avatar-group/AvatarGroup.js';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
export { Breadcrumbs, BreadcrumbItem } from './components/breadcrumb/Breadcrumb.js';
export type { BreadcrumbsProps, BreadcrumbItemProps, BreadcrumbItemDef } from './components/breadcrumb/Breadcrumb.js';

// ─── Accordion ────────────────────────────────────────────────────────────────
export { Accordion, AccordionItem } from './components/accordion/Accordion.js';
export type { AccordionProps, AccordionItemProps, AccordionVariant, AccordionSize, AccordionIndicator, AccordionIndicatorPosition, AccordionTriggerMode, AccordionToggleEvent, AccordionHandle } from './components/accordion/Accordion.js';

// ─── Code Editor ──────────────────────────────────────────────────────────────
export { CodeEditor } from './components/code-editor/CodeEditor.js';
export type {
  CodeEditorProps,
  CodeLanguage,
  CodeEditorHandle,
  CodeEditorStatus,
  CodeEditorTheme,
  CompletionContext,
  CompletionItem,
  HoverContext,
  HoverInfo,
  InlineSuggestion,
  InlineSuggestionContext,
  SignatureContext,
  SignatureHelp,
  SpCodeEditorDecoration,
  SpCodeEditorDiagnostic,
  SpCodeEditorToolbarAction,
  SpCodeEditorViewZone,
} from './components/code-editor/CodeEditor.js';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export { Sidebar } from './components/sidebar/Sidebar.js';
export type { SidebarProps } from './components/sidebar/Sidebar.js';
export { SidebarProvider, useSidebar } from './components/sidebar/SidebarContext.js';
export type { SidebarContextValue } from './components/sidebar/SidebarContext.js';
export { SidebarHeader } from './components/sidebar/SidebarHeader.js';
export { SidebarContent } from './components/sidebar/SidebarContent.js';
export { SidebarFooter } from './components/sidebar/SidebarFooter.js';
export { SidebarGroup } from './components/sidebar/SidebarGroup.js';
export { SidebarGroupLabel } from './components/sidebar/SidebarGroupLabel.js';
export { SidebarItem } from './components/sidebar/SidebarItem.js';
export type { SidebarItemProps } from './components/sidebar/SidebarItem.js';
export { SidebarMenu, SidebarMenuGroup } from './components/sidebar/SidebarMenu.js';
export { SidebarSeparator } from './components/sidebar/SidebarSeparator.js';
export { SidebarPopoverItem } from './components/sidebar/SidebarPopoverItem.js';
export type { SidebarPopoverItemProps } from './components/sidebar/SidebarPopoverItem.js';
export { SidebarAccountSwitcher } from './components/sidebar/SidebarAccountSwitcher.js';
export type { SidebarAccountSwitcherProps, SidebarMenuItem } from './components/sidebar/SidebarAccountSwitcher.js';
export { SidebarWorkspaceSwitcher } from './components/sidebar/SidebarWorkspaceSwitcher.js';
export type { SidebarWorkspaceSwitcherProps, WorkspaceOption } from './components/sidebar/SidebarWorkspaceSwitcher.js';
export { SidebarNewsletterSubscribeForm } from './components/sidebar/SidebarNewsletterSubscribeForm.js';
export type { SidebarNewsletterSubscribeFormProps } from './components/sidebar/SidebarNewsletterSubscribeForm.js';

// ─── AppShell ─────────────────────────────────────────────────────────────────
export { AppShell, AppShellHamburger } from './components/app-shell/AppShell.js';
export type { AppShellProps, AppShellHamburgerProps } from './components/app-shell/AppShell.js';

// ─── Theme ────────────────────────────────────────────────────────────────────
export { ThemeProvider, useTheme } from './theme/theme-context.js';
export type { AccentHarmony, ThemeContextValue, ThemeProviderProps } from './theme/theme-context.js';
export { applyThemeToDocument } from './theme/theme-dom.js';
// Re-export theme types and presets from existing theme module
export type { SpruceTheme, ThemePreference } from './theme/types.js';
export * from './theme/index.js';

// ─── Icons: Component & Registry ─────────────────────────────────────────────
export { Icon } from './icons/Icon.js';
export type { IconProps } from './icons/Icon.js';
export { IconRegistryProvider, useIconRegistry, useIcons } from './icons/icon-registry.js';

// ─── Icons: Collections ───────────────────────────────────────────────────────
export { ALL_DEFAULT_ICONS, DEFAULT_ICONS } from './icons/default-icons.js';
export type { IconDefinition } from './icons/collections/icon-definition.js';
export { iconSet } from './icons/collections/icon-definition.js';
export * from './icons/collections/navigation.js';
export * from './icons/collections/action.js';
export * from './icons/collections/status.js';
export * from './icons/collections/social.js';
export * from './icons/collections/content.js';
export * from './icons/collections/editor.js';
export * from './icons/collections/layout.js';
export * from './icons/collections/data.js';
export * from './icons/collections/development.js';
export * from './icons/collections/general.js';
export * from './icons/collections/duotone.js';
export { FLAG_ICONS } from './icons/collections/flags.js';

// ─── Kbd ──────────────────────────────────────────────────────────────────────
export { Kbd } from './components/kbd/Kbd.js';
export type { KbdProps, KbdSize } from './components/kbd/Kbd.js';

// ─── ProgressBar ──────────────────────────────────────────────────────────────
export { ProgressBar } from './components/progress-bar/ProgressBar.js';
export type { ProgressBarProps, ProgressBarVariant, ProgressBarSize, ProgressSegmentShape } from './components/progress-bar/ProgressBar.js';

// ─── Spinner ──────────────────────────────────────────────────────────────────
export { Spinner } from './components/spinner/Spinner.js';
export type { SpinnerProps, SpinnerSize, SpinnerVariant, SpinnerColorVariant } from './components/spinner/Spinner.js';

// ─── CircularProgress ────────────────────────────────────────────────────────
export { CircularProgress } from './components/circular-progress/CircularProgress.js';
export type {
  CircularProgressProps,
  CircularProgressVariant,
  CircularProgressSize,
} from './components/circular-progress/CircularProgress.js';

// ─── StatCard ─────────────────────────────────────────────────────────────────
export { StatCard, StatGroup, StatDivider } from './components/stat-card/StatCard.js';
export type { StatCardProps, StatCardVariant, StatCardTrend, StatCardIconColor, StatCardChartFit, StatGroupProps, StatGroupVariant, StatDividerProps } from './components/stat-card/StatCard.js';

// ─── Empty ────────────────────────────────────────────────────────────────────
export { Empty } from './components/empty/Empty.js';
export type { EmptyProps, EmptySize } from './components/empty/Empty.js';

// ─── Timeline ─────────────────────────────────────────────────────────────────
export { Timeline, TimelineItem } from './components/timeline/Timeline.js';
export type { TimelineProps, TimelineItemProps, TimelineItemColor } from './components/timeline/Timeline.js';

// ─── Switch ───────────────────────────────────────────────────────────────────
export { Switch } from './components/switch/Switch.js';
export type { SwitchProps } from './components/switch/Switch.js';

// ─── Input ────────────────────────────────────────────────────────────────────
export { Input } from './components/input/Input.js';
export type { InputProps, InputType, InputSize, InputVariant } from './components/input/Input.js';

// ─── Textarea ─────────────────────────────────────────────────────────────────
export { Textarea } from './components/textarea/Textarea.js';
export type { TextareaProps, TextareaSize, TextareaResize, TextareaVariant } from './components/textarea/Textarea.js';

// ─── Form Foundation ─────────────────────────────────────────────────────────
export { Field } from './components/field/Field.js';
export type {
  FieldProps,
  FieldLayout,
  FormBorder,
  FormChrome,
  FormRadius,
  FormValidationError,
  FormControlContractProps,
} from './components/field/Field.js';
export { useFormFieldContext } from './components/field/FormFieldContext.js';
export type { FormFieldContextValue } from './components/field/FormFieldContext.js';
export { FormLayout } from './components/form-layout/FormLayout.js';
export type {
  FormLayoutProps,
  FormLayoutMode,
  FormLayoutGap,
  FormLayoutColumns,
} from './components/form-layout/FormLayout.js';
export { useFormLayoutContext } from './components/form-layout/FormLayoutContext.js';
export type { FormLayoutContextValue } from './components/form-layout/FormLayoutContext.js';
export {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupActions,
  InputGroupSpacer,
  InputGroupButton,
} from './components/input-group/InputGroup.js';
export type {
  InputGroupProps,
  InputGroupInputProps,
  InputGroupAddonProps,
  InputGroupActionsProps,
  InputGroupSpacerProps,
  InputGroupButtonProps,
  InputGroupSize,
  InputGroupLayout,
  InputGroupButtonVariant,
} from './components/input-group/InputGroup.js';

// ─── PasswordInput ────────────────────────────────────────────────────────────
export { PasswordInput } from './components/password-input/PasswordInput.js';
export type { PasswordInputProps, PasswordInputSize } from './components/password-input/PasswordInput.js';

// ─── PasswordProgress ─────────────────────────────────────────────────────────
export { PasswordProgress } from './components/password-progress/PasswordProgress.js';
export type { PasswordProgressProps, PasswordStrength } from './components/password-progress/PasswordProgress.js';

// ─── Missing form primitives ─────────────────────────────────────────────────
export { ColorPicker } from './components/color-picker/ColorPicker.js';
export type { ColorPickerColor, ColorPickerHandle, ColorPickerProps } from './components/color-picker/ColorPicker.js';
export { EmojiPicker } from './components/emoji-picker/EmojiPicker.js';
export type { EmojiPickerEmoji, EmojiPickerHandle, EmojiPickerProps } from './components/emoji-picker/EmojiPicker.js';
export { FormBuilder } from './components/form-builder/FormBuilder.js';
export type {
  FormBuilderField,
  FormBuilderFieldType,
  FormBuilderGridColumn,
  FormBuilderHandle,
  FormBuilderMode,
  FormBuilderOption,
  FormBuilderProps,
  FormBuilderSchema,
  FormBuilderSection,
  FormBuilderSubmitEvent,
  FormBuilderTab,
} from './components/form-builder/FormBuilder.js';
export {
  FormBuilderDataContextAdapter,
  createFormBuilderDataContextAdapter,
  useFormBuilderDataContextAdapter,
} from './components/form-builder/FormBuilderDataContextAdapter.js';
export type { FormBuilderDataContextAdapterOptions } from './components/form-builder/FormBuilderDataContextAdapter.js';

// ─── OtpInput ─────────────────────────────────────────────────────────────────
export { OtpInput } from './components/otp-input/OtpInput.js';
export type { OtpInputProps, OtpInputSize } from './components/otp-input/OtpInput.js';

// ─── MaskedInput ──────────────────────────────────────────────────────────────
export { MaskedInput } from './components/masked-input/MaskedInput.js';
export type { MaskedInputProps, MaskedInputSize } from './components/masked-input/MaskedInput.js';

// ─── Calendar ─────────────────────────────────────────────────────────────────
export { Calendar } from './components/calendar/Calendar.js';
export type { CalendarProps, DateFilter } from './components/calendar/Calendar.js';
export type { DateControlContractProps, DateControlVariant } from './components/date-control/date-control-contract.js';

// ─── DatePicker ───────────────────────────────────────────────────────────────
export { DatePicker } from './components/date-picker/DatePicker.js';
export type { DatePickerProps, DatePickerSize } from './components/date-picker/DatePicker.js';

// ─── TimePicker ───────────────────────────────────────────────────────────────
export { TimePicker } from './components/time-picker/TimePicker.js';
export type { TimePickerProps, TimePickerSize } from './components/time-picker/TimePicker.js';

// ─── DateTimePicker ───────────────────────────────────────────────────────────
export { DateTimePicker } from './components/datetime-picker/DateTimePicker.js';
export type { DateTimePickerProps, DateTimePickerSize } from './components/datetime-picker/DateTimePicker.js';

// ─── RangeCalendar ────────────────────────────────────────────────────────────
export { RangeCalendar } from './components/range-calendar/RangeCalendar.js';
export type { RangeCalendarProps, DateRange, DateRangePreset } from './components/range-calendar/RangeCalendar.js';

// ─── DateRangePicker ──────────────────────────────────────────────────────────
export { DateRangePicker } from './components/date-range-picker/DateRangePicker.js';
export type { DateRangePickerProps } from './components/date-range-picker/DateRangePicker.js';

// ─── Stepper ─────────────────────────────────────────────────────────────────
export { Stepper } from './components/stepper/Stepper.js';
export type { StepperProps, StepItem } from './components/stepper/Stepper.js';

// ─── Tabs ────────────────────────────────────────────────────────────────────
export { Tabs } from './components/tabs/Tabs.js';
export type { TabsProps, TabItem, TabHeaderRenderProps, TabContextMenuEvent, TabReorderEvent, TabsToolbarPlacement } from './components/tabs/Tabs.js';

// ─── SplitButton ─────────────────────────────────────────────────────────────
export { SplitButton } from './components/split-button/SplitButton.js';
export type { SplitButtonProps, SplitButtonItem, SplitButtonVariant, SplitButtonSize } from './components/split-button/SplitButton.js';

// ─── SegmentedControl ────────────────────────────────────────────────────────
export { SegmentedControl } from './components/segmented-control/SegmentedControl.js';
export type { SegmentedControlProps, SegmentedOption, SegmentedSize } from './components/segmented-control/SegmentedControl.js';

// ─── Overflow ────────────────────────────────────────────────────────────────
export { Overflow, OverflowItem } from './components/overflow/Overflow.js';
export { computeOverflowHidden } from './components/overflow/Overflow.js';
export type { OverflowProps, OverflowItemProps, OverflowChangeEvent, OverflowHandle, OverflowItemMeasurement } from './components/overflow/Overflow.js';

// ─── Toolbar ─────────────────────────────────────────────────────────────────
export { Toolbar, ToolbarButton, ToolbarGroup, ToolbarDivider, ToolbarSpacer } from './components/toolbar/Toolbar.js';
export type { ToolbarProps, ToolbarButtonItem, ToolbarSize, ToolbarButtonProps, ToolbarGroupProps, ToolbarButtonPresentation, ToolbarChrome, ToolbarRadius, ToolbarOverflowEvent } from './components/toolbar/Toolbar.js';

// ─── Splitter ────────────────────────────────────────────────────────────────
export { Splitter, SplitterPane } from './components/splitter/Splitter.js';
export type { SplitterProps, SplitterPaneProps } from './components/splitter/Splitter.js';

// ─── Drawer ──────────────────────────────────────────────────────────────────
export { Drawer } from './components/drawer/Drawer.js';
export type { DrawerProps, DrawerPosition, DrawerSize } from './components/drawer/Drawer.js';

// ─── Modal ───────────────────────────────────────────────────────────────────
export { Modal } from './components/modal/Modal.js';
export type { ModalProps, ModalSize, ModalRegionBackground } from './components/modal/Modal.js';

// ─── Window ──────────────────────────────────────────────────────────────────
export { Window } from './components/window/Window.js';
export type { WindowProps, WindowSize } from './components/window/Window.js';

// ─── Toast ───────────────────────────────────────────────────────────────────
export { ToastProvider, useToast } from './components/toast/Toast.js';
export type { ToastConfig, ToastVariant, ToastPosition, ToastStackMode, ToastContextValue } from './components/toast/Toast.js';

// ─── Snackbar ────────────────────────────────────────────────────────────────
export { SnackbarProvider, useSnackbar } from './components/snackbar/Snackbar.js';
export type { SnackbarConfig, SnackbarContextValue } from './components/snackbar/Snackbar.js';

// ─── NotificationCenter ──────────────────────────────────────────────────────
export { NotificationCenter } from './components/notification-center/NotificationCenter.js';
export type {
  NotificationCenterProps,
  NotificationSeverity,
  NotificationCenterVariant,
  NotificationCenterTone,
  NotificationCenterPosition,
  NotificationCenterDensity,
  NotificationToolbarButton,
  NotificationAction,
  NotificationItem,
  NotificationActionEvent,
  NotificationToolbarEvent,
} from './components/notification-center/NotificationCenter.js';

// ─── CommandPalette ──────────────────────────────────────────────────────────
export { CommandPalette } from './components/command-palette/CommandPalette.js';
export type { CommandPaletteProps, CommandPaletteItem } from './components/command-palette/CommandPalette.js';

// ─── ButtonGroup ─────────────────────────────────────────────────────────────
export { ButtonGroup, ButtonGroupButton, ButtonGroupItemIcon } from './components/button-group/ButtonGroup.js';
export type { ButtonGroupProps, ButtonGroupItem, ButtonGroupOrientation, ButtonGroupToggleMode, ButtonGroupVariant, ButtonGroupSize, ButtonGroupButtonProps } from './components/button-group/ButtonGroup.js';

// ─── Slider ──────────────────────────────────────────────────────────────────
export { Slider } from './components/slider/Slider.js';
export type { SliderProps } from './components/slider/Slider.js';

// ─── Range ───────────────────────────────────────────────────────────────────
export { Range } from './components/range/Range.js';
export type { RangeProps, RangeValue } from './components/range/Range.js';

// ─── Scrollbar ───────────────────────────────────────────────────────────────
export { Scrollbar } from './components/scrollbar/Scrollbar.js';
export type { ScrollbarProps, ScrollbarThickness } from './components/scrollbar/Scrollbar.js';

// ─── Grid (Layout) ───────────────────────────────────────────────────────────
export { Container, Row, Col } from './components/grid/Grid.js';
export type { ContainerProps, RowProps, ColProps } from './components/grid/Grid.js';
export { LayoutManager, LayoutDragHandle } from './components/layout-manager/LayoutManager.js';
export type { LayoutManagerProps, LayoutManagerHandle, LayoutDragHandleProps, LayoutItem, LayoutBreakpoint, LayoutChangeEvent, LayoutDragEvent, LayoutResizeEvent, LayoutCompactType, LayoutResizeHandle } from './components/layout-manager/LayoutManager.js';
export { Masonry, MasonryItem } from './components/masonry/Masonry.js';
export type { MasonryProps, MasonryItemProps, MasonryItemLayout } from './components/masonry/Masonry.js';
export { DockManager, DockPanel, DockPanelTools, AutoHideStrip, calculateSplitResize, findSplitIntersections } from './components/dock-manager/DockManager.js';
export type { DockManagerProps, DockManagerHandle, DockPanelProps, DockPanelToolsProps, AutoHideStripProps, AutoHideStripTab, DockLayout, DockNode, DockLeafNode, DockTabNode, DockDocumentNode, DockSplitNode, DockFloat, DockAutoHide, DockSplitDirection, DropZone, AutoHideStripPosition, DockCornerSplitRef, DockCornerJunction } from './components/dock-manager/DockManager.js';
export { DragDrop } from './components/drag-drop/DragDrop.js';
export type { DragDropProps, DragDropEvent, DragDropEffect, DragDropEffectAllowed, DragDropPosition, DragDropAxis } from './components/drag-drop/DragDrop.js';
export { Fullscreen } from './components/fullscreen/Fullscreen.js';
export type { FullscreenProps, FullscreenHandle, FullscreenMode } from './components/fullscreen/Fullscreen.js';
export { HideOnScroll, useHideOnScroll } from './components/hide-on-scroll/HideOnScroll.js';
export type { HideOnScrollProps, HideOnScrollOptions, HideOnScrollResult } from './components/hide-on-scroll/HideOnScroll.js';

// ─── Combobox ────────────────────────────────────────────────────────────────
export { Combobox } from './components/combobox/Combobox.js';
export type { ComboboxProps, ComboboxOption, ComboboxSource } from './components/combobox/Combobox.js';

// ─── GridCombobox ────────────────────────────────────────────────────────────
export { GridCombobox } from './components/grid-combobox/GridCombobox.js';
export type { GridComboboxProps, GridComboboxBaseProps, GridComboboxSingleProps, GridComboboxMultipleProps, GridComboboxColumn, GridComboboxOption, GridComboboxSource, GridComboboxVariant } from './components/grid-combobox/GridCombobox.js';

// ─── Lookup contracts ───────────────────────────────────────────────────────
export type { LookupOption, LookupColumn, LookupRenderContext, LookupSource, LookupRenderer } from './components/lookup/lookup-types.js';

// ─── Datagrid ─────────────────────────────────────────────────────────────
export {
  Datagrid,
  DatagridCellTemplate,
  DatagridCellEditor,
  DatagridRowDetail,
  DatagridDetailPane,
  DatagridLeadingRowActions,
  DatagridRowTemplate,
  DatagridDataContextAdapter,
  createDatagridDataContextAdapter,
} from './components/datagrid/Datagrid.js';
export type {
  DatagridProps,
  DatagridHandle,
  DatagridCellTemplateProps,
  DatagridCellEditorProps,
  DatagridRowDetailProps,
  DatagridDetailPaneProps,
  DatagridLeadingRowActionsProps,
  DatagridRowTemplateProps,
} from './components/datagrid/Datagrid.js';
export type {
  DatagridAggregate,
  DatagridAggregateContext,
  DatagridAggregateValueContext,
  DatagridBuiltInAggregate,
  DatagridCellContext,
  DatagridCellEvent,
  DatagridCellClassName,
  DatagridCellStyle,
  DatagridCellEditorContext,
  DatagridCellTemplateContext,
  DatagridChoiceOption,
  DatagridColumn,
  DatagridColumnFilter,
  DatagridColumnGroup,
  DatagridColumnGroupOrderChange,
  DatagridColumnGroupResize,
  DatagridColumnMenuItem,
  DatagridColumnOrderChange,
  DatagridColumnPin,
  DatagridColumnResize,
  DatagridColumnVisibilityChange,
  DatagridCustomAggregate,
  DatagridDataContext,
  DatagridDataContextOptions,
  DatagridDataContextStateDisplay,
  DatagridDetailPaneContext,
  DatagridDynamicFilterCondition,
  DatagridDynamicFilterOperator,
  DatagridEditCancel,
  DatagridEditDecision,
  DatagridEditLabels,
  DatagridEditMode,
  DatagridEditorOptions,
  DatagridEditorType,
  DatagridFilterChange,
  DatagridFilterDataType,
  DatagridFilterIndicatorVisibility,
  DatagridFilterMode,
  DatagridFilterPanelConfig,
  DatagridFilterVariant,
  DatagridGroupBy,
  DatagridGroupSort,
  DatagridGroupSortDirection,
  DatagridHeaderTextCase,
  DatagridLeadingRowActionsContext,
  DatagridNewRowCommit,
  DatagridNewRowCommitMode,
  DatagridNewRowFactory,
  DatagridNewRowPosition,
  DatagridPageChange,
  DatagridPaginationType,
  DatagridRecordState,
  DatagridReorderMode,
  DatagridResizeMode,
  DatagridRowEvent,
  DatagridRowClassName,
  DatagridRowDetailContext,
  DatagridRowDetailExpandable,
  DatagridRowEditCommit,
  DatagridRowLabel,
  DatagridRowOrderChange,
  DatagridRowSpanContext,
  DatagridRowStyle,
  DatagridRowTemplateContext,
  DatagridSelectionChange,
  DatagridSelectionControl,
  DatagridSelectionMode,
  DatagridDensity,
  DatagridLoadingMode,
  DatagridNestedGridConfig,
  DatagridNestedGridProps,
  DatagridSort,
  DatagridSortChange,
  DatagridSortDirection,
  DatagridSortIndicatorVisibility,
  DatagridSortMode,
  DatagridSortsChange,
  DatagridTrackBy,
  DatagridTrackedRecord,
  DatagridValidationError,
  DatagridValidationEvent,
  DatagridValidationRules,
  DatagridValidator,
  DatagridValidatorFn,
  DatagridValidatorRule,
  DatagridVirtualPageDirection,
  DatagridVirtualPageRequest,
  DatagridVirtualPageTrigger,
} from './components/datagrid/datagrid-types.js';

// ─── Gantt Chart ─────────────────────────────────────────────────────────────
export { GanttChart } from './components/gantt-chart/GanttChart.js';
export type { GanttChartProps } from './components/gantt-chart/GanttChart.js';
export type {
  GanttTask,
  GanttMilestone,
  GanttDependency,
  GanttResource,
  GanttConfig,
  GanttCommand,
  OverlapPeriod,
  GanttTimeScale,
  GanttDependencyType,
  TaskClickEvent,
  TaskMoveEvent,
  TaskResizeEvent,
  MilestoneClickEvent,
  DependencyClickEvent,
  SlotClickEvent as GanttSlotClickEvent,
  GanttFlatRow,
  GanttTimeSlot,
  GanttPrimarySlot,
} from './components/gantt-chart/gantt-types.js';
export { GANTT_DEFAULT_CONFIG } from './components/gantt-chart/gantt-types.js';
export { GanttUndoRedo, GanttVirtualScroll, computeCriticalPath, detectOverallocations } from './components/gantt-chart/gantt-services.js';

// ─── Scheduler ───────────────────────────────────────────────────────────────
export { Scheduler } from './components/scheduler/Scheduler.js';
export type { SchedulerProps } from './components/scheduler/Scheduler.js';
export type {
  SchedulerEvent,
  SchedulerResource,
  SchedulerCalendar,
  SchedulerCalendarId,
  SchedulerCalendarControls,
  SchedulerDayGlyph,
  SchedulerDayGlyphConfig,
  SchedulerDayGlyphResolver,
  SchedulerDateRestriction,
  SchedulerUnavailableHourRange,
  SchedulerRecurrence,
  SchedulerRecurrenceRule,
  SchedulerRecurrenceFrequency,
  SchedulerRecurrenceWeekday,
  SchedulerTimeScale,
  SchedulerTimelineScale,
  SchedulerWeekNumberRule,
  SchedulerView,
  SchedulerSlot,
  EventClickEvent,
  SlotClickEvent as SchedulerSlotClickEvent,
  EventMoveEvent,
  EventResizeEvent,
  PositionedEvent,
  DateRange as SchedulerDateRange,
} from './components/scheduler/scheduler-types.js';
export {
  getWeekNumber,
  hasEventConflict,
  isAllDayOrLongDuration,
  isDateRestricted,
  isHourUnavailable,
  resolveDayGlyphs,
  expandRecurringEvents,
} from './components/scheduler/scheduler-utils.js';

// ─── Kanban ──────────────────────────────────────────────────────────────────
export { Kanban } from './components/kanban/Kanban.js';
export type {
  KanbanProps,
  KanbanCard,
  KanbanColumn,
  KanbanCardMoveEvent,
  KanbanColumnMoveEvent,
} from './components/kanban/Kanban.js';

// ─── Tree ────────────────────────────────────────────────────────────────────
export { Tree } from './components/tree/Tree.js';
export type { TreeProps, TreeNode } from './components/tree/Tree.js';

// ─── InplaceEditor ───────────────────────────────────────────────────────────
export { InplaceEditor } from './components/inplace-editor/InplaceEditor.js';
export type { InplaceEditorProps, InplaceEditorSize, InplaceEditorType, InplaceEditorValue } from './components/inplace-editor/InplaceEditor.js';

// ─── Panel ───────────────────────────────────────────────────────────────────
export { Panel } from './components/panel/Panel.js';
export type { PanelProps, PanelVariant, PanelPadding } from './components/panel/Panel.js';

// ─── MessageBar ──────────────────────────────────────────────────────────────
export { MessageBar } from './components/message-bar/MessageBar.js';
export type { MessageBarProps, MessageBarVariant, MessageBarAction } from './components/message-bar/MessageBar.js';

// ─── Pager ───────────────────────────────────────────────────────────────────
export { Pager } from './components/pager/Pager.js';
export type { PagerProps, PagerSize, PagerVariant, PagerState } from './components/pager/Pager.js';

// ─── FAB ─────────────────────────────────────────────────────────────────────
export { Fab } from './components/fab/Fab.js';
export type { FabProps, FabVariant, FabSize, FabPosition, FabAction } from './components/fab/Fab.js';

// ─── AppHeader ───────────────────────────────────────────────────────────────
export { AppHeader } from './components/app-header/AppHeader.js';
export type { AppHeaderProps } from './components/app-header/AppHeader.js';

// ─── NavMenu ─────────────────────────────────────────────────────────────────
export { NavMenu, NavMenuItem, NavMenuContent, NavMenuLink } from './components/nav-menu/NavMenu.js';
export type { NavMenuProps, NavMenuItem as NavMenuItemData, NavMenuLink as NavMenuLinkData, NavMenuItemComponentProps, NavMenuContentProps, NavMenuLinkProps } from './components/nav-menu/NavMenu.js';

// ─── Coachmark ───────────────────────────────────────────────────────────────
export { Coachmark } from './components/coachmark/Coachmark.js';
export type { CoachmarkProps, CoachmarkStep } from './components/coachmark/Coachmark.js';

// ─── Mention ─────────────────────────────────────────────────────────────────
export { Mention } from './components/mention/Mention.js';
export type { MentionProps, MentionItem, MentionInsertEvent, MentionTrigger } from './components/mention/Mention.js';

// ─── P1 productivity surfaces ───────────────────────────────────────────────
export { Table } from './components/table/Table.js';
export type {
  TableProps,
  TableColumn,
  TableSort,
  TableSortDirection,
  TableDensity,
  TableCellAlign,
  SpTableProps,
  SpTableColumn,
  SpTableDensity,
  SpTableCellAlign,
} from './components/table/Table.js';
export { ComposeBar } from './components/compose-bar/ComposeBar.js';
export type { ComposeBarProps, ComposeBarSize, ComposeBarShape, SpComposeBarProps, SpComposeBarSize, SpComposeBarShape } from './components/compose-bar/ComposeBar.js';
export { CommentThread, formatRelativeTime, renderCommentBody, DEFAULT_REACTION_PALETTE } from './components/comment-thread/CommentThread.js';
export type {
  Comment,
  CommentAuthor,
  CommentReaction,
  CommentSubmitEvent,
  ReactionToggleEvent,
  CommentThreadProps,
  SpComment,
  SpCommentAuthor,
  SpCommentReaction,
  SpCommentSubmitEvent,
  SpReactionToggleEvent,
  SpCommentThreadProps,
} from './components/comment-thread/CommentThread.js';
export { PropertyPanel } from './components/property-panel/PropertyPanel.js';
export type {
  PropertyPanelProps,
  PropertyPanelMode,
  PropertyPanelValue,
  PropertyPanelEditor,
  PropertyPanelOption,
  PropertyPanelCompoundField,
  PropertyPanelProperty,
  PropertyPanelValues,
  PropertyPanelCollapsedGroups,
  PropertyPanelChange,
  SpPropertyPanelProps,
  SpPropertyPanelMode,
  SpPropertyPanelValue,
  SpPropertyPanelEditor,
  SpPropertyPanelOption,
  SpPropertyPanelCompoundField,
  SpPropertyPanelProperty,
  SpPropertyPanelValues,
  SpPropertyPanelCollapsedGroups,
  SpPropertyPanelChange,
} from './components/property-panel/PropertyPanel.js';
export { PdfViewer } from './components/pdf-viewer/PdfViewer.js';
export type { PdfViewerProps, SpPdfViewerProps } from './components/pdf-viewer/PdfViewer.js';
export { TextDiff, diffText } from './components/text-diff/TextDiff.js';
export type {
  TextDiffProps,
  TextDiffGranularity,
  TextDiffAppearance,
  TextDiffDeletionStyle,
  TextDiffInsertionStyle,
  TextDiffSegment,
  SpTextDiffProps,
} from './components/text-diff/TextDiff.js';
export {
  EntitlementsProvider,
  useEntitlements,
  useHasFeature,
  FeatureGate,
  FeatureLocked,
  SP_ENTITLEMENTS_URL,
} from './components/entitlements/Entitlements.js';
export type {
  EntitlementFeature,
  EntitlementsResponse,
  EntitlementsSnapshot,
  EntitlementsFetcher,
  EntitlementsContextValue,
  EntitlementsProviderProps,
  FeatureGateProps,
  FeatureLockedProps,
  SpEntitlementFeature,
  SpEntitlementsProviderProps,
  SpFeatureGateProps,
  SpFeatureLockedProps,
} from './components/entitlements/Entitlements.js';

// ─── List ────────────────────────────────────────────────────────────────────
export { List, ListItem, ListItemLine } from './components/list/List.js';
export type { ListProps, ListItemProps, ListItemLineProps, ListSize, ListVariant } from './components/list/List.js';

// ─── Terminal ────────────────────────────────────────────────────────────────
export { Terminal, useTerminal } from './components/terminal/Terminal.js';
export type { TerminalProps, TerminalEntry, TerminalLogLevel } from './components/terminal/Terminal.js';

// ─── Rating ──────────────────────────────────────────────────────────────────
export { Rating } from './components/rating/Rating.js';
export type { RatingProps, RatingSize, RatingShape } from './components/rating/Rating.js';

// ─── Carousel ────────────────────────────────────────────────────────────────
export { Carousel } from './components/carousel/Carousel.js';
export type { CarouselProps, CarouselIndicator } from './components/carousel/Carousel.js';

// ─── Lightbox ────────────────────────────────────────────────────────────────
export { Lightbox } from './components/lightbox/Lightbox.js';
export type { LightboxProps, LightboxImage } from './components/lightbox/Lightbox.js';

// ─── ImageCompare ────────────────────────────────────────────────────────────
export { ImageCompare } from './components/image-compare/ImageCompare.js';
export type { ImageCompareProps, ImageCompareOrientation } from './components/image-compare/ImageCompare.js';

// ─── ImageEditor ─────────────────────────────────────────────────────────────
export { ImageEditor } from './components/image-editor/ImageEditor.js';
export type {
  ImageEditorProps,
  ImageEditorTool,
  ImageEditorAspect,
  ImageEditorOutputFormat,
  ImageEditorSelectionShape,
  ImageEditorAnnotationKind,
  ImageEditorAdjustmentId,
  ImageEditorPoint,
  ImageEditorAdjustments,
  ImageEditorSelection,
  ImageEditorAnnotation,
  ImageEditorChange,
} from './components/image-editor/ImageEditor.js';

// ─── AspectRatio ─────────────────────────────────────────────────────────────
export { AspectRatio } from './components/aspect-ratio/AspectRatio.js';
export type { AspectRatioProps } from './components/aspect-ratio/AspectRatio.js';

// ─── CreditCard ──────────────────────────────────────────────────────────────
export { CreditCard } from './components/credit-card/CreditCard.js';
export type { CreditCardProps, CardColor } from './components/credit-card/CreditCard.js';

// ─── Barcode & QR Code ──────────────────────────────────────────────────────
export { Barcode, QrCode } from './components/barcode/Barcode.js';
export type { BarcodeProps, QrCodeProps, BarcodeFormat, QrCodeEcLevel } from './components/barcode/Barcode.js';

// ─── GitGraph ────────────────────────────────────────────────────────────────
export { GitGraph } from './components/git-graph/GitGraph.js';
export type { GitGraphProps, GitGraphCommit, GitGraphBranch } from './components/git-graph/GitGraph.js';

// ─── FilterExpression ────────────────────────────────────────────────────────
export { FilterExpression } from './components/filter-expression/FilterExpression.js';
export {
  DEFAULT_FILTER_OPERATORS,
  TEXT_OPERATORS,
  NUMBER_OPERATORS,
  DATE_OPERATORS,
  BOOLEAN_OPERATORS,
} from './components/filter-expression/FilterExpression.js';
export type {
  FilterExpressionProps,
  FilterField,
  FilterOperatorOption,
  FilterRule,
  FilterGroup,
  FilterExpressionType,
  FilterLogic,
  FieldType,
} from './components/filter-expression/FilterExpression.js';

// ─── FileUpload ──────────────────────────────────────────────────────────────
export { FileUpload } from './components/file-upload/FileUpload.js';
export type { FileUploadProps, FileUploadSize, UploadedFileItem } from './components/file-upload/FileUpload.js';

// ─── Editor ──────────────────────────────────────────────────────────────────
export { Editor } from './components/editor/Editor.js';
export type {
  EditorProps,
  EditorSize,
  MentionItem as EditorMentionItem,
  MentionTrigger as EditorMentionTrigger,
  MentionInsertEvent as EditorMentionInsertEvent,
} from './components/editor/Editor.js';

// ─── MarkdownEditor ──────────────────────────────────────────────────────────
export { MarkdownEditor } from './components/markdown-editor/MarkdownEditor.js';
export type { MarkdownEditorProps, MarkdownEditorMode, MarkdownEditorSize } from './components/markdown-editor/MarkdownEditor.js';

// ─── BlockEditor ─────────────────────────────────────────────────────────────
export { BlockEditor } from './components/block-editor/BlockEditor.js';
export type {
  BlockEditorProps,
  BlockItem,
  Block,
  BlockType,
  BlockEditorSize,
  BlockEditorDocument,
  BlockSelection,
  EditorUndoStrategy,
  EditorDecorations,
  RemoteCaret,
  BlockPresenceMarker,
  BlockMenuItem,
  BlockPlugin,
  BlockEditorContext,
  BlockEditorHandle,
  LinkSuggestion,
  LinkSuggestionProvider,
  MentionSuggestion,
  MentionSuggestionProvider,
} from './components/block-editor/BlockEditor.js';

// ─── DiffEditor ──────────────────────────────────────────────────────────────
export { DiffEditor } from './components/diff-editor/DiffEditor.js';
export type { DiffEditorProps, DiffEditorHandle, DiffMode } from './components/diff-editor/DiffEditor.js';

// ─── SignaturePad ────────────────────────────────────────────────────────────
export { SignaturePad } from './components/signature-pad/SignaturePad.js';
export type { SignaturePadProps, SignaturePadHandle } from './components/signature-pad/SignaturePad.js';

// ─── Charts Framework ────────────────────────────────────────────────────────
export { ChartContainer } from './charts/ChartContainer.js';
export type { ChartContainerProps, LegendItem } from './charts/ChartContainer.js';
export {
  CHART_PALETTES,
  HARMONY_PALETTE,
  readChartThemeColors,
  resolveSeriesPalette,
  useChartContext,
  useChartKernel,
  useChartPalette,
} from './charts/ChartKernel.js';
export type { ChartKernelOptions, ChartKernelValue, ChartPalette } from './charts/ChartKernel.js';
export { BarChart } from './charts/BarChart.js';
export type { BarChartProps } from './charts/BarChart.js';
export { PieChart } from './charts/PieChart.js';
export type { PieChartProps } from './charts/PieChart.js';
export { LineChart } from './charts/LineChart.js';
export type { LineChartProps } from './charts/LineChart.js';
export { AreaChart } from './charts/AreaChart.js';
export type { AreaChartProps } from './charts/AreaChart.js';
export { Sparkline } from './charts/Sparkline.js';
export type { SparklineProps } from './charts/Sparkline.js';
export { StackedBarChart } from './charts/StackedBarChart.js';
export type { StackedBarChartProps } from './charts/StackedBarChart.js';
export { StackedAreaChart } from './charts/StackedAreaChart.js';
export type { StackedAreaChartProps } from './charts/StackedAreaChart.js';
export { GroupedBarChart } from './charts/GroupedBarChart.js';
export type { GroupedBarChartProps } from './charts/GroupedBarChart.js';
export { BubbleChart } from './charts/BubbleChart.js';
export type { BubbleChartProps, BubbleSeries, BubblePoint } from './charts/BubbleChart.js';
export { GaugeChart } from './charts/GaugeChart.js';
export type { GaugeChartProps } from './charts/GaugeChart.js';
export { ScatterChart } from './charts/ScatterChart.js';
export type { ScatterChartProps, ScatterSeries, ScatterPoint } from './charts/ScatterChart.js';
export { HeatmapChart } from './charts/HeatmapChart.js';
export type { HeatmapChartProps, HeatmapItem } from './charts/HeatmapChart.js';
export { RadarChart } from './charts/RadarChart.js';
export type { RadarChartProps, RadarSeries } from './charts/RadarChart.js';
export { SunburstChart } from './charts/SunburstChart.js';
export type { SunburstChartProps, SunburstNode } from './charts/SunburstChart.js';
export { SankeyChart } from './charts/SankeyChart.js';
export type { SankeyChartProps, SankeyNode, SankeyLink } from './charts/SankeyChart.js';
export { PolarLineChart } from './charts/PolarLineChart.js';
export type { PolarLineChartProps, PolarSeries } from './charts/PolarLineChart.js';
export { WaterfallChart } from './charts/WaterfallChart.js';
export type { WaterfallChartProps, WaterfallDataItem } from './charts/WaterfallChart.js';
export { FunnelChart } from './charts/FunnelChart.js';
export type { FunnelChartProps } from './charts/FunnelChart.js';
export { CandlestickChart } from './charts/CandlestickChart.js';
export type { CandlestickChartProps, CandlestickDataItem } from './charts/CandlestickChart.js';
export { TreemapChart } from './charts/TreemapChart.js';
export type { TreemapChartProps, TreemapNode } from './charts/TreemapChart.js';
export { BarRaceChart } from './charts/BarRaceChart.js';
export type { BarRaceChartProps, BarRaceFrame } from './charts/BarRaceChart.js';
export { HistogramChart } from './charts/HistogramChart.js';
export type { HistogramChartProps, HistogramBin } from './charts/HistogramChart.js';
export { CalendarHeatmapChart } from './charts/CalendarHeatmapChart.js';
export type { CalendarHeatmapChartProps, CalendarHeatmapDay } from './charts/CalendarHeatmapChart.js';
export { ComboChart } from './charts/ComboChart.js';
export type { ComboChartProps, ComboSeries } from './charts/ComboChart.js';
export { OrgChart } from './charts/OrgChart.js';
export type { OrgChartProps, OrgNode } from './charts/OrgChart.js';
export { CylinderChart } from './charts/CylinderChart.js';
export type { CylinderChartProps, CylinderChartConfig } from './charts/CylinderChart.js';
export { PyramidChart } from './charts/PyramidChart.js';
export type { PyramidChartProps, PyramidChartConfig, PyramidDatum } from './charts/PyramidChart.js';
export { VennChart } from './charts/VennChart.js';
export type { VennChartProps, VennChartConfig, VennSet, VennIntersection } from './charts/VennChart.js';
export { WheelDiagram } from './charts/WheelDiagram.js';
export type { WheelDiagramProps, WheelDiagramConfig, WheelItem } from './charts/WheelDiagram.js';
export { FishboneChart } from './charts/FishboneChart.js';
export type { FishboneChartProps, FishboneDiagramConfig, FishboneCause, FishboneCategory } from './charts/FishboneChart.js';
export { MapChart } from './charts/MapChart.js';
export type { MapChartProps, MapChartConfig, MapData, MapRegion, MapMarker, MapConnection } from './charts/MapChart.js';
export { GraphChart, PerformanceGraph } from './charts/GraphChart.js';
export type { GraphChartProps, GraphChartConfig, GraphNode, GraphEdge, PerformanceGraphProps, PerformanceGraphConfig } from './charts/GraphChart.js';
export { DiagramEditor, autoLayoutDiagram } from './charts/DiagramEditor.js';
export type {
  DiagramEditorProps,
  DiagramEditorRef,
  DiagramShape,
  DiagramShapeType,
  DiagramConnector,
  ConnectorRouteType,
  DiagramEditorConfig,
  ShapeDefinition,
  DiagramLayoutDirection,
  DiagramLayoutOptions,
  DiagramSelectionEvent,
} from './charts/DiagramEditor.js';
export { TinyBar, TinyBarChart } from './charts/TinyBar.js';
export type { TinyBarProps, TinyBarChartProps } from './charts/TinyBar.js';
export { TinyLine, TinyLineChart } from './charts/TinyLine.js';
export type { TinyLineProps, TinyLineChartProps } from './charts/TinyLine.js';
export { TinyPie, TinyPieChart } from './charts/TinyPie.js';
export type { TinyPieProps, TinyPieChartProps } from './charts/TinyPie.js';
export { TinyDonut, TinyDonutChart } from './charts/TinyDonut.js';
export type { TinyDonutProps, TinyDonutChartProps } from './charts/TinyDonut.js';
export { TinyStacked, TinyStackedChart } from './charts/TinyStacked.js';
export type { TinyStackedProps, TinyStackedChartProps } from './charts/TinyStacked.js';
export type {
  TinyDatum,
  TinySeries,
  TinyStack,
  TinyValues,
  TinyChartSize,
  TinyValueFormat,
  TinyHighlight,
  TinyColorMode,
  TinyScaleTo,
  TinyThreshold,
  TinySizeSpec,
  TinyChartConfig,
  TinyBarChartConfig,
  TinyLineChartConfig,
  TinyPieChartConfig,
  TinyDonutChartConfig,
  TinyStackedChartConfig,
} from './charts/tiny-types.js';
export {
  TINY_SIZE_SPECS,
  TINY_SERIES_COLORS,
  TINY_POSITIVE_COLOR,
  TINY_NEGATIVE_COLOR,
  TINY_TRACK_COLOR,
  TINY_TEXT_COLOR,
  TINY_MUTED_COLOR,
} from './charts/tiny-types.js';
export {
  normalizeTinyValues,
  sortTinyData,
  resolveThresholdColor,
  sumValues,
  clamp,
  tinyLinePath,
  piePath,
  arcStrokePath,
} from './charts/tiny-utils.js';
export type {
  ChartCallbackEvent,
  ChartCommonProps,
  ChartDataItem,
  ChartLegendPosition,
  ChartLegendEvent,
  ChartMargin,
  ChartPointEvent,
  ChartSeries,
  ChartThemeColors,
  ChartTooltipConfig,
  ChartTooltipData,
  ChartTooltipEvent,
  ChartTooltipItem,
  ChartZoomState,
  CoreChartConfig,
} from './charts/types.js';
export { DEFAULT_CHART_COLORS, DEFAULT_CHART_CONFIG } from './charts/types.js';
export {
  CHART_PALETTE_KEYS,
  getPaletteColor,
  interpolateColor,
  resolveChartPalette,
} from './charts/colors.js';
export type { ChartPalette as ChartColorPalette } from './charts/colors.js';
export { formatCompact, formatNumber, generateTicks } from './charts/axis.js';
export { bandScale, linearScale, niceLinearDomain } from './charts/scales.js';

// ─── Effects & Animations ───────────────────────────────────────────────────
export { Sparkles } from './effects/Sparkles.js';
export type { SparklesProps, SparkleColor, SparkleSize } from './effects/Sparkles.js';
export { Confetti } from './effects/Confetti.js';
export type { ConfettiProps, ConfettiConfig, ConfettiHandle, ConfettiShape } from './effects/Confetti.js';
export { Shimmer } from './effects/Shimmer.js';
export type { ShimmerProps, ShimmerDirection } from './effects/Shimmer.js';
export { Rainbow } from './effects/Rainbow.js';
export type { RainbowProps, RainbowMode } from './effects/Rainbow.js';
export { Shine } from './effects/Shine.js';
export type { ShineProps, ShineAngle } from './effects/Shine.js';
export { Glow } from './effects/Glow.js';
export type { GlowProps, GlowVariant } from './effects/Glow.js';
export { Marquee } from './effects/Marquee.js';
export type { MarqueeProps, MarqueeDirection } from './effects/Marquee.js';
export { Fade } from './effects/Fade.js';
export type { FadeProps, FadeDirection, FadeTrigger } from './effects/Fade.js';
export { Ripple, useRipple } from './effects/Ripple.js';
export type { RippleProps, RippleOptions, RippleBinding } from './effects/Ripple.js';
export { Tilt, useTilt } from './effects/Tilt.js';
export type { TiltProps, TiltOptions, TiltBinding, TiltAxis } from './effects/Tilt.js';
export { Shake } from './effects/Shake.js';
export type { ShakeProps, ShakeHandle, ShakeVariant, ShakeTrigger, ShakeIntensity } from './effects/Shake.js';
export { IconMotion } from './effects/IconMotion.js';
export type { IconMotionProps, IconMotionType, IconSwapTransition, IconMotionTrigger } from './effects/IconMotion.js';
export { Slide, useSlide } from './effects/Slide.js';
export type { SlideProps, SlideOptions, SlideBinding, SlideDirection, SlideTrigger } from './effects/Slide.js';
export { NumberCounter, NumberTicker, useNumberCounter } from './effects/NumberTicker.js';
export type { NumberCounterProps, NumberCounterOptions, NumberCounterBinding, NumberTickerProps, NumberTickerMode } from './effects/NumberTicker.js';
export { Aura } from './effects/Aura.js';
export type { AuraProps } from './effects/Aura.js';
export { Fire } from './effects/Fire.js';
export type { FireProps, FireColor, FireDensity } from './effects/Fire.js';
export { Fireworks } from './effects/Fireworks.js';
export type { FireworksProps, FireworksHandle, FireworksBurst, FireworksIntensity, FireworksPalette } from './effects/Fireworks.js';
export { FluidFill } from './effects/FluidFill.js';
export type { FluidFillProps } from './effects/FluidFill.js';
export { Hourglass } from './effects/Hourglass.js';
export type { HourglassProps, HourglassHandle, HourglassSize } from './effects/Hourglass.js';
export { Snowflakes } from './effects/Snowflakes.js';
export type { SnowflakesProps, SnowflakeSize } from './effects/Snowflakes.js';
export { Thermometer } from './effects/Thermometer.js';
export type { ThermometerProps, ThermometerSize, TemperatureUnit } from './effects/Thermometer.js';
export { WheelOfFortune } from './effects/WheelOfFortune.js';
export type { WheelOfFortuneProps, WheelOfFortuneHandle, WheelSlice, WheelSize } from './effects/WheelOfFortune.js';

// ─── Utilities ────────────────────────────────────────────────────────────────
export { FocusTrap, AutoFocus, useFocusTrap } from './utils/FocusUtils.js';
export type { FocusTrapProps, AutoFocusProps, UseFocusTrapOptions } from './utils/FocusUtils.js';
export type { Placement, PositionAnchor, PositionBoundary, PositionDirection, PositionResult } from './utils/positioning.js';
export { Highlight } from './utils/Highlight.js';
export type { HighlightProps } from './utils/Highlight.js';

// ─── Data ─────────────────────────────────────────────────────────────────────
export * from './data/index.js';

// ─── Illustrations ──────────────────────────────────────────────────────────
export { Illustration } from './illustrations/Illustration.js';
export type { IllustrationProps, IllustrationSize } from './illustrations/Illustration.js';
export type { IllustrationDefinition, IllustrationCategory } from './illustrations/illustration-definition.js';
export { illustrationSet } from './illustrations/illustration-definition.js';
export * from './illustrations/collections/index.js';
