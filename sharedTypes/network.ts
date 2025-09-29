type NetResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: string;
  url: string;
};

type NetFetchOps = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
  retryCount?: number;
};

export type { NetResponse, NetFetchOps };
