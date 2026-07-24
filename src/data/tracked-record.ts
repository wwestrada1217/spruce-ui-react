import { RecordState } from './record-state.js';

export interface TrackedRecord<T extends Record<string, unknown>> {
  data: T;
  state: RecordState;
  original: T | undefined;
  _modifiedFields: Map<keyof T, { oldValue: unknown; newValue: unknown }> | undefined;
}
