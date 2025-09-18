import { NetworkResponse, RequestOptions } from '@sharedTypes/network';

export async function request(
  url: string,
  options: RequestOptions
): Promise<NetworkResponse> {
  const response = await fetch(url, {
    method: options.method,
    headers: options.headers,
    body: options.body,
    signal: options.signal,
  });

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
    headers: responseHeaders,
    data,
    url: response.url,
  };
}
