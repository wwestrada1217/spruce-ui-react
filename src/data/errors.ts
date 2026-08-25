export enum DataContextErrorCode {
  RecordNotFound = 'RECORD_NOT_FOUND',
  DataSourceNotConfigured = 'DATASOURCE_NOT_CONFIGURED',
  NoCurrentRecord = 'NO_CURRENT_RECORD',
  NoChangesToSave = 'NO_CHANGES_TO_SAVE',
  ValidationFailed = 'VALIDATION_FAILED',
  DetailNotConfigured = 'DETAIL_NOT_CONFIGURED',
  UrlNotConfigured = 'URL_NOT_CONFIGURED',
  IdRequired = 'ID_REQUIRED',
  SyncNotSupported = 'SYNC_NOT_SUPPORTED',
}

export class DataContextError extends Error {
  override readonly name = 'DataContextError';

  constructor(
    message: string,
    public readonly code: DataContextErrorCode,
    public readonly recordId?: string,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
