export class DataServiceError extends Error {
  constructor(message: string, public code: string, public originalError?: any) {
    super(message);
    this.name = 'DataServiceError';
  }
}
