export interface IServerResponse<T = null> {
  statusCode: number;
  message: string;
  data: T;
  error?: string;
}
