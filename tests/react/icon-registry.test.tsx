import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Icon,
  IconRegistryProvider,
  useIcons,
  type IconDefinition,
} from '../../src/index.js';

const CUSTOM_ICONS: readonly IconDefinition[] = [
  ['custom-test', '<svg viewBox="0 0 16 16"><path d="M2 8h12" /></svg>'],
];

function RegisteredIcon({ label }: { label: string }) {
  useIcons(CUSTOM_ICONS);
  return <Icon name="custom-test" ariaLabel={label} />;
}

describe('IconRegistryProvider', () => {
  it('reactively registers the same icon collection in separate providers', async () => {
    render(
      <>
        <IconRegistryProvider><RegisteredIcon label="First custom icon" /></IconRegistryProvider>
        <IconRegistryProvider><RegisteredIcon label="Second custom icon" /></IconRegistryProvider>
      </>,
    );

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'First custom icon' }).querySelector('svg')).not.toBeNull();
      expect(screen.getByRole('img', { name: 'Second custom icon' }).querySelector('svg')).not.toBeNull();
    });
  });

  it('updates the registry when the provider icons prop changes', () => {
    const { rerender } = render(
      <IconRegistryProvider icons={{ alpha: '<svg data-icon="alpha" />' }}>
        <Icon name="alpha" ariaLabel="Dynamic icon" />
      </IconRegistryProvider>,
    );
    expect(screen.getByRole('img', { name: 'Dynamic icon' }).querySelector('[data-icon="alpha"]')).not.toBeNull();

    rerender(
      <IconRegistryProvider icons={{ alpha: '<svg data-icon="updated" />' }}>
        <Icon name="alpha" ariaLabel="Dynamic icon" />
      </IconRegistryProvider>,
    );
    expect(screen.getByRole('img', { name: 'Dynamic icon' }).querySelector('[data-icon="updated"]')).not.toBeNull();
  });
});
