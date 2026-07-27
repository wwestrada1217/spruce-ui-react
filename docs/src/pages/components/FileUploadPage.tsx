import { useState, useEffect, useRef } from 'react';
import { FileUpload, type UploadedFileItem } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';

const BASIC_CODE = `import { FileUpload } from 'spruce-react';

<FileUpload
  maxFileSize={10 * 1024 * 1024}
  onChange={(files) => console.log('Selected files:', files)}
/>`;

const MULTIPLE_CODE = `import { FileUpload } from 'spruce-react';

<FileUpload
  multiple
  maxFiles={5}
  onChange={(files) => console.log('Selected files:', files)}
/>`;

const ACCEPT_CODE = `import { FileUpload } from 'spruce-react';

<FileUpload
  accept="image/*,.pdf"
  dropSubtext="PNG, JPG, SVG or PDF (max 10 MB)"
  onChange={(files) => console.log('Selected files:', files)}
/>`;

const PREVIEWS_CODE = `import { FileUpload } from 'spruce-react';

<FileUpload
  multiple
  showPreviews
  onChange={(files) => console.log('Selected files:', files)}
/>`;

const MAX_SIZE_CODE = `import { FileUpload } from 'spruce-react';

<FileUpload
  maxFileSize={2 * 1024 * 1024}
  dropSubtext="Max 2 MB per file"
  onChange={(files) => console.log('Selected files:', files)}
/>`;

const DISABLED_CODE = `import { FileUpload } from 'spruce-react';

<FileUpload
  disabled
  dropSubtext="Upload disabled"
/>`;

const ERROR_CODE = `import { FileUpload } from 'spruce-react';

<FileUpload
  error="File size exceeds the 10 MB limit. Please select a smaller file."
/>`;

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'basic',     label: 'Basic Upload' },
  { id: 'multiple',  label: 'Multiple Files' },
  { id: 'accept',    label: 'Accept Filter' },
  { id: 'previews',  label: 'Image Previews' },
  { id: 'max-size',  label: 'Max File Size' },
  { id: 'disabled',  label: 'Disabled' },
  { id: 'error',     label: 'With Error' },
  { id: 'api',        label: 'API' },
];

export function FileUploadPage() {
  const [activeSection, setActiveSection] = useState('basic');
  const mainRef = useRef<HTMLDivElement>(null);

  // Demo state for previews
  const [demoFiles, setDemoFiles] = useState<(File | UploadedFileItem)[]>([
    {
      id: '1',
      name: 'dashboard-hero.png',
      size: 1420000,
      type: 'image/png',
      previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      name: 'financial-report.pdf',
      size: 3480000,
      type: 'application/pdf',
    },
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    );
    mainRef.current?.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="features-layout">
      <div className="features-main" ref={mainRef}>
        <h1>File Upload</h1>
        <p className="docs-desc">
          A drag-and-drop file upload zone with file list, image previews, size formatting, and validation error support.
        </p>

        {/* Basic Upload */}
        <section id="basic" className="demo-section" aria-labelledby="basic-heading">
          <h2 id="basic-heading">Basic Upload</h2>
          <p className="section-desc">A single-file upload zone with drag-and-drop support.</p>
          <CodePreview code={BASIC_CODE} language="typescript">
            <FileUpload maxFileSize={10 * 1024 * 1024} />
          </CodePreview>
        </section>

        {/* Multiple Files */}
        <section id="multiple" className="demo-section" aria-labelledby="multiple-heading">
          <h2 id="multiple-heading">Multiple Files</h2>
          <p className="section-desc">Enable <code>multiple</code> to allow selecting more than one file at a time.</p>
          <CodePreview code={MULTIPLE_CODE} language="typescript">
            <FileUpload multiple maxFiles={5} />
          </CodePreview>
        </section>

        {/* Accept Filter */}
        <section id="accept" className="demo-section" aria-labelledby="accept-heading">
          <h2 id="accept-heading">Accept Filter</h2>
          <p className="section-desc">Restrict upload selections to specific file extensions or MIME types using <code>accept</code>.</p>
          <CodePreview code={ACCEPT_CODE} language="typescript">
            <FileUpload accept="image/*,.pdf" dropSubtext="PNG, JPG, SVG or PDF (max 10 MB)" />
          </CodePreview>
        </section>

        {/* Image Previews */}
        <section id="previews" className="demo-section" aria-labelledby="previews-heading">
          <h2 id="previews-heading">Image Previews</h2>
          <p className="section-desc">Display thumbnail previews for image files and structured item cards for selected documents.</p>
          <CodePreview code={PREVIEWS_CODE} language="typescript">
            <FileUpload
              multiple
              showPreviews
              value={demoFiles}
              onChange={(files) => setDemoFiles(files || [])}
            />
          </CodePreview>
        </section>

        {/* Max File Size */}
        <section id="max-size" className="demo-section" aria-labelledby="max-size-heading">
          <h2 id="max-size-heading">Max File Size</h2>
          <p className="section-desc">Specify <code>maxFileSize</code> in bytes to validate incoming file sizes.</p>
          <CodePreview code={MAX_SIZE_CODE} language="typescript">
            <FileUpload maxFileSize={2 * 1024 * 1024} dropSubtext="Max 2 MB per file" />
          </CodePreview>
        </section>

        {/* Disabled */}
        <section id="disabled" className="demo-section" aria-labelledby="disabled-heading">
          <h2 id="disabled-heading">Disabled</h2>
          <p className="section-desc">Disable user interaction by setting <code>disabled</code>.</p>
          <CodePreview code={DISABLED_CODE} language="typescript">
            <FileUpload disabled dropSubtext="Upload disabled" />
          </CodePreview>
        </section>

        {/* With Error */}
        <section id="error" className="demo-section" aria-labelledby="error-heading">
          <h2 id="error-heading">With Error</h2>
          <p className="section-desc">Pass an <code>error</code> string to display a validation error state and alert message.</p>
          <CodePreview code={ERROR_CODE} language="typescript">
            <FileUpload error="File size exceeds the 10 MB limit. Please select a smaller file." />
          </CodePreview>
        </section>

        {/* API */}
        <section id="api" className="demo-section">
          <h2>API</h2>
          <div className="api-table-wrap">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>value</code></td>
                  <td><code>File[] | UploadedFileItem[] | null</code></td>
                  <td>—</td>
                  <td>Controlled file list value</td>
                </tr>
                <tr>
                  <td><code>onChange</code></td>
                  <td><code>(files: File[] | null) =&gt; void</code></td>
                  <td>—</td>
                  <td>Callback emitted when selected files change or are removed</td>
                </tr>
                <tr>
                  <td><code>multiple</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Allow selecting multiple files</td>
                </tr>
                <tr>
                  <td><code>accept</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Accepted file extensions/MIME types (e.g. <code>image/*,.pdf</code>)</td>
                </tr>
                <tr>
                  <td><code>maxFileSize</code></td>
                  <td><code>number</code></td>
                  <td>—</td>
                  <td>Maximum file size in bytes</td>
                </tr>
                <tr>
                  <td><code>maxFiles</code></td>
                  <td><code>number</code></td>
                  <td>—</td>
                  <td>Maximum file count when <code>multiple</code> is true</td>
                </tr>
                <tr>
                  <td><code>showPreviews</code></td>
                  <td><code>boolean</code></td>
                  <td><code>true</code></td>
                  <td>Display thumbnail previews for image files</td>
                </tr>
                <tr>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Disable file upload interaction</td>
                </tr>
                <tr>
                  <td><code>label</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Field label displayed above dropzone</td>
                </tr>
                <tr>
                  <td><code>hint</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Helper message shown below dropzone</td>
                </tr>
                <tr>
                  <td><code>error</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Validation error message string</td>
                </tr>
                <tr>
                  <td><code>dropText</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Primary text inside dropzone</td>
                </tr>
                <tr>
                  <td><code>dropSubtext</code></td>
                  <td><code>string</code></td>
                  <td>—</td>
                  <td>Subtext inside dropzone (e.g. size/file count hint)</td>
                </tr>
                <tr>
                  <td><code>size</code></td>
                  <td><code>'sm' | 'md' | 'lg'</code></td>
                  <td><code>'md'</code></td>
                  <td>Visual size variant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Table of Contents */}
      <nav className="features-toc" aria-label="Table of contents">
        <p className="features-toc__title">On this page</p>
        <ul className="toc-list">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                className={`toc-link${activeSection === section.id ? ' active' : ''}`}
                onClick={() => scrollTo(section.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && scrollTo(section.id)}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
