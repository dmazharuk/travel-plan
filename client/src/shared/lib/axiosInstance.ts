import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  sent?: boolean;
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
});

let accessToken = '';

export function setAccessToken(token: string): void {
  accessToken = token;
}

const DEFAULT_TIMEOUT = 10000;

axiosInstance.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig): ExtendedAxiosRequestConfig => {
    if (config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    const prevRequest: ExtendedAxiosRequestConfig | undefined = error.config;
    if (error.response?.status === 403 && prevRequest && !prevRequest.sent) {
      try {
        const {data:response} = await axiosInstance.get('/auth/refreshTokens');
       
        accessToken = response.data.accessToken;
        prevRequest.sent = true;

        if (prevRequest.headers) {
          prevRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(prevRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
