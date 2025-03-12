import { AxiosError } from 'axios';
import { IServerResponse } from '../types';

const defaultRejectedAxiosError = {
  data: null,
  message: 'Unknown internal server error',
  statusCode: 500,
  error: 'Network Error',
};

export function handleAxiosError(error: unknown): IServerResponse {
  if (error instanceof AxiosError) {
    if (error.code === 'ERR_CANCELED') {
      return {
        ...defaultRejectedAxiosError,
        error:
          'Время ожидания истекло. Повторите позднее или проверьте настройки интернета.',
      };
    }

    if (error.code === 'ERR_NETWORK') {
      return {
        ...defaultRejectedAxiosError,
        error: 'Ошибка подключения к серверу, повторите позднее',
      };
    }

    if (error.response) {
      const responseData = error.response.data;
      if (!responseData.error) {
        return {
          ...responseData,
          error: 'Unknown internal server error',
        };
      }
      return responseData;
    }
  }

  return defaultRejectedAxiosError;
}
