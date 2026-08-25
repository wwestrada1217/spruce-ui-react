# Datagridex Angular → React parity matrix

Source baseline: `spruce-ng/projects/spruce-ui/datagridex` and `projects/docs/src/app/pages/components/datagridex-page.ts`. React target: `src/components/datagridex`, its docs route, and `tests/react/datagridex.test.tsx`.

The Angular inputs and outputs below are represented as typed React props/callbacks. React keeps state controlled where Angular exposes a model, and uses render props/slot components where Angular uses templates. Framework-specific dependency injection, signals, and directives are intentionally not part of the React contract.

## Properties and behaviors

| Angular surface | React surface | Behavior / accessibility / theming notes |
| --- | --- | --- |
| `rows` | `rows` | Generic readonly row collection; stable row identity uses `trackBy`. |
| `dataContext`, `dataContextOptions` | Same names | Adapter covers loading, dirty state, record state, validation, navigation, CRUD, save/discard, and configurable state/validation display. |
| `loading`, `loadingMessage` | Same names | `aria-busy` and status region; message defaults through Spruce i18n. |
| `columns` | `columns` | Typed column definitions; value getters/formatters, widths, alignment, wrapping, sort/filter/edit/aggregate metadata. |
| `columnGroups` | `columnGroups` | Group header rows, resize and reorder callbacks; keyboard Alt+Arrow movement. |
| `ariaLabel` | `ariaLabel` | Labels the `role="grid"`; default is localized. |
| `emptyMessage`, `filterEmptyMessage` | Same names | Empty and filtered-empty states; product descriptions remain caller-owned. |
| `emptyStateDescription`, `filterEmptyStateDescription` | Same names | Optional descriptive text below the state heading; filtered fallback is localized. |
| `autoHeight` | `autoHeight` | Parent owns layout spacing; viewport overflow changes without hard-coded colors. |
| `autoColumnWidth`, `fitColumnsToWidth`, `defaultColumnWidth` | Same names | Token-based grid sizing with numeric, percentage, flex, min/max, resize, and auto-size support. |
| `reorderable` | `reorderable` | Pointer drag and keyboard Alt+Arrow/Home/End column movement; per-column/group `reorderable` overrides apply. |
| `showVerticalLines` | `showVerticalLines` | Token-based borders; works in light/dark themes. |
| `sortMode` | `sortMode` | Client sorting or manual sorting with the same sort callbacks. |
| `sortIndicatorVisibility`, `filterIndicatorVisibility` | Same names | Hover/always visibility is exposed as data attributes for CSS and keeps keyboard focus visible. |
| `multiSort` | `multiSort` | Sort model is an ordered readonly array; `onSortChange` and `onSortsChange` fire together. |
| `filterMode` | `filterMode` | Client/manual filtering; value and dynamic conditions share `onFilterChange`. |
| `locale` | `locale` | Overrides provider locale for number/date/filter comparisons; provider i18n supplies default locale and direction. |
| `trackBy` | `trackBy` | Stable DOM identity for rows and imperative focus. |
| `editMode`, `editOnClick`, `editOnType`, `editLabels` | Same names | Cell/row editing, keyboard entry, Escape/Enter/Tab/Arrow movement, and localized/custom action labels. |
| `rowLabel` | `rowLabel` | Caller-defined accessible row name; default row names are localized. |
| `rowDetails`, `expandedRows`, `rowDetailExpandable`, `rowDetailHeight` | Same names plus `onExpandedRowsChange` | Controlled expansion, keyboard-toggleable disclosure, detail region, and `$implicit` row detail context. |
| `enableNewRow`, `newRowFactory`, `newRowLabel` | Same names | New-row draft is committed through controlled edit/new-row callbacks or the data-context adapter. |
| `pagination`, `paginationType`, `pageSize`, `pageSizeOptions` | Same names plus `onPageChange`, `onPageSizeChange` | Compact/full pager; page size is controlled/uncontrolled React state and page navigation is callback-driven. |
| `virtualScroll`, `virtualScrollHeight`, `virtualRowHeight`, `virtualOverscan` | Same names | Overscanned rendering and spacer rows; row spans are disabled when virtualization is active. |
| `columnVirtualization`, `columnVirtualizationOverscan` | Same names | Public configuration/data attributes retained for the virtualization strategy and CSS integration. |
| `virtualPaging`, `virtualPage`, `virtualTotalRows`, `virtualHasPreviousPage`, `virtualHasNextPage`, `virtualPagingLoading` | Same names plus `onVirtualPageChange`, `onVirtualPageRequest` | Pager renders for virtual paging, unknown totals use supplied next/previous flags, page-size changes are callback-driven, and loading is announced. |
| `selectionMode`, `groupSelection`, `selectedRows` | Same names plus `onSelectedRowsChange` | Single/multiple selection, group tri-state selection, controlled model, row `aria-selected`, and grid `aria-multiselectable`. |
| `stripedRows` | `stripedRows` | Token-based alternating row background. |
| `footer`, `footerLabel` | Same names | Aggregate footer uses caller labels/formatters and localized default summary label. |
| `statusbar`, `statusbarAriaLabel`, `statusbarShowRowCount`, `statusbarShowSelectedRowCount`, `statusbarMergePagination` | Same names | `role="status"`, localized counts, optional merged pager. |
| `toolbar`, `toolbarAriaLabel`, `toolbarShowColumnSelector`, `toolbarShowGroupedColumns` | Same names | Toolbar is labeled and exposes data-context actions, search, column selector, and grouping controls. |
| `searchable`, `searchTerm` | Same names plus `onSearchTermChange` | Controlled search model, localized label, locale-aware matching. |
| `columnSelector`, `columnSelectorLabel`, `hiddenColumnKeys` | Same names plus `onHiddenColumnKeysChange` | Visibility checkboxes, pointer drag, and keyboard move controls; hidden-column model is controlled. |
| `groupBy`, `stickyGroupHeaders`, `groupsExpandedByDefault`, `indentGroupedRows` | Same names plus `onGroupByChange` | Nested grouped rows, keyboard expansion, sticky headers, indentation, and group selection. |
| `groupSorting`, `groupSorts` | Same names plus `onGroupSortsChange` | Group chips cycle ascending/descending; Delete/Backspace removes grouping; Alt+Arrow/Home/End reorders groups. |
| `rowReorder`, `rowNumbers` | Same names plus `onRowOrderChange` | Drag and Alt+Arrow/Home/End reorder events are blocked when paging, virtualizing, grouping, sorting, or filtering changes the visible order. |
| `columnMenu` | `columnMenu` | Sort, auto-size, group, pin, unpin, hide, separators, nested menu items, Escape close, and menu roles. |
| `columnPins` | Same name plus `onColumnPinsChange` | Controlled per-column left/right/null overrides reorder visible columns and calculate cumulative logical offsets for pinned cells in RTL/LTR. |
| `detailPane`, `detailPaneWidth`, `detailPaneTitle`, `detailPaneRow` | Same names plus `onDetailPaneRowChange` | Controlled side pane with labeled close button and `$implicit` detail context. |
| `leadingRowActionsWidth` | Same name | Width is applied to the leading action utility column. |
| `preventInvalidCommit`, `validateOnInput` | Same names | Required/range/length/pattern/custom validation, commit blocking, `aria-invalid`, `aria-describedby`, and announced messages. |
| `rowClass`, `rowStyle` | Same names | Caller styling hooks; library CSS continues to use `sp-` classes and design tokens. |
| `cellTemplates`, `cellEditors`, `rowDetail`, `detailPaneRenderer`, `leadingRowActions`, `rowTemplate` | Same names plus equivalent JSX slot components | Render contexts expose Angular-style `$implicit` alongside named fields, without Angular template syntax. |

## Column-level behavior

| Angular column capability | React type | Parity notes |
| --- | --- | --- |
| value access/formatting | `valueGetter`, `valueFormatter`, `filterValueFormatter` | All derived display/filter values remain typed callbacks. |
| sorting | `sortable`, `sortComparator` | Locale-aware fallback comparator; manual mode emits without client reordering. |
| filtering | `filterable`, `filterVariant`, `filterDataType`, `filterPredicate` | Value filters preserve actual values in emitted events; dynamic filters normalize numbers, dates, and booleans. |
| sizing/order/pinning | `resizable`, `reorderable`, `pinned`, `width`, `flex`, `minWidth`, `maxWidth` | Logical inline offsets support RTL; keyboard resize uses logical Arrow direction. |
| editing | `editable`, `readonly`, `editorType`, `editorOptions`, `editorValueFormatter`, `valueParser` | Built-in text/number/checkbox/date/select/combobox/grid-combobox paths plus custom editors. Select/combobox options support label/value/display/value-field mappings. |
| date editor constraints | `min`, `max`, `editorOptions.minDate`, `maxDate`, `disabledDates`, `dateFilter` | Native date input constraints plus callback guard for disabled dates. |
| validation | `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `validator`, `validators`, `rules`, `validationMessages` | Invalid cells remain associated with their messages and expose visible focus/contrast states. |
| row spanning | `rowSpan` | Numeric or callback spans expose `rows` context and `aria-rowspan`; covered cells are omitted. Disabled with virtual scroll/paging, grouping, or expanded details as in Angular. |
| aggregates | `aggregate` | Sum/count/average/min/max/custom group/footer aggregates with typed value contexts and formatters. |
| custom column menu | `menuItems` | Commands, disabled items, separators, and nested groups are preserved. |

## Events and imperative methods

| Angular output | React callback |
| --- | --- |
| `sortChange`, `sortsChange` | `onSortChange`, `onSortsChange` |
| `filterChange` | `onFilterChange` |
| `columnResize`, `columnGroupResize` | `onColumnResize`, `onColumnGroupResize` |
| `columnOrderChange`, `columnGroupOrderChange` | `onColumnOrderChange`, `onColumnGroupOrderChange` |
| `columnPinsChange` | `onColumnPinsChange` |
| `hiddenColumnKeysChange`, `columnVisibilityChange` | `onHiddenColumnKeysChange`, `onColumnVisibilityChange` |
| `groupByChange`, `groupSortsChange` | `onGroupByChange`, `onGroupSortsChange` |
| `cellEditCommit`, `rowEditCommit`, `newRowCommit`, `editCancel` | `onCellEditCommit`, `onRowEditCommit`, `onNewRowCommit`, `onEditCancel` |
| `cellValidationFailed`, `rowValidationFailed` | `onCellValidationFailed`, `onRowValidationFailed` |
| `pageChange`, page-size model changes | `onPageChange`, `onPageSizeChange` |
| `virtualPageRequest` | `onVirtualPageRequest` |
| selection/row details/detail pane changes | `onSelectionChange`, `onSelectedRowsChange`, `onExpandedRowsChange`, `onDetailPaneRowChange` |
| row reorder | `onRowOrderChange` |
| DataContext save complete/error | `onDataContextSaveComplete`, `onDataContextSaveError` |

The `DatagridexHandle` exposes the Angular public actions as typed imperative methods: sorting, value/condition filtering, detail expansion, paging, selection, DataContext CRUD/save/discard, sizing, visibility/grouping, and edit lifecycle controls.

## Accessibility, i18n, RTL, and themes

- The grid uses `role="grid"`, `row`, `columnheader`, and `gridcell` semantics with row/column counts, selection state, busy state, invalid state, row spans, and labeled status/toolbar/pagination regions.
- Keyboard behavior covers cell navigation, edit lifecycle, sorting, resize, column/group reorder, grouping expansion, selection, row reorder, and Escape dismissal of menus.
- Default chrome comes from `useI18n()` and `SpruceProvider` labels; caller-provided domain copy stays on the explicit props.
- Logical CSS properties and RTL-aware resize/reorder calculations are used throughout; no physical left/right assumptions are required for Arabic or other RTL locales.
- All colors, borders, spacing, radii, shadows, typography, control heights, and motion use Spruce design tokens so light/dark themes inherit correctly.
