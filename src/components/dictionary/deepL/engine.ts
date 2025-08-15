// DeepL Translation Engine - English to Chinese only
// Simplified version with English comments

import { RequestOptions } from '@sharedTypes/network';

// Request parameters interface
// type RequestParams = {
//   url: string;
//   method: 'POST';
//   body: string;
//   headers: Record<string, string>;
// };

// Response interface

// Use fetch API for HTTP requests
// async function requestUrl(params: RequestParams): Promise<RequestResponse> {
//   const { url, method, body, headers } = params;

//   try {
//     const response = await fetch(url, {
//       method,
//       headers,
//       body,
//       mode: 'cors',
//     });

//     const text = await response.text();
//     let json: Record<string, unknown>;

//     try {
//       json = JSON.parse(text);
//     } catch (e) {
//       json = {};
//     }

//     return {
//       json,
//       text,
//       status: response.status,
//     };
//   } catch (error) {
//     throw new Error(
//       `Network request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
//     );
//   }
// }

/**
 * DeepL translation function - English to Chinese only
 * @param text English text to translate
 * @returns Promise<string | undefined> Chinese translation result
 */
export async function deeplTranslate(
  text: string
): Promise<string | undefined> {
  const payload = {
    text,
    source_lang: 'EN',
    target_lang: 'ZH',
  };

  const data: RequestOptions = {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    retryCount: 2,
    timeout: 30000,
  };

  try {
    const res = await window.networkManager.request(
      'https://deeplx.vercel.app/translate',
      data
    );
    console.log('res of deeplTranslate ===>', res);
    // Check response status
    if (!res.json || res.json.code !== 200) {
      throw new Error('DeepL API service error');
    }
    console.log('deeplTranslate res.json ===>', res.json);
    return res.json.data as string;
  } catch (err) {
    console.error(
      'DeepL translation error:',
      err instanceof Error ? err.message : 'Unknown error'
    );
    // Return undefined instead of throwing error, let caller handle it
    return undefined;
  }
}

/**
 * Batch translation function
 * @param texts Array of English texts to translate
 * @returns Promise<(string | undefined)[]> Array of Chinese translation results
 */
export async function batchTranslate(
  texts: string[]
): Promise<(string | undefined)[]> {
  const promises = texts.map(text => deeplTranslate(text));
  return Promise.all(promises);
}
