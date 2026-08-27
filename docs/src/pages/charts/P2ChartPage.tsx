import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  CylinderChart, DiagramEditor, FishboneChart, GraphChart, MapChart, PerformanceGraph,
  PyramidChart, TinyBar, TinyDonut, TinyLine, TinyPie, TinyStacked, VennChart, WheelDiagram,
  type DiagramConnector, type DiagramShape,
} from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

export type P2ChartKind = 'cylinder' | 'diagram-editor' | 'fishbone' | 'graph' | 'map' | 'performance' | 'pyramid' | 'tiny' | 'venn' | 'wheel';
type ApiRow = [string, string, string, string];
interface PageSpec { title: string; description: string; code: string; api: ApiRow[]; interaction: string }
const code = (...lines: string[]) => lines.join('\n');

const specs: Record<P2ChartKind, PageSpec> = {
  cylinder: {
    title: 'Cylinder Chart',
    description: 'Perspective cylinders for discrete comparisons with the shared Spruce chart container, palette, tooltip, and responsive behavior.',
    code: code('import { CylinderChart } from "spruce-react";', '', 'const data = [', '  { label: "North", value: 86 },', '  { label: "South", value: 64 },', '  { label: "West", value: 42 },', '];', '', '<CylinderChart title="Regional throughput" data={data} config={{ targetLine: 70, targetLineLabel: "Goal" }} />'),
    api: [
      ['data', 'ChartDataItem[]', 'required', 'Cylinders with label, value, and optional color.'],
      ['config.orientation', "'vertical' | 'horizontal'", "'vertical'", 'Cylinder direction.'],
      ['config.perspectiveRatio', 'number', '0.3', 'Depth ratio for the top and end ellipses.'],
      ['config.barPadding', 'number', '0.3', 'Relative gap between cylinders.'],
      ['config.showValues / valueFormat', 'boolean / string', 'true / compact', 'Value label visibility and formatting.'],
      ['config.targetLine / targetLineLabel', 'number / string', 'undefined / Target', 'Optional target reference line.'],
    ],
    interaction: 'Cylinder marks expose native chart-point metadata for shared hover tooltips and click callbacks. Set config.animate to false for static presentation; shared chart motion also respects reduced-motion CSS.',
  },
  'diagram-editor': {
    title: 'Diagram Editor',
    description: 'Dependency-free SVG diagramming canvas with eight built-in shapes, routed connectors, keyboard editing, history, zoom, and layered auto-layout.',
    code: code('import { DiagramEditor } from "spruce-react";', '', 'const shapes = [', '  { id: "start", type: "rounded-rectangle", x: 80, y: 90, width: 160, height: 80, text: "Start" },', '  { id: "work", type: "rectangle", x: 360, y: 90, width: 160, height: 80, text: "Work" },', '];', 'const connectors = [{ id: "flow", sourceId: "start", targetId: "work", label: "next" }];', '', '<DiagramEditor shapes={shapes} connectors={connectors} onShapesChange={setShapes} onConnectorsChange={setConnectors} />'),
    api: [
      ['shapes / connectors', 'DiagramShape[] / DiagramConnector[]', '[]', 'Controlled or initial canvas collections.'],
      ['config', 'DiagramEditorConfig', '{}', 'Canvas, grid, defaults, zoom, and history settings.'],
      ['customShapes', 'ShapeDefinition[]', '[]', 'Additional toolbar shape definitions.'],
      ['onShapesChange / onConnectorsChange', '(items) => void', 'undefined', 'Called after edits to either collection.'],
      ['onSelectionChange', '(event) => void', 'undefined', 'Reports shape, connector, or none selection.'],
      ['ref.autoLayout', '(options?) => void', '—', 'Runs top-bottom or left-right layered layout.'],
    ],
    interaction: 'Select with V, connect with C, move or resize shapes, double-click or press Enter to edit text, delete with Delete/Backspace, and use Ctrl/Cmd+Z/Y for history. The toolbar provides zoom and layout controls.',
  },
  fishbone: {
    title: 'Fishbone Chart',
    description: 'Cause-and-effect fishbone diagram with alternating category branches, cause labels, category icons, and an effect box.',
    code: code('import { FishboneChart } from "spruce-react";', '', '<FishboneChart', '  effect="Delayed release"', '  categories={[', '    { label: "People", causes: [{ label: "Training gaps" }] },', '    { label: "Process", causes: [{ label: "Manual approval" }] },', '    { label: "Tools", causes: [{ label: "Slow builds" }] },', '  ]}', '  config={{ title: "Root-cause analysis", height: 520 }}', '/>'),
    api: [
      ['categories', 'FishboneCategory[]', '[]', 'Categories with optional iconPath and causes.'],
      ['effect', 'string', "''", 'Effect displayed at the head.'],
      ['config.title / subtitle', 'string', 'undefined', 'Diagram heading content.'],
      ['config.height', 'number', '560', 'SVG viewport height in pixels.'],
      ['config.branchAngle / junctionSpacing', 'number', '45 / auto', 'Branch angle and optional spine spacing.'],
      ['config.accentColor / effectBoxColor', 'string', 'palette', 'Theme-aware branch and effect colors.'],
    ],
    interaction: 'The effect and categories are exposed as one labeled SVG image. The layout is static and safe for reduced motion; use ariaLabel when domain-specific narration is needed.',
  },
  graph: {
    title: 'Graph Chart',
    description: 'Force, circular, or grid graph with directed edges, labels, collision handling, trace-on-hover, drag interaction, and shared zoom/pan.',
    code: code('import { GraphChart } from "spruce-react";', '', 'const nodes = [', '  { id: "api", label: "API", group: "runtime" },', '  { id: "db", label: "Database", group: "storage" },', '  { id: "queue", label: "Queue", group: "runtime" },', '];', 'const edges = [{ source: "api", target: "db", directed: true, label: "reads" }];', '', '<GraphChart nodes={nodes} edges={edges} config={{ layout: "force", draggable: true, traceOnHover: true, zoomEnabled: true }} />'),
    api: [
      ['nodes / edges', 'GraphNode[] / GraphEdge[]', '[]', 'Nodes and source/target relationships.'],
      ['config.layout', "'force' | 'circular' | 'grid'", "'force'", 'Layout algorithm.'],
      ['config.simulationIterations', 'number', '120', 'Force simulation cap.'],
      ['config.nodeRadius / edgeWidth', 'number', '8 / 1.5', 'Default mark sizes.'],
      ['config.draggable', 'boolean', 'false', 'Allow pointer dragging of nodes.'],
      ['config.traceOnHover / traceDepth', 'boolean / number', 'false / 1', 'Highlight related nodes and edges.'],
      ['config.zoomEnabled / panEnabled', 'boolean', 'false', 'Shared ChartContainer navigation.'],
      ['onNodeClick', '(nodeId) => void', 'undefined', 'Keyboard and pointer node activation callback.'],
    ],
    interaction: 'Nodes are keyboard-focusable buttons. Enter and Space activate onNodeClick, draggable nodes move by pointer, and trace-on-hover dims unrelated graph elements.',
  },
  map: {
    title: 'Map Chart',
    description: 'Responsive world map with built-in geometry, optional GeoJSON loading, choropleth regions, markers, connections, and pointer zoom/pan.',
    code: code('import { MapChart } from "spruce-react";', '', '<MapChart', '  title="Global operations"', '  data={{', '    regions: [{ id: "US", label: "United States", value: 82 }],', '    markers: [{ lat: 37.8, lng: -122.4, label: "San Francisco", value: 82 }],', '    connections: [{ from: [37.8, -122.4], to: [51.5, -0.1], label: "Primary route" }],', '  }}', '  config={{ showMarkerLabels: true, connectionStyle: "arc" }}', '/>'),
    api: [
      ['data.regions / markers / connections', 'MapRegion[] / MapMarker[] / MapConnection[]', '[]', 'Choropleth, coordinate marker, and route data.'],
      ['config.projection', "'mercator' | 'equirectangular'", "'mercator'", 'Projection for built-in and GeoJSON geometry.'],
      ['config.geoJsonUrl', 'string', 'undefined', 'Optional FeatureCollection source.'],
      ['config.lowColor / highColor', 'string', 'blue scale', 'Choropleth endpoints.'],
      ['config.connectionStyle', "'arc' | 'straight'", "'arc'", 'Connection route style.'],
      ['config.interactive / zoom', 'boolean / number', 'true / 1', 'Pointer navigation and initial scale.'],
      ['config.showScale / showMarkerLabels', 'boolean', 'true / false', 'Legend and marker label visibility.'],
    ],
    interaction: 'Interactive maps support wheel zoom, pointer pan, and an accessible reset button. Regions, markers, and connections use shared chart hover/click metadata; set interactive=false for static output.',
  },
  performance: {
    title: 'Performance Graph',
    description: 'Graph variant for dependency and performance topology, with draggable nodes enabled by default.',
    code: code('import { PerformanceGraph } from "spruce-react";', '', '<PerformanceGraph', '  title="Request dependency graph"', '  nodes={[{ id: "edge", label: "Edge" }, { id: "service", label: "Service" }, { id: "cache", label: "Cache" }]}', '  edges={[{ source: "edge", target: "service", directed: true }, { source: "service", target: "cache", directed: true }]}', '  config={{ traceOnHover: true, zoomEnabled: true }}', '/>'),
    api: [
      ['nodes / edges', 'GraphNode[] / GraphEdge[]', '[]', 'The GraphChart data model.'],
      ['config', 'PerformanceGraphConfig', '{}', 'GraphChartConfig plus performance defaults.'],
      ['config.draggable', 'boolean', 'true', 'Nodes can be repositioned by pointer.'],
      ['config.traceOnHover', 'boolean', 'false', 'Trace dependency depth from a hovered node.'],
      ['onNodeClick', '(nodeId) => void', 'undefined', 'Keyboard and pointer node activation callback.'],
    ],
    interaction: 'PerformanceGraph uses the same accessible node buttons as GraphChart and defaults to draggable nodes for quick topology inspection.',
  },
  pyramid: {
    title: 'Pyramid Chart',
    description: 'Layered funnel visualization with outside or inside labels, formatted values, and percentage annotations.',
    code: code('import { PyramidChart } from "spruce-react";', '', '<PyramidChart', '  title="Conversion funnel"', '  data={[', '    { label: "Visitors", value: 10000 },', '    { label: "Qualified", value: 4200 },', '    { label: "Trials", value: 1600 },', '    { label: "Customers", value: 480 },', '  ]}', '  config={{ labelPosition: "outside", showPercentage: true }}', '/>'),
    api: [
      ['data', 'PyramidDatum[]', 'required', 'Ordered layers with label, value, and optional color.'],
      ['config.labelPosition', "'outside' | 'inside'", "'outside'", 'Label placement.'],
      ['config.showValues', 'boolean', 'true', 'Show numeric values.'],
      ['config.valueFormat', "'compact' | 'full' | 'none'", "'compact'", 'Value formatting mode.'],
      ['config.showPercentage', 'boolean', 'true', 'Append each layer percentage of total.'],
    ],
    interaction: 'Each layer is a shared chart point with label, value, color, hover tooltip, and click callback. The SVG has a descriptive accessible name.',
  },
  tiny: {
    title: 'Tiny Charts',
    description: 'Glyph-sized Bar, Line, Pie, Donut, and Stacked charts for tables, cards, dense dashboards, and inline metrics.',
    code: code('import { TinyBar, TinyLine, TinyPie, TinyDonut, TinyStacked } from "spruce-react";', '', '<TinyBar data={[12, 20, 16, 28]} config={{ size: "sm", highlight: "last" }} />', '<TinyLine data={[12, 20, 16, 28]} config={{ size: "sm", area: true }} />', '<TinyPie data={[{ label: "Done", value: 72 }, { label: "Open", value: 28 }]} />', '<TinyDonut data={[72, 28]} config={{ centerText: "Done" }} />', '<TinyStacked data={[[{ value: 3 }, { value: 2 }], [{ value: 1 }, { value: 4 }]]} />'),
    api: [
      ['data', 'TinyValues | TinySeries[] | TinyStack[]', 'required', 'Numeric/labeled values, series, or stacked segments.'],
      ['config.size', "'xs' | 'sm' | 'md' | 'lg'", "'md'", 'Preset dimensions and stroke metrics.'],
      ['config.color / colors / palette', 'string / string[] / string', 'theme', 'Single color or shared series palette.'],
      ['config.showTooltip', 'boolean', 'true', 'Native SVG title tooltips.'],
      ['config.ariaLabel / decorative', 'string / boolean', 'generated / false', 'Accessible summary or presentation-only mode.'],
      ['config.animate / animationDuration', 'boolean / number', 'true / 400', 'Entry motion; CSS respects reduced motion.'],
      ['TinyBarChartConfig', 'orientation, scaleTo, thresholds, highlight, showTrack', '—', 'Bar-specific options.'],
      ['TinyLineChartConfig', 'curve, area, showEndDot, showMinMax, referenceLine', '—', 'Line-specific options.'],
      ['TinyPie/Donut/Stacked configs', 'sort, padAngle, thickness, normalize, showShare', '—', 'Composition-specific options.'],
    ],
    interaction: 'Tiny charts use native SVG titles, generated ARIA summaries, presentation mode for decorative output, and a reduced-motion CSS path. Use size presets instead of hard-coded dimensions.',
  },
  venn: {
    title: 'Venn Chart',
    description: 'Set overlap visualization for one, two, or multiple sets with configurable intersection labels and theme-aware fills.',
    code: code('import { VennChart } from "spruce-react";', '', '<VennChart', '  title="Audience overlap"', '  data={[{ key: "a", label: "Designers" }, { key: "b", label: "Developers" }]}', '  config={{ intersections: [{ sets: ["a", "b"], label: "Shared users", items: ["Prototypes"] }] }}', '/>'),
    api: [
      ['data', 'VennSet[]', 'required', 'Unique set keys, labels, optional sizes, and colors.'],
      ['config.intersections', 'VennIntersection[]', '[]', 'Set keys and overlap label/items.'],
      ['config.fillOpacity / overlapFactor', 'number', '0.65 / 0.4', 'Circle opacity and normalized overlap.'],
      ['config.showLabels / showIntersectionLabels', 'boolean', 'true', 'Set and overlap labels.'],
      ['config.monoColor', 'string', 'undefined', 'Use one color for every set.'],
    ],
    interaction: 'Set circles expose chart-point metadata for shared tooltips and click callbacks. Labels can be disabled when custom narration is provided.',
  },
  wheel: {
    title: 'Wheel Diagram',
    description: 'Radial wheel for a central concept with colored ring segments, icon markers, descriptions, and center subtitles.',
    code: code('import { WheelDiagram } from "spruce-react";', '', '<WheelDiagram', '  title="Product principles"', '  data={[', '    { label: "Clarity", description: "Make the next action obvious", iconText: "1" },', '    { label: "Trust", description: "Explain important decisions", iconText: "2" },', '    { label: "Momentum", description: "Keep work moving", iconText: "3" },', '  ]}', '  config={{ centerTitle: "Spruce", centerSubTitle: "Design system" }}', '/>'),
    api: [
      ['data', 'WheelItem[]', 'required', 'Labels, descriptions, iconPath/iconText, and colors.'],
      ['config.centerTitle / centerSubTitle', 'string', 'undefined', 'Text in the wheel center.'],
      ['config.showDescriptions', 'boolean', 'true', 'Show item descriptions.'],
      ['config.showRing', 'boolean', 'true', 'Show colored radial segments.'],
      ['config.ringColor', 'string', 'palette', 'Fallback ring color.'],
    ],
    interaction: 'Wheel items are shared chart points with hover/click metadata. Center and item labels are included in the accessible SVG; provide ariaLabel for domain-specific narration.',
  },
};

const examples: Record<P2ChartKind, ReactNode> = {
  cylinder: <CylinderChart title="Regional throughput" data={[{ label: 'North', value: 86 }, { label: 'South', value: 64 }, { label: 'West', value: 42 }]} config={{ targetLine: 70, targetLineLabel: 'Goal' }} />,
  'diagram-editor': <DiagramExample />,
  fishbone: <FishboneChart effect="Delayed release" categories={[{ label: 'People', causes: [{ label: 'Training gaps' }, { label: 'Unclear ownership' }] }, { label: 'Process', causes: [{ label: 'Manual approval' }] }, { label: 'Tools', causes: [{ label: 'Slow builds' }] }]} config={{ title: 'Root-cause analysis', height: 520 }} />,
  graph: <GraphChart nodes={[{ id: 'api', label: 'API', group: 'runtime' }, { id: 'db', label: 'Database', group: 'storage' }, { id: 'queue', label: 'Queue', group: 'runtime' }]} edges={[{ source: 'api', target: 'db', directed: true, label: 'reads' }, { source: 'api', target: 'queue', directed: true, dashed: true }]} config={{ layout: 'force', draggable: true, traceOnHover: true, zoomEnabled: true }} />,
  map: <MapChart title="Global operations" data={{ regions: [{ id: 'US', label: 'United States', value: 82 }], markers: [{ lat: 37.8, lng: -122.4, label: 'San Francisco', value: 82 }, { lat: 51.5, lng: -0.1, label: 'London', value: 68 }], connections: [{ from: [37.8, -122.4], to: [51.5, -0.1], label: 'Primary route' }] }} config={{ showMarkerLabels: true }} />,
  performance: <PerformanceGraph title="Request dependency graph" nodes={[{ id: 'edge', label: 'Edge' }, { id: 'service', label: 'Service' }, { id: 'cache', label: 'Cache' }]} edges={[{ source: 'edge', target: 'service', directed: true }, { source: 'service', target: 'cache', directed: true }]} config={{ traceOnHover: true, zoomEnabled: true }} />,
  pyramid: <PyramidChart title="Conversion funnel" data={[{ label: 'Visitors', value: 10000 }, { label: 'Qualified', value: 4200 }, { label: 'Trials', value: 1600 }, { label: 'Customers', value: 480 }]} />,
  tiny: <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', alignItems: 'center' }}><TinyBar data={[12, 20, 16, 28]} config={{ size: 'lg', highlight: 'last' }} /><TinyLine data={[12, 20, 16, 28]} config={{ size: 'lg', area: true }} /><TinyPie data={[{ label: 'Done', value: 72 }, { label: 'Open', value: 28 }]} config={{ size: 'lg' }} /><TinyDonut data={[72, 28]} config={{ size: 'lg', centerText: 'Done' }} /><TinyStacked data={[{ segments: [{ value: 3 }, { value: 2 }] }, { segments: [{ value: 1 }, { value: 4 }] }]} config={{ size: 'lg' }} /></div>,
  venn: <VennChart title="Audience overlap" data={[{ key: 'a', label: 'Designers' }, { key: 'b', label: 'Developers' }]} config={{ intersections: [{ sets: ['a', 'b'], label: 'Shared users', items: ['Prototypes'] }] }} />,
  wheel: <WheelDiagram title="Product principles" data={[{ label: 'Clarity', description: 'Make the next action obvious', iconText: '1' }, { label: 'Trust', description: 'Explain important decisions', iconText: '2' }, { label: 'Momentum', description: 'Keep work moving', iconText: '3' }]} config={{ centerTitle: 'Spruce', centerSubTitle: 'Design system' }} />,
};

function DiagramExample() {
  const initialShapes: DiagramShape[] = [{ id: 'start', type: 'rounded-rectangle', x: 80, y: 90, width: 160, height: 80, text: 'Start' }, { id: 'work', type: 'rectangle', x: 360, y: 90, width: 160, height: 80, text: 'Work' }];
  const initialConnectors: DiagramConnector[] = [{ id: 'flow', sourceId: 'start', targetId: 'work', label: 'next' }];
  const [shapes, setShapes] = useState(initialShapes);
  const [connectors, setConnectors] = useState(initialConnectors);
  return <DiagramEditor shapes={shapes} connectors={connectors} onShapesChange={setShapes} onConnectorsChange={setConnectors} config={{ height: 420 }} />;
}

export function P2ChartPage({ kind }: { kind: P2ChartKind }) {
  const spec = specs[kind];
  const [activeSection, setActiveSection] = useState('example');
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); }), { threshold: 0.25 });
    mainRef.current?.querySelectorAll('[id]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return <div className="features-layout">
    <div className="features-main" ref={mainRef}>
      <h1>{spec.title}</h1>
      <p className="docs-desc">{spec.description}</p>
      <section id="example" className="demo-section"><h2>Example</h2><CodePreview code={spec.code}>{examples[kind]}</CodePreview></section>
      <section id="behavior" className="demo-section"><h2>Behavior and accessibility</h2><p className="section-desc">{spec.interaction}</p></section>
      <section id="api" className="demo-section"><h2>API</h2><div className="api-table-wrap"><table className="api-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>{spec.api.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{index === 0 ? <code>{cell}</code> : cell}</td>)}</tr>)}</tbody></table></div></section>
    </div>
    <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list">{[['example', 'Example'], ['behavior', 'Behavior'], ['api', 'API']].map(([id, label]) => <li key={id}><a className={'toc-link' + (activeSection === id ? ' active' : '')} href={'#' + id}>{label}</a></li>)}</ul></nav>
  </div>;
}
