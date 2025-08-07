import { GetHTMLConfig } from '@sharedTypes/dictionary';

export async function fetchDirtyDOM(url: string): Promise<DocumentFragment> {
  const response = await window.networkManager.request(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  const html = response.data;
  const cleanHtml = html.replace(/<img[^>]*>/g, '');

  const template = document.createElement('template');
  template.innerHTML = cleanHtml;

  console.log('raw dom===>', template.content);
  return template.content;
}

export function getText(parent: ParentNode | null, selector?: string): string {
  if (!parent) {
    return '';
  }

  const child = selector
    ? parent.querySelector(selector)
    : (parent as HTMLElement);
  if (!child) {
    return '';
  }

  const textContent = child.textContent || '';
  //return transform ? transform(textContent) : textContent
  return textContent;
}

/**
 * Remove a child node from a parent node
 */
export function removeChild(parent: ParentNode, selector: string) {
  const child = parent.querySelector(selector);
  if (child) {
    child.remove();
  }
}

export function getHTML(
  parent: ParentNode,
  {
    mode = 'innerHTML',
    selector,
    transform,
    host,
    //config = defaultDOMPurifyConfig
  }: GetHTMLConfig = {}
): string {
  const node = selector
    ? parent.querySelector<HTMLElement>(selector)
    : (parent as HTMLElement);
  if (!node) {
    return '';
  }

  if (host) {
    const fillLink = (el: HTMLElement) => {
      if (el.getAttribute('href')) {
        el.setAttribute('href', getFullLink(host!, el, 'href'));
      }
      if (el.getAttribute('src')) {
        el.setAttribute('src', getFullLink(host!, el, 'src'));
      }
    };

    if (isTagName(node, 'a') || isTagName(node, 'img')) {
      fillLink(node);
    }
    node.querySelectorAll('a').forEach(fillLink);
    node.querySelectorAll('img').forEach(fillLink);
  }

  const container = document.createElement('div');
  container.appendChild(node);
  const content = container[mode] || '';

  return transform ? transform(content) : content;
}

export function getInnerHTML(
  host: string,
  parent: ParentNode,
  selectorOrConfig: string | Omit<GetHTMLConfig, 'mode' | 'host'> = {}
) {
  return getHTML(
    parent,
    typeof selectorOrConfig === 'string'
      ? { selector: selectorOrConfig, host, mode: 'innerHTML' }
      : { ...selectorOrConfig, host, mode: 'innerHTML' }
  );
}

export function isTagName(node: Node, tagName: string): boolean {
  return (
    ((node as HTMLElement).tagName || '').toLowerCase() ===
    tagName.toLowerCase()
  );
}

export function getFullLink(host: string, el: Element, attr: string): string {
  if (host.endsWith('/')) {
    host = host.slice(0, -1);
  }

  const protocol = host.startsWith('https') ? 'https:' : 'http:';

  const link = el.getAttribute(attr);
  if (!link) {
    return '';
  }

  if (/^[a-zA-Z0-9]+:/.test(link)) {
    return link;
  }

  if (link.startsWith('//')) {
    return protocol + link;
  }

  if (/^.?\/+/.test(link)) {
    return host + '/' + link.replace(/^.?\/+/, '');
  }

  return host + '/' + link;
}

export function handleNoResult<T = never>(): Promise<T> {
  return Promise.reject(new Error('NO_RESULT'));
}
