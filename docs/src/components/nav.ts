export interface NavLeaf {
  label: string;
  route: string;
  icon?: string;
  soon?: boolean;
}

export interface NavBranch {
  label: string;
  icon: string;
  children: NavLeaf[];
}

export interface NavSection {
  label: string;
  items: (NavLeaf | NavBranch)[];
}

export function isNavBranch(item: NavLeaf | NavBranch): item is NavBranch {
  return 'children' in item && Array.isArray((item as NavBranch).children);
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Foundations',
    items: [
      { icon: 'palette',        label: 'Colors',       route: '#/foundation/colors'        },
      { icon: 'align-left',     label: 'Typography',   route: '#/foundation/typography'    },
      { icon: 'ruler',          label: 'Spacing',      route: '#/foundation/spacing'       },
      { icon: 'layers',         label: 'Shadows',      route: '#/foundation/shadows'       },
      { icon: 'sparkles',       label: 'Iconography',  route: '#/foundation/iconography'   },
      { icon: 'brush',          label: 'Theming',      route: '#/foundation/theming'       },
      { icon: 'play',           label: 'Motion',       route: '#/foundation/motion'        },
      { icon: 'message-circle', label: 'Voice & Tone', route: '#/foundation/voice-and-tone'},
    ],
  },
  {
    label: 'Core',
    items: [
      { icon: 'database', label: 'Data Source',  route: '#/core/data-source'  },
      { icon: 'layers',   label: 'Data Context', route: '#/core/data-context' },
    ],
  },
  {
    label: 'Data Display',
    items: [
      { icon: 'tag',                label: 'Badge',             route: '#/components/badge'          },
      { icon: 'keyboard',           label: 'Kbd',               route: '#/components/kbd'            },
      { icon: 'activity',           label: 'Progress Bar',      route: '#/components/progress-bar'   },
      { icon: 'trending-up',        label: 'Stat Card',         route: '#/components/stat-card'      },
      { icon: 'user',               label: 'Avatar',            route: '#/components/avatar'         },
      { icon: 'users',              label: 'Avatar Group',      route: '#/components/avatar-group'   },
      { icon: 'loader',             label: 'Spinner',           route: '#/components/spinner'        },
      { icon: 'package',            label: 'Empty',             route: '#/components/empty'          },
      { icon: 'clock',              label: 'Timeline',          route: '#/components/timeline'       },
      { icon: 'git-commit',         label: 'Git Graph',         route: '#/components/git-graph'      },
      { icon: 'git-fork',           label: 'Treeview',          route: '#/components/tree'           },
      { icon: 'scan-line',          label: 'Barcode & QR Code', route: '#/components/barcode-qr'     },
      { icon: 'credit-card',        label: 'Credit Card',       route: '#/components/credit-card'    },
      { icon: 'table',              label: 'Datagrid',          route: '#/components/datagrid'       },
      { icon: 'calendar',           label: 'Scheduler',         route: '#/components/scheduler'      },
      { icon: 'bar-chart',          label: 'Gantt Chart',       route: '#/components/gantt'          },
      { icon: 'columns',            label: 'Kanban',            route: '#/components/kanban'         },
      { icon: 'terminal',           label: 'Terminal',          route: '#/components/terminal'       },
      { icon: 'star',               label: 'Rating',            route: '#/components/rating'         },
      { icon: 'columns', label: 'Carousel',          route: '#/components/carousel'       },
      { icon: 'maximize',           label: 'Lightbox',          route: '#/components/lightbox'       },
      { icon: 'columns',            label: 'Image Compare',     route: '#/components/image-compare'  },
      { icon: 'ratio',              label: 'Aspect Ratio',      route: '#/components/aspect-ratio'   },
      { icon: 'list',               label: 'List',              route: '#/components/list'           },
    ],
  },
  {
    label: 'Forms & Inputs',
    items: [
      { icon: 'square-check',      label: 'Checkbox',          route: '#/components/checkbox'           },
      { icon: 'circle-dot',        label: 'Radio Buttons',     route: '#/components/radio'              },
      { icon: 'toggle-left',       label: 'Switch',            route: '#/components/switch'             },
      { icon: 'text-cursor-input', label: 'Input',             route: '#/components/input'              },
      { icon: 'chevron-down',      label: 'Select',            route: '#/components/select'             },
      { icon: 'search',            label: 'Combobox',          route: '#/components/combobox'           },
      { icon: 'layout-grid',       label: 'Grid Combobox',     route: '#/components/grid-combobox'      },
      { icon: 'menu',              label: 'Dropdown Menu',     route: '#/components/dropdown'           },
      { icon: 'align-left',        label: 'Textarea',          route: '#/components/textarea'           },
      { icon: 'at-sign',           label: 'Mention',           route: '#/components/mention'             },
      { icon: 'lock',              label: 'Password Input',    route: '#/components/password-input'     },
      { icon: 'shield',            label: 'Password Progress', route: '#/components/password-progress'  },
      { icon: 'hash',              label: 'OTP Input',         route: '#/components/otp-input'          },
      { icon: 'code',              label: 'Masked Input',      route: '#/components/masked-input'       },
      { icon: 'calendar',          label: 'Datepicker',        route: '#/components/datepicker'         },
      { icon: 'calendar-range',    label: 'Date Range Picker', route: '#/components/daterange-picker'   },
      { icon: 'calendar',          label: 'Calendar',          route: '#/components/calendar'           },
      { icon: 'calendar-range',    label: 'Range Calendar',    route: '#/components/range-calendar'     },
      { icon: 'clock',             label: 'Time Picker',       route: '#/components/time-picker'        },
      { icon: 'calendar-clock',    label: 'Datetime Picker',   route: '#/components/datetime-picker'    },
      { icon: 'sliders-horizontal',label: 'Slider & Range',    route: '#/components/slider-range'       },
      { icon: 'upload',            label: 'File Upload',       route: '#/components/file-upload'        },
      { icon: 'pen-tool',          label: 'Editor',            route: '#/components/editor'        },
      { icon: 'layout-list',       label: 'Block Editor',      route: '#/components/block-editor',       soon: true },
      { icon: 'heading',           label: 'Markdown Editor',   route: '#/components/markdown-editor',    soon: true },
      { icon: 'braces',            label: 'Code Editor',       route: '#/components/code-editor'        },
      { icon: 'square-split-horizontal',         label: 'Diff Editor',       route: '#/components/diff-editor',        soon: true },
      { icon: 'map-pin',           label: 'In-place Editor',   route: '#/components/inplace-editor'     },
      { icon: 'signature',          label: 'Signature Pad',     route: '#/components/signature-pad',      soon: true },
      { icon: 'layout-list',       label: 'Field',             route: '#/components/field',              soon: true },
      { icon: 'filter',            label: 'Filter Expression', route: '#/components/filter-expression'  },
    ],
  },
  {
    label: 'Actions & Navigation',
    items: [
      { icon: 'zap',          label: 'Button',            route: '#/components/button'          },
      { icon: 'columns',      label: 'Button Group',      route: '#/components/button-group'    },
      { icon: 'columns',      label: 'Split Button',      route: '#/components/split-button'    },
      { icon: 'folder-dt',  label: 'Tabs',              route: '#/components/tabs'            },
      { icon: 'chevrons-right',label: 'Breadcrumbs',      route: '#/components/breadcrumbs'     },
      { icon: 'list',         label: 'Stepper',           route: '#/components/stepper'         },
      { icon: 'toggle-left',  label: 'Segmented Control', route: '#/components/segmented'       },
      { icon: 'plus',    label: 'FAB',               route: '#/components/fab'             },
      { icon: 'menu',         label: 'Navigation Menu',   route: '#/components/nav-menu'        },
      { icon: 'panel-top-dashed', label: 'Toolbar',           route: '#/components/toolbar'         },
      { icon: 'chevrons-right',label: 'Pager',            route: '#/components/pager'           },
    ],
  },
  {
    label: 'Layout & Overlays',
    items: [
      { icon: 'square',         label: 'Card',              route: '#/components/card'             },
      { icon: 'layout-panel-left', label: 'Panel',             route: '#/components/panel'            },
      { icon: 'layout-grid',    label: 'Grid',              route: '#/components/grid'             },
      { icon: 'grip-vertical',  label: 'Splitter',          route: '#/components/splitter'         },
      { icon: 'sidebar-left',   label: 'Sidebar',           route: '#/components/sidebar'          },
      { icon: 'credit-card',    label: 'App Header',        route: '#/components/app-header'       },
      { icon: 'panel-right',    label: 'Drawer',            route: '#/components/drawer'           },
      { icon: 'maximize',       label: 'Modal',             route: '#/components/modal'            },
      { icon: 'minimize',       label: 'Window',            route: '#/components/window'           },
      { icon: 'chevron-down',   label: 'Accordion',         route: '#/components/accordion'        },
      { icon: 'alert-circle',   label: 'Alert',             route: '#/components/alert'            },
      { icon: 'alert-triangle', label: 'Message Bar',       route: '#/components/message-bar'      },
      { icon: 'message-square', label: 'Popover & Tooltip', route: '#/components/popover-tooltip'  },
      { icon: 'bell',           label: 'Toast',             route: '#/components/toast'            },
      { icon: 'message-circle', label: 'Snackbar',          route: '#/components/snackbar'         },
      { icon: 'command',        label: 'Command Palette',   route: '#/components/command-palette'  },
      { icon: 'compass',        label: 'Coachmark',         route: '#/components/coachmark'        },
    ],
  },
  {
    label: 'Charts',
    items: [
      { icon: 'bar-chart',    label: 'Bar Chart',         route: '#/charts/bar-chart',             soon: true },
      { icon: 'pie-chart',    label: 'Pie Chart',         route: '#/charts/pie-chart',             soon: true },
      { icon: 'trending-up',  label: 'Line Chart',        route: '#/charts/line-chart',            soon: true },
      { icon: 'activity',     label: 'Area Chart',        route: '#/charts/area-chart',            soon: true },
      { icon: 'bar-chart',    label: 'Stacked Bar',       route: '#/charts/stacked-bar-chart',     soon: true },
      { icon: 'layers',       label: 'Stacked Area',      route: '#/charts/stacked-area-chart',    soon: true },
      { icon: 'circle-dot',   label: 'Bubble Chart',      route: '#/charts/bubble-chart',          soon: true },
      { icon: 'gauge',        label: 'Gauge Chart',       route: '#/charts/gauge-chart',           soon: true },
      { icon: 'chart-scatter',   label: 'Scatter Chart',     route: '#/charts/scatter-chart',         soon: true },
      { icon: 'layout-grid',  label: 'Heatmap',           route: '#/charts/heatmap-chart',         soon: true },
      { icon: 'bar-chart',    label: 'Grouped Bar',       route: '#/charts/grouped-bar-chart',     soon: true },
      { icon: 'bar-chart-2',  label: 'Candlestick',       route: '#/charts/candlestick-chart',     soon: true },
      { icon: 'layout-grid',  label: 'Treemap',           route: '#/charts/treemap-chart',         soon: true },
      { icon: 'play',         label: 'Bar Race',          route: '#/charts/bar-race-chart',        soon: true },
      { icon: 'activity',     label: 'Sparkline',         route: '#/charts/sparkline-chart',       soon: true },
      { icon: 'filter',       label: 'Funnel',            route: '#/charts/funnel-chart',          soon: true },
      { icon: 'bar-chart-2',  label: 'Histogram',         route: '#/charts/histogram-chart',       soon: true },
      { icon: 'calendar',     label: 'Calendar Heatmap',  route: '#/charts/calendar-heatmap-chart',soon: true },
      { icon: 'bar-chart-2',  label: 'Combo Chart',       route: '#/charts/combo-chart',           soon: true },
      { icon: 'hexagon',      label: 'Radar Chart',       route: '#/charts/radar-chart',           soon: true },
      { icon: 'git-merge',    label: 'Sankey Chart',      route: '#/charts/sankey-chart',          soon: true },
      { icon: 'sun',          label: 'Sunburst Chart',    route: '#/charts/sunburst-chart',        soon: true },
      { icon: 'compass',      label: 'Polar Line Chart',  route: '#/charts/polar-line-chart',      soon: true },
      { icon: 'bar-chart-2',  label: 'Waterfall Chart',   route: '#/charts/waterfall-chart',       soon: true },
      { icon: 'globe',        label: 'Map Chart',         route: '#/charts/map-chart',             soon: true },
      { icon: 'users',        label: 'Org Chart',         route: '#/charts/org-chart',             soon: true },
      { icon: 'edit',         label: 'Diagram Editor',    route: '#/charts/diagram-editor',        soon: true },
    ],
  },
  {
    label: 'Effects & Animations',
    items: [
      { icon: 'sparkles',       label: 'Sparkles', route: '#/effects/sparkles', soon: true },
      { icon: 'zap',            label: 'Confetti', route: '#/effects/confetti', soon: true },
      { icon: 'scan-line',      label: 'Shimmer',  route: '#/effects/shimmer',  soon: true },
      { icon: 'sparkles',       label: 'Rainbow',  route: '#/effects/rainbow',  soon: true },
      { icon: 'sun',            label: 'Shine',    route: '#/effects/shine',    soon: true },
      { icon: 'lightbulb',      label: 'Glow',     route: '#/effects/glow',     soon: true },
      { icon: 'move-horizontal',label: 'Marquee',  route: '#/effects/marquee',  soon: true },
      { icon: 'eye',            label: 'Fade',     route: '#/effects/fade',     soon: true },
    ],
  },
  {
    label: 'Utilities',
    items: [
      { icon: 'focus',      label: 'Focus Directives', route: '#/utils/focus-directives', soon: true },
      { icon: 'highlighter',    label: 'Highlight',        route: '#/utils/highlight',        soon: true },
      { icon: 'panel-right',    label: 'Scrollbar',        route: '#/utils/scrollbar'        },
      { icon: 'panel-left',     label: 'Form Layout',      route: '#/utils/form-layout',      soon: true },
      { icon: 'more-vertical',  label: 'Overflow',         route: '#/utils/overflow'         },
      { icon: 'app-window',     label: 'Code Preview',     route: '#/utils/code-preview',     soon: true },
    ],
  },
  {
    label: 'Blocks',
    items: [
      { icon: 'layout-dashboard',label: 'Dashboard',         route: '#/blocks/dashboard',         soon: true },
      { icon: 'lock',            label: 'Authentication',    route: '#/blocks/authentication',    soon: true },
      { icon: 'settings',        label: 'Settings',          route: '#/blocks/settings',          soon: true },
      { icon: 'list',            label: 'Feeds & Lists',     route: '#/blocks/feeds',             soon: true },
      { icon: 'clipboard-check', label: 'Project Workspace', route: '#/blocks/project-workspace', soon: true },
      { icon: 'help-circle',     label: 'Support Desk',      route: '#/blocks/support-desk',      soon: true },
      { icon: 'mail',            label: 'Email App',         route: '#/blocks/email',             soon: true },
      { icon: 'bar-chart',       label: 'Charts',            route: '#/blocks/charts',            soon: true },
      { icon: 'trending-up',     label: 'Stocks App',        route: '#/blocks/stocks',            soon: true },
    ],
  },
];
