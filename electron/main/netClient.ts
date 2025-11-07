import { ipcMain, net } from 'electron';
import { NetFetchOps } from '@sharedTypes/network';

class NetClient {
  private defaultHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Content-Type': 'application/json',
  };
  private defaultTimeout = 30000;
  private defaultRetryCount = 1;

  async netFetch<T>(url: string, options: NetFetchOps): Promise<T> {
    //if options's timeout, retrycount, headers is not set, use defaultTimeout, defaultRetryCount, defaultHeaders
    const {
      timeout = this.defaultTimeout,
      retryCount = this.defaultRetryCount,
      headers = this.defaultHeaders,
    } = options;
    options.timeout = timeout;
    options.retryCount = retryCount;
    options.headers = headers;

    try {
      const res = await net.fetch(url, options);
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        let errorDetails = '';
        try {
          const errorClone = res.clone();
          if (contentType.includes('application/json')) {
            const errorJson = await errorClone.json();
            errorDetails = JSON.stringify(errorJson, null, 2);
            console.log('Error JSON:', errorJson);
          } else if (contentType.includes('text/')) {
            errorDetails = await errorClone.text();
            console.log('Error Text:', errorDetails);
          } else {
            errorDetails = 'Binary or unknown content type';
          }
        } catch (readError) {
          console.log('Failed to read error response:', readError);
          errorDetails = 'Could not read error response';
        }

        const errorMessage = `HTTP ${res.status}: ${res.statusText}. Response: ${errorDetails}`;
        console.log('=== Final Error Message ===');
        console.log(errorMessage);

        throw new Error(errorMessage);
      }

      let parsedResult;
      switch (true) {
        case contentType.includes('application/json'):
          parsedResult = await res.json();
          break;
        case contentType.includes('text/'):
          parsedResult = await res.text();
          break;
        default:
          parsedResult = await res.arrayBuffer();
      }

      

      return {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: parsedResult,
      } as T;
    } catch (err: unknown) {
      console.log('net.fetch err in netclient=>', err);
      throw err;
    }
  }

  registerIPC() {
    ipcMain.handle(
      'net-fetch',
      async (_, url: string, options: NetFetchOps) => {
        return this.netFetch(url, options);
      }
    );
  }
}

const netClient = new NetClient();
export { netClient };
