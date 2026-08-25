import { useState } from 'react';
import { Combobox, GridCombobox, Select, type GridComboboxColumn } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

interface Car { id: string; make: string; model: string; year: number; value: string; label: string }

const cars: Car[] = [
  { id: '1', value: '1', label: 'Civic', make: 'Honda', model: 'Civic', year: 2024 },
  { id: '2', value: '2', label: 'Model 3', make: 'Tesla', model: 'Model 3', year: 2023 },
  { id: '3', value: '3', label: 'Corolla', make: 'Toyota', model: 'Corolla', year: 2022 },
  { id: '4', value: '4', label: 'Golf', make: 'Volkswagen', model: 'Golf', year: 2021 },
];

const columns: GridComboboxColumn[] = [
  { key: 'make', label: 'Make', width: '1fr' },
  { key: 'model', label: 'Model', width: '1fr' },
  { key: 'year', label: 'Year', width: '80px' },
];

const SOURCE_CODE = `<Combobox
  source={cars}
  displayField="model"
  valueField="id"
  searchFields={['make', 'model']}
  onChange={setCarId}
  onSelectedItem={setCar}
/>`;

export function LookupsPage() {
  const [carId, setCarId] = useState('');
  const [car, setCar] = useState<Car | null>(null);
  const [selectId, setSelectId] = useState<string | string[]>('');
  const [gridId, setGridId] = useState('');

  return (
    <div className="features-layout">
      <div className="features-main">
        <h1>Lookups</h1>
        <p className="docs-desc">Use local arrays, URLs, or <code>IReadableDataSource</code> adapters with controlled React callbacks. The lookup controls own filtering, paging, virtual scrolling, portaled placement, and listbox keyboard behavior.</p>

        <section id="combobox" className="demo-section"><h2>Combobox lookup</h2><p className="section-desc">Selected-object callbacks preserve the raw record while the controlled value stays scalar.</p><CodePreview code={SOURCE_CODE}><div style={{ maxWidth: 360 }}><Combobox source={cars} displayField="model" valueField="id" searchFields={['make', 'model']} value={carId} onChange={(next) => setCarId(String(next))} onSelectedItem={(item) => setCar(item as Car)} placeholder="Search cars..." /></div></CodePreview>{car && <p className="section-desc">Selected: {car.year} {car.make} {car.model}</p>}</section>
        <section id="select" className="demo-section"><h2>Select lookup</h2><CodePreview code={'<Select options={cars} value={value} onChange={setValue} searchable />'}><div style={{ maxWidth: 360 }}><Select options={cars} value={selectId} onChange={setSelectId} searchable placeholder="Pick a car..." /></div></CodePreview></section>
        <section id="grid" className="demo-section"><h2>Grid combobox lookup</h2><CodePreview code={'<GridCombobox columns={columns} options={cars} value={value} onChange={setValue} />'}><div style={{ maxWidth: 520 }}><GridCombobox columns={columns} options={cars} value={gridId} onChange={setGridId} filterBy={['make', 'model', 'year']} placeholder="Search cars..." /></div></CodePreview></section>
        <section id="virtual" className="demo-section"><h2>Virtual and paged sources</h2><p className="section-desc">For large local lists or remote sources, pass <code>virtualScroll</code>, <code>virtualPaging</code>, <code>pageSize</code>, and the matching <code>LookupSource</code> callbacks.</p><CodePreview code={'<Combobox source={source} virtualScroll virtualPaging pageSize={50} />'}><Combobox options={Array.from({ length: 100 }, (_, index) => ({ label: `Item ${index + 1}`, value: String(index + 1) }))} virtualScroll placeholder="Search 100 items..." /></CodePreview></section>
      </div>
      <nav className="features-toc" aria-label="Table of contents"><p className="features-toc__title">On this page</p><ul className="toc-list"><li><a className="toc-link" href="#combobox">Combobox</a></li><li><a className="toc-link" href="#select">Select</a></li><li><a className="toc-link" href="#grid">Grid Combobox</a></li><li><a className="toc-link" href="#virtual">Virtual and paged</a></li></ul></nav>
    </div>
  );
}

