type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string | Buffer;
  timeout?: number;
  retryCount?: number;
  signal?: AbortSignal;
};

type NetworkResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: string;
  url: string;
};

export type { RequestOptions, NetworkResponse };
