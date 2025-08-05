import { getInnerHTML, fetchDirtyDOM, getText, removeChild, handleNoResult } from '../utils';
import { DictSearchResult, HTMLString } from '@sharedTypes/dictionary';

type YoudaoSearchResult = DictSearchResult<YoudaoResult>;

export interface YoudaoResultLex {
  type: 'lex'; // 结果类型：词汇
  title: string; // 单词标题
  stars: number; // 星级评分
  rank: string; // 词频排名
  pattern: string; // 词性模式
  prons: Array<{
    // 发音信息数组
    phsym: string; // 音标
    url: string; // 发音音频URL
  }>;
  basic?: HTMLString; // 基本释义（HTML格式）
  collins: Array<{
    // 柯林斯词典释义数组
    title: string; // 释义标题
    content: HTMLString; // 释义内容
  }>;
  discrimination?: HTMLString; // 词义辨析
  sentence?: HTMLString; // 例句
  translation?: HTMLString; // 翻译
  wordGroup?: HTMLString; // 词组
  relWord?: HTMLString; // 相关词
}

// 有道词典相关词结果接口定义
export interface YoudaoResultRelated {
  type: 'related'; // 结果类型：相关词
  list: HTMLString; // 相关词列表
}

// 有道词典结果联合类型
export type YoudaoResult = YoudaoResultLex | YoudaoResultRelated;

const HOST = 'https://dict.youdao.com';

//entry point
export const search = async (text: string) => {
  const options = {
    basic: true, //basic info
    collins: true, //Collins
    discrimination: true, //discriminate
    sentence: true, //sentence
    translation: true, // 翻译
    wordGroup: true, // 词组
    relWord: true, // 相关词
  };

  const url = getSrcPage(text);
  const doc = await fetchDirtyDOM(url).then(doc => checkResult(doc, options));

  
  return doc;
};

export const getSrcPage = (text: string) =>
  'https://dict.youdao.com/w/' + encodeURIComponent(text.replace(/\s+/g, ' '));

function checkResult(
  doc: DocumentFragment,
  options: any,
  transform?: null | ((text: string) => string)
): YoudaoSearchResult | Promise<YoudaoSearchResult> {
  // 检查是否有拼写错误提示
  const $typo = doc.querySelector('.error-typo');
  if (!$typo) {
    // 没有拼写错误，正常处理DOM
    return handleDOM(doc, options, transform);
  } else if (options.related) {
    // 有拼写错误且需要相关词，返回相关词列表
    return {
      result: {
        type: 'related',
        list: getInnerHTML(HOST, $typo, { transform }),
      },
    };
  }
  // 有拼写错误但不需要相关词，返回无结果
  return handleNoResult();
}

function handleDOM(
  doc: DocumentFragment,
  options: any,
  transform: null | ((text: string) => string)
): YoudaoSearchResult | Promise<YoudaoSearchResult> {
  // 初始化结果对象
  const result: YoudaoResult = {
    type: 'lex',
    title: getText(doc, '.keyword'), // 获取单词标题
    stars: 0, // 星级评分，默认为0
    rank: getText(doc, '.rank'), // 获取词频排名
    pattern: getText(doc, '.pattern'), // 获取词性模式
    prons: [], // 发音信息数组
    collins: [], // 柯林斯词典释义数组
  };

  // 音频URL对象，用于存储英式和美式发音
  const audio: { uk?: string; us?: string } = {};

  // 提取星级评分
  const $star = doc.querySelector('.star');
  if ($star) {
    // 从className中提取星级数字
    result.stars = Number(($star.className.match(/\d+/) || [0])[0]);
  }

  // 提取发音信息
  doc.querySelectorAll('.baav .pronounce').forEach($pron => {
    const phsym = $pron.textContent || ''; // 获取音标文本
    const $voice = $pron.querySelector<HTMLAnchorElement>('.dictvoice');
    if ($voice && $voice.dataset.rel) {
      // 构建发音音频URL
      const url =
        'https://dict.youdao.com/dictvoice?audio=' + $voice.dataset.rel;

      // 添加到发音数组
      result.prons.push({ phsym, url });

      // 根据音标内容判断是英式还是美式发音
      if (phsym.includes('英')) {
        audio.uk = url;
      } else if (phsym.includes('美')) {
        audio.us = url;
      }
    }
  });

  // 提取基本释义（如果选项启用）
  if (options.basic) {
    result.basic = getInnerHTML(HOST, doc, {
      selector: '#phrsListTab .trans-container', // 基本释义的CSS选择器
      transform,
    });
  }

  // 提取柯林斯词典释义（如果选项启用）
  if (options.collins) {
    doc.querySelectorAll('#collinsResult .wt-container').forEach($container => {
      const item = { title: '', content: '' };

      // 提取释义标题
      const $title = $container.querySelector(':scope > .title.trans-tip');
      if ($title) {
        removeChild($title, '.do-detail'); // 移除不需要的详情链接
        item.title = getText($title);
        $title.remove(); // 移除标题元素，避免重复
      }

      // 处理星级评分显示
      const $star = $container.querySelector('.star');
      if ($star) {
        const starMatch = /star(\d+)/.exec(String($star.className));
        if (starMatch) {
          const rate = +starMatch[1]; // 获取星级数字
          let stars = '';
          // 生成SVG星星图标
          for (let i = 0; i < 5; i++) {
            stars += `<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 426.67 426.67"
              width="1em"
              height="1em"
              style="${i === 4 ? '' : 'margin-right: 1px'}"
            >
              <path
                fill=${i < rate ? '#FAC917' : '#d1d8de'} // 根据星级设置颜色
                d="M213.33 10.44l65.92 133.58 147.42 21.42L320 269.4l25.17 146.83-131.84-69.32-131.85 69.34 25.2-146.82L0 165.45l147.4-21.42"
              />
            </svg>`;
          }
          $star.innerHTML = stars; // 替换为SVG星星
        }
      }

      // 提取释义内容
      item.content = getInnerHTML(HOST, $container, { transform });
      if (item.content) {
        result.collins.push(item); // 添加到柯林斯词典数组
      }
    });
  }

  // 移除词义辨析中的链接
  doc.querySelectorAll('#discriminate .wt-container .title a').forEach(el => {
    el.remove();
  });

  // 提取词义辨析（如果选项启用）
  if (options.discrimination) {
    result.discrimination = getInnerHTML(HOST, doc, {
      selector: '#discriminate',
      transform,
    });
  }

  // 提取例句（如果选项启用）
  if (options.sentence) {
    result.sentence = getInnerHTML(HOST, doc, {
      selector: '#authority .ol',
      transform,
    });
  }

  // 提取翻译（如果选项启用）
  if (options.translation) {
    result.translation = getInnerHTML(HOST, doc, {
      selector: '#fanyiToggle .trans-container',
      transform,
    });
  }

  // 提取词组（如果选项启用）
  if (options.wordGroup) {
    result.wordGroup = getInnerHTML(HOST, doc, {
      selector: '#wordGroup',
      transform,
    });
  }

  // 提取相关词（如果选项启用）
  if (options.relWord) {
    result.relWord = getInnerHTML(HOST, doc, {
      selector: '#relWordTab',
      transform,
    });
  }

  // 检查是否有有效内容，如果有则返回结果，否则返回无结果
  if (result.title || result.translation) {
    return { result, audio }; // 返回结果和音频信息
  }
  return handleNoResult(); // 返回无结果
}
