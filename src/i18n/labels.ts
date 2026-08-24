/**
 * Every user-visible string that a Spruce component owns.
 *
 * Component chrome — icon-button labels, empty states, toolbar names, ARIA text —
 * lives here so an application localizes the design system once instead of passing
 * strings into every component. Product copy (page titles, field labels, empty-state
 * bodies that describe domain data) stays on component inputs.
 *
 * Keys are grouped by concern and alphabetized inside each group. When adding a key,
 * add it to `SP_I18N_DEFAULT_LABELS` and to every locale pack in `./locales`.
 */
export interface SpI18nLabels {
  // ---------------------------------------------------------------------------
  // Common actions
  // ---------------------------------------------------------------------------
  add: string;
  and: string;
  apply: string;
  back: string;
  build: string;
  cancel: string;
  clear: string;
  clearAll: string;
  clearSearch: string;
  close: string;
  collapse: string;
  collapseAll: string;
  confirm: string;
  copy: string;
  custom: string;
  delete: string;
  discard: string;
  dismiss: string;
  done: string;
  duplicate: string;
  edit: string;
  expand: string;
  expandAll: string;
  export: string;
  filter: string;
  filters: string;
  for: string;
  hideAll: string;
  insert: string;
  less: string;
  more: string;
  moreNotifications: string;
  notifications: string;
  moveDown: string;
  moveUp: string;
  next: string;
  none: string;
  of: string;
  on: string;
  or: string;
  preview: string;
  previous: string;
  redo: string;
  refresh: string;
  remove: string;
  rename: string;
  reset: string;
  restore: string;
  save: string;
  search: string;
  select: string;
  selectAll: string;
  send: string;
  showAll: string;
  skip: string;
  skipToContent: string;
  split: string;
  undo: string;
  unlink: string;
  upload: string;

  // ---------------------------------------------------------------------------
  // Common nouns and states
  // ---------------------------------------------------------------------------
  color: string;
  column: string;
  columns: string;
  comment: string;
  condition: string;
  description: string;
  fields: string;
  group: string;
  helperText: string;
  items: string;
  label: string;
  loading: string;
  loadingMore: string;
  location: string;
  max: string;
  maxLength: string;
  min: string;
  minLength: string;
  modified: string;
  name: string;
  noData: string;
  noOptions: string;
  noResults: string;
  noSuggestions: string;
  opacity: string;
  options: string;
  placeholder: string;
  progress: string;
  circularProgress: string;
  properties: string;
  record: string;
  reply: string;
  required: string;
  row: string;
  rows: string;
  rule: string;
  section: string;
  size: string;
  style: string;
  suggestions: string;
  tab: string;
  text: string;
  title: string;
  untitled: string;
  value: string;
  visibility: string;
  width: string;

  // ---------------------------------------------------------------------------
  // Text formatting and editors
  // ---------------------------------------------------------------------------
  addBlock: string;
  addBlockBelow: string;
  alignCenter: string;
  alignLeft: string;
  alignRight: string;
  annotation: string;
  annotationText: string;
  blockquote: string;
  bold: string;
  bulletList: string;
  closeFind: string;
  codeBlock: string;
  columnsLayout: string;
  deleteBlock: string;
  diagramView: string;
  doneEditingLink: string;
  dragToReorder: string;
  dragToReorderOrClickForOptions: string;
  editLink: string;
  editMode: string;
  editorContent: string;
  enterText: string;
  enterUrl: string;
  equationView: string;
  find: string;
  findInDocument: string;
  findInEditor: string;
  fontSize: string;
  formatDocument: string;
  formattingOptions: string;
  goToLineNumber: string;
  heading: string;
  heading1: string;
  heading2: string;
  heading3: string;
  highlightColor: string;
  horizontalRule: string;
  htmlSource: string;
  inlineCode: string;
  insertEmoji: string;
  insertImage: string;
  insertLink: string;
  italic: string;
  latexEquationSyntax: string;
  link: string;
  linkTitleOptional: string;
  linkUrl: string;
  markdownFormatting: string;
  markdownPreview: string;
  mention: string;
  mentionSuggestions: string;
  mermaidDiagramSyntax: string;
  nextMatch: string;
  nextMatchHint: string;
  noLinkClickToAdd: string;
  noTags: string;
  numberedList: string;
  paragraph: string;
  pasteImageUrl: string;
  pasteOrTypeLink: string;
  previewMode: string;
  previousMatch: string;
  previousMatchHint: string;
  redoHint: string;
  removeLink: string;
  renderedEquation: string;
  searchEmojis: string;
  strikethrough: string;
  subscript: string;
  superscript: string;
  table: string;
  tableControls: string;
  textColor: string;
  typeMentionTrigger: string;
  underline: string;
  undoHint: string;

  // ---------------------------------------------------------------------------
  // Diff editor
  // ---------------------------------------------------------------------------
  deletions: string;
  inline: string;
  insertions: string;
  navigateChanges: string;
  nextChange: string;
  previousChange: string;
  sideBySide: string;

  // ---------------------------------------------------------------------------
  // Dates, time, and calendars
  // ---------------------------------------------------------------------------
  amPm: string;
  dateInput: string;
  dateRangeCalendar: string;
  dateRangePresets: string;
  dateTimeInput: string;
  day: string;
  daily: string;
  days: string;
  decreaseHours: string;
  decreaseMinutes: string;
  decreaseSeconds: string;
  endDate: string;
  endMustBeAfterStart: string;
  goToToday: string;
  hideCalendar: string;
  hour: string;
  hours: string;
  increaseHours: string;
  increaseMinutes: string;
  increaseSeconds: string;
  minutes: string;
  month: string;
  monthly: string;
  months: string;
  nextMonth: string;
  nextYear: string;
  nextYears: string;
  openCalendar: string;
  openDateTimePicker: string;
  previousMonth: string;
  previousYear: string;
  previousYears: string;
  seconds: string;
  selectDate: string;
  selectEndDate: string;
  selectMonthAndYear: string;
  selectRange: string;
  selectStartDate: string;
  selectTime: string;
  selectYear: string;
  showCalendar: string;
  startDate: string;
  time: string;
  timezone: string;
  timezoneHelper: string;
  today: string;
  week: string;
  weekAbbreviation: string;
  weekly: string;
  weeks: string;
  workWeek: string;
  year: string;
  yearly: string;
  years: string;

  // ---------------------------------------------------------------------------
  // Timezone names
  // ---------------------------------------------------------------------------
  alaskaTime: string;
  centralEurope: string;
  centralTime: string;
  easternTime: string;
  hawaiiTime: string;
  london: string;
  manila: string;
  mountainTime: string;
  pacificTime: string;
  singapore: string;
  sydney: string;
  tokyo: string;

  // ---------------------------------------------------------------------------
  // Scheduler
  // ---------------------------------------------------------------------------
  afterOccurrences: string;
  agenda: string;
  agendaView: string;
  allDay: string;
  availability: string;
  busy: string;
  calendar: string;
  calendars: string;
  calendarViews: string;
  category: string;
  closeEventList: string;
  deleteEvent: string;
  deleteEventConfirm: string;
  deleteOccurrenceOrSeriesConfirm: string;
  editOccurrenceOrSeriesConfirm: string;
  descriptionPlaceholder: string;
  doesNotRepeat: string;
  editEvent: string;
  ends: string;
  enterTitle: string;
  entireSeries: string;
  eventCalendar: string;
  eventColor: string;
  eventDetails: string;
  eventLocation: string;
  eventStartDay: string;
  eventTitle: string;
  every: string;
  focusTime: string;
  free: string;
  hourBefore: string;
  locationPlaceholder: string;
  meeting: string;
  minutesBefore: string;
  moveEventTo: string;
  never: string;
  newEvent: string;
  noCalendar: string;
  noCategory: string;
  noEventsInPeriod: string;
  noResource: string;
  occurrences: string;
  onDate: string;
  outOfOffice: string;
  personal: string;
  private: string;
  public: string;
  recurrenceEndMustBeAfterStart: string;
  recurringEvent: string;
  reminder: string;
  repeatEvery: string;
  repeatOn: string;
  repeatOnDays: string;
  repeats: string;
  repeatsEvery: string;
  resource: string;
  scheduleDayView: string;
  schedulerToolbar: string;
  series: string;
  showAllEventsFor: string;
  showAsAllDayEvent: string;
  tentative: string;
  thisEvent: string;
  timeline: string;
  timelineView: string;
  times: string;
  travel: string;
  treeView: string;
  until: string;
  untilChangedOrDeleted: string;
  useColor: string;

  // ---------------------------------------------------------------------------
  // Gantt
  // ---------------------------------------------------------------------------
  dayScale: string;
  ganttChartControls: string;
  hourScale: string;
  monthScale: string;
  owner: string;
  resizeColumnNamed: string;
  resizeTaskList: string;
  scrollToToday: string;
  start: string;
  end: string;
  task: string;
  taskList: string;
  toggleChildren: string;
  weekScale: string;

  // ---------------------------------------------------------------------------
  // Data grids
  // ---------------------------------------------------------------------------
  actions: string;
  addNewRow: string;
  allRowsLoaded: string;
  availableColumns: string;
  chooseAtLeastOneColumn: string;
  clearAllGrouping: string;
  clearFilters: string;
  closeDetailPane: string;
  closeDetailPaneForRow: string;
  collapseGroupRows: string;
  columnMenu: string;
  columnVisibility: string;
  detailsForRow: string;
  dragColumnToGroup: string;
  dragHandle: string;
  dragHandleColumn: string;
  dropColumnToGroup: string;
  expandGroupRows: string;
  filterActive: string;
  filterValue: string;
  firstPage: string;
  groupedColumns: string;
  hideColumnSelector: string;
  hideDetailsForRow: string;
  lastPage: string;
  nextPage: string;
  noColumnsSelected: string;
  noFilterCondition: string;
  noMatchingValues: string;
  noRowsOnPage: string;
  openColumnMenu: string;
  page: string;
  pagination: string;
  paginationPageCompact: string;
  paginationPageTotal: string;
  paginationRangeCompact: string;
  paginationRangeTotal: string;
  previousPage: string;
  removeColumn: string;
  removeColumnGrouping: string;
  removeGrouping: string;
  resizeColumn: string;
  resizeColumnGroup: string;
  rowActions: string;
  rowDetails: string;
  rowNumber: string;
  rowSelection: string;
  searchValues: string;
  selectAllRows: string;
  selectAllRowsOnPage: string;
  showColumnSelector: string;
  showDetailPaneForRow: string;
  showDetailsForRow: string;
  to: string;
  toggleDetails: string;
  valuesForColumn: string;
  zeroRows: string;

  // ---------------------------------------------------------------------------
  // Filter builder
  // ---------------------------------------------------------------------------
  filterCondition: string;
  filterLogic: string;
  noConditions: string;
  upperBound: string;

  // ---------------------------------------------------------------------------
  // Form builder
  // ---------------------------------------------------------------------------
  addColumn: string;
  addOption: string;
  addRow: string;
  addSection: string;
  deleteSection: string;
  design: string;
  editable: string;
  fieldPalette: string;
  fieldProperties: string;
  formBuilderToolbar: string;
  maskPattern: string;
  noFieldsYet: string;
  noSectionsYet: string;
  removeOption: string;
  renameSection: string;
  selectFieldToEdit: string;
  typeableInputMode: string;

  // ---------------------------------------------------------------------------
  // Forms
  // ---------------------------------------------------------------------------
  cardHolder: string;
  clearSignature: string;
  expires: string;
  removeFile: string;
  signHere: string;
  signatureDrawingArea: string;
  signatureDrawingTools: string;

  // ---------------------------------------------------------------------------
  // Charts and diagrams
  // ---------------------------------------------------------------------------
  arrowAtEnd: string;
  arrowAtTargetEnd: string;
  autoLayoutLeftToRight: string;
  autoLayoutTopToBottom: string;
  bearish: string;
  border: string;
  borderColor: string;
  borderStyle: string;
  borderWidth: string;
  bullish: string;
  chartLatest: string;
  chartTotal: string;
  chartTypeBar: string;
  chartTypeDonut: string;
  chartTypeLine: string;
  chartTypePie: string;
  chartTypeStackedBar: string;
  connectTool: string;
  connection: string;
  connectorLabel: string;
  connectorRouteType: string;
  connectorTool: string;
  curve: string;
  dashDot: string;
  dashed: string;
  deleteSelected: string;
  diagramTools: string;
  dotted: string;
  fill: string;
  fillColor: string;
  fillOpacity: string;
  loadingMapData: string;
  mean: string;
  orthogonal: string;
  plainLine: string;
  resetMapView: string;
  resetView: string;
  resetZoom: string;
  resetZoomAndPan: string;
  restart: string;
  route: string;
  selectTool: string;
  shapeText: string;
  solid: string;
  source: string;
  sourceEndType: string;
  straight: string;
  stroke: string;
  strokeColor: string;
  strokeStyle: string;
  strokeWidth: string;
  target: string;
  targetEndType: string;
  toggleArrowAtSourceEnd: string;
  toggleArrowAtStart: string;

  // ---------------------------------------------------------------------------
  // Image editor
  // ---------------------------------------------------------------------------
  addAnnotation: string;
  adjust: string;
  adjustments: string;
  annotations: string;
  arrowAnnotation: string;
  aspectRatio: string;
  circleSelection: string;
  crop: string;
  cropSelection: string;
  dragToCreateSelection: string;
  draw: string;
  ellipseAnnotation: string;
  file: string;
  flipHorizontally: string;
  flipVertically: string;
  history: string;
  imageAdjustments: string;
  imageEditorTools: string;
  imageOptions: string;
  lineAnnotation: string;
  loadImageToStart: string;
  output: string;
  outputQuality: string;
  quality: string;
  rectangleAnnotation: string;
  resetEdits: string;
  resetZoomFit: string;
  rotateAnnotation: string;
  rotateLeft: string;
  scaleAnnotation: string;
  selection: string;
  square: string;
  squareSelection: string;
  transform: string;
  uploadImage: string;
  zoom: string;
  zoomIn: string;
  zoomOut: string;

  // ---------------------------------------------------------------------------
  // Overlays and feedback
  // ---------------------------------------------------------------------------
  askAnything: string;
  closeEsc: string;
  closeLightbox: string;
  commandPaletteResults: string;
  commandPaletteNavigateHint: string;
  commandPaletteSelectHint: string;
  commandPaletteCloseHint: string;
  dismissNotification: string;
  imageThumbnails: string;
  nextImage: string;
  nextSlide: string;
  previousImage: string;
  previousSlide: string;
  slideControls: string;

  // ---------------------------------------------------------------------------
  // Layout, docks, and navigation
  // ---------------------------------------------------------------------------
  allPanelsClosed: string;
  autoHidePanel: string;
  breadcrumb: string;
  closePanel: string;
  closePeek: string;
  closeSidebar: string;
  company: string;
  companySwitcher: string;
  floatPanel: string;
  floatTabGroup: string;
  imageComparisonSlider: string;
  maximize: string;
  minimize: string;
  noDocumentsOpen: string;
  panel: string;
  pinToDock: string;
  removeTab: string;
  renameTab: string;
  resizeSidebar: string;
  scrollTabsLeft: string;
  scrollTabsRight: string;
  scrollingContent: string;
  selectCompany: string;
  switchCompany: string;
  workspace: string;

  // ---------------------------------------------------------------------------
  // Data display
  // ---------------------------------------------------------------------------
  addReaction: string;
  clearPropertySearch: string;
  clearTerminal: string;
  dropCardsHere: string;
  highValue: string;
  lowValue: string;
  noOutputYet: string;
  propertyOrder: string;
  alphabetical: string;
  categorized: string;

  // ---------------------------------------------------------------------------
  // Appearance and theming
  // ---------------------------------------------------------------------------
  accent: string;
  accentColor: string;
  auto: string;
  colorHarmony: string;
  harmonyBaseHue: string;
  harmonyCustom: string;
  harmonyPresets: string;
  harmonyScheme: string;
  harmonySecondaryHue: string;
  harmonyTertiaryHue: string;
  harmonyWheel: string;
  schemeAnalogous: string;
  schemeComplementary: string;
  schemeMonochromatic: string;
  schemeSplitComplementary: string;
  schemeTetradic: string;
  schemeTriadic: string;
  secondaryAccent: string;
  tertiaryAccent: string;
  changesApplyImmediately: string;
  chooseCustomAccentColor: string;
  closeAppearanceSettings: string;
  customAccentColor: string;
  density: string;
  filterThemesByMode: string;
  gridView: string;
  interfaceDensity: string;
  listView: string;
  livePreview: string;
  messageBarActions: string;
  preferences: string;
  reduceMotion: string;
  searchThemes: string;
  system: string;
  systemDefault: string;
  themeLayout: string;
  themePreset: string;

  // ---------------------------------------------------------------------------
  // Component input defaults
  //
  // Components expose these as inputs so a product can override the wording. The
  // input default resolves to the active locale instead of a hard-coded string.
  // ---------------------------------------------------------------------------
  action: string;
  addCommentPrompt: string;
  after: string;
  appearance: string;
  appearanceDescription: string;
  before: string;
  carousel: string;
  codeEditor: string;
  commandPalette: string;
  dataGrid: string;
  dataGridStatus: string;
  dataGridTools: string;
  details: string;
  diffEditor: string;
  document: string;
  download: string;
  dropFilesHere: string;
  editValue: string;
  emoji: string;
  enterPassword: string;
  inplaceAccept: string;
  inplaceDiscard: string;
  featureNotIncluded: string;
  fixValidationErrors: string;
  focusPropertyForDescription: string;
  imageComparison: string;
  imageEditor: string;
  invalid: string;
  kanbanBoard: string;
  layoutManager: string;
  loadingData: string;
  loadingPdf: string;
  mainNavigation: string;
  misc: string;
  moreActions: string;
  moreOptions: string;
  navigation: string;
  newRow: string;
  noCommentsYet: string;
  noDescriptionAvailable: string;
  noMatchingRows: string;
  noPdfSelected: string;
  noPropertiesFound: string;
  noRowsToDisplay: string;
  open: string;
  openActionsMenu: string;
  original: string;
  popoverContent: string;
  propertyPanel: string;
  providePdfSource: string;
  rating: string;
  readOnly: string;
  recommended: string;
  resetToDefault: string;
  resizableSplitView: string;
  searchProperties: string;
  selectDateAndTime: string;
  splitButton: string;
  summary: string;
  terminalOutput: string;
  textDifference: string;
  typeMarkdownHere: string;
  typeMentionPrompt: string;
  upgradePlanToUnlock: string;
  writeReply: string;

  // ---------------------------------------------------------------------------
  // Filter operators and column menus
  // ---------------------------------------------------------------------------
  opAfter: string;
  opBefore: string;
  opBetween: string;
  opContains: string;
  opDoesNotContain: string;
  opDoesNotEqual: string;
  opEndsWith: string;
  opEquals: string;
  opGreaterThan: string;
  opGreaterThanOrEqual: string;
  opIs: string;
  opIsBlank: string;
  opIsEmpty: string;
  opIsNot: string;
  opIsNotBlank: string;
  opIsNotEmpty: string;
  opLessThan: string;
  opLessThanOrEqual: string;
  opNotEquals: string;
  opStartsWith: string;
  autoFitColumn: string;
  clearSorting: string;
  hideColumn: string;
  pinColumn: string;
  pinLeft: string;
  pinRight: string;
  sortAscending: string;
  sortDescending: string;
  unpin: string;
  valueTrue: string;
  valueFalse: string;

  // Aggregates
  aggregate: string;
  aggregateAverage: string;
  aggregateCount: string;
  aggregateMaximum: string;
  aggregateMinimum: string;
  aggregateSum: string;

  // Clock periods
  am: string;
  pm: string;

  // ---------------------------------------------------------------------------
  // AI Components
  // ---------------------------------------------------------------------------
  aiSend: string;
  aiStop: string;
  aiRetry: string;
  aiRegenerate: string;
  aiContinue: string;
  aiCopy: string;
  aiCopied: string;
  aiLike: string;
  aiDislike: string;
  aiReadAloud: string;
  aiShare: string;
  aiReport: string;
  aiScrollToLatest: string;
  aiTyping: string;
  aiGenerating: string;
  aiAnalyzing: string;
  aiSearching: string;
  aiEmptyConversation: string;
  aiComposerPlaceholder: string;
  aiAttachFile: string;
  aiRemoveAttachment: string;
  aiCharCount: string;
  aiSuggestionsDismiss: string;
  aiSuggestionsRefresh: string;
  aiToolRunning: string;
  aiToolCompleted: string;
  aiToolFailed: string;
  aiToolCanceled: string;
  aiToolApprovalRequired: string;
  aiToolDetails: string;
  aiApprove: string;
  aiReject: string;
  aiAlwaysAllow: string;
  aiApprovalExpired: string;
  aiCitationUnavailable: string;
  aiViewSource: string;
  aiArtifactCopy: string;
  aiArtifactExport: string;
  aiArtifactDownload: string;
  aiArtifactFullscreen: string;
  aiContextRemove: string;
  aiContextProcessing: string;
  aiContextIndexing: string;
  aiElapsedTime: string;
  aiCancelGeneration: string;
  aiMessageFailed: string;
  aiMessageInterrupted: string;

  // AI: region and toolbar names
  aiResponseActionsLabel: string;
  aiSuggestionsLabel: string;
  aiConversationLabel: string;
  aiMessageStreamingStatus: string;
  aiMessageCompletedStatus: string;

  // AI: tool calls
  aiToolCallLabel: string;
  aiToolInput: string;
  aiToolResult: string;
  aiToolHideDetails: string;
  aiToolStartedAt: string;
  aiToolCompletedAt: string;
  aiToolDuration: string;
  aiToolCancel: string;
  aiToolSteps: string;

  // AI: approval
  aiApprovalLabel: string;
  aiApprovalResources: string;
  aiApprovalParameters: string;
  aiApprovalConsequence: string;
  aiApprovalDestructive: string;
  aiApprovalConfirm: string;
  aiApprovalConfirmPrompt: string;
  aiApprovalCancel: string;
  aiApprovalApproved: string;
  aiApprovalRejected: string;
  aiApprovalFailed: string;
  aiApprovalPending: string;

  // AI: citations
  aiCitationLabel: string;
  aiCitationsLabel: string;
  aiCitationSources: string;
  aiCitationExcerpt: string;
  aiCitationOpenSource: string;
  aiCitationCloseSource: string;
  aiCitationBy: string;

  // AI: artifacts
  aiArtifactLabel: string;
  aiArtifactVersion: string;
  aiArtifactExitFullscreen: string;
  aiArtifactCollapse: string;
  aiArtifactExpand: string;
  aiArtifactEdit: string;
  aiArtifactDone: string;
  aiArtifactGenerating: string;
  aiArtifactEmpty: string;

  // AI: context panel
  aiContextLabel: string;
  aiContextEmpty: string;
  aiContextUsage: string;
  aiContextReady: string;
  aiContextError: string;
  aiContextPermissionRead: string;
  aiContextPermissionWrite: string;
  aiContextPermissionExecute: string;
  aiContextGroupFile: string;
  aiContextGroupDocument: string;
  aiContextGroupWorkspace: string;
  aiContextGroupTool: string;
  aiContextGroupDatasource: string;
  aiContextGroupInstruction: string;

  // AI: composer additions
  aiComposerInvalid: string;
  aiVoiceInput: string;

  // AI: conversation sidebar
  aiNewConversation: string;
  aiConversationsLabel: string;
  aiSearchConversations: string;
  aiNoConversations: string;
  aiNoConversationsMatch: string;
  aiGroupPinned: string;
  aiGroupToday: string;
  aiGroupYesterday: string;
  aiGroupPrevious7Days: string;
  aiGroupPrevious30Days: string;
  aiGroupOlder: string;
  aiConversationRename: string;
  aiConversationRenameLabel: string;
  aiConversationPin: string;
  aiConversationUnpin: string;
  aiConversationFavorite: string;
  aiConversationUnfavorite: string;
  aiConversationArchive: string;
  aiConversationUnarchive: string;
  aiConversationDelete: string;
  aiConversationMove: string;
  aiConversationActions: string;
  aiConversationMessages: string;
  aiShowArchived: string;
  aiHideArchived: string;
  aiFoldersLabel: string;
  aiProjectsLabel: string;
  aiAllConversations: string;
  aiFavoritesLabel: string;
  aiSyncSynced: string;
  aiSyncSyncing: string;
  aiSyncOffline: string;
  aiSyncFailed: string;
  aiSelectConversation: string;
  aiSelectAll: string;
  aiClearSelection: string;
  aiSelectedCount: string;
  aiExitSelection: string;

  // AI: template picker
  aiTemplatesLabel: string;
  aiSearchTemplates: string;
  aiNoTemplates: string;
  aiNoTemplatesMatch: string;
  aiTemplateAll: string;
  aiTemplateFavorites: string;
  aiTemplateRecent: string;
  aiTemplatePersonal: string;
  aiTemplateShared: string;
  aiTemplateSharedBy: string;
  aiTemplatePreview: string;
  aiTemplateVariables: string;
  aiTemplateInsert: string;
  aiTemplateRun: string;
  aiTemplateDuplicate: string;
  aiTemplateEdit: string;
  aiTemplateDelete: string;
  aiTemplateFavoriteAdd: string;
  aiTemplateFavoriteRemove: string;
  aiTemplateRequired: string;
  aiTemplateSelectPrompt: string;

  // AI: model selector
  aiModelLabel: string;
  aiSelectModel: string;
  aiModelAuto: string;
  aiModelAutoDescription: string;
  aiModelRecommended: string;
  aiModelSpeed: string;
  aiModelQuality: string;
  aiModelCost: string;
  aiModelContext: string;
  aiModelMaxOutput: string;
  aiModelTokens: string;
  aiModelSupportsText: string;
  aiModelSupportsImage: string;
  aiModelSupportsAudio: string;
  aiModelSupportsVideo: string;
  aiModelSupportsTools: string;
  aiModelSupportsVision: string;
  aiModelUnavailable: string;
  aiModelRateLimited: string;
  aiModelQuotaExceeded: string;
  aiModelNotEntitled: string;
  aiModelRegionRestricted: string;
  aiModelDeprecated: string;
  aiModelOffline: string;
  aiRatingLow: string;
  aiRatingMedium: string;
  aiRatingHigh: string;
  aiNoModels: string;

  // AI: agent selector
  aiAgentLabel: string;
  aiSelectAgent: string;
  aiAgentSkills: string;
  aiAgentTools: string;
  aiAgentPermissions: string;
  aiAgentPermissionRead: string;
  aiAgentPermissionWrite: string;
  aiAgentPermissionExecute: string;
  aiAgentRequiresApproval: string;
  aiAgentNeedsApproval: string;
  aiAgentRecent: string;
  aiAgentFavorites: string;
  aiAgentAll: string;
  aiAgentOnline: string;
  aiAgentBusy: string;
  aiAgentUnavailable: string;
  aiAgentOffline: string;
  aiAgentCreate: string;
  aiAgentConfigure: string;
  aiNoAgents: string;
  aiSearchAgents: string;

  // AI: knowledge picker
  aiKnowledgeLabel: string;
  aiSearchFiles: string;
  aiKnowledgeSources: string;
  aiKnowledgeUpload: string;
  aiKnowledgeUploadHint: string;
  aiKnowledgeRecent: string;
  aiKnowledgeBrowse: string;
  aiKnowledgeRoot: string;
  aiKnowledgeEmpty: string;
  aiKnowledgeNoMatch: string;
  aiKnowledgeFilters: string;
  aiKnowledgeAllTypes: string;
  aiKnowledgeOpenFolder: string;
  aiKnowledgeSelectFile: string;
  aiKnowledgeAddToContext: string;
  aiKnowledgeAddCount: string;
  aiKnowledgeClear: string;
  aiKnowledgeUploading: string;
  aiKnowledgeIndexFailed: string;
  aiPermissionGranted: string;
  aiKnowledgePermissionDenied: string;
  aiKnowledgePermissionPrompt: string;
  aiKnowledgePermissionExpired: string;
  aiKnowledgeRequestAccess: string;
  aiKnowledgeProgress: string;

  // AI: retrieval results
  aiRetrievalLabel: string;
  aiRetrievalCount: string;
  aiRetrievalEmpty: string;
  aiRetrievalNoMatch: string;
  aiRetrievalPartial: string;
  aiRetrievalPartialSources: string;
  aiRetrievalSearching: string;
  aiRetrievalFailed: string;
  aiRetrievalSortBy: string;
  aiRetrievalSortRelevance: string;
  aiRetrievalSortRecency: string;
  aiRetrievalSortTitle: string;
  aiRetrievalRelevance: string;
  aiRetrievalExpand: string;
  aiRetrievalCollapse: string;
  aiRetrievalAdd: string;
  aiRetrievalRemove: string;
  aiRetrievalInContext: string;
  aiRetrievalOpen: string;
  aiRetrievalKindPassage: string;
  aiRetrievalKindDocument: string;
  aiRetrievalKindRecord: string;
  aiRetrievalKindImage: string;
  aiRetrievalKindCode: string;
  aiRetrievalKindWeb: string;

  // AI: command palette
  aiCommandsLabel: string;
  aiCommandPlaceholder: string;
  aiCommandEmpty: string;
  aiCommandNoMatch: string;
  aiCommandRecent: string;
  aiCommandSuggested: string;
  aiCommandOther: string;
  aiCommandKindTool: string;
  aiCommandKindAgent: string;
  aiCommandKindAction: string;
  aiCommandKindNavigation: string;
  aiCommandKindPrompt: string;
  aiCommandRun: string;
  aiCommandUnavailable: string;
  aiCommandPreviewEmpty: string;
  aiCommandNavigateHint: string;
  aiCommandSelectHint: string;
  aiCommandCloseHint: string;

  // AI: editor toolbar
  aiEditorLabel: string;
  aiEditorRewrite: string;
  aiEditorShorten: string;
  aiEditorExpand: string;
  aiEditorImproveClarity: string;
  aiEditorFixGrammar: string;
  aiEditorChangeTone: string;
  aiEditorTranslate: string;
  aiEditorSummarize: string;
  aiEditorExplain: string;
  aiEditorContinue: string;
  aiEditorGenerate: string;
  aiEditorMoreActions: string;
  aiEditorBack: string;
  aiEditorNoSelection: string;

  // AI: inline suggestions
  aiInlineLabel: string;
  aiInlineAccept: string;
  aiInlineAcceptWord: string;
  aiInlineReject: string;
  aiInlineRegenerate: string;
  aiInlineUndo: string;
  aiInlineAccepted: string;
  aiInlineThinking: string;
  aiInlineFailed: string;
  aiInlineNoSuggestion: string;
  aiInlineHintAccept: string;
  aiInlineHintWord: string;
  aiInlineHintReject: string;

  // AI: diff review
  aiDiffLabel: string;
  aiDiffOriginal: string;
  aiDiffGenerated: string;
  aiDiffViewInline: string;
  aiDiffViewSideBySide: string;
  aiDiffAcceptHunk: string;
  aiDiffRejectHunk: string;
  aiDiffAcceptAll: string;
  aiDiffRejectAll: string;
  aiDiffRestore: string;
  aiDiffExplain: string;
  aiDiffApply: string;
  aiDiffPrevChange: string;
  aiDiffNextChange: string;
  aiDiffChangeCount: string;
  aiDiffNoChanges: string;
  aiDiffAccepted: string;
  aiDiffRejected: string;
  aiDiffPending: string;
  aiDiffKindAdded: string;
  aiDiffKindRemoved: string;
  aiDiffKindModified: string;
  aiDiffChangePosition: string;

  // AI: structured output
  aiStructuredLabel: string;
  aiStructuredConfirm: string;
  aiStructuredCancel: string;
  aiStructuredCopyJson: string;
  aiStructuredCopied: string;
  aiStructuredRegenerateField: string;
  aiStructuredMissing: string;
  aiStructuredMissingCount: string;
  aiStructuredRequired: string;
  aiStructuredInvalidNumber: string;
  aiStructuredInvalidEmail: string;
  aiStructuredInvalidUrl: string;
  aiStructuredInvalidDate: string;
  aiStructuredEmpty: string;
  aiStructuredGenerating: string;
  aiStructuredSubmitted: string;
  aiStructuredChoose: string;
  aiStructuredYes: string;
  aiStructuredNo: string;

  // AI: search experience
  aiSearchLabel: string;
  aiSearchPlaceholder: string;
  aiSearchSubmit: string;
  aiSearchScope: string;
  aiSearchFilters: string;
  aiSearchClearFilters: string;
  aiSearchSuggestions: string;
  aiSearchAnswer: string;
  aiSearchAnswerGenerating: string;
  aiSearchProgress: string;
  aiSearchStepPending: string;
  aiSearchStepRunning: string;
  aiSearchStepDone: string;
  aiSearchStepFailed: string;
  aiSearchResults: string;
  aiSearchResultCount: string;
  aiSearchNoResults: string;
  aiSearchNoAnswer: string;
  aiSearchNoAnswerHint: string;
  aiSearchPartial: string;
  aiSearchFollowUps: string;
  aiSearchEmpty: string;
  aiSearchFailed: string;
  aiSearchRetry: string;

  // AI: generation controls
  aiGenerationLabel: string;
  aiGenerationGenerate: string;
  aiGenerationStop: string;
  aiGenerationRegenerate: string;
  aiGenerationCount: string;
  aiGenerationAspectRatio: string;
  aiGenerationResolution: string;
  aiGenerationQuality: string;
  aiGenerationStyle: string;
  aiGenerationSeed: string;
  aiGenerationSeedRandom: string;
  aiGenerationSeedHint: string;
  aiGenerationCreativity: string;
  aiGenerationCreativityLow: string;
  aiGenerationCreativityHigh: string;
  aiGenerationReference: string;
  aiGenerationReferenceHint: string;
  aiGenerationNegative: string;
  aiGenerationNegativeHint: string;
  aiGenerationReset: string;
  aiGenerationAdvanced: string;
  aiGenerationNoControls: string;
  aiGenerationGenerating: string;

  // AI: generation gallery
  aiGalleryLabel: string;
  aiGalleryEmpty: string;
  aiGalleryGenerating: string;
  aiGalleryFailed: string;
  aiGalleryFilters: string;
  aiGalleryLayout: string;
  aiGalleryLayoutGrid: string;
  aiGalleryLayoutList: string;
  aiGalleryPreview: string;
  aiGalleryClosePreview: string;
  aiGallerySelect: string;
  aiGalleryDeselect: string;
  aiGallerySelectedCount: string;
  aiGalleryRegenerate: string;
  aiGalleryVariation: string;
  aiGalleryEdit: string;
  aiGalleryCrop: string;
  aiGalleryUpscale: string;
  aiGalleryCompare: string;
  aiGalleryStopCompare: string;
  aiGalleryDownload: string;
  aiGalleryDelete: string;
  aiGalleryFavorite: string;
  aiGalleryUnfavorite: string;
  aiGalleryDetails: string;
  aiGalleryPrompt: string;
  aiGallerySeedLabel: string;
  aiGalleryModelLabel: string;
  aiGalleryDimensions: string;
  aiGalleryHistory: string;
  aiGalleryFavorites: string;
  aiGalleryAll: string;
  aiGalleryCompareHint: string;

  // AI: workflow timeline
  aiWorkflowLabel: string;
  aiWorkflowEmpty: string;
  aiWorkflowStepPlanned: string;
  aiWorkflowStepRunning: string;
  aiWorkflowStepCompleted: string;
  aiWorkflowStepFailed: string;
  aiWorkflowStepSkipped: string;
  aiWorkflowStepBlocked: string;
  aiWorkflowStepWaitingApproval: string;
  aiWorkflowDependsOn: string;
  aiWorkflowParallel: string;
  aiWorkflowShowLogs: string;
  aiWorkflowHideLogs: string;
  aiWorkflowRetryStep: string;
  aiWorkflowPause: string;
  aiWorkflowResume: string;
  aiWorkflowCancel: string;
  aiWorkflowResult: string;
  aiWorkflowRunning: string;
  aiWorkflowPaused: string;
  aiWorkflowCompleted: string;
  aiWorkflowFailedRun: string;
  aiWorkflowCanceled: string;
  aiWorkflowProgress: string;
  aiWorkflowDuration: string;

  // AI: memory manager
  aiMemoryLabel: string;
  aiMemoryEmpty: string;
  aiMemoryEnable: string;
  aiMemoryEnabled: string;
  aiMemoryDisabled: string;
  aiMemoryAdd: string;
  aiMemoryAddPlaceholder: string;
  aiMemoryEdit: string;
  aiMemoryDelete: string;
  aiMemorySave: string;
  aiMemoryCancel: string;
  aiMemorySource: string;
  aiMemorySourceConversation: string;
  aiMemorySourceManual: string;
  aiMemorySourceImported: string;
  aiMemorySourceInferred: string;
  aiMemoryProject: string;
  aiMemoryTemporary: string;
  aiMemoryTemporaryHint: string;
  aiMemoryPrivacy: string;
  aiMemoryPrivacyBody: string;
  aiMemorySensitive: string;
  aiMemoryConfirmDelete: string;
  aiMemoryConfirmDeleteBody: string;
  aiMemoryClearAll: string;

  // AI: settings
  aiSettingsLabel: string;
  aiSettingsModel: string;
  aiSettingsResponseLength: string;
  aiSettingsLengthBrief: string;
  aiSettingsLengthBalanced: string;
  aiSettingsLengthDetailed: string;
  aiSettingsTone: string;
  aiSettingsToneNeutral: string;
  aiSettingsToneFriendly: string;
  aiSettingsToneFormal: string;
  aiSettingsToneConcise: string;
  aiSettingsLanguage: string;
  aiSettingsLanguageAuto: string;
  aiSettingsCreativity: string;
  aiSettingsCitations: string;
  aiSettingsCitationsAlways: string;
  aiSettingsCitationsWhenUseful: string;
  aiSettingsCitationsNever: string;
  aiSettingsSearch: string;
  aiSettingsSearchOff: string;
  aiSettingsSearchKnowledge: string;
  aiSettingsSearchWeb: string;
  aiSettingsSearchBoth: string;
  aiSettingsTools: string;
  aiSettingsToolsHint: string;
  aiSettingsMemory: string;
  aiSettingsRetention: string;
  aiSettingsRetentionSession: string;
  aiSettingsRetention30: string;
  aiSettingsRetention1Year: string;
  aiSettingsRetentionForever: string;
  aiSettingsInstructions: string;
  aiSettingsInstructionsHint: string;
  aiSettingsInstructionsPlaceholder: string;
  aiSettingsSave: string;
  aiSettingsSaved: string;
  aiSettingsReset: string;

  // AI: usage meter
  aiUsageLabel: string;
  aiUsageUsed: string;
  aiUsageUsedUnmetered: string;
  aiUsageRemaining: string;
  aiUsageTokensLabel: string;
  aiUsageResetsLabel: string;
  aiUsageTokens: string;
  aiUsageToday: string;
  aiUsageThisMonth: string;
  aiUsageResets: string;
  aiUsageByModel: string;
  aiUsageRequests: string;
  aiUsageEstimatedCost: string;
  aiUsageCostUnavailable: string;
  aiUsageStatusOk: string;
  aiUsageStatusWarning: string;
  aiUsageStatusExceeded: string;
  aiUsageStatusRateLimited: string;
  aiUsageRateLimitRetry: string;
  aiUsageUpgrade: string;
  aiUsageUpgradeHint: string;
  aiUsageEmpty: string;
  aiUsageUnmetered: string;

  // AI: feedback
  aiFeedbackLabel: string;
  aiFeedbackGood: string;
  aiFeedbackBad: string;
  aiFeedbackRating: string;
  aiFeedbackWhy: string;
  aiFeedbackIncorrect: string;
  aiFeedbackUnsafe: string;
  aiFeedbackIncomplete: string;
  aiFeedbackIrrelevant: string;
  aiFeedbackComment: string;
  aiFeedbackCommentPlaceholder: string;
  aiFeedbackIncludeContext: string;
  aiFeedbackPrivacy: string;
  aiFeedbackSubmit: string;
  aiFeedbackCancel: string;
  aiFeedbackThanks: string;
  aiFeedbackSending: string;
  aiFeedbackFailed: string;

  // AI: error recovery
  aiErrorLabel: string;
  aiErrorNetwork: string;
  aiErrorOffline: string;
  aiErrorTimeout: string;
  aiErrorRateLimit: string;
  aiErrorQuota: string;
  aiErrorPermission: string;
  aiErrorTool: string;
  aiErrorToolNamed: string;
  aiErrorAttachment: string;
  aiErrorContentFilter: string;
  aiErrorModelUnavailable: string;
  aiErrorInterrupted: string;
  aiErrorUnknown: string;
  aiErrorNotRecoverable: string;
  aiErrorRetry: string;
  aiErrorEditPrompt: string;
  aiErrorContinue: string;
  aiErrorSwitchModel: string;
  aiErrorRemoveAttachment: string;
  aiErrorReconnect: string;
  aiErrorUpgrade: string;
  aiErrorRequestAccess: string;
  aiErrorDismiss: string;
  aiErrorRetryIn: string;
  aiErrorShowDetail: string;
  aiErrorHideDetail: string;
  aiErrorPartialKept: string;

  // AI: voice
  aiVoiceLabel: string;
  aiVoiceStart: string;
  aiVoiceStop: string;
  aiVoiceListening: string;
  aiVoiceProcessing: string;
  aiVoiceSpeaking: string;
  aiVoiceConnecting: string;
  aiVoiceIdle: string;
  aiVoiceInterrupt: string;
  aiVoiceMute: string;
  aiVoiceUnmute: string;
  aiVoiceMuted: string;
  aiVoiceTranscript: string;
  aiVoiceTranscriptEmpty: string;
  aiVoiceSelectVoice: string;
  aiVoiceSpeed: string;
  aiVoiceInputDevice: string;
  aiVoiceOutputDevice: string;
  aiVoicePermissionPrompt: string;
  aiVoicePermissionDenied: string;
  aiVoicePermissionRequest: string;
  aiVoiceDisconnected: string;
  aiVoiceReconnect: string;
  aiVoiceError: string;
  aiVoiceWaveform: string;

  // AI: human handoff
  aiHandoffLabel: string;
  aiHandoffEscalate: string;
  aiHandoffReason: string;
  aiHandoffReasonPlaceholder: string;
  aiHandoffSummary: string;
  aiHandoffSummaryHint: string;
  aiHandoffChannel: string;
  aiHandoffChannelChat: string;
  aiHandoffChannelEmail: string;
  aiHandoffChannelPhone: string;
  aiHandoffChannelTicket: string;
  aiHandoffSubmit: string;
  aiHandoffCancel: string;
  aiHandoffRequested: string;
  aiHandoffQueued: string;
  aiHandoffQueuePosition: string;
  aiHandoffWait: string;
  aiHandoffAssigned: string;
  aiHandoffActive: string;
  aiHandoffResolved: string;
  aiHandoffUnavailable: string;
  aiHandoffReference: string;
  aiHandoffResumeAi: string;

  // AI: notifications
  aiNotifyGenerationComplete: string;
  aiNotifyFileProcessed: string;
  aiNotifyExportReady: string;
  aiNotifyApprovalRequired: string;
  aiNotifyAgentBlocked: string;
  aiNotifyUsageWarning: string;
  aiNotifyConnectionLost: string;
  aiNotifyActionComplete: string;
  aiNotifyView: string;
  aiNotifyDismiss: string;

  // AI: onboarding
  aiOnboardingLabel: string;
  aiOnboardingSkip: string;
  aiOnboardingResume: string;
  aiOnboardingNext: string;
  aiOnboardingBack: string;
  aiOnboardingDone: string;
  aiOnboardingStepOf: string;
  aiOnboardingCapabilities: string;
  aiOnboardingExamples: string;
  aiOnboardingUpload: string;
  aiOnboardingUploadBody: string;
  aiOnboardingTools: string;
  aiOnboardingToolsBody: string;
  aiOnboardingMemory: string;
  aiOnboardingMemoryBody: string;
  aiOnboardingConnect: string;
  aiOnboardingConnectBody: string;

  // Authorization administration
  authorizationBackToRoles: string;
  authorizationAssignmentAllowed: string;
  authorizationAssignmentApplicationScope: string;
  authorizationAssignmentApply: string;
  authorizationAssignmentApprovalRequested: string;
  authorizationAssignmentCheck: string;
  authorizationAssignmentChooseRole: string;
  authorizationAssignmentDenied: string;
  authorizationAssignmentDescription: string;
  authorizationAssignmentDescendants: string;
  authorizationAssignmentGranted: string;
  authorizationAssignmentIndeterminate: string;
  authorizationAssignmentImpact: string;
  authorizationAssignmentImpactDescription: string;
  authorizationAssignmentInheritance: string;
  authorizationAssignmentMutationCouldNotComplete: string;
  authorizationAssignmentNoRoles: string;
  authorizationAssignmentPreflightCouldNotLoad: string;
  authorizationAssignmentReason: string;
  authorizationAssignmentReasonPlaceholder: string;
  authorizationAssignmentRequestApproval: string;
  authorizationAssignmentResourceScope: string;
  authorizationAssignmentRequiredFields: string;
  authorizationAssignmentRole: string;
  authorizationAssignmentRolesCouldNotLoad: string;
  authorizationAssignmentScopeId: string;
  authorizationAssignmentScopeIdPlaceholder: string;
  authorizationAssignmentScopeType: string;
  authorizationAssignmentStepUp: string;
  authorizationAssignmentStartsAt: string;
  authorizationAssignmentThisScopeOnly: string;
  authorizationAssignmentTitle: string;
  authorizationAssignmentTenantScope: string;
  authorizationAssignmentExpiresAt: string;
  authorizationAssignmentPermanent: string;
  authorizationAssignmentWindowHint: string;
  authorizationAssignmentWindowInvalid: string;
  authorizationAssignmentWindowOrder: string;
  authorizationAssignmentWindowPlaceholder: string;
  authorizationAccessGraphTitle: string;
  authorizationAccessGraphDescription: string;
  authorizationAccessGraphEmpty: string;
  authorizationAccessGraphApplication: string;
  authorizationAccessGraphRole: string;
  authorizationAccessGraphPermission: string;
  authorizationAccessGraphSource: string;
  authorizationUserAccessSubtitle: string;
  authorizationUserAccessMfaWarning: string;
  authorizationUserAccessStatApplications: string;
  authorizationUserAccessLastSignIn: string;
  authorizationUserAccessStatAllowed: string;
  authorizationUserAccessStatDenied: string;
  authorizationUserAccessStatFromGroups: string;
  authorizationUserAccessGrantsTitle: string;
  authorizationUserAccessGrantsDescription: string;
  authorizationUserAccessSearchPlaceholder: string;
  authorizationUserAccessSearchLabel: string;
  authorizationUserAccessEffectFilter: string;
  authorizationUserAccessSourceFilter: string;
  authorizationUserAccessAnyEffect: string;
  authorizationUserAccessAnySource: string;
  authorizationUserAccessAllow: string;
  authorizationUserAccessDeny: string;
  authorizationUserAccessDirect: string;
  authorizationUserAccessFromGroup: string;
  authorizationUserAccessShown: string;
  authorizationUserAccessNoGrantMatch: string;
  authorizationUserAccessNoGrantMatchHint: string;
  authorizationUserAccessNoApplications: string;
  authorizationUserAccessHasAccess: string;
  authorizationUserAccessNoAccess: string;
  authorizationUserAccessNoGrants: string;
  authorizationUserAccessDenyOverrides: string;
  authorizationUserAccessSnapshot: string;
  authorizationUserAccessExplainRow: string;
  authorizationUserAccessPathsTitle: string;
  authorizationUserAccessPathsDescription: string;
  authorizationUserAccessPathsEmpty: string;
  authorizationUserAccessViaGroup: string;
  authorizationUserAccessAssignedDirectly: string;
  authorizationUserAccessGroupsTitle: string;
  authorizationUserAccessGroupsEmpty: string;
  authorizationUserAccessWindowStarts: string;
  authorizationUserAccessWindowExpires: string;
  authorizationUserAccessExplainTitle: string;
  authorizationUserAccessExplainDescription: string;
  authorizationUserAccessMatchedRoles: string;
  authorizationUserAccessPermissionCount: string;
  authorizationUserAccessOnePermission: string;
  authorizationApplicationAccessTitle: string;
  authorizationApplicationAccessDescription: string;
  authorizationApplicationAccessLoading: string;
  authorizationApplicationAccessError: string;
  authorizationApplicationAccessEmpty: string;
  authorizationApplicationAccessUnavailable: string;
  authorizationApplicationAccessPermissions: string;
  authorizationApplicationAccessRoles: string;
  authorizationApplicationAccessUsers: string;
  authorizationApplicationAccessGroups: string;
  authorizationApplicationAccessAssignments: string;
  authorizationApplicationAccessScopes: string;
  authorizationApplicationAccessAccessRoles: string;
  authorizationApplicationAccessInactive: string;
  authorizationApplicationAccessDeprecated: string;
  authorizationProviderResultsTitle: string;
  authorizationRoleImpactTitle: string;
  authorizationRoleImpactDescription: string;
  authorizationRoleImpactLoading: string;
  authorizationRoleImpactError: string;
  authorizationRoleImpactDirectUsers: string;
  authorizationRoleImpactGroups: string;
  authorizationRoleImpactEffectiveUsers: string;
  authorizationRoleImpactScopes: string;
  authorizationRoleImpactApplications: string;
  authorizationRoleImpactAssignments: string;
  authorizationRoleImpactPermissions: string;
  authorizationRoleImpactRequired: string;
  authorizationRoleApplicationHint: string;
  authorizationRolePermissionsMismatch: string;
  authorizationCompare: string;
  authorizationCompareRoles: string;
  authorizationCompareRolesDescription: string;
  authorizationCompareRolesHint: string;
  authorizationConsideredGrants: string;
  authorizationDifference: string;
  authorizationEffectivePermissions: string;
  authorizationFirstRole: string;
  authorizationNoEffectivePermissions: string;
  authorizationNoGrantsMatchedScope: string;
  authorizationNoRolePermissions: string;
  authorizationOnlyIn: string;
  authorizationPermission: string;
  authorizationPermissionsCompared: string;
  authorizationPermissionsSubtitle: string;
  authorizationPermissionsSearchPlaceholder: string;
  authorizationPermissionsSearchLabel: string;
  authorizationPermissionsRiskFilter: string;
  authorizationPermissionsResourceFilter: string;
  authorizationPermissionsAllRisk: string;
  authorizationPermissionsAllResources: string;
  authorizationPermissionsDeprecatedOnly: string;
  authorizationPermissionsShown: string;
  authorizationPermissionsNoMatchTitle: string;
  authorizationPermissionsNoMatchDescription: string;
  authorizationPermissionsCatalogEmptyTitle: string;
  authorizationPermissionsCatalogEmptyDescription: string;
  authorizationPermissionsLoadFailed: string;
  authorizationPermissionsInCatalog: string;
  authorizationPermissionsNeedsReview: string;
  authorizationPermissionsResources: string;
  authorizationPermissionsDeprecated: string;
  authorizationPermissionsGrantedByRoles: string;
  authorizationPermissionsGrantedByOneRole: string;
  authorizationPermissionsGrantedByNoRole: string;
  authorizationPermissionsUnusedHint: string;
  authorizationPermissionsReplacedBy: string;
  authorizationPermissionsKeyCopied: string;
  authorizationPermissionsDetailsTitle: string;
  authorizationPermissionsRolesGranting: string;
  authorizationPermissionsNoDescription: string;
  authorizationPermissionsRisk: string;
  authorizationPermissionsResourceType: string;
  authorizationPermissionsApplication: string;
  authorizationPermissionsKey: string;
  authorizationPermissionsRiskStandard: string;
  authorizationPermissionsRiskElevated: string;
  authorizationPermissionsRiskPrivileged: string;
  authorizationPermissionsRiskCritical: string;
  authorizationRequestedScope: string;
  authorizationRoleComparisonCouldNotLoad: string;
  authorizationRoleOption: string;
  authorizationRoleScope: string;
  authorizationRolesCouldNotLoad: string;
  authorizationSameApplicationRequired: string;
  authorizationSecondRole: string;
  authorizationSelectRole: string;
  authorizationSelectTwoDifferentRoles: string;
  authorizationShared: string;
  authorizationTenantScope: string;
  authorizationVersus: string;
  authorizationResourceAccessTitle: string;
  authorizationResourceAccessDescription: string;
  authorizationResourceAccessNew: string;
  authorizationResourceAccessEmpty: string;
  authorizationResourceAccessLoadError: string;
  authorizationResourceAccessApplication: string;
  authorizationResourceAccessPermission: string;
  authorizationResourceAccessPrincipal: string;
  authorizationResourceAccessScope: string;
  authorizationResourceAccessEffect: string;
  authorizationResourceAccessInheritance: string;
  authorizationResourceAccessStarts: string;
  authorizationResourceAccessExpires: string;
  authorizationResourceAccessStatus: string;
  authorizationResourceAccessSource: string;
  authorizationResourceAccessCreateTitle: string;
  authorizationResourceAccessEditTitle: string;
  authorizationResourceAccessReview: string;
  authorizationResourceAccessPreflight: string;
  authorizationResourceAccessPreflightDescription: string;
  authorizationResourceAccessExplain: string;
  authorizationResourceAccessExplainTitle: string;
  authorizationResourceAccessNoContributions: string;
  authorizationResourceAccessScopePath: string;
  authorizationResourceAccessSearchScopes: string;
  authorizationResourceAccessScopeRequired: string;
  authorizationResourceAccessSaved: string;
  authorizationResourceAccessDeleted: string;
  authorizationResourceAccessCouldNotSave: string;
  authorizationResourceAccessCouldNotDelete: string;
  authorizationGovernanceTitle: string;
  authorizationGovernanceDescription: string;
  authorizationGovernanceBoundaries: string;
  authorizationGovernanceGrantablePermissions: string;
  authorizationGovernanceCreateGrantable: string;
  authorizationGovernanceGrantableError: string;
  authorizationGovernanceAuthorities: string;
  authorizationGovernanceProtectedRoles: string;
  authorizationGovernanceConstraints: string;
  authorizationGovernanceAccessRequests: string;
  authorizationGovernanceAccessReviews: string;
  authorizationGovernanceNoAuthorities: string;
  authorizationGovernanceNoGrantablePermissions: string;
  authorizationGovernanceNoPolicies: string;
  authorizationGovernanceNoConstraints: string;
  authorizationGovernanceNoRequests: string;
  authorizationGovernanceNoReviews: string;
  authorizationGovernanceDecision: string;
  authorizationGovernanceViolations: string;
  authorizationGovernanceRequiresApproval: string;
  authorizationGovernanceCreateBoundary: string;
  authorizationGovernanceBoundarySaved: string;
  authorizationGovernanceBoundaryError: string;
  authorizationGovernanceProtected: string;
  authorizationGovernanceRestriction: string;
  authorizationGovernanceEditPolicy: string;
  authorizationGovernancePolicySaved: string;
  authorizationGovernanceRequestsTitle: string;
  authorizationGovernanceReviewsTitle: string;
  authorizationGovernanceRequestDetails: string;
  authorizationGovernanceRequestReason: string;
  authorizationGovernanceApprove: string;
  authorizationGovernanceReject: string;
  authorizationGovernanceApprovalReason: string;
  authorizationGovernanceRequestActionError: string;
  authorizationGovernanceAuditTrail: string;
  authorizationGovernanceCreateReview: string;
  authorizationGovernanceReviewEvidence: string;
  authorizationGovernanceKeep: string;
  authorizationGovernanceRevoke: string;
  authorizationGovernanceComplete: string;
  authorizationGovernanceReviewIncomplete: string;
  authorizationGovernanceReviewSaved: string;
  authorizationGovernanceReviewCreateError: string;
  authorizationGovernanceReviewActionError: string;
  authorizationGovernanceReviewDue: string;
  authorizationGovernanceReviewItems: string;
  authorizationGovernanceNotReviewed: string;
  authorizationGovernanceCompleted: string;
  authorizationGovernancePending: string;
  authorizationGovernanceActive: string;
  authorizationGovernanceRequired: string;

  // Authorization operations and enterprise-scale administration
  authorizationOperationsTitle: string;
  authorizationOperationsDescription: string;
  authorizationOperationsOverview: string;
  authorizationOperationsDiagnostics: string;
  authorizationOperationsAudit: string;
  authorizationOperationsDecisions: string;
  authorizationOperationsBulk: string;
  authorizationOperationsHealth: string;
  authorizationOperationsPrivilegedUsers: string;
  authorizationOperationsPendingRequests: string;
  authorizationOperationsActiveElevations: string;
  authorizationOperationsOverdueReviews: string;
  authorizationOperationsProvisioningConflicts: string;
  authorizationOperationsUnhealthyConnections: string;
  authorizationOperationsInvalidPolicies: string;
  authorizationOperationsShadowMismatches: string;
  authorizationOperationsDenyVolume: string;
  authorizationOperationsPolicyFailures: string;
  authorizationOperationsMissingAttributes: string;
  authorizationOperationsStaleProjections: string;
  authorizationOperationsReconciliationDrift: string;
  authorizationOperationsBlockedScopes: string;
  authorizationOperationsRevisionHeads: string;
  authorizationOperationsEscalationAttempts: string;
  authorizationOperationsAuditDescription: string;
  authorizationOperationsDecisionDescription: string;
  authorizationOperationsDecisionId: string;
  authorizationOperationsTime: string;
  authorizationOperationsAction: string;
  authorizationOperationsActor: string;
  authorizationOperationsSeverity: string;
  authorizationOperationsRequestId: string;
  authorizationOperationsSubjectId: string;
  authorizationOperationsResource: string;
  authorizationOperationsRevision: string;
  authorizationOperationsTarget: string;
  authorizationOperationsOutcome: string;
  authorizationOperationsNoAudit: string;
  authorizationOperationsNoDecision: string;
  authorizationOperationsAuditError: string;
  authorizationOperationsDecisionError: string;
  authorizationOperationsLoadError: string;
  authorizationOperationsApplication: string;
  authorizationOperationsRole: string;
  authorizationOperationsPermission: string;
  authorizationOperationsFrom: string;
  authorizationOperationsTo: string;
  authorizationOperationsHealthHealthy: string;
  authorizationOperationsHealthDegraded: string;
  authorizationOperationsHealthUnhealthy: string;
  authorizationOperationsViewDetails: string;
  authorizationOperationsRedactedDetails: string;
  authorizationBulkTitle: string;
  authorizationBulkDescription: string;
  authorizationBulkSelectUsers: string;
  authorizationBulkSelectedUsers: string;
  authorizationBulkRole: string;
  authorizationBulkScopeType: string;
  authorizationBulkScopeId: string;
  authorizationBulkReason: string;
  authorizationBulkPreview: string;
  authorizationBulkCommit: string;
  authorizationBulkRollback: string;
  authorizationBulkImpact: string;
  authorizationBulkPartialFailure: string;
  authorizationBulkPreviewRequired: string;
  authorizationBulkNoUsers: string;
  authorizationBulkLoadError: string;
  authorizationBulkActionError: string;
  authorizationBulkPreviewReady: string;
  authorizationBulkCommitted: string;
  authorizationBulkRolledBack: string;
  authorizationBulkApprovalRequired: string;
  authorizationBulkBlocked: string;
  authorizationBulkSelectAtLeastOne: string;
  authorizationBulkRollbackReason: string;
  authorizationBulkRollbackConfirmation: string;
  authorizationBulkReasonRequired: string;
  forbiddenEyebrow: string;
  forbiddenTitle: string;
  forbiddenDescription: string;
  forbiddenHelp: string;
  forbiddenGoToDashboard: string;
  forbiddenSignOut: string;

  // Authorization policy administration
  authorizationPoliciesTitle: string;
  authorizationPoliciesDescription: string;
  authorizationPoliciesList: string;
  authorizationPoliciesBindings: string;
  authorizationPoliciesSimulation: string;
  authorizationPoliciesDiagnostics: string;
  authorizationPoliciesOverview: string;
  authorizationPoliciesDefinition: string;
  authorizationPoliciesVersions: string;
  authorizationPoliciesShadowResults: string;
  authorizationPoliciesDetail: string;
  authorizationPoliciesNew: string;
  authorizationPoliciesOpen: string;
  authorizationPoliciesSearch: string;
  authorizationPoliciesApplication: string;
  authorizationPoliciesApplicationPlaceholder: string;
  authorizationPoliciesName: string;
  authorizationPoliciesOwner: string;
  authorizationPoliciesRisk: string;
  authorizationPoliciesStandard: string;
  authorizationPoliciesSystemOwner: string;
  authorizationPoliciesApplicationOwner: string;
  authorizationPoliciesTenantOwner: string;
  authorizationPoliciesKey: string;
  authorizationPoliciesKeyPlaceholder: string;
  authorizationPoliciesDescriptionLabel: string;
  authorizationPoliciesStatus: string;
  authorizationPoliciesActiveVersion: string;
  authorizationPoliciesHealth: string;
  authorizationPoliciesEmpty: string;
  authorizationPoliciesAllStates: string;
  authorizationPoliciesCreateTitle: string;
  authorizationPoliciesCreate: string;
  authorizationPoliciesCritical: string;
  authorizationPoliciesCriticalHint: string;
  authorizationPoliciesRequiredFields: string;
  authorizationPoliciesCreated: string;
  authorizationPoliciesLoadError: string;
  authorizationPoliciesDetailError: string;
  authorizationPoliciesCreateError: string;
  authorizationPoliciesDefinitionDescription: string;
  authorizationPoliciesMatchMode: string;
  authorizationPoliciesAllConditions: string;
  authorizationPoliciesAnyCondition: string;
  authorizationPoliciesNegate: string;
  authorizationPoliciesConditions: string;
  authorizationPoliciesAddCondition: string;
  authorizationPoliciesRemoveCondition: string;
  authorizationPoliciesLiteralPlaceholder: string;
  authorizationPoliciesAttributeValue: string;
  authorizationPoliciesLiteralValue: string;
  authorizationPoliciesSaveDraft: string;
  authorizationPoliciesDraftSaved: string;
  authorizationPoliciesValidationIssues: string;
  authorizationPoliciesAdvancedDefinition: string;
  authorizationPoliciesExpression: string;
  authorizationPoliciesNotValidated: string;
  authorizationPoliciesAttributes: string;
  authorizationPoliciesAttributesDescription: string;
  authorizationPoliciesSensitive: string;
  authorizationPoliciesAttributesUnavailable: string;
  authorizationPoliciesValidate: string;
  authorizationPoliciesValidated: string;
  authorizationPoliciesValidationError: string;
  authorizationPoliciesNoVersions: string;
  authorizationPoliciesVersion: string;
  authorizationPoliciesRollback: string;
  authorizationPoliciesRollbackTitle: string;
  authorizationPoliciesRollbackDescription: string;
  authorizationPoliciesRollbackWarning: string;
  authorizationPoliciesRollbackAuditNote: string;
  authorizationPoliciesRollbackCompleted: string;
  authorizationPoliciesRollbackError: string;
  authorizationPoliciesBindingsDescription: string;
  authorizationPoliciesAddBinding: string;
  authorizationPoliciesEditBinding: string;
  authorizationPoliciesNoBindings: string;
  authorizationPoliciesBindingsLoadError: string;
  authorizationPoliciesPermission: string;
  authorizationPoliciesResourceType: string;
  authorizationPoliciesResourceId: string;
  authorizationPoliciesScope: string;
  authorizationPoliciesScopeType: string;
  authorizationPoliciesScopeId: string;
  authorizationPoliciesScopePlaceholder: string;
  authorizationPoliciesInheritance: string;
  authorizationPoliciesThisScopeOnly: string;
  authorizationPoliciesDescendants: string;
  authorizationPoliciesEffect: string;
  authorizationPoliciesRequire: string;
  authorizationPoliciesDeny: string;
  authorizationPoliciesMode: string;
  authorizationPoliciesEnforced: string;
  authorizationPoliciesShadow: string;
  authorizationPoliciesDisabled: string;
  authorizationPoliciesSamplingRate: string;
  authorizationPoliciesShadowStarts: string;
  authorizationPoliciesShadowEnds: string;
  authorizationPoliciesUserExplanation: string;
  authorizationPoliciesAdminExplanation: string;
  authorizationPoliciesBindingRequiredFields: string;
  authorizationPoliciesSamplingInvalid: string;
  authorizationPoliciesBindingSaved: string;
  authorizationPoliciesBindingDeleted: string;
  authorizationPoliciesBindingError: string;
  authorizationPoliciesSelectPolicyFirst: string;
  authorizationPoliciesActivationSafety: string;
  authorizationPoliciesActivationSafetyDescription: string;
  authorizationPoliciesImpactPrincipal: string;
  authorizationPoliciesImpactRequired: string;
  authorizationPoliciesSimulationDescription: string;
  authorizationPoliciesNonMutating: string;
  authorizationPoliciesPrincipal: string;
  authorizationPoliciesCurrentVersion: string;
  authorizationPoliciesCandidateVersion: string;
  authorizationPoliciesSelectVersion: string;
  authorizationPoliciesAttributeOverrides: string;
  authorizationPoliciesAttributeOverridesHint: string;
  authorizationPoliciesBaseDecision: string;
  authorizationPoliciesRunSimulation: string;
  authorizationPoliciesRunImpact: string;
  authorizationPoliciesSimulationRequiredFields: string;
  authorizationPoliciesAttributesJsonInvalid: string;
  authorizationPoliciesSimulationError: string;
  authorizationPoliciesDecisionTrace: string;
  authorizationPoliciesBaseAuthority: string;
  authorizationPoliciesPolicyDecision: string;
  authorizationPoliciesFinalDecision: string;
  authorizationPoliciesAllow: string;
  authorizationPoliciesMatchedRules: string;
  authorizationPoliciesNoRulesMatched: string;
  authorizationPoliciesMissingAttributes: string;
  authorizationPoliciesCandidateDecision: string;
  authorizationPoliciesImpact: string;
  authorizationPoliciesImpactDescription: string;
  authorizationPoliciesEvaluatedSamples: string;
  authorizationPoliciesChangedSamples: string;
  authorizationPoliciesEstimated: string;
  authorizationPoliciesImpactSafetyNote: string;
  authorizationPoliciesImpactError: string;
  authorizationPoliciesYes: string;
  authorizationPoliciesNo: string;
  authorizationPoliciesShadowDescription: string;
  authorizationPoliciesRefreshDiagnostics: string;
  authorizationPoliciesRecordedMismatches: string;
  authorizationPoliciesAllowToDeny: string;
  authorizationPoliciesDenyToAllow: string;
  authorizationPoliciesDiagnosticsUnavailable: string;
  authorizationPoliciesNoMismatches: string;
  authorizationPoliciesMismatch: string;
  authorizationPoliciesReason: string;
  authorizationPoliciesProduction: string;
  authorizationPoliciesObserved: string;
  authorizationPoliciesDiagnosticsError: string;
  authorizationPoliciesDraft: string;
  authorizationPoliciesValidatedState: string;
  authorizationPoliciesActive: string;
  authorizationPoliciesInactive: string;
  authorizationPoliciesDeprecated: string;
  authorizationPoliciesInvalid: string;
  authorizationPoliciesShadowing: string;
  authorizationPoliciesValid: string;
  authorizationPoliciesMissingProvider: string;
  authorizationPoliciesStaleProjection: string;
  authorizationPoliciesEvaluationErrors: string;
  authorizationPoliciesOperatorEqual: string;
  authorizationPoliciesOperatorNotEqual: string;
  authorizationPoliciesOperatorGreaterThan: string;
  authorizationPoliciesOperatorGreaterThanOrEqual: string;
  authorizationPoliciesOperatorLessThan: string;
  authorizationPoliciesOperatorLessThanOrEqual: string;
  authorizationPoliciesOperatorContains: string;
  authorizationPoliciesOperatorIn: string;
  authorizationPoliciesOperatorStartsWith: string;
  authorizationPoliciesStringType: string;
  authorizationPoliciesBooleanType: string;
  authorizationPoliciesIntegerType: string;
  authorizationPoliciesDecimalType: string;

  authorizationProvisioningTitle: string;
  authorizationProvisioningDescription: string;
  authorizationProvisioningConnections: string;
  authorizationProvisioningExternalMappings: string;
  authorizationProvisioningConflicts: string;
  authorizationProvisioningReconciliation: string;
  authorizationProvisioningHealth: string;
  authorizationProvisioningNoConnections: string;
  authorizationProvisioningConnectionsLoadError: string;
  authorizationProvisioningProvider: string;
  authorizationProvisioningProviderType: string;
  authorizationProvisioningLastSync: string;
  authorizationProvisioningLastReconciled: string;
  authorizationProvisioningProvisionedUsers: string;
  authorizationProvisioningProvisionedGroups: string;
  authorizationProvisioningMappingCount: string;
  authorizationProvisioningDrift: string;
  authorizationProvisioningPendingConflicts: string;
  authorizationProvisioningConnectionDetails: string;
  authorizationProvisioningOpenProviderSettings: string;
  authorizationProvisioningOpenScimSettings: string;
  authorizationProvisioningViewMappings: string;
  authorizationProvisioningHealthHealthy: string;
  authorizationProvisioningHealthDegraded: string;
  authorizationProvisioningHealthBroken: string;
  authorizationProvisioningHealthSynchronizationBehind: string;
  authorizationProvisioningHealthMappingUnresolved: string;
  authorizationProvisioningMappingsLoadError: string;
  authorizationProvisioningNoMappings: string;
  authorizationProvisioningNewMapping: string;
  authorizationProvisioningEditMapping: string;
  authorizationProvisioningMappingProvider: string;
  authorizationProvisioningMappingSource: string;
  authorizationProvisioningExternalObject: string;
  authorizationProvisioningTarget: string;
  authorizationProvisioningApplication: string;
  authorizationProvisioningApplicationPlaceholder: string;
  authorizationProvisioningTargetId: string;
  authorizationProvisioningTargetIdPlaceholder: string;
  authorizationProvisioningScopeType: string;
  authorizationProvisioningScopeId: string;
  authorizationProvisioningInheritance: string;
  authorizationProvisioningMappingEnabled: string;
  authorizationProvisioningGroupSource: string;
  authorizationProvisioningClaimSource: string;
  authorizationProvisioningRoleTarget: string;
  authorizationProvisioningGroupTarget: string;
  authorizationProvisioningApplicationAccessTarget: string;
  authorizationProvisioningPreviewMapping: string;
  authorizationProvisioningApplyMapping: string;
  authorizationProvisioningPreviewDescription: string;
  authorizationProvisioningPreviewImpact: string;
  authorizationProvisioningExternalMembers: string;
  authorizationProvisioningKnownUsers: string;
  authorizationProvisioningNewAssignments: string;
  authorizationProvisioningRisk: string;
  authorizationProvisioningWarnings: string;
  authorizationProvisioningPreviewRequired: string;
  authorizationProvisioningPreviewBlocked: string;
  authorizationProvisioningMappingRequiredFields: string;
  authorizationProvisioningMappingPreviewError: string;
  authorizationProvisioningMappingSaved: string;
  authorizationProvisioningMappingSaveError: string;
  authorizationProvisioningDisableMapping: string;
  authorizationProvisioningMappingDeleted: string;
  authorizationProvisioningMappingDeleteError: string;
  authorizationProvisioningConflictStatus: string;
  authorizationProvisioningConflictReason: string;
  authorizationProvisioningConflictDetail: string;
  authorizationProvisioningCreated: string;
  authorizationProvisioningNoConflicts: string;
  authorizationProvisioningConflictLoadError: string;
  authorizationProvisioningIgnoreConflict: string;
  authorizationProvisioningConflictResolved: string;
  authorizationProvisioningConflictActionError: string;
  authorizationProvisioningAllStatuses: string;
  authorizationProvisioningPending: string;
  authorizationProvisioningBlocked: string;
  authorizationProvisioningResolved: string;
  authorizationProvisioningIgnored: string;
  authorizationProvisioningReconciliationTitle: string;
  authorizationProvisioningReconciliationDescription: string;
  authorizationProvisioningReconciliationMode: string;
  authorizationProvisioningObserve: string;
  authorizationProvisioningRepair: string;
  authorizationProvisioningRunDryRun: string;
  authorizationProvisioningRunRepair: string;
  authorizationProvisioningReconciliationStatus: string;
  authorizationProvisioningLastSuccessfulSync: string;
  authorizationProvisioningLastFailure: string;
  authorizationProvisioningReconciliationResult: string;
  authorizationProvisioningAdds: string;
  authorizationProvisioningRemoves: string;
  authorizationProvisioningRepairs: string;
  authorizationProvisioningReconciliationRunError: string;
  authorizationProvisioningStatusLoadError: string;
  authorizationProvisioningStatusUnavailable: string;
  authorizationProvisioningDecisionAllowed: string;
  authorizationProvisioningDecisionBlocked: string;
  authorizationProvisioningHealthTitle: string;
  authorizationProvisioningHealthDescription: string;

  authorizationPrivilegedAccessTitle: string;
  authorizationPrivilegedAccessDescription: string;
  authorizationPrivilegedAccessRequests: string;
  authorizationPrivilegedAccessActiveElevations: string;
  authorizationPrivilegedAccessHistory: string;
  authorizationPrivilegedAccessNewRequest: string;
  authorizationPrivilegedAccessNoRequests: string;
  authorizationPrivilegedAccessNoActiveElevations: string;
  authorizationPrivilegedAccessNoHistory: string;
  authorizationPrivilegedAccessLoadError: string;
  authorizationPrivilegedAccessRole: string;
  authorizationPrivilegedAccessPrincipal: string;
  authorizationPrivilegedAccessScope: string;
  authorizationPrivilegedAccessScopeType: string;
  authorizationPrivilegedAccessScopeId: string;
  authorizationPrivilegedAccessDuration: string;
  authorizationPrivilegedAccessDurationValue: string;
  authorizationPrivilegedAccessDurationHint: string;
  authorizationPrivilegedAccessReason: string;
  authorizationPrivilegedAccessReasonHint: string;
  authorizationPrivilegedAccessRequested: string;
  authorizationPrivilegedAccessStatus: string;
  authorizationPrivilegedAccessActivated: string;
  authorizationPrivilegedAccessStarts: string;
  authorizationPrivilegedAccessExpires: string;
  authorizationPrivilegedAccessRevoked: string;
  authorizationPrivilegedAccessRemaining: string;
  authorizationPrivilegedAccessRequestTitle: string;
  authorizationPrivilegedAccessRequestDescription: string;
  authorizationPrivilegedAccessPreflight: string;
  authorizationPrivilegedAccessPreflightDescription: string;
  authorizationPrivilegedAccessPreflightRequired: string;
  authorizationPrivilegedAccessCheck: string;
  authorizationPrivilegedAccessRequest: string;
  authorizationPrivilegedAccessRequired: string;
  authorizationPrivilegedAccessApproval: string;
  authorizationPrivilegedAccessApprover: string;
  authorizationPrivilegedAccessStepUp: string;
  authorizationPrivilegedAccessMaximumDuration: string;
  authorizationPrivilegedAccessRisk: string;
  authorizationPrivilegedAccessConflicts: string;
  authorizationPrivilegedAccessDecisionAllowed: string;
  authorizationPrivilegedAccessDecision: string;
  authorizationPrivilegedAccessRequiredFields: string;
  authorizationPrivilegedAccessPreflightError: string;
  authorizationPrivilegedAccessRequestError: string;
  authorizationPrivilegedAccessDetailError: string;
  authorizationPrivilegedAccessActionError: string;
  authorizationPrivilegedAccessDetails: string;
  authorizationPrivilegedAccessApprove: string;
  authorizationPrivilegedAccessActivate: string;
  authorizationPrivilegedAccessRevoke: string;
  authorizationPrivilegedAccessRevokeReason: string;
  authorizationPrivilegedAccessApprovalHistory: string;
  authorizationPrivilegedAccessAuditTrail: string;
  authorizationPrivilegedAccessNoAudit: string;
  authorizationPrivilegedAccessApprovalRequested: string;
  authorizationPrivilegedAccessRequestedSuccess: string;
  authorizationPrivilegedAccessApproved: string;
  authorizationPrivilegedAccessActivatedSuccess: string;
  authorizationPrivilegedAccessRevokedSuccess: string;
  authorizationPrivilegedAccessStateActive: string;
  authorizationPrivilegedAccessStateExpiringSoon: string;
  authorizationPrivilegedAccessStateExpired: string;
  authorizationPrivilegedAccessStateRevoked: string;
}

export type SpI18nLabelKey = keyof SpI18nLabels;

/**
 * American English labels. Every other locale pack falls back to these, so a pack
 * only needs the keys it actually translates.
 */
export const SP_I18N_DEFAULT_LABELS: SpI18nLabels = {
  // Common actions
  add: 'Add',
  and: 'and',
  apply: 'Apply',
  back: 'Back',
  build: 'Build',
  cancel: 'Cancel',
  clear: 'Clear',
  clearAll: 'Clear all',
  clearSearch: 'Clear search',
  close: 'Close',
  collapse: 'Collapse',
  collapseAll: 'Collapse all',
  confirm: 'Confirm',
  copy: 'Copy',
  custom: 'Custom',
  delete: 'Delete',
  discard: 'Discard',
  dismiss: 'Dismiss',
  done: 'Done',
  duplicate: 'Duplicate',
  edit: 'Edit',
  expand: 'Expand',
  expandAll: 'Expand all',
  export: 'Export',
  filter: 'Filter',
  filters: 'Filters',
  for: 'For',
  hideAll: 'Hide all',
  insert: 'Insert',
  less: 'Less',
  more: 'more',
  moreNotifications: '{count} more',
  notifications: 'Notifications',
  moveDown: 'Move down',
  moveUp: 'Move up',
  next: 'Next',
  none: 'None',
  of: 'of',
  on: 'On',
  or: 'or',
  preview: 'Preview',
  previous: 'Previous',
  redo: 'Redo',
  refresh: 'Refresh',
  remove: 'Remove',
  rename: 'Rename',
  reset: 'Reset',
  restore: 'Restore',
  save: 'Save',
  search: 'Search',
  select: 'Select...',
  selectAll: 'Select all',
  send: 'Send',
  showAll: 'Show all',
  skip: 'Skip',
  skipToContent: 'Skip to main content',
  split: 'Split',
  undo: 'Undo',
  unlink: 'Unlink',
  upload: 'Upload',

  // Common nouns and states
  color: 'Color',
  column: 'Column',
  columns: 'Columns',
  comment: 'Comment',
  condition: 'Condition',
  description: 'Description',
  fields: 'Fields',
  group: 'Group',
  helperText: 'Helper text',
  items: 'Items',
  label: 'Label',
  loading: 'Loading...',
  loadingMore: 'Loading more...',
  location: 'Location',
  max: 'Max',
  maxLength: 'Max length',
  min: 'Min',
  minLength: 'Min length',
  modified: 'Modified',
  name: 'Name',
  noData: 'No data',
  noOptions: 'No options',
  noResults: 'No results',
  noSuggestions: 'No suggestions',
  opacity: 'Opacity',
  options: 'Options',
  placeholder: 'Placeholder',
  progress: 'Progress',
  circularProgress: 'Circular progress',
  properties: 'Properties',
  record: 'Record',
  reply: 'Reply',
  required: 'Required',
  row: 'Row',
  rows: 'Rows',
  rule: 'Rule',
  section: 'Section',
  size: 'Size',
  style: 'Style',
  suggestions: 'Suggestions',
  tab: 'Tab',
  text: 'Text',
  title: 'Title',
  untitled: 'Untitled',
  value: 'Value',
  visibility: 'Visibility',
  width: 'Width',

  // Text formatting and editors
  addBlock: 'Add block',
  addBlockBelow: 'Add block below',
  alignCenter: 'Align center',
  alignLeft: 'Align left',
  alignRight: 'Align right',
  annotation: 'Annotation',
  annotationText: 'Annotation text',
  blockquote: 'Blockquote',
  bold: 'Bold',
  bulletList: 'Bullet list',
  closeFind: 'Close find',
  codeBlock: 'Code block',
  columnsLayout: 'Columns layout',
  deleteBlock: 'Delete block',
  diagramView: 'Diagram view',
  doneEditingLink: 'Done editing link',
  dragToReorder: 'Drag to reorder',
  dragToReorderOrClickForOptions: 'Drag to reorder, or click for block options',
  editLink: 'Edit link',
  editMode: 'Edit mode',
  editorContent: 'Editor content',
  enterText: 'Enter text...',
  enterUrl: 'Enter URL...',
  equationView: 'Equation view',
  find: 'Find',
  findInDocument: 'Find in document',
  findInEditor: 'Find in editor',
  fontSize: 'Font size',
  formatDocument: 'Format document',
  formattingOptions: 'Formatting options',
  goToLineNumber: 'Go to line number',
  heading: 'Heading',
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  highlightColor: 'Highlight color',
  horizontalRule: 'Horizontal rule',
  htmlSource: 'HTML source',
  inlineCode: 'Inline code',
  insertEmoji: 'Insert emoji',
  insertImage: 'Insert image',
  insertLink: 'Insert link',
  italic: 'Italic',
  latexEquationSyntax: 'LaTeX equation syntax',
  link: 'Link',
  linkTitleOptional: 'Link title (optional)',
  linkUrl: 'Link URL',
  markdownFormatting: 'Markdown formatting',
  markdownPreview: 'Markdown preview',
  mention: 'Mention',
  mentionSuggestions: 'Mention suggestions',
  mermaidDiagramSyntax: 'Mermaid diagram syntax',
  nextMatch: 'Next match',
  nextMatchHint: 'Next match (Enter)',
  noLinkClickToAdd: 'No link — click to add',
  noTags: 'No tags',
  numberedList: 'Numbered list',
  paragraph: 'Paragraph',
  pasteImageUrl: 'Paste an image URL and press Enter',
  pasteOrTypeLink: 'Paste or type a link, then Enter',
  previewMode: 'Preview mode',
  previousMatch: 'Previous match',
  previousMatchHint: 'Previous match (Shift+Enter)',
  redoHint: 'Redo (Ctrl+Y)',
  removeLink: 'Remove link',
  renderedEquation: 'Rendered equation',
  searchEmojis: 'Search emojis',
  strikethrough: 'Strikethrough',
  subscript: 'Subscript',
  superscript: 'Superscript',
  table: 'Table',
  tableControls: 'Table controls',
  textColor: 'Text color',
  typeMentionTrigger: 'Type @',
  underline: 'Underline',
  undoHint: 'Undo (Ctrl+Z)',

  // Diff editor
  deletions: 'Deletions',
  inline: 'Inline',
  insertions: 'Insertions',
  navigateChanges: 'Navigate changes',
  nextChange: 'Next change',
  previousChange: 'Previous change',
  sideBySide: 'Side by side',

  // Dates, time, and calendars
  amPm: 'AM/PM',
  dateInput: 'Date input',
  dateRangeCalendar: 'Date range calendar',
  dateRangePresets: 'Date range presets',
  dateTimeInput: 'Date and time input',
  day: 'Day',
  daily: 'Daily',
  days: 'days',
  decreaseHours: 'Decrease hours',
  decreaseMinutes: 'Decrease minutes',
  decreaseSeconds: 'Decrease seconds',
  endDate: 'End date',
  endMustBeAfterStart: 'End must be after start.',
  goToToday: 'Go to today',
  hideCalendar: 'Hide calendar',
  hour: 'Hour',
  hours: 'Hours',
  increaseHours: 'Increase hours',
  increaseMinutes: 'Increase minutes',
  increaseSeconds: 'Increase seconds',
  minutes: 'Minutes',
  month: 'Month',
  monthly: 'Monthly',
  months: 'months',
  nextMonth: 'Next month',
  nextYear: 'Next year',
  nextYears: 'Next years',
  openCalendar: 'Open calendar',
  openDateTimePicker: 'Open date time picker',
  previousMonth: 'Previous month',
  previousYear: 'Previous year',
  previousYears: 'Previous years',
  seconds: 'Seconds',
  selectDate: 'Select date',
  selectEndDate: 'Select end date',
  selectMonthAndYear: 'Select month and year',
  selectRange: 'Select range',
  selectStartDate: 'Select start date',
  selectTime: 'Select time',
  selectYear: 'Select year',
  showCalendar: 'Show calendar',
  startDate: 'Start date',
  time: 'Time',
  timezone: 'Timezone',
  timezoneHelper: 'Stored with the event for display and app persistence.',
  today: 'Today',
  week: 'Week',
  weekAbbreviation: 'Wk',
  weekly: 'Weekly',
  weeks: 'weeks',
  workWeek: 'Work Week',
  year: 'Year',
  yearly: 'Yearly',
  years: 'years',

  // Timezone names
  alaskaTime: 'Alaska Time',
  centralEurope: 'Central Europe',
  centralTime: 'Central Time',
  easternTime: 'Eastern Time',
  hawaiiTime: 'Hawaii Time',
  london: 'London',
  manila: 'Manila',
  mountainTime: 'Mountain Time',
  pacificTime: 'Pacific Time',
  singapore: 'Singapore',
  sydney: 'Sydney',
  tokyo: 'Tokyo',

  // Scheduler
  afterOccurrences: 'After occurrences',
  agenda: 'Agenda',
  agendaView: 'Agenda view',
  allDay: 'All day',
  availability: 'Availability',
  busy: 'Busy',
  calendar: 'Calendar',
  calendars: 'Calendars',
  calendarViews: 'Calendar views',
  category: 'Category',
  closeEventList: 'Close event list',
  deleteEvent: 'Delete event',
  deleteEventConfirm: 'Delete this event?',
  deleteOccurrenceOrSeriesConfirm: 'Delete this event or the entire series?',
  editOccurrenceOrSeriesConfirm: 'Apply change to this event or the entire series?',
  descriptionPlaceholder: 'Add notes or context',
  doesNotRepeat: 'Does not repeat',
  editEvent: 'Edit event',
  ends: 'Ends',
  enterTitle: 'Enter a title.',
  entireSeries: 'Entire series',
  eventCalendar: 'Event calendar',
  eventColor: 'Event color',
  eventDetails: 'Event details',
  eventLocation: 'Event location',
  eventStartDay: 'the event start day',
  eventTitle: 'Event title',
  every: 'Every',
  focusTime: 'Focus time',
  free: 'Free',
  hourBefore: 'hour before',
  locationPlaceholder: 'Add a room, address, or meeting link',
  meeting: 'Meeting',
  minutesBefore: 'minutes before',
  moveEventTo: 'Move to {schedule}',
  never: 'Never',
  newEvent: 'New event',
  noCalendar: 'No calendar',
  noCategory: 'No category',
  noEventsInPeriod: 'No events in this period.',
  noResource: 'No resource',
  occurrences: 'Occurrences',
  onDate: 'On date',
  outOfOffice: 'Out of office',
  personal: 'Personal',
  private: 'Private',
  public: 'Public',
  recurrenceEndMustBeAfterStart: 'Recurrence end must be after start.',
  recurringEvent: 'Recurring event',
  reminder: 'Reminder',
  repeatEvery: 'Repeat every',
  repeatOn: 'Repeat on',
  repeatOnDays: 'Repeat on days',
  repeats: 'Repeats',
  repeatsEvery: 'Repeats every',
  resource: 'Resource',
  scheduleDayView: 'Schedule day view',
  schedulerToolbar: 'Scheduler toolbar',
  series: 'Series',
  showAllEventsFor: 'Show all events for',
  showAsAllDayEvent: 'Show as an all-day event',
  tentative: 'Tentative',
  thisEvent: 'This event',
  timeline: 'Timeline',
  timelineView: 'Timeline view',
  times: 'times',
  travel: 'Travel',
  treeView: 'Tree view',
  until: 'Until',
  untilChangedOrDeleted: 'until it is changed or deleted',
  useColor: 'Use color',

  // Gantt
  dayScale: 'Day scale',
  ganttChartControls: 'Gantt chart controls',
  hourScale: 'Hour scale',
  monthScale: 'Month scale',
  owner: 'Owner',
  resizeColumnNamed: 'Resize {name} column',
  resizeTaskList: 'Resize task list',
  scrollToToday: 'Scroll to today',
  start: 'Start',
  end: 'End',
  task: 'Task',
  taskList: 'Task list',
  toggleChildren: 'Toggle children',
  weekScale: 'Week scale',

  // Data grids
  actions: 'Actions',
  addNewRow: 'Add new row',
  allRowsLoaded: 'All rows loaded',
  availableColumns: 'Available columns',
  chooseAtLeastOneColumn: 'Choose at least one column to display data.',
  clearAllGrouping: 'Clear all grouping',
  clearFilters: 'Clear filters',
  closeDetailPane: 'Close detail pane',
  closeDetailPaneForRow: 'Close detail pane for {row}',
  collapseGroupRows: 'Collapse {label}, {count} {rowWord}',
  columnMenu: 'Column menu',
  columnVisibility: 'Column visibility',
  detailsForRow: 'Details for {row}',
  dragColumnToGroup: 'Drag a column to group',
  dragHandle: 'Drag handle',
  dragHandleColumn: 'Drag handle column',
  dropColumnToGroup: 'Drop the column here to group',
  expandGroupRows: 'Expand {label}, {count} {rowWord}',
  filterActive: 'Filter active',
  filterValue: 'Filter value…',
  firstPage: 'First page',
  groupedColumns: 'Grouped columns',
  hideColumnSelector: 'Hide {label}',
  hideDetailsForRow: 'Hide details for {row}',
  lastPage: 'Last page',
  nextPage: 'Next page',
  noColumnsSelected: 'No columns selected',
  noFilterCondition: 'No condition',
  noMatchingValues: 'No matching values',
  noRowsOnPage: 'No rows on this page',
  openColumnMenu: 'Open menu for {column}',
  page: 'Page',
  pagination: 'Pagination',
  paginationPageCompact: 'Page {current}',
  paginationPageTotal: 'Page {current} of {total}',
  paginationRangeCompact: '{start}–{end}',
  paginationRangeTotal: '{start}–{end} of {total}',
  previousPage: 'Previous page',
  removeColumn: 'Remove column',
  removeColumnGrouping: 'Remove {column} grouping',
  removeGrouping: 'Remove grouping',
  resizeColumn: 'Resize {column} column',
  resizeColumnGroup: 'Resize {group} column group',
  rowActions: 'Row actions',
  rowDetails: 'Row details',
  rowNumber: 'Row number',
  rowSelection: 'Row selection',
  searchValues: 'Search values',
  selectAllRows: 'Select all rows',
  selectAllRowsOnPage: 'Select all rows on this page',
  showColumnSelector: 'Show {label}',
  showDetailPaneForRow: 'Show detail pane for {row}',
  showDetailsForRow: 'Show details for {row}',
  to: 'To',
  toggleDetails: 'Toggle details',
  valuesForColumn: 'Values for {column}',
  zeroRows: '0 rows',

  // Filter builder
  filterCondition: 'Filter condition',
  filterLogic: 'Filter logic',
  noConditions: 'No conditions yet. Add a rule to get started.',
  upperBound: 'Upper bound…',

  // Form builder
  addColumn: 'Add column',
  addOption: 'Add option',
  addRow: 'Add row',
  addSection: 'Add section',
  deleteSection: 'Delete section',
  design: 'Design',
  editable: 'Editable',
  fieldPalette: 'Field palette',
  fieldProperties: 'Field properties',
  formBuilderToolbar: 'Form builder toolbar',
  maskPattern: 'Mask pattern',
  noFieldsYet: 'No fields yet — pick one from the palette.',
  noSectionsYet: 'No sections yet.',
  removeOption: 'Remove option',
  renameSection: 'Rename section',
  selectFieldToEdit: 'Select a field to edit its properties.',
  typeableInputMode: 'Typeable input mode',

  // Forms
  cardHolder: 'Card Holder',
  clearSignature: 'Clear signature',
  expires: 'Expires',
  removeFile: 'Remove file',
  signHere: 'Sign here',
  signatureDrawingArea: 'Signature drawing area — draw your signature here',
  signatureDrawingTools: 'Signature drawing tools',

  // Charts and diagrams
  arrowAtEnd: 'Arrow at end',
  arrowAtTargetEnd: 'Arrow at target end',
  autoLayoutLeftToRight: 'Auto layout left to right',
  autoLayoutTopToBottom: 'Auto layout top to bottom',
  bearish: 'Bearish',
  border: 'Border',
  borderColor: 'Border color',
  borderStyle: 'Border style',
  borderWidth: 'Border width',
  bullish: 'Bullish',
  chartLatest: 'Latest',
  chartTotal: 'Total',
  chartTypeBar: 'Bar chart',
  chartTypeDonut: 'Donut chart',
  chartTypeLine: 'Line chart',
  chartTypePie: 'Pie chart',
  chartTypeStackedBar: 'Stacked bar chart',
  connectTool: 'Connector tool (C)',
  connection: 'Connection',
  connectorLabel: 'Connector label',
  connectorRouteType: 'Connector route type',
  connectorTool: 'Connector tool',
  curve: 'Curve',
  dashDot: 'Dash-dot',
  dashed: 'Dashed',
  deleteSelected: 'Delete selected',
  diagramTools: 'Diagram tools',
  dotted: 'Dotted',
  fill: 'Fill',
  fillColor: 'Fill color',
  fillOpacity: 'Fill opacity',
  loadingMapData: 'Loading map data...',
  mean: 'Mean',
  orthogonal: 'Orthogonal',
  plainLine: 'Plain line',
  resetMapView: 'Reset map view',
  resetView: 'Reset view',
  resetZoom: 'Reset zoom',
  resetZoomAndPan: 'Reset zoom and pan',
  restart: 'Restart',
  route: 'Route',
  selectTool: 'Select tool',
  shapeText: 'Shape text',
  solid: 'Solid',
  source: 'Source',
  sourceEndType: 'Source end type',
  straight: 'Straight',
  stroke: 'Stroke',
  strokeColor: 'Stroke color',
  strokeStyle: 'Stroke style',
  strokeWidth: 'Stroke width',
  target: 'Target',
  targetEndType: 'Target end type',
  toggleArrowAtSourceEnd: 'Toggle arrow at source end',
  toggleArrowAtStart: 'Toggle arrow at start',

  // Image editor
  addAnnotation: 'Add annotation',
  adjust: 'Adjust',
  adjustments: 'Adjustments',
  annotations: 'Annotations',
  arrowAnnotation: 'Arrow annotation',
  aspectRatio: 'Aspect ratio',
  circleSelection: 'Circle selection',
  crop: 'Crop',
  cropSelection: 'Crop selection',
  dragToCreateSelection: 'Drag on the image to create a selection.',
  draw: 'Draw',
  ellipseAnnotation: 'Ellipse annotation',
  file: 'File',
  flipHorizontally: 'Flip horizontally',
  flipVertically: 'Flip vertically',
  history: 'History',
  imageAdjustments: 'Image adjustments',
  imageEditorTools: 'Image editor tools',
  imageOptions: 'Image options',
  lineAnnotation: 'Line annotation',
  loadImageToStart: 'Load an image to start editing.',
  output: 'Output',
  outputQuality: 'Output quality',
  quality: 'Quality',
  rectangleAnnotation: 'Rectangle annotation',
  resetEdits: 'Reset edits',
  resetZoomFit: 'Reset zoom/fit',
  rotateAnnotation: 'Rotate annotation',
  rotateLeft: 'Rotate left',
  scaleAnnotation: 'Scale annotation',
  selection: 'Selection',
  square: 'Square',
  squareSelection: 'Square selection',
  transform: 'Transform',
  uploadImage: 'Upload image',
  zoom: 'Zoom',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',

  // Overlays and feedback
  askAnything: 'Ask anything',
  closeEsc: 'Close (Esc)',
  closeLightbox: 'Close lightbox',
  commandPaletteResults: 'Results',
  commandPaletteNavigateHint: 'Navigate',
  commandPaletteSelectHint: 'Select',
  commandPaletteCloseHint: 'Close',
  dismissNotification: 'Dismiss notification',
  imageThumbnails: 'Image thumbnails',
  nextImage: 'Next image',
  nextSlide: 'Next slide',
  previousImage: 'Previous image',
  previousSlide: 'Previous slide',
  slideControls: 'Slide controls',

  // Layout, docks, and navigation
  allPanelsClosed: 'All panels closed',
  autoHidePanel: 'Auto-hide panel',
  breadcrumb: 'Breadcrumb',
  closePanel: 'Close panel',
  closePeek: 'Close peek',
  closeSidebar: 'Close sidebar',
  company: 'Company',
  companySwitcher: 'Company switcher',
  floatPanel: 'Float panel',
  floatTabGroup: 'Float tab group',
  imageComparisonSlider: 'Image comparison slider',
  maximize: 'Maximize',
  minimize: 'Minimize',
  noDocumentsOpen: 'No documents open',
  panel: 'Panel',
  pinToDock: 'Pin to dock',
  removeTab: 'Remove tab',
  renameTab: 'Rename tab',
  resizeSidebar: 'Resize sidebar',
  scrollTabsLeft: 'Scroll tabs left',
  scrollTabsRight: 'Scroll tabs right',
  scrollingContent: 'Scrolling content',
  selectCompany: 'Select company',
  switchCompany: 'Switch company',
  workspace: 'Workspace',

  // Data display
  addReaction: 'Add reaction',
  clearPropertySearch: 'Clear property search',
  clearTerminal: 'Clear terminal',
  dropCardsHere: 'Drop cards here',
  highValue: 'High value',
  lowValue: 'Low value',
  noOutputYet: 'No output yet.',
  propertyOrder: 'Property order',
  alphabetical: 'Alphabetical',
  categorized: 'Categorized',

  // Appearance and theming
  accent: 'Accent',
  accentColor: 'Accent color',
  auto: 'Auto',
  colorHarmony: 'Color harmony',
  harmonyBaseHue: 'Brand hue',
  harmonyCustom: 'Custom',
  harmonyPresets: 'Harmony presets',
  harmonyScheme: 'Harmony scheme',
  harmonySecondaryHue: 'Secondary hue offset',
  harmonyTertiaryHue: 'Tertiary hue offset',
  harmonyWheel: 'Color harmony wheel',
  schemeAnalogous: 'Analogous',
  schemeComplementary: 'Complementary',
  schemeMonochromatic: 'Monochromatic',
  schemeSplitComplementary: 'Split complementary',
  schemeTetradic: 'Tetradic',
  schemeTriadic: 'Triadic',
  secondaryAccent: 'Secondary accent',
  tertiaryAccent: 'Tertiary accent',
  changesApplyImmediately: 'Changes apply as you pick them',
  chooseCustomAccentColor: 'Choose custom accent color',
  closeAppearanceSettings: 'Close appearance settings',
  customAccentColor: 'Custom accent color',
  density: 'Density',
  filterThemesByMode: 'Filter themes by mode',
  gridView: 'Grid view',
  interfaceDensity: 'Interface density',
  listView: 'List view',
  livePreview: 'Live preview',
  messageBarActions: 'Message bar actions',
  preferences: 'Preferences',
  reduceMotion: 'Reduce motion',
  searchThemes: 'Search themes',
  system: 'System',
  systemDefault: 'System default',
  themeLayout: 'Theme layout',
  themePreset: 'Theme preset',

  // Component input defaults
  action: 'Action',
  addCommentPrompt: 'Add a comment…  Type @ to mention someone.',
  after: 'After',
  appearance: 'Appearance',
  appearanceDescription: 'Customize the look and feel',
  before: 'Before',
  carousel: 'Carousel',
  codeEditor: 'Code editor',
  commandPalette: 'Command palette',
  dataGrid: 'Data grid',
  dataGridStatus: 'Data grid status',
  dataGridTools: 'Data grid tools',
  details: 'Details',
  diffEditor: 'Diff editor',
  document: 'Document',
  download: 'Download',
  dropFilesHere: 'Drop files here or click to browse',
  editValue: 'Edit value',
  emoji: 'Emoji',
  enterPassword: 'Enter password',
  inplaceAccept: 'Accept changes',
  inplaceDiscard: 'Discard changes',
  featureNotIncluded: 'This feature isn’t included in your plan',
  fixValidationErrors: 'Fix validation errors before saving',
  focusPropertyForDescription: 'Focus a property to see its description.',
  imageComparison: 'Image comparison',
  imageEditor: 'Image editor',
  invalid: 'Invalid',
  kanbanBoard: 'Kanban board',
  layoutManager: 'Layout manager',
  loadingData: 'Loading data...',
  loadingPdf: 'Loading PDF',
  mainNavigation: 'Main navigation',
  misc: 'Misc',
  moreActions: 'More actions',
  moreOptions: 'More options',
  navigation: 'Navigation',
  newRow: 'New row',
  noCommentsYet: 'No comments yet. Start the conversation.',
  noDescriptionAvailable: 'No description is available for this property.',
  noMatchingRows: 'No matching rows',
  noPdfSelected: 'No PDF selected',
  noPropertiesFound: 'No properties found.',
  noRowsToDisplay: 'No rows to display',
  open: 'Open',
  openActionsMenu: 'Open actions menu',
  original: 'Original',
  popoverContent: 'Popover content',
  propertyPanel: 'Property panel',
  providePdfSource: 'Provide a PDF source URL to show the document preview.',
  rating: 'Rating',
  readOnly: 'Read-only',
  recommended: 'Recommended',
  resetToDefault: 'Reset to default',
  resizableSplitView: 'Resizable split view',
  searchProperties: 'Search properties',
  selectDateAndTime: 'Select date & time',
  splitButton: 'Split button',
  summary: 'Summary',
  terminalOutput: 'Terminal output',
  textDifference: 'Text difference',
  typeMarkdownHere: 'Type markdown here...',
  typeMentionPrompt: 'Type @ to mention someone...',
  upgradePlanToUnlock: 'Upgrade your plan to unlock it.',
  writeReply: 'Write a reply…',

  // Filter operators and column menus
  opAfter: 'After',
  opBefore: 'Before',
  opBetween: 'Between',
  opContains: 'Contains',
  opDoesNotContain: 'Does not contain',
  opDoesNotEqual: 'Does not equal',
  opEndsWith: 'Ends with',
  opEquals: 'Equals',
  opGreaterThan: 'Greater than',
  opGreaterThanOrEqual: 'Greater than or equal',
  opIs: 'Is',
  opIsBlank: 'Is blank',
  opIsEmpty: 'Is empty',
  opIsNot: 'Is not',
  opIsNotBlank: 'Is not blank',
  opIsNotEmpty: 'Is not empty',
  opLessThan: 'Less than',
  opLessThanOrEqual: 'Less than or equal',
  opNotEquals: 'Not equals',
  opStartsWith: 'Starts with',
  autoFitColumn: 'Auto-fit column',
  clearSorting: 'Clear sorting',
  hideColumn: 'Hide column',
  pinColumn: 'Pin column',
  pinLeft: 'Pin left',
  pinRight: 'Pin right',
  sortAscending: 'Sort ascending',
  sortDescending: 'Sort descending',
  unpin: 'Unpin',
  valueTrue: 'True',
  valueFalse: 'False',

  // Aggregates
  aggregate: 'Aggregate',
  aggregateAverage: 'Average',
  aggregateCount: 'Count',
  aggregateMaximum: 'Maximum',
  aggregateMinimum: 'Minimum',
  aggregateSum: 'Sum',

  // Clock periods
  am: 'AM',
  pm: 'PM',

  // AI Components
  aiSend: 'Send',
  aiStop: 'Stop generating',
  aiRetry: 'Retry',
  aiRegenerate: 'Regenerate',
  aiContinue: 'Continue generating',
  aiCopy: 'Copy',
  aiCopied: 'Copied!',
  aiLike: 'Good response',
  aiDislike: 'Bad response',
  aiReadAloud: 'Read aloud',
  aiShare: 'Share',
  aiReport: 'Report',
  aiScrollToLatest: 'Scroll to latest',
  aiTyping: 'Typing',
  aiGenerating: 'Generating',
  aiAnalyzing: 'Analyzing',
  aiSearching: 'Searching',
  aiEmptyConversation: 'Start a conversation',
  aiComposerPlaceholder: 'Type a message…',
  aiAttachFile: 'Attach file',
  aiRemoveAttachment: 'Remove attachment',
  aiCharCount: '{current} / {max}',
  aiSuggestionsDismiss: 'Dismiss suggestions',
  aiSuggestionsRefresh: 'Refresh suggestions',
  aiToolRunning: 'Running',
  aiToolCompleted: 'Completed',
  aiToolFailed: 'Failed',
  aiToolCanceled: 'Canceled',
  aiToolApprovalRequired: 'Approval required',
  aiToolDetails: 'Show details',
  aiApprove: 'Approve',
  aiReject: 'Reject',
  aiAlwaysAllow: 'Always allow',
  aiApprovalExpired: 'Approval expired',
  aiCitationUnavailable: 'Source unavailable',
  aiViewSource: 'View source',
  aiArtifactCopy: 'Copy content',
  aiArtifactExport: 'Export',
  aiArtifactDownload: 'Download',
  aiArtifactFullscreen: 'Full screen',
  aiContextRemove: 'Remove from context',
  aiContextProcessing: 'Processing',
  aiContextIndexing: 'Indexing',
  aiElapsedTime: '{time} elapsed',
  aiCancelGeneration: 'Cancel generation',
  aiMessageFailed: 'Message failed to send',
  aiMessageInterrupted: 'Generation interrupted',

  aiResponseActionsLabel: 'Response actions',
  aiSuggestionsLabel: 'Suggested prompts',
  aiConversationLabel: 'Conversation',
  aiMessageStreamingStatus: 'Generating a response',
  aiMessageCompletedStatus: 'Response ready',

  aiToolCallLabel: 'Tool call',
  aiToolInput: 'Input',
  aiToolResult: 'Result',
  aiToolHideDetails: 'Hide details',
  aiToolStartedAt: 'Started {time}',
  aiToolCompletedAt: 'Completed {time}',
  aiToolDuration: 'Took {duration}',
  aiToolCancel: 'Cancel tool call',
  aiToolSteps: 'Steps',

  aiApprovalLabel: 'Permission required',
  aiApprovalResources: 'Affected resources',
  aiApprovalParameters: 'Parameters',
  aiApprovalConsequence: 'Before you approve',
  aiApprovalDestructive: 'This action cannot be undone',
  aiApprovalConfirm: 'Yes, approve',
  aiApprovalConfirmPrompt: 'Approve this action?',
  aiApprovalCancel: 'Go back',
  aiApprovalApproved: 'Approved',
  aiApprovalRejected: 'Rejected',
  aiApprovalFailed: 'Approval failed',
  aiApprovalPending: 'Waiting for your decision',

  aiCitationLabel: 'Source {index}',
  aiCitationsLabel: 'Sources',
  aiCitationSources: '{count} sources',
  aiCitationExcerpt: 'Excerpt',
  aiCitationOpenSource: 'Open source',
  aiCitationCloseSource: 'Close source details',
  aiCitationBy: 'By {author}',

  aiArtifactLabel: 'Generated output',
  aiArtifactVersion: 'Version {version}',
  aiArtifactExitFullscreen: 'Exit full screen',
  aiArtifactCollapse: 'Collapse preview',
  aiArtifactExpand: 'Expand preview',
  aiArtifactEdit: 'Edit',
  aiArtifactDone: 'Done',
  aiArtifactGenerating: 'Generating output',
  aiArtifactEmpty: 'Nothing generated yet',

  aiContextLabel: 'Available context',
  aiContextEmpty: 'No context added',
  aiContextUsage: '{used} of {total} used',
  aiContextReady: 'Ready',
  aiContextError: 'Could not be processed',
  aiContextPermissionRead: 'Read only',
  aiContextPermissionWrite: 'Read and write',
  aiContextPermissionExecute: 'Can run',
  aiContextGroupFile: 'Files',
  aiContextGroupDocument: 'Documents',
  aiContextGroupWorkspace: 'Workspace',
  aiContextGroupTool: 'Tools',
  aiContextGroupDatasource: 'Data sources',
  aiContextGroupInstruction: 'Instructions',

  aiComposerInvalid: 'Fix the highlighted problem before sending',
  aiVoiceInput: 'Use voice input',

  aiNewConversation: 'New conversation',
  aiConversationsLabel: 'Conversations',
  aiSearchConversations: 'Search conversations',
  aiNoConversations: 'No conversations yet',
  aiNoConversationsMatch: 'No conversations match your search',
  aiGroupPinned: 'Pinned',
  aiGroupToday: 'Today',
  aiGroupYesterday: 'Yesterday',
  aiGroupPrevious7Days: 'Previous 7 days',
  aiGroupPrevious30Days: 'Previous 30 days',
  aiGroupOlder: 'Older',
  aiConversationRename: 'Rename',
  aiConversationRenameLabel: 'Conversation title',
  aiConversationPin: 'Pin',
  aiConversationUnpin: 'Unpin',
  aiConversationFavorite: 'Add to favorites',
  aiConversationUnfavorite: 'Remove from favorites',
  aiConversationArchive: 'Archive',
  aiConversationUnarchive: 'Unarchive',
  aiConversationDelete: 'Delete',
  aiConversationMove: 'Move to folder',
  aiConversationActions: 'Conversation actions',
  aiConversationMessages: '{count} messages',
  aiShowArchived: 'Show archived',
  aiHideArchived: 'Hide archived',
  aiFoldersLabel: 'Folders',
  aiProjectsLabel: 'Projects',
  aiAllConversations: 'All conversations',
  aiFavoritesLabel: 'Favorites',
  aiSyncSynced: 'Saved',
  aiSyncSyncing: 'Saving',
  aiSyncOffline: 'Saved on this device only',
  aiSyncFailed: 'Could not save',
  aiSelectConversation: 'Select conversation',
  aiSelectAll: 'Select all',
  aiClearSelection: 'Clear selection',
  aiSelectedCount: '{count} selected',
  aiExitSelection: 'Done selecting',

  aiTemplatesLabel: 'Prompt templates',
  aiSearchTemplates: 'Search templates',
  aiNoTemplates: 'No templates yet',
  aiNoTemplatesMatch: 'No templates match your search',
  aiTemplateAll: 'All',
  aiTemplateFavorites: 'Favorites',
  aiTemplateRecent: 'Recent',
  aiTemplatePersonal: 'Personal',
  aiTemplateShared: 'Shared',
  aiTemplateSharedBy: 'Shared by {owner}',
  aiTemplatePreview: 'Preview',
  aiTemplateVariables: 'Fill in the details',
  aiTemplateInsert: 'Insert',
  aiTemplateRun: 'Insert and run',
  aiTemplateDuplicate: 'Duplicate',
  aiTemplateEdit: 'Edit',
  aiTemplateDelete: 'Delete',
  aiTemplateFavoriteAdd: 'Add to favorites',
  aiTemplateFavoriteRemove: 'Remove from favorites',
  aiTemplateRequired: 'This field is required',
  aiTemplateSelectPrompt: 'Choose a template to preview it',

  aiModelLabel: 'Model',
  aiSelectModel: 'Select a model',
  aiModelAuto: 'Automatic',
  aiModelAutoDescription: 'Pick the best model for each request',
  aiModelRecommended: 'Recommended',
  aiModelSpeed: 'Speed',
  aiModelQuality: 'Quality',
  aiModelCost: 'Cost',
  aiModelContext: 'Context',
  aiModelMaxOutput: 'Max output',
  aiModelTokens: '{count} tokens',
  aiModelSupportsText: 'Text',
  aiModelSupportsImage: 'Images',
  aiModelSupportsAudio: 'Audio',
  aiModelSupportsVideo: 'Video',
  aiModelSupportsTools: 'Tools',
  aiModelSupportsVision: 'Vision',
  aiModelUnavailable: 'Unavailable',
  aiModelRateLimited: 'Rate limit reached',
  aiModelQuotaExceeded: 'Quota used up',
  aiModelNotEntitled: 'Not included in your plan',
  aiModelRegionRestricted: 'Not available in your region',
  aiModelDeprecated: 'No longer supported',
  aiModelOffline: 'Temporarily offline',
  aiRatingLow: 'Low',
  aiRatingMedium: 'Medium',
  aiRatingHigh: 'High',
  aiNoModels: 'No models available',

  aiAgentLabel: 'Agent',
  aiSelectAgent: 'Select an agent',
  aiAgentSkills: 'Skills',
  aiAgentTools: 'Tools',
  aiAgentPermissions: 'Permissions',
  aiAgentPermissionRead: 'Can read',
  aiAgentPermissionWrite: 'Can change',
  aiAgentPermissionExecute: 'Can run',
  aiAgentRequiresApproval: 'Asks before acting',
  aiAgentNeedsApproval: 'Needs approval',
  aiAgentRecent: 'Recent',
  aiAgentFavorites: 'Favorites',
  aiAgentAll: 'All agents',
  aiAgentOnline: 'Available',
  aiAgentBusy: 'Busy',
  aiAgentUnavailable: 'Unavailable',
  aiAgentOffline: 'Offline',
  aiAgentCreate: 'Create an agent',
  aiAgentConfigure: 'Configure',
  aiNoAgents: 'No agents available',
  aiSearchAgents: 'Search agents',

  aiKnowledgeLabel: 'Files and knowledge',
  aiSearchFiles: 'Search files',
  aiKnowledgeSources: 'Sources',
  aiKnowledgeUpload: 'Upload files',
  aiKnowledgeUploadHint: 'Drop files here or browse',
  aiKnowledgeRecent: 'Recent',
  aiKnowledgeBrowse: 'Browse',
  aiKnowledgeRoot: 'All files',
  aiKnowledgeEmpty: 'This folder is empty',
  aiKnowledgeNoMatch: 'No files match your search',
  aiKnowledgeFilters: 'File types',
  aiKnowledgeAllTypes: 'All types',
  aiKnowledgeOpenFolder: 'Open folder',
  aiKnowledgeSelectFile: 'Select file',
  aiKnowledgeAddToContext: 'Add to context',
  aiKnowledgeAddCount: 'Add {count} to context',
  aiKnowledgeClear: 'Clear selection',
  aiKnowledgeUploading: 'Uploading',
  aiKnowledgeIndexFailed: 'Could not be indexed',
  aiPermissionGranted: 'Access granted',
  aiKnowledgePermissionDenied: 'You do not have access',
  aiKnowledgePermissionPrompt: 'Access needed',
  aiKnowledgePermissionExpired: 'Access expired',
  aiKnowledgeRequestAccess: 'Request access',
  aiKnowledgeProgress: '{percent}% complete',

  aiRetrievalLabel: 'Search results',
  aiRetrievalCount: '{count} results',
  aiRetrievalEmpty: 'Nothing to show yet',
  aiRetrievalNoMatch: 'No results found',
  aiRetrievalPartial: 'Some sources did not respond',
  aiRetrievalPartialSources: 'Did not respond: {sources}',
  aiRetrievalSearching: 'Searching sources',
  aiRetrievalFailed: 'Search failed',
  aiRetrievalSortBy: 'Sort by',
  aiRetrievalSortRelevance: 'Relevance',
  aiRetrievalSortRecency: 'Most recent',
  aiRetrievalSortTitle: 'Title',
  aiRetrievalRelevance: 'Relevance {percent}%',
  aiRetrievalExpand: 'Show more',
  aiRetrievalCollapse: 'Show less',
  aiRetrievalAdd: 'Add to context',
  aiRetrievalRemove: 'Remove from context',
  aiRetrievalInContext: 'In context',
  aiRetrievalOpen: 'Open source',
  aiRetrievalKindPassage: 'Passage',
  aiRetrievalKindDocument: 'Document',
  aiRetrievalKindRecord: 'Record',
  aiRetrievalKindImage: 'Image',
  aiRetrievalKindCode: 'Code',
  aiRetrievalKindWeb: 'Web page',

  aiCommandsLabel: 'Commands',
  aiCommandPlaceholder: 'Type a command or ask a question',
  aiCommandEmpty: 'No commands available',
  aiCommandNoMatch: 'No commands match your search',
  aiCommandRecent: 'Recent',
  aiCommandSuggested: 'Suggested',
  aiCommandOther: 'Other',
  aiCommandKindTool: 'Tool',
  aiCommandKindAgent: 'Agent',
  aiCommandKindAction: 'Action',
  aiCommandKindNavigation: 'Go to',
  aiCommandKindPrompt: 'Prompt',
  aiCommandRun: 'Run',
  aiCommandUnavailable: 'Not available right now',
  aiCommandPreviewEmpty: 'Select a command to see what it does',
  aiCommandNavigateHint: 'Navigate',
  aiCommandSelectHint: 'Run',
  aiCommandCloseHint: 'Close',

  aiEditorLabel: 'AI writing actions',
  aiEditorRewrite: 'Rewrite',
  aiEditorShorten: 'Make shorter',
  aiEditorExpand: 'Make longer',
  aiEditorImproveClarity: 'Improve clarity',
  aiEditorFixGrammar: 'Correct grammar',
  aiEditorChangeTone: 'Change tone',
  aiEditorTranslate: 'Translate',
  aiEditorSummarize: 'Summarize',
  aiEditorExplain: 'Explain',
  aiEditorContinue: 'Continue writing',
  aiEditorGenerate: 'Generate from selection',
  aiEditorMoreActions: 'More actions',
  aiEditorBack: 'Back',
  aiEditorNoSelection: 'Select some text to use these actions',

  aiInlineLabel: 'Suggested continuation',
  aiInlineAccept: 'Accept',
  aiInlineAcceptWord: 'Accept next word',
  aiInlineReject: 'Dismiss',
  aiInlineRegenerate: 'Try again',
  aiInlineUndo: 'Undo',
  aiInlineAccepted: 'Suggestion applied',
  aiInlineThinking: 'Thinking',
  aiInlineFailed: 'Could not suggest anything',
  aiInlineNoSuggestion: 'No suggestion',
  aiInlineHintAccept: 'Accept',
  aiInlineHintWord: 'Word',
  aiInlineHintReject: 'Dismiss',

  aiDiffLabel: 'Review changes',
  aiDiffOriginal: 'Original',
  aiDiffGenerated: 'Suggested',
  aiDiffViewInline: 'Inline',
  aiDiffViewSideBySide: 'Side by side',
  aiDiffAcceptHunk: 'Accept this change',
  aiDiffRejectHunk: 'Reject this change',
  aiDiffAcceptAll: 'Accept all',
  aiDiffRejectAll: 'Reject all',
  aiDiffRestore: 'Restore original',
  aiDiffExplain: 'Explain this change',
  aiDiffApply: 'Apply',
  aiDiffPrevChange: 'Previous change',
  aiDiffNextChange: 'Next change',
  aiDiffChangeCount: '{count} changes',
  aiDiffNoChanges: 'No changes to review',
  aiDiffAccepted: 'Accepted',
  aiDiffRejected: 'Rejected',
  aiDiffPending: 'Not decided',
  aiDiffKindAdded: 'Added',
  aiDiffKindRemoved: 'Removed',
  aiDiffKindModified: 'Changed',
  aiDiffChangePosition: 'Change {index} of {total}',

  aiStructuredLabel: 'Extracted details',
  aiStructuredConfirm: 'Confirm',
  aiStructuredCancel: 'Discard',
  aiStructuredCopyJson: 'Copy as JSON',
  aiStructuredCopied: 'Copied!',
  aiStructuredRegenerateField: 'Suggest again',
  aiStructuredMissing: 'Needs a value',
  aiStructuredMissingCount: '{count} fields need attention',
  aiStructuredRequired: 'This field is required',
  aiStructuredInvalidNumber: 'Enter a number',
  aiStructuredInvalidEmail: 'Enter a valid email address',
  aiStructuredInvalidUrl: 'Enter a valid web address',
  aiStructuredInvalidDate: 'Enter a valid date',
  aiStructuredEmpty: 'Nothing extracted yet',
  aiStructuredGenerating: 'Extracting details',
  aiStructuredSubmitted: 'Saved',
  aiStructuredChoose: 'Choose one',
  aiStructuredYes: 'Yes',
  aiStructuredNo: 'No',

  // AI: search experience
  aiSearchLabel: 'AI search',
  aiSearchPlaceholder: 'Ask a question or search',
  aiSearchSubmit: 'Search',
  aiSearchScope: 'Search in',
  aiSearchFilters: 'Filters',
  aiSearchClearFilters: 'Clear filters',
  aiSearchSuggestions: 'Try asking',
  aiSearchAnswer: 'Answer',
  aiSearchAnswerGenerating: 'Writing an answer',
  aiSearchProgress: 'Search progress',
  aiSearchStepPending: 'Waiting',
  aiSearchStepRunning: 'In progress',
  aiSearchStepDone: 'Done',
  aiSearchStepFailed: 'Failed',
  aiSearchResults: 'Results',
  aiSearchResultCount: '{count} results',
  aiSearchNoResults: 'No results found',
  aiSearchNoAnswer: 'No answer could be given',
  aiSearchNoAnswerHint: 'The sources were searched but did not cover this.',
  aiSearchPartial: 'Some sources did not respond',
  aiSearchFollowUps: 'Follow-up questions',
  aiSearchEmpty: 'Ask a question to get started',
  aiSearchFailed: 'The search failed',
  aiSearchRetry: 'Search again',

  // AI: generation controls
  aiGenerationLabel: 'Generation settings',
  aiGenerationGenerate: 'Generate',
  aiGenerationStop: 'Stop',
  aiGenerationRegenerate: 'Generate again',
  aiGenerationCount: 'How many',
  aiGenerationAspectRatio: 'Aspect ratio',
  aiGenerationResolution: 'Resolution',
  aiGenerationQuality: 'Quality',
  aiGenerationStyle: 'Style',
  aiGenerationSeed: 'Seed',
  aiGenerationSeedRandom: 'Randomize the seed',
  aiGenerationSeedHint: 'Reuse a seed to get a similar result',
  aiGenerationCreativity: 'Creativity',
  aiGenerationCreativityLow: 'Predictable',
  aiGenerationCreativityHigh: 'Inventive',
  aiGenerationReference: 'Reference',
  aiGenerationReferenceHint: 'Attach an image to guide the result',
  aiGenerationNegative: 'Avoid',
  aiGenerationNegativeHint: 'Describe what the result should not include',
  aiGenerationReset: 'Reset to defaults',
  aiGenerationAdvanced: 'Advanced',
  aiGenerationNoControls: 'No settings available',
  aiGenerationGenerating: 'Generating',

  // AI: generation gallery
  aiGalleryLabel: 'Generated results',
  aiGalleryEmpty: 'Nothing generated yet',
  aiGalleryGenerating: 'Generating results',
  aiGalleryFailed: 'This result failed',
  aiGalleryFilters: 'Filter results',
  aiGalleryLayout: 'Layout',
  aiGalleryLayoutGrid: 'Grid',
  aiGalleryLayoutList: 'List',
  aiGalleryPreview: 'Preview',
  aiGalleryClosePreview: 'Close preview',
  aiGallerySelect: 'Select',
  aiGalleryDeselect: 'Deselect',
  aiGallerySelectedCount: '{count} selected',
  aiGalleryRegenerate: 'Generate again',
  aiGalleryVariation: 'Make a variation',
  aiGalleryEdit: 'Edit',
  aiGalleryCrop: 'Crop',
  aiGalleryUpscale: 'Upscale',
  aiGalleryCompare: 'Compare',
  aiGalleryStopCompare: 'Stop comparing',
  aiGalleryDownload: 'Download',
  aiGalleryDelete: 'Delete',
  aiGalleryFavorite: 'Add to favorites',
  aiGalleryUnfavorite: 'Remove from favorites',
  aiGalleryDetails: 'Details',
  aiGalleryPrompt: 'Prompt',
  aiGallerySeedLabel: 'Seed',
  aiGalleryModelLabel: 'Model',
  aiGalleryDimensions: 'Size',
  aiGalleryHistory: 'History',
  aiGalleryFavorites: 'Favorites',
  aiGalleryAll: 'All',
  aiGalleryCompareHint: 'Select two results to compare',

  // AI: workflow timeline
  aiWorkflowLabel: 'Agent plan',
  aiWorkflowEmpty: 'No plan yet',
  aiWorkflowStepPlanned: 'Planned',
  aiWorkflowStepRunning: 'In progress',
  aiWorkflowStepCompleted: 'Done',
  aiWorkflowStepFailed: 'Failed',
  aiWorkflowStepSkipped: 'Skipped',
  aiWorkflowStepBlocked: 'Blocked',
  aiWorkflowStepWaitingApproval: 'Waiting for approval',
  aiWorkflowDependsOn: 'Waits for {steps}',
  aiWorkflowParallel: 'Runs at the same time',
  aiWorkflowShowLogs: 'Show logs',
  aiWorkflowHideLogs: 'Hide logs',
  aiWorkflowRetryStep: 'Retry from here',
  aiWorkflowPause: 'Pause',
  aiWorkflowResume: 'Resume',
  aiWorkflowCancel: 'Cancel run',
  aiWorkflowResult: 'Result',
  aiWorkflowRunning: 'Running',
  aiWorkflowPaused: 'Paused',
  aiWorkflowCompleted: 'Finished',
  aiWorkflowFailedRun: 'Run failed',
  aiWorkflowCanceled: 'Run canceled',
  aiWorkflowProgress: 'Step {current} of {total}',
  aiWorkflowDuration: 'Took {duration}',

  // AI: memory manager
  aiMemoryLabel: 'What the AI remembers',
  aiMemoryEmpty: 'Nothing remembered yet',
  aiMemoryEnable: 'Let the AI remember',
  aiMemoryEnabled: 'Memory is on',
  aiMemoryDisabled: 'Memory is off',
  aiMemoryAdd: 'Add a memory',
  aiMemoryAddPlaceholder: 'Something the AI should remember',
  aiMemoryEdit: 'Edit',
  aiMemoryDelete: 'Forget this',
  aiMemorySave: 'Save',
  aiMemoryCancel: 'Cancel',
  aiMemorySource: 'From {source}',
  aiMemorySourceConversation: 'a conversation',
  aiMemorySourceManual: 'you',
  aiMemorySourceImported: 'an import',
  aiMemorySourceInferred: 'what you have asked',
  aiMemoryProject: 'Only in {project}',
  aiMemoryTemporary: 'Temporary session',
  aiMemoryTemporaryHint: 'Nothing from this session will be remembered',
  aiMemoryPrivacy: 'How memory works',
  aiMemoryPrivacyBody:
    'Memories are used to personalize replies. You can review, edit, or remove any of them at any time.',
  aiMemorySensitive: 'Sensitive',
  aiMemoryConfirmDelete: 'Forget this memory?',
  aiMemoryConfirmDeleteBody: 'This cannot be undone.',
  aiMemoryClearAll: 'Forget everything',

  // AI: settings
  aiSettingsLabel: 'AI settings',
  aiSettingsModel: 'Default model',
  aiSettingsResponseLength: 'Response length',
  aiSettingsLengthBrief: 'Brief',
  aiSettingsLengthBalanced: 'Balanced',
  aiSettingsLengthDetailed: 'Detailed',
  aiSettingsTone: 'Tone',
  aiSettingsToneNeutral: 'Neutral',
  aiSettingsToneFriendly: 'Friendly',
  aiSettingsToneFormal: 'Formal',
  aiSettingsToneConcise: 'Concise',
  aiSettingsLanguage: 'Reply in',
  aiSettingsLanguageAuto: 'Match the interface',
  aiSettingsCreativity: 'Creativity',
  aiSettingsCitations: 'Citations',
  aiSettingsCitationsAlways: 'Always cite sources',
  aiSettingsCitationsWhenUseful: 'Cite when it helps',
  aiSettingsCitationsNever: 'Do not cite',
  aiSettingsSearch: 'Looking things up',
  aiSettingsSearchOff: 'Do not look anything up',
  aiSettingsSearchKnowledge: 'Our knowledge base only',
  aiSettingsSearchWeb: 'The web only',
  aiSettingsSearchBoth: 'Knowledge base and the web',
  aiSettingsTools: 'Tool permissions',
  aiSettingsToolsHint: 'Choose what the AI may do on your behalf',
  aiSettingsMemory: 'Memory',
  aiSettingsRetention: 'Keep conversations',
  aiSettingsRetentionSession: 'Until I close the session',
  aiSettingsRetention30: 'For 30 days',
  aiSettingsRetention1Year: 'For a year',
  aiSettingsRetentionForever: 'Indefinitely',
  aiSettingsInstructions: 'Custom instructions',
  aiSettingsInstructionsHint: 'Applied to every conversation',
  aiSettingsInstructionsPlaceholder: 'For example: always answer in bullet points',
  aiSettingsSave: 'Save settings',
  aiSettingsSaved: 'Settings saved',
  aiSettingsReset: 'Reset to defaults',

  // AI: usage meter
  aiUsageLabel: 'Usage',
  aiUsageUsed: '{used} of {limit} used',
  aiUsageUsedUnmetered: '{used} used',
  aiUsageRemaining: '{count} left',
  aiUsageTokensLabel: 'Tokens',
  aiUsageResetsLabel: 'Resets',
  aiUsageTokens: '{count} tokens',
  aiUsageToday: 'Today',
  aiUsageThisMonth: 'This month',
  aiUsageResets: 'Resets {when}',
  aiUsageByModel: 'By model',
  aiUsageRequests: '{count} requests',
  aiUsageEstimatedCost: 'Estimated cost of this request',
  aiUsageCostUnavailable: 'Cost is not available',
  aiUsageStatusOk: 'Within your plan',
  aiUsageStatusWarning: 'Approaching your limit',
  aiUsageStatusExceeded: 'You have used your quota',
  aiUsageStatusRateLimited: 'Too many requests',
  aiUsageRateLimitRetry: 'Try again in {seconds}s',
  aiUsageUpgrade: 'Upgrade',
  aiUsageUpgradeHint: 'Get a higher limit',
  aiUsageEmpty: 'No usage yet',
  aiUsageUnmetered: 'Unmetered',

  // AI: feedback
  aiFeedbackLabel: 'Was this helpful?',
  aiFeedbackGood: 'Helpful',
  aiFeedbackBad: 'Not helpful',
  aiFeedbackRating: 'Rate this response',
  aiFeedbackWhy: 'What went wrong?',
  aiFeedbackIncorrect: 'Incorrect',
  aiFeedbackUnsafe: 'Unsafe',
  aiFeedbackIncomplete: 'Incomplete',
  aiFeedbackIrrelevant: 'Off topic',
  aiFeedbackComment: 'Tell us more',
  aiFeedbackCommentPlaceholder: 'Optional detail',
  aiFeedbackIncludeContext: 'Include this conversation',
  aiFeedbackPrivacy:
    'Your feedback helps improve responses. Only what you choose to share is sent.',
  aiFeedbackSubmit: 'Send feedback',
  aiFeedbackCancel: 'Cancel',
  aiFeedbackThanks: 'Thanks for the feedback',
  aiFeedbackSending: 'Sending',
  aiFeedbackFailed: 'Could not send your feedback',

  // AI: error recovery
  aiErrorLabel: 'Something went wrong',
  aiErrorNetwork: 'Could not reach the service',
  aiErrorOffline: 'You are offline',
  aiErrorTimeout: 'The request took too long',
  aiErrorRateLimit: 'Too many requests',
  aiErrorQuota: 'You have used your quota',
  aiErrorPermission: 'You do not have access',
  aiErrorTool: 'A tool failed',
  aiErrorToolNamed: '{tool} failed',
  aiErrorAttachment: 'An attachment could not be read',
  aiErrorContentFilter: 'This request was blocked',
  aiErrorModelUnavailable: 'That model is unavailable',
  aiErrorInterrupted: 'Generation stopped early',
  aiErrorUnknown: 'Something went wrong',
  aiErrorNotRecoverable: 'This cannot be retried',
  aiErrorRetry: 'Try again',
  aiErrorEditPrompt: 'Edit and resend',
  aiErrorContinue: 'Continue from here',
  aiErrorSwitchModel: 'Use another model',
  aiErrorRemoveAttachment: 'Remove {name}',
  aiErrorReconnect: 'Reconnect',
  aiErrorUpgrade: 'Upgrade',
  aiErrorRequestAccess: 'Request access',
  aiErrorDismiss: 'Dismiss',
  aiErrorRetryIn: 'Try again in {seconds}s',
  aiErrorShowDetail: 'Show details',
  aiErrorHideDetail: 'Hide details',
  aiErrorPartialKept: 'What was generated so far is kept below',

  // AI: voice
  aiVoiceLabel: 'Voice',
  aiVoiceStart: 'Start listening',
  aiVoiceStop: 'Stop listening',
  aiVoiceListening: 'Listening',
  aiVoiceProcessing: 'Thinking',
  aiVoiceSpeaking: 'Speaking',
  aiVoiceConnecting: 'Connecting',
  aiVoiceIdle: 'Not listening',
  aiVoiceInterrupt: 'Interrupt',
  aiVoiceMute: 'Mute',
  aiVoiceUnmute: 'Unmute',
  aiVoiceMuted: 'Muted',
  aiVoiceTranscript: 'Transcript',
  aiVoiceTranscriptEmpty: 'Nothing heard yet',
  aiVoiceSelectVoice: 'Voice',
  aiVoiceSpeed: 'Playback speed',
  aiVoiceInputDevice: 'Microphone',
  aiVoiceOutputDevice: 'Speaker',
  aiVoicePermissionPrompt: 'Microphone access is needed',
  aiVoicePermissionDenied: 'Microphone access was denied',
  aiVoicePermissionRequest: 'Allow the microphone',
  aiVoiceDisconnected: 'Disconnected',
  aiVoiceReconnect: 'Reconnect',
  aiVoiceError: 'The voice session failed',
  aiVoiceWaveform: 'Audio level',

  // AI: human handoff
  aiHandoffLabel: 'Talk to a person',
  aiHandoffEscalate: 'Talk to a person',
  aiHandoffReason: 'Why do you need a person?',
  aiHandoffReasonPlaceholder: 'Optional detail',
  aiHandoffSummary: 'What we will share',
  aiHandoffSummaryHint: 'A summary of this conversation goes with your request',
  aiHandoffChannel: 'How would you like to be contacted?',
  aiHandoffChannelChat: 'Chat',
  aiHandoffChannelEmail: 'Email',
  aiHandoffChannelPhone: 'Phone',
  aiHandoffChannelTicket: 'Support ticket',
  aiHandoffSubmit: 'Request a person',
  aiHandoffCancel: 'Never mind',
  aiHandoffRequested: 'Your request was sent',
  aiHandoffQueued: 'You are in the queue',
  aiHandoffQueuePosition: 'Position {position} in the queue',
  aiHandoffWait: 'About {minutes} minutes',
  aiHandoffAssigned: '{name} is picking this up',
  aiHandoffActive: 'You are talking to {name}',
  aiHandoffResolved: 'This was resolved',
  aiHandoffUnavailable: 'Nobody is available right now',
  aiHandoffReference: 'Reference {reference}',
  aiHandoffResumeAi: 'Go back to the assistant',

  // AI: notifications
  aiNotifyGenerationComplete: 'Your result is ready',
  aiNotifyFileProcessed: 'Your file is ready',
  aiNotifyExportReady: 'Your export is ready',
  aiNotifyApprovalRequired: 'The AI needs your approval',
  aiNotifyAgentBlocked: 'The agent is blocked',
  aiNotifyUsageWarning: 'You are approaching your limit',
  aiNotifyConnectionLost: 'Connection lost',
  aiNotifyActionComplete: 'Done',
  aiNotifyView: 'View',
  aiNotifyDismiss: 'Dismiss',

  // AI: onboarding
  aiOnboardingLabel: 'Getting started',
  aiOnboardingSkip: 'Skip for now',
  aiOnboardingResume: 'Pick up where you left off',
  aiOnboardingNext: 'Next',
  aiOnboardingBack: 'Back',
  aiOnboardingDone: 'Start using it',
  aiOnboardingStepOf: 'Step {current} of {total}',
  aiOnboardingCapabilities: 'What this can do',
  aiOnboardingExamples: 'Try one of these',
  aiOnboardingUpload: 'Add your own files',
  aiOnboardingUploadBody: 'Attach a document and ask questions about it.',
  aiOnboardingTools: 'What it may do for you',
  aiOnboardingToolsBody: 'Some actions ask for your approval first. You stay in control.',
  aiOnboardingMemory: 'Memory and privacy',
  aiOnboardingMemoryBody:
    'Turn memory on to get replies shaped by earlier conversations. You can review or clear it at any time.',
  aiOnboardingConnect: 'Connect a data source',
  aiOnboardingConnectBody: 'Bring in your own content so answers can cite it.',

  // Authorization administration
  authorizationBackToRoles: 'Back to roles',
  authorizationAssignmentAllowed: 'Assignment can be granted.',
  authorizationAssignmentApplicationScope: 'Application scope',
  authorizationAssignmentApply: 'Assign role',
  authorizationAssignmentApprovalRequested: 'Approval request created.',
  authorizationAssignmentCheck: 'Check assignment',
  authorizationAssignmentChooseRole: 'Choose a role before checking the assignment.',
  authorizationAssignmentDenied: 'Assignment denied',
  authorizationAssignmentDescription:
    'Choose a role and scope, then check the governance decision before assigning access.',
  authorizationAssignmentDescendants: 'This scope and its descendants',
  authorizationAssignmentGranted: 'Role assignment created and effective access refreshed.',
  authorizationAssignmentIndeterminate: 'The governance decision could not be verified.',
  authorizationAssignmentImpact: 'Impact preview',
  authorizationAssignmentImpactDescription:
    'Review the role, scope, inheritance, and assignment window before submitting.',
  authorizationAssignmentInheritance: 'Inheritance',
  authorizationAssignmentMutationCouldNotComplete: 'The role assignment could not be completed.',
  authorizationAssignmentNoRoles: 'No roles are available for assignment in this tenant.',
  authorizationAssignmentPreflightCouldNotLoad:
    'The assignment governance check could not be loaded.',
  authorizationAssignmentReason: 'Reason for access',
  authorizationAssignmentReasonPlaceholder: 'Explain why this access is needed',
  authorizationAssignmentRequestApproval: 'Request approval',
  authorizationAssignmentResourceScope: 'Resource scope',
  authorizationAssignmentRequiredFields: 'Choose a role and complete the requested scope fields.',
  authorizationAssignmentRole: 'Role',
  authorizationAssignmentRolesCouldNotLoad: 'Assignable roles could not be loaded.',
  authorizationAssignmentScopeId: 'Scope ID',
  authorizationAssignmentScopeIdPlaceholder: 'Enter the application or resource scope ID',
  authorizationAssignmentScopeType: 'Scope type',
  authorizationAssignmentStepUp:
    'Recent stronger authentication is required before this assignment can continue.',
  authorizationAssignmentStartsAt: 'Starts at',
  authorizationAssignmentThisScopeOnly: 'This scope only',
  authorizationAssignmentTitle: 'Assign a role',
  authorizationAssignmentTenantScope: 'Tenant scope',
  authorizationAssignmentExpiresAt: 'Expires at',
  authorizationAssignmentPermanent: 'Permanent access',
  authorizationAssignmentWindowHint: 'Use local date and time, for example 2026-09-01T09:00.',
  authorizationAssignmentWindowInvalid: 'Enter a valid start or expiration date and time.',
  authorizationAssignmentWindowOrder: 'Expiration must be later than the start.',
  authorizationAssignmentWindowPlaceholder: 'YYYY-MM-DDTHH:MM',
  authorizationAccessGraphTitle: 'Access graph',
  authorizationAccessGraphDescription:
    "Trace how applications, roles, permissions, and sources shape this user's access.",
  authorizationAccessGraphEmpty: 'No access relationships are available to visualize.',
  authorizationAccessGraphApplication: 'Application',
  authorizationAccessGraphRole: 'Role',
  authorizationAccessGraphPermission: 'Permission',
  authorizationAccessGraphSource: 'Source',
  authorizationUserAccessSubtitle:
    'Everything this user can do, where each grant came from, and why a check passes or fails.',
  authorizationUserAccessMfaWarning: 'Multi-factor authentication is not enabled for this account.',
  authorizationUserAccessStatApplications: 'Applications',
  authorizationUserAccessLastSignIn: 'Last sign-in',
  authorizationUserAccessStatAllowed: 'Allowed',
  authorizationUserAccessStatDenied: 'Denied',
  authorizationUserAccessStatFromGroups: 'From groups',
  authorizationUserAccessGrantsTitle: 'Effective access',
  authorizationUserAccessGrantsDescription:
    'Direct and group-derived grants, combined per application.',
  authorizationUserAccessSearchPlaceholder: 'Search permission, role, or scope',
  authorizationUserAccessSearchLabel: 'Search effective grants',
  authorizationUserAccessEffectFilter: 'Effect',
  authorizationUserAccessSourceFilter: 'Source',
  authorizationUserAccessAnyEffect: 'Any effect',
  authorizationUserAccessAnySource: 'Any source',
  authorizationUserAccessAllow: 'Allow',
  authorizationUserAccessDeny: 'Deny',
  authorizationUserAccessDirect: 'Direct',
  authorizationUserAccessFromGroup: 'From a group',
  authorizationUserAccessShown: '{shown} of {total} grants shown',
  authorizationUserAccessNoGrantMatch: 'No grants match these filters',
  authorizationUserAccessNoGrantMatchHint:
    'Clear the search or widen the effect and source filters.',
  authorizationUserAccessNoApplications:
    'No authorization applications are registered for this tenant.',
  authorizationUserAccessHasAccess: 'Has access',
  authorizationUserAccessNoAccess: 'No access',
  authorizationUserAccessNoGrants: 'No effective grants in this application.',
  authorizationUserAccessDenyOverrides:
    'A deny rule overrides every allow for the same permission.',
  authorizationUserAccessSnapshot: 'Revision {revision}, valid until {until}',
  authorizationUserAccessExplainRow: 'Explain {permission}',
  authorizationUserAccessPathsTitle: 'How this access was granted',
  authorizationUserAccessPathsDescription:
    'Each role this user holds, how they came to hold it, and what it grants.',
  authorizationUserAccessPathsEmpty: 'No role assignments were found for this user.',
  authorizationUserAccessViaGroup: 'via {group}',
  authorizationUserAccessAssignedDirectly: 'Assigned directly',
  authorizationUserAccessGroupsTitle: 'Group memberships',
  authorizationUserAccessGroupsEmpty: 'This user is not a member of any group.',
  authorizationUserAccessWindowStarts: 'Starts {date}',
  authorizationUserAccessWindowExpires: 'Expires {date}',
  authorizationUserAccessExplainTitle: 'Explain a check',
  authorizationUserAccessExplainDescription:
    'Ask the server why a permission is allowed or denied for this user.',
  authorizationUserAccessMatchedRoles: 'Matched roles',
  authorizationUserAccessPermissionCount: '{count} permissions',
  authorizationUserAccessOnePermission: '1 permission',
  authorizationApplicationAccessTitle: 'Application access',
  authorizationApplicationAccessDescription:
    'Review authorization roles, permissions, and access assignments for each registered application.',
  authorizationApplicationAccessLoading: 'Loading application access...',
  authorizationApplicationAccessError: 'Application access could not be loaded.',
  authorizationApplicationAccessEmpty: 'No registered applications are available for this tenant.',
  authorizationApplicationAccessUnavailable:
    'No authorization manifest is registered for this application.',
  authorizationApplicationAccessPermissions: 'Permissions',
  authorizationApplicationAccessRoles: 'Roles',
  authorizationApplicationAccessUsers: 'Users with access',
  authorizationApplicationAccessGroups: 'Groups with access',
  authorizationApplicationAccessAssignments: 'Active assignments',
  authorizationApplicationAccessScopes: 'Scopes',
  authorizationApplicationAccessAccessRoles: 'Access roles',
  authorizationApplicationAccessInactive: 'Inactive',
  authorizationApplicationAccessDeprecated: 'Deprecated',
  authorizationProviderResultsTitle: 'Provider results',
  authorizationRoleImpactTitle: 'Role impact',
  authorizationRoleImpactDescription:
    'Review the users, groups, scopes, and permissions affected by this role.',
  authorizationRoleImpactLoading: 'Loading role impact...',
  authorizationRoleImpactError: 'Role impact could not be loaded.',
  authorizationRoleImpactDirectUsers: 'Direct users',
  authorizationRoleImpactGroups: 'Groups',
  authorizationRoleImpactEffectiveUsers: 'Effective users',
  authorizationRoleImpactScopes: 'Scopes',
  authorizationRoleImpactApplications: 'Applications',
  authorizationRoleImpactAssignments: 'Assignments',
  authorizationRoleImpactPermissions: 'Permissions',
  authorizationRoleImpactRequired: 'Load role impact before saving this change.',
  authorizationRoleApplicationHint: 'Select a registered application to load its permissions.',
  authorizationRolePermissionsMismatch: 'Choose permissions owned by the selected application.',
  authorizationCompare: 'Compare',
  authorizationCompareRoles: 'Compare roles',
  authorizationCompareRolesDescription:
    'See shared and role-specific permissions before changing an access definition.',
  authorizationCompareRolesHint:
    'Compare roles from the same application to keep permission differences meaningful.',
  authorizationConsideredGrants: 'Considered grants',
  authorizationDifference: 'Difference',
  authorizationEffectivePermissions: 'Effective permissions',
  authorizationFirstRole: 'First role',
  authorizationNoEffectivePermissions: 'No effective permissions matched this request.',
  authorizationNoGrantsMatchedScope: 'No grants matched the requested scope.',
  authorizationNoRolePermissions: 'These roles do not contain any permissions.',
  authorizationOnlyIn: 'Only in {name}',
  authorizationPermission: 'Permission',
  authorizationPermissionsCompared: '{count} permissions compared',
  authorizationPermissionsSubtitle:
    'Browse every capability the catalog defines, how risky it is, and which roles grant it.',
  authorizationPermissionsSearchPlaceholder: 'Search name, key, or description',
  authorizationPermissionsSearchLabel: 'Search the permission catalog',
  authorizationPermissionsRiskFilter: 'Risk level',
  authorizationPermissionsResourceFilter: 'Resource',
  authorizationPermissionsAllRisk: 'Any risk',
  authorizationPermissionsAllResources: 'All resources',
  authorizationPermissionsDeprecatedOnly: 'Deprecated only',
  authorizationPermissionsShown: '{shown} of {total} shown',
  authorizationPermissionsNoMatchTitle: 'No permissions match these filters',
  authorizationPermissionsNoMatchDescription:
    'Clear the search or widen the risk filter to see more of the catalog.',
  authorizationPermissionsCatalogEmptyTitle: 'The permission catalog is empty',
  authorizationPermissionsCatalogEmptyDescription:
    'Register an application that declares permissions to populate the catalog.',
  authorizationPermissionsLoadFailed: 'The permission catalog could not be loaded.',
  authorizationPermissionsInCatalog: 'In catalog',
  authorizationPermissionsNeedsReview: 'Privileged or critical',
  authorizationPermissionsResources: 'Resources',
  authorizationPermissionsDeprecated: 'Deprecated',
  authorizationPermissionsGrantedByRoles: '{count} roles',
  authorizationPermissionsGrantedByOneRole: '1 role',
  authorizationPermissionsGrantedByNoRole: 'No role',
  authorizationPermissionsUnusedHint: 'No role in this tenant grants this permission yet.',
  authorizationPermissionsReplacedBy: 'Replaced by {key}',
  authorizationPermissionsKeyCopied: 'Permission key copied',
  authorizationPermissionsDetailsTitle: 'Permission details',
  authorizationPermissionsRolesGranting: 'Roles granting this permission',
  authorizationPermissionsNoDescription: 'No description provided.',
  authorizationPermissionsRisk: 'Risk',
  authorizationPermissionsResourceType: 'Resource type',
  authorizationPermissionsApplication: 'Application',
  authorizationPermissionsKey: 'Key',
  authorizationPermissionsRiskStandard: 'Standard',
  authorizationPermissionsRiskElevated: 'Elevated',
  authorizationPermissionsRiskPrivileged: 'Privileged',
  authorizationPermissionsRiskCritical: 'Critical',
  authorizationRequestedScope: 'Requested scope',
  authorizationRoleComparisonCouldNotLoad: 'The role comparison could not be loaded.',
  authorizationRoleOption: '{name} · {application}',
  authorizationRoleScope: '{application} · {scope} scope',
  authorizationRolesCouldNotLoad: 'Roles could not be loaded.',
  authorizationSameApplicationRequired:
    'Choose roles from the same application to compare permissions.',
  authorizationSecondRole: 'Second role',
  authorizationSelectRole: 'Select a role',
  authorizationSelectTwoDifferentRoles: 'Select two different roles to compare.',
  authorizationShared: 'Shared',
  authorizationTenantScope: 'Tenant scope',
  authorizationVersus: 'vs',
  authorizationResourceAccessTitle: 'Resource access',
  authorizationResourceAccessDescription:
    'Manage application-owned resource grants and explain effective access at each scope.',
  authorizationResourceAccessNew: 'Add ACL',
  authorizationResourceAccessEmpty: 'No resource access entries match the current filters.',
  authorizationResourceAccessLoadError: 'Resource access could not be loaded.',
  authorizationResourceAccessApplication: 'Application',
  authorizationResourceAccessPermission: 'Permission',
  authorizationResourceAccessPrincipal: 'Principal',
  authorizationResourceAccessScope: 'Scope',
  authorizationResourceAccessEffect: 'Effect',
  authorizationResourceAccessInheritance: 'Inheritance',
  authorizationResourceAccessStarts: 'Starts',
  authorizationResourceAccessExpires: 'Expires',
  authorizationResourceAccessStatus: 'Status',
  authorizationResourceAccessSource: 'Source',
  authorizationResourceAccessCreateTitle: 'Add resource access',
  authorizationResourceAccessEditTitle: 'Edit resource access',
  authorizationResourceAccessReview: 'Review change',
  authorizationResourceAccessPreflight: 'Governance preflight',
  authorizationResourceAccessPreflightDescription:
    'The server must approve this ACL change before it can be saved.',
  authorizationResourceAccessExplain: 'Explain access',
  authorizationResourceAccessExplainTitle: 'Effective resource access',
  authorizationResourceAccessNoContributions: 'No active ACL contributions match this request.',
  authorizationResourceAccessScopePath: 'Scope path',
  authorizationResourceAccessSearchScopes: 'Search application resources',
  authorizationResourceAccessScopeRequired: 'Select an application resource scope.',
  authorizationResourceAccessSaved: 'Resource access saved.',
  authorizationResourceAccessDeleted: 'Resource access removed.',
  authorizationResourceAccessCouldNotSave: 'Resource access could not be saved.',
  authorizationResourceAccessCouldNotDelete: 'Resource access could not be removed.',
  authorizationGovernanceTitle: 'Governance',
  authorizationGovernanceDescription:
    'Delegate access safely with administrative boundaries, protected roles, reviews, and approvals.',
  authorizationGovernanceBoundaries: 'Administrative boundaries',
  authorizationGovernanceGrantablePermissions: 'Grantable permissions',
  authorizationGovernanceCreateGrantable: 'Add grantable permission',
  authorizationGovernanceGrantableError: 'The grantable permission boundary could not be saved.',
  authorizationGovernanceAuthorities: 'Your administrative access',
  authorizationGovernanceProtectedRoles: 'Protected roles',
  authorizationGovernanceConstraints: 'Role conflicts and constraints',
  authorizationGovernanceAccessRequests: 'Access requests',
  authorizationGovernanceAccessReviews: 'Access reviews',
  authorizationGovernanceNoAuthorities: 'No delegated administrative authorities are available.',
  authorizationGovernanceNoGrantablePermissions:
    'No grantable permission boundaries are configured.',
  authorizationGovernanceNoPolicies: 'No role governance policies are configured.',
  authorizationGovernanceNoConstraints: 'No role conflicts or constraints are configured.',
  authorizationGovernanceNoRequests: 'No access requests match the selected status.',
  authorizationGovernanceNoReviews: 'No access reviews are available.',
  authorizationGovernanceDecision: 'Decision',
  authorizationGovernanceViolations: 'Governance findings',
  authorizationGovernanceRequiresApproval: 'Requires approval',
  authorizationGovernanceCreateBoundary: 'Create boundary',
  authorizationGovernanceBoundarySaved: 'Administrative boundary saved.',
  authorizationGovernanceBoundaryError: 'The administrative boundary could not be saved.',
  authorizationGovernanceProtected: 'Protected',
  authorizationGovernanceRestriction: 'Restriction',
  authorizationGovernanceEditPolicy: 'Edit protection',
  authorizationGovernancePolicySaved: 'Role protection saved.',
  authorizationGovernanceRequestsTitle: 'Access requests',
  authorizationGovernanceReviewsTitle: 'Access reviews',
  authorizationGovernanceRequestDetails: 'Request details',
  authorizationGovernanceRequestReason: 'Reason for access',
  authorizationGovernanceApprove: 'Approve request',
  authorizationGovernanceReject: 'Reject request',
  authorizationGovernanceApprovalReason: 'Decision reason',
  authorizationGovernanceRequestActionError: 'The access request decision could not be saved.',
  authorizationGovernanceAuditTrail: 'Audit trail',
  authorizationGovernanceCreateReview: 'Create review',
  authorizationGovernanceReviewEvidence: 'Review evidence',
  authorizationGovernanceKeep: 'Keep access',
  authorizationGovernanceRevoke: 'Revoke access',
  authorizationGovernanceComplete: 'Complete review',
  authorizationGovernanceReviewIncomplete: 'Review every item before completing this review.',
  authorizationGovernanceReviewSaved: 'Review decision saved.',
  authorizationGovernanceReviewCreateError: 'The access review could not be created.',
  authorizationGovernanceReviewActionError: 'The review decision could not be saved.',
  authorizationGovernanceReviewDue: 'Due date',
  authorizationGovernanceReviewItems: 'Review items',
  authorizationGovernanceNotReviewed: 'Not reviewed',
  authorizationGovernanceCompleted: 'Completed',
  authorizationGovernancePending: 'Pending',
  authorizationGovernanceActive: 'Active',
  authorizationGovernanceRequired: 'This governance change requires server approval.',

  authorizationPoliciesTitle: 'Policies',
  authorizationPoliciesDescription: 'Manage typed contextual policies and roll out changes safely.',
  authorizationPoliciesList: 'Policies',
  authorizationPoliciesBindings: 'Policy bindings',
  authorizationPoliciesSimulation: 'Simulation',
  authorizationPoliciesDiagnostics: 'Diagnostics',
  authorizationPoliciesOverview: 'Overview',
  authorizationPoliciesDefinition: 'Definition',
  authorizationPoliciesVersions: 'Versions',
  authorizationPoliciesShadowResults: 'Shadow results',
  authorizationPoliciesDetail: 'Policy details',
  authorizationPoliciesNew: 'New policy',
  authorizationPoliciesOpen: 'Open policy',
  authorizationPoliciesSearch: 'Search policies',
  authorizationPoliciesApplication: 'Application',
  authorizationPoliciesApplicationPlaceholder: 'paper',
  authorizationPoliciesName: 'Name',
  authorizationPoliciesOwner: 'Owner',
  authorizationPoliciesRisk: 'Risk',
  authorizationPoliciesStandard: 'Standard',
  authorizationPoliciesSystemOwner: 'System',
  authorizationPoliciesApplicationOwner: 'Application',
  authorizationPoliciesTenantOwner: 'Tenant',
  authorizationPoliciesKey: 'Policy key',
  authorizationPoliciesKeyPlaceholder: 'paper.policy.same-department',
  authorizationPoliciesDescriptionLabel: 'Description',
  authorizationPoliciesStatus: 'Status',
  authorizationPoliciesActiveVersion: 'Active version',
  authorizationPoliciesHealth: 'Health',
  authorizationPoliciesEmpty: 'No policies match the current filters.',
  authorizationPoliciesAllStates: 'All states',
  authorizationPoliciesCreateTitle: 'Create policy',
  authorizationPoliciesCreate: 'Create policy',
  authorizationPoliciesCritical: 'Critical policy',
  authorizationPoliciesCriticalHint: 'Require stronger authentication for high-impact changes.',
  authorizationPoliciesRequiredFields: 'Complete the application, key, and name fields.',
  authorizationPoliciesCreated: 'Policy created.',
  authorizationPoliciesLoadError: 'Policies could not be loaded.',
  authorizationPoliciesDetailError: 'Policy details could not be loaded.',
  authorizationPoliciesCreateError: 'The policy could not be created.',
  authorizationPoliciesDefinitionDescription:
    'Build a typed expression using registered attributes and operators.',
  authorizationPoliciesMatchMode: 'Match mode',
  authorizationPoliciesAllConditions: 'All conditions',
  authorizationPoliciesAnyCondition: 'Any condition',
  authorizationPoliciesNegate: 'Negate group',
  authorizationPoliciesConditions: 'Policy conditions',
  authorizationPoliciesAddCondition: 'Add condition',
  authorizationPoliciesRemoveCondition: 'Remove condition',
  authorizationPoliciesLiteralPlaceholder: 'Enter a value',
  authorizationPoliciesAttributeValue: 'Attribute',
  authorizationPoliciesLiteralValue: 'Literal',
  authorizationPoliciesSaveDraft: 'Save draft',
  authorizationPoliciesDraftSaved: 'Policy draft saved.',
  authorizationPoliciesValidationIssues: 'Validation findings',
  authorizationPoliciesAdvancedDefinition: 'Serialized definition',
  authorizationPoliciesExpression: 'Expression',
  authorizationPoliciesNotValidated: 'Not validated',
  authorizationPoliciesAttributes: 'Attributes',
  authorizationPoliciesAttributesDescription: 'Attributes available to this application policy.',
  authorizationPoliciesSensitive: 'Sensitive',
  authorizationPoliciesAttributesUnavailable:
    'Attribute metadata is unavailable for this application.',
  authorizationPoliciesValidate: 'Validate',
  authorizationPoliciesValidated: 'Policy version validated.',
  authorizationPoliciesValidationError: 'The policy version could not be validated.',
  authorizationPoliciesNoVersions: 'No policy versions are available.',
  authorizationPoliciesVersion: 'Version',
  authorizationPoliciesRollback: 'Rollback',
  authorizationPoliciesRollbackTitle: 'Rollback policy version',
  authorizationPoliciesRollbackDescription:
    'Restore policy version v{version} for the active binding.',
  authorizationPoliciesRollbackWarning: 'Rollback changes enforced authorization for the binding.',
  authorizationPoliciesRollbackAuditNote:
    'The server records the rollback and returns an authorization revision as audit evidence.',
  authorizationPoliciesRollbackCompleted: 'Policy rolled back. Authorization revision: {revision}.',
  authorizationPoliciesRollbackError: 'The policy could not be rolled back.',
  authorizationPoliciesBindingsDescription:
    'Connect validated policy versions to permissions, resources, and scopes.',
  authorizationPoliciesAddBinding: 'Add binding',
  authorizationPoliciesEditBinding: 'Edit binding',
  authorizationPoliciesNoBindings: 'No policy bindings match the current filters.',
  authorizationPoliciesBindingsLoadError: 'Policy bindings could not be loaded.',
  authorizationPoliciesPermission: 'Permission',
  authorizationPoliciesResourceType: 'Resource type',
  authorizationPoliciesResourceId: 'Resource ID',
  authorizationPoliciesScope: 'Scope',
  authorizationPoliciesScopeType: 'Scope type',
  authorizationPoliciesScopeId: 'Scope ID',
  authorizationPoliciesScopePlaceholder: 'tenant: or workspace:engineering',
  authorizationPoliciesInheritance: 'Inheritance',
  authorizationPoliciesThisScopeOnly: 'This scope only',
  authorizationPoliciesDescendants: 'Descendants',
  authorizationPoliciesEffect: 'Effect',
  authorizationPoliciesRequire: 'Require',
  authorizationPoliciesDeny: 'Deny',
  authorizationPoliciesMode: 'Rollout mode',
  authorizationPoliciesEnforced: 'Enforced',
  authorizationPoliciesShadow: 'Shadow',
  authorizationPoliciesDisabled: 'Disabled',
  authorizationPoliciesSamplingRate: 'Sampling rate',
  authorizationPoliciesShadowStarts: 'Shadow starts',
  authorizationPoliciesShadowEnds: 'Shadow ends',
  authorizationPoliciesUserExplanation: 'User-safe explanation',
  authorizationPoliciesAdminExplanation: 'Administrator explanation',
  authorizationPoliciesBindingRequiredFields:
    'Choose a policy version, permission, and scope type.',
  authorizationPoliciesSamplingInvalid: 'Sampling rate must be between 0 and 1.',
  authorizationPoliciesBindingSaved: 'Policy binding saved.',
  authorizationPoliciesBindingDeleted: 'Policy binding removed.',
  authorizationPoliciesBindingError: 'The policy binding could not be changed.',
  authorizationPoliciesSelectPolicyFirst: 'Open a policy before managing its bindings.',
  authorizationPoliciesActivationSafety: 'Activation safety check',
  authorizationPoliciesActivationSafetyDescription:
    'Run a targeted impact analysis before enforcing this binding.',
  authorizationPoliciesImpactPrincipal: 'Sample principal ID',
  authorizationPoliciesImpactRequired:
    'Run impact analysis with a sample principal before enforcing this binding.',
  authorizationPoliciesSimulationDescription:
    'Compare current and candidate decisions without changing production authorization.',
  authorizationPoliciesNonMutating: 'Non-mutating',
  authorizationPoliciesPrincipal: 'Principal',
  authorizationPoliciesCurrentVersion: 'Current policy version',
  authorizationPoliciesCandidateVersion: 'Candidate policy version',
  authorizationPoliciesSelectVersion: 'Select a version',
  authorizationPoliciesAttributeOverrides: 'Context attributes',
  authorizationPoliciesAttributeOverridesHint:
    'Use the typed server format for simulation-only values. These values never become trusted production attributes.',
  authorizationPoliciesBaseDecision: 'Base authorization allows access',
  authorizationPoliciesRunSimulation: 'Run simulation',
  authorizationPoliciesRunImpact: 'Run impact analysis',
  authorizationPoliciesSimulationRequiredFields:
    'Complete the application, principal, and permission fields.',
  authorizationPoliciesAttributesJsonInvalid: 'Context attributes must be a JSON object.',
  authorizationPoliciesSimulationError: 'The policy simulation could not be completed.',
  authorizationPoliciesDecisionTrace: 'Decision trace',
  authorizationPoliciesBaseAuthority: 'Base authority',
  authorizationPoliciesPolicyDecision: 'Policy decision',
  authorizationPoliciesFinalDecision: 'Final decision',
  authorizationPoliciesAllow: 'Allow',
  authorizationPoliciesMatchedRules: 'Matched policy rules',
  authorizationPoliciesNoRulesMatched: 'No policy rules matched this request.',
  authorizationPoliciesMissingAttributes: 'Missing attributes',
  authorizationPoliciesCandidateDecision: 'Candidate decision',
  authorizationPoliciesImpact: 'Impact analysis',
  authorizationPoliciesImpactDescription:
    'Targeted analysis is bounded and estimated; it does not enumerate every tenant principal and resource.',
  authorizationPoliciesEvaluatedSamples: 'Evaluated samples',
  authorizationPoliciesChangedSamples: 'Changed samples',
  authorizationPoliciesEstimated: 'Estimated',
  authorizationPoliciesImpactSafetyNote:
    'Use this result as a safety signal. The backend remains authoritative and validates the activation again.',
  authorizationPoliciesImpactError: 'The policy impact analysis could not be completed.',
  authorizationPoliciesYes: 'Yes',
  authorizationPoliciesNo: 'No',
  authorizationPoliciesShadowDescription:
    'Shadow evaluations never affect production access. Only mismatches are persisted for diagnostics.',
  authorizationPoliciesRefreshDiagnostics: 'Refresh diagnostics',
  authorizationPoliciesRecordedMismatches: 'Recorded mismatches',
  authorizationPoliciesAllowToDeny: 'Allow to deny',
  authorizationPoliciesDenyToAllow: 'Deny to allow',
  authorizationPoliciesDiagnosticsUnavailable: 'Shadow diagnostics are unavailable.',
  authorizationPoliciesNoMismatches: 'No shadow mismatches are recorded.',
  authorizationPoliciesMismatch: 'Mismatch',
  authorizationPoliciesReason: 'Reason',
  authorizationPoliciesProduction: 'Production',
  authorizationPoliciesObserved: 'Observed',
  authorizationPoliciesDiagnosticsError: 'Shadow diagnostics could not be loaded.',
  authorizationPoliciesDraft: 'Draft',
  authorizationPoliciesValidatedState: 'Validated',
  authorizationPoliciesActive: 'Active',
  authorizationPoliciesInactive: 'Inactive',
  authorizationPoliciesDeprecated: 'Deprecated',
  authorizationPoliciesInvalid: 'Invalid',
  authorizationPoliciesShadowing: 'Shadow',
  authorizationPoliciesValid: 'Valid',
  authorizationPoliciesMissingProvider: 'Missing attribute provider',
  authorizationPoliciesStaleProjection: 'Stale projection',
  authorizationPoliciesEvaluationErrors: 'Evaluation errors',
  authorizationPoliciesOperatorEqual: 'Equals',
  authorizationPoliciesOperatorNotEqual: 'Does not equal',
  authorizationPoliciesOperatorGreaterThan: 'Greater than',
  authorizationPoliciesOperatorGreaterThanOrEqual: 'At least',
  authorizationPoliciesOperatorLessThan: 'Less than',
  authorizationPoliciesOperatorLessThanOrEqual: 'At most',
  authorizationPoliciesOperatorContains: 'Contains',
  authorizationPoliciesOperatorIn: 'Is in',
  authorizationPoliciesOperatorStartsWith: 'Starts with',
  authorizationPoliciesStringType: 'Text',
  authorizationPoliciesBooleanType: 'Boolean',
  authorizationPoliciesIntegerType: 'Whole number',
  authorizationPoliciesDecimalType: 'Decimal number',

  authorizationProvisioningTitle: 'Provisioning',
  authorizationProvisioningDescription:
    'Understand and repair external authorization state without inspecting background jobs or raw events.',
  authorizationProvisioningConnections: 'Connections',
  authorizationProvisioningExternalMappings: 'External mappings',
  authorizationProvisioningConflicts: 'Provisioning conflicts',
  authorizationProvisioningReconciliation: 'Reconciliation',
  authorizationProvisioningHealth: 'Health',
  authorizationProvisioningNoConnections: 'No external identity connections are configured.',
  authorizationProvisioningConnectionsLoadError: 'Provisioning connections could not be loaded.',
  authorizationProvisioningProvider: 'Provider',
  authorizationProvisioningProviderType: 'Type',
  authorizationProvisioningLastSync: 'Last sync',
  authorizationProvisioningLastReconciled: 'Last reconciliation',
  authorizationProvisioningProvisionedUsers: 'Provisioned users',
  authorizationProvisioningProvisionedGroups: 'Provisioned groups',
  authorizationProvisioningMappingCount: 'Mappings',
  authorizationProvisioningDrift: 'Drift',
  authorizationProvisioningPendingConflicts: 'Pending conflicts',
  authorizationProvisioningConnectionDetails: 'Connection details',
  authorizationProvisioningOpenProviderSettings: 'Open provider settings',
  authorizationProvisioningOpenScimSettings: 'Open SCIM settings',
  authorizationProvisioningViewMappings: 'View mappings',
  authorizationProvisioningHealthHealthy: 'Healthy',
  authorizationProvisioningHealthDegraded: 'Degraded',
  authorizationProvisioningHealthBroken: 'Broken',
  authorizationProvisioningHealthSynchronizationBehind: 'Sync behind',
  authorizationProvisioningHealthMappingUnresolved: 'Mapping unresolved',
  authorizationProvisioningMappingsLoadError: 'External mappings could not be loaded.',
  authorizationProvisioningNoMappings: 'No external mappings match the selected provider.',
  authorizationProvisioningNewMapping: 'New mapping',
  authorizationProvisioningEditMapping: 'Edit mapping',
  authorizationProvisioningMappingProvider: 'Connection',
  authorizationProvisioningMappingSource: 'External source',
  authorizationProvisioningExternalObject: 'External group or claim',
  authorizationProvisioningTarget: 'Spruce target',
  authorizationProvisioningApplication: 'Application key',
  authorizationProvisioningApplicationPlaceholder: 'paper',
  authorizationProvisioningTargetId: 'Target ID',
  authorizationProvisioningTargetIdPlaceholder: 'Enter a group or role ID',
  authorizationProvisioningScopeType: 'Scope type',
  authorizationProvisioningScopeId: 'Scope ID',
  authorizationProvisioningInheritance: 'Inheritance',
  authorizationProvisioningMappingEnabled: 'Enabled',
  authorizationProvisioningGroupSource: 'External group',
  authorizationProvisioningClaimSource: 'Federation claim',
  authorizationProvisioningRoleTarget: 'Role',
  authorizationProvisioningGroupTarget: 'Group',
  authorizationProvisioningApplicationAccessTarget: 'Application access',
  authorizationProvisioningPreviewMapping: 'Preview mapping',
  authorizationProvisioningApplyMapping: 'Apply mapping',
  authorizationProvisioningPreviewDescription:
    'Review membership impact and governance findings before this mapping changes access.',
  authorizationProvisioningPreviewImpact: 'Mapping impact preview',
  authorizationProvisioningExternalMembers: 'External members',
  authorizationProvisioningKnownUsers: 'Known users',
  authorizationProvisioningNewAssignments: 'New assignments',
  authorizationProvisioningRisk: 'Risk',
  authorizationProvisioningWarnings: 'Warnings',
  authorizationProvisioningPreviewRequired: 'Preview the mapping before applying it.',
  authorizationProvisioningPreviewBlocked:
    'This mapping is blocked by the server governance decision.',
  authorizationProvisioningMappingRequiredFields:
    'Complete the provider, external object, application, and target fields.',
  authorizationProvisioningMappingPreviewError: 'The mapping preview could not be loaded.',
  authorizationProvisioningMappingSaved: 'External mapping saved.',
  authorizationProvisioningMappingSaveError: 'The external mapping could not be saved.',
  authorizationProvisioningDisableMapping: 'Disable mapping',
  authorizationProvisioningMappingDeleted: 'External mapping disabled.',
  authorizationProvisioningMappingDeleteError: 'The external mapping could not be disabled.',
  authorizationProvisioningConflictStatus: 'Conflict status',
  authorizationProvisioningConflictReason: 'Reason',
  authorizationProvisioningConflictDetail: 'Details',
  authorizationProvisioningCreated: 'Created',
  authorizationProvisioningNoConflicts: 'No provisioning conflicts match the selected status.',
  authorizationProvisioningConflictLoadError: 'Provisioning conflicts could not be loaded.',
  authorizationProvisioningIgnoreConflict: 'Ignore conflict',
  authorizationProvisioningConflictResolved: 'Provisioning conflict resolved.',
  authorizationProvisioningConflictActionError: 'The provisioning conflict could not be updated.',
  authorizationProvisioningAllStatuses: 'All statuses',
  authorizationProvisioningPending: 'Pending',
  authorizationProvisioningBlocked: 'Blocked',
  authorizationProvisioningResolved: 'Resolved',
  authorizationProvisioningIgnored: 'Ignored',
  authorizationProvisioningReconciliationTitle: 'Run reconciliation',
  authorizationProvisioningReconciliationDescription:
    'Compare external state with Spruce authorization and choose whether to observe drift or repair it.',
  authorizationProvisioningReconciliationMode: 'Mode',
  authorizationProvisioningObserve: 'Observe',
  authorizationProvisioningRepair: 'Repair',
  authorizationProvisioningRunDryRun: 'Run dry run',
  authorizationProvisioningRunRepair: 'Run repair',
  authorizationProvisioningReconciliationStatus: 'Reconciliation status',
  authorizationProvisioningLastSuccessfulSync: 'Last successful sync',
  authorizationProvisioningLastFailure: 'Last failure',
  authorizationProvisioningReconciliationResult: 'Latest result',
  authorizationProvisioningAdds: 'Memberships to add',
  authorizationProvisioningRemoves: 'Memberships to remove',
  authorizationProvisioningRepairs: 'Repairs applied',
  authorizationProvisioningReconciliationRunError: 'The reconciliation run could not be completed.',
  authorizationProvisioningStatusLoadError: 'Reconciliation status could not be loaded.',
  authorizationProvisioningStatusUnavailable:
    'No reconciliation status is available for this connection.',
  authorizationProvisioningDecisionAllowed: 'The mapping is allowed.',
  authorizationProvisioningDecisionBlocked: 'The mapping is blocked: {outcome}.',
  authorizationProvisioningHealthTitle: 'Provisioning health',
  authorizationProvisioningHealthDescription:
    'Monitor synchronization drift, pending conflicts, and the last successful reconciliation for each connection.',

  authorizationPrivilegedAccessTitle: 'Privileged access',
  authorizationPrivilegedAccessDescription:
    'Keep elevated access visible, time-bound, reviewable, and revocable.',
  authorizationPrivilegedAccessRequests: 'Requests',
  authorizationPrivilegedAccessActiveElevations: 'Active elevations',
  authorizationPrivilegedAccessHistory: 'History',
  authorizationPrivilegedAccessNewRequest: 'Request elevation',
  authorizationPrivilegedAccessNoRequests: 'No privileged access requests are available.',
  authorizationPrivilegedAccessNoActiveElevations: 'No active elevations are in effect.',
  authorizationPrivilegedAccessNoHistory: 'No privileged access history is available.',
  authorizationPrivilegedAccessLoadError: 'Privileged access requests could not be loaded.',
  authorizationPrivilegedAccessRole: 'Role',
  authorizationPrivilegedAccessPrincipal: 'Principal',
  authorizationPrivilegedAccessScope: 'Scope',
  authorizationPrivilegedAccessScopeType: 'Scope type',
  authorizationPrivilegedAccessScopeId: 'Scope ID',
  authorizationPrivilegedAccessDuration: 'Duration (minutes)',
  authorizationPrivilegedAccessDurationValue: '{value} minutes',
  authorizationPrivilegedAccessDurationHint:
    'The server enforces the maximum duration for this role.',
  authorizationPrivilegedAccessReason: 'Justification',
  authorizationPrivilegedAccessReasonHint:
    'Explain the work that requires temporary elevated access.',
  authorizationPrivilegedAccessRequested: 'Requested',
  authorizationPrivilegedAccessStatus: 'State',
  authorizationPrivilegedAccessActivated: 'Activated',
  authorizationPrivilegedAccessStarts: 'Starts',
  authorizationPrivilegedAccessExpires: 'Expires',
  authorizationPrivilegedAccessRevoked: 'Revoked',
  authorizationPrivilegedAccessRemaining: '{value} minutes remaining',
  authorizationPrivilegedAccessRequestTitle: 'Request privileged access',
  authorizationPrivilegedAccessRequestDescription:
    'Choose a privileged role, scope, duration, and justification. Server governance remains authoritative.',
  authorizationPrivilegedAccessPreflight: 'Governance preflight',
  authorizationPrivilegedAccessPreflightDescription:
    'Review the approval, step-up, and conflict decision before creating the request.',
  authorizationPrivilegedAccessPreflightRequired:
    'Run the governance preflight before requesting access.',
  authorizationPrivilegedAccessCheck: 'Check request',
  authorizationPrivilegedAccessRequest: 'Request access',
  authorizationPrivilegedAccessRequired: 'Required',
  authorizationPrivilegedAccessApproval: 'Approval',
  authorizationPrivilegedAccessApprover: 'Approver',
  authorizationPrivilegedAccessStepUp: 'Step-up authentication',
  authorizationPrivilegedAccessMaximumDuration: 'Maximum duration',
  authorizationPrivilegedAccessRisk: 'Risk level',
  authorizationPrivilegedAccessConflicts: 'Conflicts',
  authorizationPrivilegedAccessDecisionAllowed: 'The request can be activated.',
  authorizationPrivilegedAccessDecision: 'The request requires attention: {outcome}.',
  authorizationPrivilegedAccessRequiredFields:
    'Choose a role and complete the duration and justification fields.',
  authorizationPrivilegedAccessPreflightError:
    'The privileged access preflight could not be loaded.',
  authorizationPrivilegedAccessRequestError: 'The privileged access request could not be created.',
  authorizationPrivilegedAccessDetailError: 'The privileged access details could not be loaded.',
  authorizationPrivilegedAccessActionError: 'The privileged access action could not be completed.',
  authorizationPrivilegedAccessDetails: 'Privileged access details',
  authorizationPrivilegedAccessApprove: 'Approve',
  authorizationPrivilegedAccessActivate: 'Activate',
  authorizationPrivilegedAccessRevoke: 'Revoke elevation',
  authorizationPrivilegedAccessRevokeReason: 'Revocation reason',
  authorizationPrivilegedAccessApprovalHistory: 'Approval history',
  authorizationPrivilegedAccessAuditTrail: 'Audit trail',
  authorizationPrivilegedAccessNoAudit: 'No audit events are available.',
  authorizationPrivilegedAccessApprovalRequested: 'Approval request created.',
  authorizationPrivilegedAccessRequestedSuccess: 'Privileged access is active.',
  authorizationPrivilegedAccessApproved: 'Privileged access request approved.',
  authorizationPrivilegedAccessActivatedSuccess: 'Privileged access activated.',
  authorizationPrivilegedAccessRevokedSuccess: 'Privileged access revoked.',
  authorizationPrivilegedAccessStateActive: 'Active',
  authorizationPrivilegedAccessStateExpiringSoon: 'Expiring soon',
  authorizationPrivilegedAccessStateExpired: 'Expired',
  authorizationPrivilegedAccessStateRevoked: 'Revoked',

  authorizationOperationsTitle: 'Authorization operations',
  authorizationOperationsDescription:
    'Monitor authorization health, investigate failures, and trace protected decisions.',
  authorizationOperationsOverview: 'Overview',
  authorizationOperationsDiagnostics: 'Diagnostics',
  authorizationOperationsAudit: 'Audit explorer',
  authorizationOperationsDecisions: 'Decision lookup',
  authorizationOperationsBulk: 'Bulk operations',
  authorizationOperationsHealth: 'Authorization health',
  authorizationOperationsPrivilegedUsers: 'Users with privileged roles',
  authorizationOperationsPendingRequests: 'Pending access requests',
  authorizationOperationsActiveElevations: 'Active JIT elevations',
  authorizationOperationsOverdueReviews: 'Overdue access reviews',
  authorizationOperationsProvisioningConflicts: 'Provisioning conflicts',
  authorizationOperationsUnhealthyConnections: 'Unhealthy connections',
  authorizationOperationsInvalidPolicies: 'Invalid policies',
  authorizationOperationsShadowMismatches: 'Shadow mismatches',
  authorizationOperationsDenyVolume: 'Authorization denies (24 hours)',
  authorizationOperationsPolicyFailures: 'Policy evaluation failures',
  authorizationOperationsMissingAttributes: 'Missing attribute providers',
  authorizationOperationsStaleProjections: 'Stale projections',
  authorizationOperationsReconciliationDrift: 'Reconciliation drift',
  authorizationOperationsBlockedScopes: 'Blocked scope projections',
  authorizationOperationsRevisionHeads: 'Revision heads',
  authorizationOperationsEscalationAttempts: 'Privilege escalation attempts',
  authorizationOperationsAuditDescription:
    'Filter authorization events by actor, target, action, resource, outcome, and source details.',
  authorizationOperationsDecisionDescription:
    'Search a protected decision trace by decision, request, subject, resource, or revision.',
  authorizationOperationsDecisionId: 'Decision ID',
  authorizationOperationsTime: 'Time',
  authorizationOperationsAction: 'Action',
  authorizationOperationsActor: 'Actor',
  authorizationOperationsSeverity: 'Severity',
  authorizationOperationsRequestId: 'Request ID',
  authorizationOperationsSubjectId: 'Subject ID',
  authorizationOperationsResource: 'Resource',
  authorizationOperationsRevision: 'Authorization revision',
  authorizationOperationsTarget: 'Target',
  authorizationOperationsOutcome: 'Outcome',
  authorizationOperationsNoAudit: 'No authorization events match these filters.',
  authorizationOperationsNoDecision: 'No protected decision trace matches these filters.',
  authorizationOperationsAuditError: 'The authorization audit could not be loaded.',
  authorizationOperationsDecisionError: 'The decision trace could not be loaded.',
  authorizationOperationsLoadError: 'Authorization operations could not be loaded.',
  authorizationOperationsApplication: 'Application',
  authorizationOperationsRole: 'Role',
  authorizationOperationsPermission: 'Permission',
  authorizationOperationsFrom: 'From date',
  authorizationOperationsTo: 'To date',
  authorizationOperationsHealthHealthy: 'Healthy',
  authorizationOperationsHealthDegraded: 'Degraded',
  authorizationOperationsHealthUnhealthy: 'Unhealthy',
  authorizationOperationsViewDetails: 'View details',
  authorizationOperationsRedactedDetails: 'Redacted event details',
  authorizationBulkTitle: 'Bulk role assignments',
  authorizationBulkDescription:
    'Preview governed impact before assigning one role to selected users.',
  authorizationBulkSelectUsers: 'Select users',
  authorizationBulkSelectedUsers: 'Selected users',
  authorizationBulkRole: 'Role',
  authorizationBulkScopeType: 'Scope type',
  authorizationBulkScopeId: 'Scope ID',
  authorizationBulkReason: 'Reason',
  authorizationBulkPreview: 'Preview impact',
  authorizationBulkCommit: 'Apply assignments',
  authorizationBulkRollback: 'Roll back assignments',
  authorizationBulkImpact: 'Impact preview',
  authorizationBulkPartialFailure: 'Some assignments need attention.',
  authorizationBulkPreviewRequired: 'Review the impact preview before applying changes.',
  authorizationBulkNoUsers: 'No users match this search.',
  authorizationBulkLoadError: 'Bulk assignment data could not be loaded.',
  authorizationBulkActionError: 'The bulk assignment could not be completed.',
  authorizationBulkPreviewReady: 'The server returned a governed impact preview.',
  authorizationBulkCommitted: 'Bulk assignment results are ready.',
  authorizationBulkRolledBack: 'Selected assignments were rolled back.',
  authorizationBulkApprovalRequired: 'Approval required',
  authorizationBulkBlocked: 'Blocked',
  authorizationBulkSelectAtLeastOne: 'Select at least one user.',
  authorizationBulkRollbackReason: 'Rollback reason',
  authorizationBulkRollbackConfirmation:
    'This will revoke {count} assignments and remove their access. Confirm only if the impact is understood.',
  authorizationBulkReasonRequired: 'Enter a reason before previewing a bulk role change.',
  forbiddenEyebrow: 'Access restricted',
  forbiddenTitle: "You don't have access to this page",
  forbiddenDescription:
    'Your account is signed in, but it does not have the permissions required to view this area.',
  forbiddenHelp: 'If you think this is unexpected, contact your tenant administrator.',
  forbiddenGoToDashboard: 'Go to dashboard',
  forbiddenSignOut: 'Sign out',
};


