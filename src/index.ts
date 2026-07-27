// ─── Design Tokens ───────────────────────────────────────────────────────────
import './tokens/tokens.css';
import './tokens/motion-patterns.css';

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
export type { AlertProps, AlertVariant } from './components/alert/Alert.js';

export { Card, CardHeader, CardMedia, CardFooter } from './components/card/Card.js';
export type { CardProps, CardVariant, CardPadding, CardHeaderProps, CardMediaProps, CardFooterProps } from './components/card/Card.js';
export type { SpruceProviderProps } from './SpruceProvider.js';

// ─── Tooltip ─────────────────────────────────────────────────────────────────
export { Tooltip } from './components/tooltip/Tooltip.js';
export type { TooltipProps } from './components/tooltip/Tooltip.js';

// ─── Popover ──────────────────────────────────────────────────────────────────
export { Popover } from './components/popover/Popover.js';
export type { PopoverProps, PopoverTriggerType } from './components/popover/Popover.js';

// ─── Dropdown ─────────────────────────────────────────────────────────────────
export { Dropdown } from './components/dropdown/Dropdown.js';
export type { DropdownProps, DropdownItem } from './components/dropdown/Dropdown.js';

// ─── Select ──────────────────────────────────────────────────────────────────
export { Select } from './components/select/Select.js';
export type { SelectProps, SelectOption, SelectSize } from './components/select/Select.js';

// ─── Avatar ───────────────────────────────────────────────────────────────────
export { Avatar } from './components/avatar/Avatar.js';
export type { AvatarProps, AvatarSize, AvatarShape, AvatarStatus } from './components/avatar/Avatar.js';

// ─── AvatarGroup ──────────────────────────────────────────────────────────────
export { AvatarGroup } from './components/avatar-group/AvatarGroup.js';
export type { AvatarGroupProps, AvatarGroupItem } from './components/avatar-group/AvatarGroup.js';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
export { Breadcrumbs, BreadcrumbItem } from './components/breadcrumb/Breadcrumb.js';
export type { BreadcrumbsProps, BreadcrumbItemProps } from './components/breadcrumb/Breadcrumb.js';

// ─── Accordion ────────────────────────────────────────────────────────────────
export { Accordion, AccordionItem } from './components/accordion/Accordion.js';
export type { AccordionProps, AccordionItemProps } from './components/accordion/Accordion.js';

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

// ─── Theme ────────────────────────────────────────────────────────────────────
export { ThemeProvider, useTheme } from './theme/theme-context.js';
export type { ThemeContextValue, ThemeProviderProps } from './theme/theme-context.js';
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
export type { ProgressBarProps, ProgressBarVariant, ProgressBarSize } from './components/progress-bar/ProgressBar.js';

// ─── Spinner ──────────────────────────────────────────────────────────────────
export { Spinner } from './components/spinner/Spinner.js';
export type { SpinnerProps, SpinnerSize } from './components/spinner/Spinner.js';

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
export type { InputProps, InputType, InputSize } from './components/input/Input.js';

// ─── Textarea ─────────────────────────────────────────────────────────────────
export { Textarea } from './components/textarea/Textarea.js';
export type { TextareaProps, TextareaSize, TextareaResize } from './components/textarea/Textarea.js';

// ─── PasswordInput ────────────────────────────────────────────────────────────
export { PasswordInput } from './components/password-input/PasswordInput.js';
export type { PasswordInputProps, PasswordInputSize } from './components/password-input/PasswordInput.js';

// ─── PasswordProgress ─────────────────────────────────────────────────────────
export { PasswordProgress } from './components/password-progress/PasswordProgress.js';
export type { PasswordProgressProps, PasswordStrength } from './components/password-progress/PasswordProgress.js';

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
export type { TabsProps, TabItem } from './components/tabs/Tabs.js';

// ─── SplitButton ─────────────────────────────────────────────────────────────
export { SplitButton } from './components/split-button/SplitButton.js';
export type { SplitButtonProps, SplitButtonItem, SplitButtonVariant, SplitButtonSize } from './components/split-button/SplitButton.js';

// ─── SegmentedControl ────────────────────────────────────────────────────────
export { SegmentedControl } from './components/segmented-control/SegmentedControl.js';
export type { SegmentedControlProps, SegmentedOption, SegmentedSize } from './components/segmented-control/SegmentedControl.js';

// ─── Overflow ────────────────────────────────────────────────────────────────
export { Overflow, OverflowItem } from './components/overflow/Overflow.js';
export type { OverflowProps, OverflowItemProps } from './components/overflow/Overflow.js';

// ─── Toolbar ─────────────────────────────────────────────────────────────────
export { Toolbar } from './components/toolbar/Toolbar.js';
export type { ToolbarProps, ToolbarButtonItem, ToolbarSize } from './components/toolbar/Toolbar.js';

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
export type { ToastConfig, ToastVariant, ToastPosition, ToastContextValue } from './components/toast/Toast.js';

// ─── Snackbar ────────────────────────────────────────────────────────────────
export { SnackbarProvider, useSnackbar } from './components/snackbar/Snackbar.js';
export type { SnackbarConfig, SnackbarContextValue } from './components/snackbar/Snackbar.js';

// ─── CommandPalette ──────────────────────────────────────────────────────────
export { CommandPalette } from './components/command-palette/CommandPalette.js';
export type { CommandPaletteProps, CommandPaletteItem } from './components/command-palette/CommandPalette.js';

// ─── ButtonGroup ─────────────────────────────────────────────────────────────
export { ButtonGroup } from './components/button-group/ButtonGroup.js';
export type { ButtonGroupProps, ButtonGroupItem } from './components/button-group/ButtonGroup.js';

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
export type { ComboboxProps, ComboboxOption } from './components/combobox/Combobox.js';

// ─── GridCombobox ────────────────────────────────────────────────────────────
export { GridCombobox } from './components/grid-combobox/GridCombobox.js';
export type { GridComboboxProps, GridComboboxColumn, GridComboboxOption } from './components/grid-combobox/GridCombobox.js';

// ─── Datagrid ───────────────────────────────────────────────────────────────
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
export { NavMenu } from './components/nav-menu/NavMenu.js';
export type { NavMenuProps, NavMenuItem, NavMenuLink } from './components/nav-menu/NavMenu.js';

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

// ─── Data ─────────────────────────────────────────────────────────────────────
export * from './data/index.js';
