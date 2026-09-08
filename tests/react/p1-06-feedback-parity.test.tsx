import { afterEach, describe, expect, it, vi } from 'vitest';
import { Alert, CircularProgress, NotificationCenter, ProgressBar, SnackbarProvider, Spinner, ToastProvider, useSnackbar, useToast } from '../../src/index.js';
import { expectDocumentDirection, expectNoA11yViolations, pressKey, renderWithRtl, renderWithSpruce, waitFor } from '../utils/test-utils.js';

afterEach(() => vi.useRealTimers());

describe('P1.0-06 notification and feedback parity', () => {
  it('supports compact/motif alerts and localized dismiss callbacks', async () => {
    const onClose = vi.fn();
    const view = renderWithRtl(
      <Alert size="sm" variant="warning" dismissible backgroundMotif="overlapping-diamonds" onClose={onClose}>
        Review this warning.
      </Alert>,
    );

    expectDocumentDirection('rtl');
    expect(view.getByRole('alert')).toHaveClass('sp-alert--sm', 'sp-alert--has-motif');
    expect(view.container.querySelector('.sp-motif')).toHaveAttribute('aria-hidden', 'true');
    await view.user.click(view.getByRole('button', { name: 'إخفاء' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(view.queryByRole('alert')).not.toBeInTheDocument();
    await expectNoA11yViolations(view.container);
  });

  it('renders continuous and segmented progress with correct ARIA states', async () => {
    const segmented = renderWithSpruce(<ProgressBar value={60} segments={5} segmentShape="pill" label="Upload" showValue />);
    const progress = segmented.getByRole('progressbar', { name: 'Upload' });
    expect(progress).toHaveAttribute('aria-valuenow', '60');
    expect(segmented.container.querySelectorAll('.sp-progress__segment--filled')).toHaveLength(3);
    expect(segmented.getByText('60%')).toBeInTheDocument();

    const indeterminate = renderWithSpruce(<ProgressBar indeterminate segments={4} label="Loading" />);
    const indeterminateBar = indeterminate.getByRole('progressbar', { name: 'Loading' });
    expect(indeterminateBar).not.toHaveAttribute('aria-valuenow');
    expect(indeterminate.container.querySelectorAll('.sp-progress__segment--indeterminate')).toHaveLength(4);
  });

  it('supports all spinner families and circular progress geometry', async () => {
    const spinner = renderWithSpruce(<Spinner variant="grid-cube" size="xs" colorVariant="success" label="Syncing" />);
    expect(spinner.getByRole('status', { name: 'Syncing' })).toHaveClass('sp-spinner--xs', 'sp-spinner--color-success');
    expect(spinner.container.querySelectorAll('.sp-spinner__grid-cube span')).toHaveLength(9);

    const circular = renderWithSpruce(<CircularProgress value={65} showValue size="lg" variant="info" />);
    expect(circular.getByRole('progressbar', { name: 'Circular progress' })).toHaveAttribute('aria-valuenow', '65');
    expect(circular.getByText('65%')).toBeInTheDocument();

    circular.rerender(<CircularProgress indeterminate ariaLabel="Working" />);
    const indeterminate = circular.getByRole('progressbar', { name: 'Working' });
    expect(indeterminate).not.toHaveAttribute('aria-valuenow');
    expect(indeterminate.querySelector('.sp-circular-progress__fill')).toHaveAttribute('stroke-dashoffset', '0');
  });

  it('provides a collapsible toast stack and runtime context controls', async () => {
    function Probe() {
      const toast = useToast();
      return (
        <>
          <button type="button" onClick={() => { toast.setStackMode('collapsible'); toast.info('First', { duration: 0 }); toast.success('Second', { duration: 0 }); }}>Show</button>
          <button type="button" onClick={() => toast.setPosition('bottom-left')}>Move</button>
        </>
      );
    }

    const view = renderWithSpruce(<ToastProvider><Probe /></ToastProvider>);
    await view.user.click(view.getByRole('button', { name: 'Show' }));
    await waitFor(() => expect(view.getAllByRole('alert')).toHaveLength(2));
    expect(document.querySelector('.sp-toast-container')).toHaveClass('sp-toast-container--collapsible');
    await view.user.click(view.getByRole('button', { name: 'Move' }));
    expect(document.querySelector('.sp-toast-container')).toHaveClass('sp-toast-container--bottom-left');
    await view.user.click(view.getAllByRole('button', { name: 'Dismiss notification' })[0]);
  });

  it('can dismiss feedback immediately after it is queued', async () => {
    function Probe() {
      const toast = useToast();
      const snackbar = useSnackbar();
      return (
        <button type="button" onClick={() => {
          const toastId = toast.info('Transient toast', { duration: 0 });
          toast.dismiss(toastId);
          snackbar.open('Transient snackbar', { duration: 0 });
          snackbar.dismiss();
        }}>
          Queue and dismiss
        </button>
      );
    }

    const view = renderWithSpruce(<ToastProvider><SnackbarProvider><Probe /></SnackbarProvider></ToastProvider>);
    await view.user.click(view.getByRole('button', { name: 'Queue and dismiss' }));
    await waitFor(() => {
      expect(view.queryByText('Transient toast')).not.toBeInTheDocument();
      expect(view.queryByText('Transient snackbar')).not.toBeInTheDocument();
    });
  });

  it('replaces and dismisses snackbars through controlled actions', async () => {
    function Probe() {
      const snackbar = useSnackbar();
      return <button type="button" onClick={() => snackbar.open('Saved', { duration: 0, action: { label: 'Undo', onClick: () => undefined } })}>Show snackbar</button>;
    }
    const view = renderWithSpruce(<SnackbarProvider><Probe /></SnackbarProvider>);
    await view.user.click(view.getByRole('button', { name: 'Show snackbar' }));
    expect(view.getByRole('status')).toHaveTextContent('Saved');
    await view.user.click(view.getByRole('button', { name: 'Undo' }));
    await waitFor(() => expect(view.queryByRole('status')).not.toBeInTheDocument());
  });

  it('maps NotificationCenter lifecycle events, live-region politeness, and Escape', async () => {
    const onDismiss = vi.fn();
    const onClearAll = vi.fn();
    const onAction = vi.fn();
    const onToolbarAction = vi.fn();
    const onCollapsedChange = vi.fn();
    const view = renderWithRtl(
      <NotificationCenter
        position="inline"
        notifications={[{
          id: 'danger', severity: 'danger', title: 'Failed', message: 'Deployment rolled back.',
          actions: [{ id: 'details', label: 'Details' }],
          toolbar: [{ id: 'pin', icon: 'star', label: 'Pin' }],
          progress: 40,
        }]}
        onDismiss={onDismiss}
        onClearAll={onClearAll}
        onAction={onAction}
        onToolbarAction={onToolbarAction}
        onCollapsedChange={onCollapsedChange}
        closeOnEscape
      />,
    );

    const region = view.getByRole('region', { name: 'الإشعارات' });
    expect(region.querySelector('[aria-live="assertive"]')).toBeInTheDocument();
    expect(view.getByRole('progressbar', { name: 'التقدم' })).toHaveAttribute('aria-valuenow', '40');
    await view.user.click(view.getByRole('button', { name: 'Pin' }));
    await view.user.click(view.getByRole('button', { name: 'Details' }));
    await view.user.click(view.getByRole('button', { name: 'إخفاء الإشعار' }));
    expect(onToolbarAction).toHaveBeenCalledWith({ buttonId: 'pin', notificationId: 'danger' });
    expect(onAction).toHaveBeenCalledWith({ notificationId: 'danger', actionId: 'details' });
    expect(onDismiss).toHaveBeenCalledWith('danger');

    await pressKey(view.user, 'Escape');
    expect(onClearAll).toHaveBeenCalledTimes(1);
    await expectNoA11yViolations(view.container);
    expect(onCollapsedChange).not.toHaveBeenCalled();
  });
});
