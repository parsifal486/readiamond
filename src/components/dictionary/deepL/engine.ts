// DeepL Translation Engine - English to Chinese only
// Simplified version with English comments

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

//deepL translate function using ipc and networkManger
export async function deeplTranslate(
  text: string
): Promise<string | undefined> {
  const res = await window.netClient.netFetch(
    'https://deeplx.vercel.app/translate',
    {
      method: 'POST',
      body: JSON.stringify({
        text,
        source_lang: 'EN',
        target_lang: 'ZH',
      }),
    }
  );
  console.log('res of deeplTranslate1 ===>', res);
  return res.data as string;
}
