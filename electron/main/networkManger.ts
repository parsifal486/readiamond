import { ipcMain } from 'electron';
import { RequestOptions, NetworkResponse } from '@sharedTypes/network';

export class NetworkManger {
  private defaultHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  };
  private defaultTimeout = 10000;
  private defaultRetryCount = 3;

  async request(
    url: string,
    options: RequestOptions = {}
  ): Promise<NetworkResponse> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retryCount = this.defaultRetryCount,
    } = options;

    let lastError: Error | null = null;

    // retry
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: {
            ...this.defaultHeaders,
            ...headers,
          },
          body,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();

        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        return {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: responseHeaders,
          data,
        };
      } catch (error) {
        lastError = error as Error;
        if (attempt === retryCount - 1) {
          throw lastError;
        }
      }
    }
    throw lastError;
  }

  registerIPC() {
    ipcMain.handle(
      'network-request',
      async (_, url: string, options: RequestOptions) => {
        return this.request(url, options);
      }
    );
  }
}

const networkManger = new NetworkManger();
//register ipc
export { networkManger };
