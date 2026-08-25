// ─── Design Tokens ───────────────────────────────────────────────────────────
import './tokens/tokens.css';
import './tokens/motion-patterns.css';
export * from './tokens/index.js';

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
export { Motif } from './components/motif/Motif.js';
export type {
  MotifProps,
  SpDecorativeBackground,
  SpMotifAppearanceOption,
  SpMotifPosition,
} from './components/motif/Motif.js';
export { resolveDecorativeBackground } from './components/motif/motif-utils.js';

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
export type { AccordionProps, AccordionItemProps, AccordionVariant, AccordionSize, AccordionIndicator, AccordionIndicatorPosition, AccordionTriggerMode, AccordionToggleEvent } from './components/accordion/Accordion.js';

// ─── Code Editor ──────────────────────────────────────────────────────────────
export { CodeEditor } from './components/code-editor/CodeEditor.js';
export type { CodeEditorProps, CodeLanguage } from './components/code-editor/CodeEditor.js';

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
export { NAVIGATION_ICONS } from './icons/collections/navigation.js';
export { ACTION_ICONS } from './icons/collections/action.js';
export { STATUS_ICONS } from './icons/collections/status.js';
export { SOCIAL_ICONS } from './icons/collections/social.js';
export { CONTENT_ICONS } from './icons/collections/content.js';
export { EDITOR_ICONS } from './icons/collections/editor.js';
export { LAYOUT_ICONS } from './icons/collections/layout.js';
export { DATA_ICONS } from './icons/collections/data.js';
export { DEVELOPMENT_ICONS } from './icons/collections/development.js';
export { GENERAL_ICONS } from './icons/collections/general.js';
export { DUOTONE_ICONS } from './icons/collections/duotone.js';

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
export { StatCard } from './components/stat-card/StatCard.js';
export type { StatCardProps, StatCardVariant, StatCardTrend, StatCardIconColor } from './components/stat-card/StatCard.js';

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
export type { ModalProps, ModalSize } from './components/modal/Modal.js';

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

// ─── Combobox ────────────────────────────────────────────────────────────────
export { Combobox } from './components/combobox/Combobox.js';
export type { ComboboxProps, ComboboxOption, ComboboxSource } from './components/combobox/Combobox.js';

// ─── GridCombobox ────────────────────────────────────────────────────────────
export { GridCombobox } from './components/grid-combobox/GridCombobox.js';
export type { GridComboboxProps, GridComboboxColumn, GridComboboxOption, GridComboboxSource } from './components/grid-combobox/GridCombobox.js';

// ─── Lookup contracts ───────────────────────────────────────────────────────
export type { LookupOption, LookupColumn, LookupRenderContext, LookupSource, LookupRenderer } from './components/lookup/lookup-types.js';

// ─── Legacy Datagrid ────────────────────────────────────────────────────────
/**
 * @deprecated Use Datagridex. The legacy Datagrid API is frozen and is not the
 * parity baseline for new grid work.
 */
export { Datagrid } from './components/datagrid/Datagrid.js';
export type { DatagridProps } from './components/datagrid/Datagrid.js';
export type {
  ColumnDef,
  GridOptions,
  ColumnFilter,
  ColumnState,
  SortDirection,
  SortEntry,
  SelectionMode,
  CellValueFormatter,
  CellStyleFn,
  CellClassFn,
  CellEditorType,
  EditMode,
  EditTrigger,
  FilterMode,
  PinPosition,
  AggregateType,
  GridDensity,
  FilterOperator,
  SelectOption as DatagridSelectOption,
  CellEditorConfig,
  CellEditorContext,
  CellEditEvent,
  RowEditEvent,
  AggregateConfig,
  GroupRowMeta,
  PaginationState,
  GridToolbarButton,
  DetailPanelContext,
  TreeRowMeta,
} from './components/datagrid/grid-types.js';

// ─── Datagridex ─────────────────────────────────────────────────────────────
export {
  Datagridex,
  DatagridexCellTemplate,
  DatagridexCellEditor,
  DatagridexRowDetail,
  DatagridexDetailPane,
  DatagridexLeadingRowActions,
  DatagridexRowTemplate,
  DatagridexDataContextAdapter,
  createDatagridexDataContextAdapter,
} from './components/datagridex/Datagridex.js';
export type {
  DatagridexProps,
  DatagridexHandle,
  DatagridexCellTemplateProps,
  DatagridexCellEditorProps,
  DatagridexRowDetailProps,
  DatagridexDetailPaneProps,
  DatagridexLeadingRowActionsProps,
  DatagridexRowTemplateProps,
} from './components/datagridex/Datagridex.js';
export type {
  DatagridexAggregate,
  DatagridexAggregateContext,
  DatagridexAggregateValueContext,
  DatagridexBuiltInAggregate,
  DatagridexCellContext,
  DatagridexCellEditorContext,
  DatagridexCellTemplateContext,
  DatagridexChoiceOption,
  DatagridexColumn,
  DatagridexColumnFilter,
  DatagridexColumnGroup,
  DatagridexColumnGroupOrderChange,
  DatagridexColumnGroupResize,
  DatagridexColumnMenuItem,
  DatagridexColumnOrderChange,
  DatagridexColumnPin,
  DatagridexColumnResize,
  DatagridexColumnVisibilityChange,
  DatagridexCustomAggregate,
  DatagridexDataContext,
  DatagridexDataContextOptions,
  DatagridexDataContextStateDisplay,
  DatagridexDetailPaneContext,
  DatagridexDynamicFilterCondition,
  DatagridexDynamicFilterOperator,
  DatagridexEditCancel,
  DatagridexEditLabels,
  DatagridexEditMode,
  DatagridexEditorOptions,
  DatagridexEditorType,
  DatagridexFilterChange,
  DatagridexFilterDataType,
  DatagridexFilterIndicatorVisibility,
  DatagridexFilterMode,
  DatagridexFilterVariant,
  DatagridexGroupBy,
  DatagridexGroupSort,
  DatagridexGroupSortDirection,
  DatagridexLeadingRowActionsContext,
  DatagridexNewRowCommit,
  DatagridexNewRowFactory,
  DatagridexPageChange,
  DatagridexPaginationType,
  DatagridexRecordState,
  DatagridexRowClassName,
  DatagridexRowDetailContext,
  DatagridexRowDetailExpandable,
  DatagridexRowEditCommit,
  DatagridexRowLabel,
  DatagridexRowOrderChange,
  DatagridexRowSpanContext,
  DatagridexRowStyle,
  DatagridexRowTemplateContext,
  DatagridexSelectionChange,
  DatagridexSelectionMode,
  DatagridexSort,
  DatagridexSortChange,
  DatagridexSortDirection,
  DatagridexSortIndicatorVisibility,
  DatagridexSortMode,
  DatagridexSortsChange,
  DatagridexTrackBy,
  DatagridexTrackedRecord,
  DatagridexValidationError,
  DatagridexValidationEvent,
  DatagridexValidationRules,
  DatagridexValidator,
  DatagridexValidatorFn,
  DatagridexValidatorRule,
  DatagridexVirtualPageDirection,
  DatagridexVirtualPageRequest,
  DatagridexVirtualPageTrigger,
} from './components/datagridex/datagridex-types.js';

// ─── Gantt Chart ─────────────────────────────────────────────────────────────
export { GanttChart } from './components/gantt-chart/GanttChart.js';
export type { GanttChartProps } from './components/gantt-chart/GanttChart.js';
export type {
  GanttTask,
  GanttMilestone,
  GanttDependency,
  GanttResource,
  GanttConfig,
  GanttTimeScale,
  GanttDependencyType,
  TaskClickEvent,
  TaskMoveEvent,
  TaskResizeEvent,
  MilestoneClickEvent,
  SlotClickEvent as GanttSlotClickEvent,
  GanttFlatRow,
  GanttTimeSlot,
  GanttPrimarySlot,
} from './components/gantt-chart/gantt-types.js';

// ─── Scheduler ───────────────────────────────────────────────────────────────
export { Scheduler } from './components/scheduler/Scheduler.js';
export type { SchedulerProps } from './components/scheduler/Scheduler.js';
export type {
  SchedulerEvent,
  SchedulerResource,
  SchedulerView,
  SchedulerSlot,
  EventClickEvent,
  SlotClickEvent as SchedulerSlotClickEvent,
  EventMoveEvent,
  EventResizeEvent,
  DateRange as SchedulerDateRange,
} from './components/scheduler/scheduler-types.js';

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
export type { InplaceEditorProps, InplaceEditorSize } from './components/inplace-editor/InplaceEditor.js';

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

// ─── AspectRatio ─────────────────────────────────────────────────────────────
export { AspectRatio } from './components/aspect-ratio/AspectRatio.js';
export type { AspectRatioProps } from './components/aspect-ratio/AspectRatio.js';

// ─── CreditCard ──────────────────────────────────────────────────────────────
export { CreditCard } from './components/credit-card/CreditCard.js';
export type { CreditCardProps, CardColor } from './components/credit-card/CreditCard.js';

// ─── Barcode & QR Code ──────────────────────────────────────────────────────
export { Barcode, QrCode } from './components/barcode/Barcode.js';
export type { BarcodeProps, QrCodeProps, BarcodeFormat } from './components/barcode/Barcode.js';

// ─── GitGraph ────────────────────────────────────────────────────────────────
export { GitGraph } from './components/git-graph/GitGraph.js';
export type { GitGraphProps, GitGraphCommit, GitGraphBranch } from './components/git-graph/GitGraph.js';

// ─── FilterExpression ────────────────────────────────────────────────────────
export { FilterExpression } from './components/filter-expression/FilterExpression.js';
export type {
  FilterExpressionProps,
  FilterField,
  FilterOperatorOption,
  FilterRule,
  FilterGroup,
  FilterLogic,
  FieldType,
} from './components/filter-expression/FilterExpression.js';

// ─── FileUpload ──────────────────────────────────────────────────────────────
export { FileUpload } from './components/file-upload/FileUpload.js';
export type { FileUploadProps, FileUploadSize, UploadedFileItem } from './components/file-upload/FileUpload.js';

// ─── Editor ──────────────────────────────────────────────────────────────────
export { Editor } from './components/editor/Editor.js';
export type { EditorProps, EditorSize } from './components/editor/Editor.js';

// ─── MarkdownEditor ──────────────────────────────────────────────────────────
export { MarkdownEditor } from './components/markdown-editor/MarkdownEditor.js';
export type { MarkdownEditorProps, MarkdownEditorMode, MarkdownEditorSize } from './components/markdown-editor/MarkdownEditor.js';

// ─── BlockEditor ─────────────────────────────────────────────────────────────
export { BlockEditor } from './components/block-editor/BlockEditor.js';
export type { BlockEditorProps, BlockItem, BlockType, BlockEditorSize } from './components/block-editor/BlockEditor.js';

// ─── DiffEditor ──────────────────────────────────────────────────────────────
export { DiffEditor } from './components/diff-editor/DiffEditor.js';
export type { DiffEditorProps } from './components/diff-editor/DiffEditor.js';

// ─── SignaturePad ────────────────────────────────────────────────────────────
export { SignaturePad } from './components/signature-pad/SignaturePad.js';
export type { SignaturePadProps, SignaturePadHandle } from './components/signature-pad/SignaturePad.js';

// ─── Charts Framework ────────────────────────────────────────────────────────
export { ChartContainer } from './charts/ChartContainer.js';
export type { ChartContainerProps, LegendItem } from './charts/ChartContainer.js';
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
export type { ChartDataItem, ChartSeries, ChartLegendPosition, ChartTooltipData } from './charts/types.js';

// ─── Effects & Animations ───────────────────────────────────────────────────
export { Sparkles } from './effects/Sparkles.js';
export type { SparklesProps } from './effects/Sparkles.js';
export { Confetti } from './effects/Confetti.js';
export type { ConfettiProps } from './effects/Confetti.js';
export { Shimmer } from './effects/Shimmer.js';
export type { ShimmerProps } from './effects/Shimmer.js';
export { Rainbow } from './effects/Rainbow.js';
export type { RainbowProps } from './effects/Rainbow.js';
export { Shine } from './effects/Shine.js';
export type { ShineProps } from './effects/Shine.js';
export { Glow } from './effects/Glow.js';
export type { GlowProps } from './effects/Glow.js';
export { Marquee } from './effects/Marquee.js';
export type { MarqueeProps } from './effects/Marquee.js';
export { Fade } from './effects/Fade.js';
export type { FadeProps } from './effects/Fade.js';

// ─── Utilities ────────────────────────────────────────────────────────────────
export { FocusTrap, AutoFocus, useFocusTrap } from './utils/FocusUtils.js';
export type { FocusTrapProps, AutoFocusProps, UseFocusTrapOptions } from './utils/FocusUtils.js';
export type { Placement, PositionAnchor, PositionBoundary, PositionDirection, PositionResult } from './utils/positioning.js';
export { Highlight } from './utils/Highlight.js';
export type { HighlightProps } from './utils/Highlight.js';

// ─── Data ─────────────────────────────────────────────────────────────────────
export * from './data/index.js';
