export interface DictSearchResult<Result> {
  result: Result;
  audio?: {
    uk?: string;
    us?: string;
    py?: string;
  };
  /** generate menus on dict titlebars */
  catalog?: Array<
    | {
        // <button>
        key: string;
        value: string;
        label: string;
        options?: undefined;
      }
    | {
        // <select>
        key: string;
        value: string;
        options: Array<{
          value: string;
          label: string;
        }>;
        title?: string;
      }
  >;
}

export type HTMLString = string;

export interface GetHTMLConfig {
  /** innerHTML or outerHTML */
  mode?: 'innerHTML' | 'outerHTML';
  /** Select child node */
  selector?: string;
  /** transform text */
  transform?: null | ((text: string) => string);
  /** Give url and src a host */
  host?: string;
  /** DOM Purify config */
  //config?: DOMPurify.Config
}
