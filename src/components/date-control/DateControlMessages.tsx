export interface DateControlMessagesProps {
  errorMessage?: string;
  hint?: string;
  errorId: string;
  hintId: string;
}

export function DateControlMessages({ errorMessage, hint, errorId, hintId }: DateControlMessagesProps) {
  if (errorMessage) return <p className="sp-date-control__error" id={errorId} role="alert">{errorMessage}</p>;
  if (hint) return <p className="sp-date-control__hint" id={hintId}>{hint}</p>;
  return null;
}
