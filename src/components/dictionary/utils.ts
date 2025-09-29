async function fetchDirtyDOM(url: string): Promise<DocumentFragment> {
  // const response = await window.networkManager.request(url, {
  //   headers: {
  //     'User-Agent':
  //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  //   },
  // });

  const response = await window.netClient.netFetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
  console.log('response  ===>', response);
  console.log('response === response1', response === response);

  const html = response.data;
  const cleanHtml = html.replace(/<img[^>]*>/g, '');

  const template = document.createElement('template');
  template.innerHTML = cleanHtml;

  return template.content;
}

function getText(parent: ParentNode | null, selector?: string): string {
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
function removeChild(parent: ParentNode, selector: string) {
  const child = parent.querySelector(selector);
  if (child) {
    child.remove();
  }
}

function extractHtmls(parent: ParentNode, selector: string): string {
  const child = parent.querySelector(selector);
  if (child) {
    return child.innerHTML;
  }
  return '';
}

function isTagName(node: Node, tagName: string): boolean {
  return (
    ((node as HTMLElement).tagName || '').toLowerCase() ===
    tagName.toLowerCase()
  );
}

function getFullLink(host: string, el: Element, attr: string): string {
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

function handleNoResult<T = never>(): Promise<T> {
  return Promise.reject(new Error('NO_RESULT'));
}

export {
  fetchDirtyDOM,
  getText,
  removeChild,
  extractHtmls,
  isTagName,
  getFullLink,
  handleNoResult,
};
