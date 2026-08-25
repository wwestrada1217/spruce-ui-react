import { RecordState } from './record-state.js';

export interface FieldChange {
  oldValue: unknown;
  newValue: unknown;
}

export interface TrackedRecord<T extends Record<string, unknown>> {
  data: T;
  state: RecordState;
  original: T | undefined;
  _modifiedFields: Map<keyof T, FieldChange> | undefined;
}
