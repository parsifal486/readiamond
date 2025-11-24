import { fetchDirtyDOM, extractHtmls } from '../utils';

type YoudaoResult = {
  text: string;
  stars: number; // the stars of the word
  basicMeaning: Map<string, string[]>;
  audio: {
    uk: {
      phsym: string;
      url: string;
    };
    us: {
      phsym: string;
      url: string;
    };
  };
  collins: collinsItem[];
  sentence: string;
};

type collinsItem = {
  POS: string[];
  meaning: string;
  examples: string[];
};

const HOST = 'https://dict.youdao.com';

const search = async (text: string) => {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Search text cannot be empty');
    }

    const url = `${HOST}/w/${encodeURIComponent(text.replace(/\s+/g, ' '))}`;
    const doc = await fetchDirtyDOM(url);
    const result = parseYoudaoDOM(doc);

    // Check if result is valid
    if (!result.text) {
      throw new Error('No result found for this word');
    }

    return result;
  } catch (error) {
    // Transform technical errors into user-friendly messages
    if (error instanceof Error) {
      // Network errors
      if (
        error.message.includes('fetch') ||
        error.message.includes('network')
      ) {
        throw new Error(
          'Network error: Unable to connect to dictionary service'
        );
      }
      // Parsing errors
      if (error.message.includes('parse') || error.message.includes('DOM')) {
        throw new Error('Failed to parse dictionary response');
      }
      // Re-throw the original error if it's already user-friendly
      throw error;
    }
    // Unknown errors
    throw new Error('An unexpected error occurred');
  }
};

const parseYoudaoDOM = (doc: DocumentFragment) => {
  const result: YoudaoResult = {
    text: '',
    stars: 0,
    basicMeaning: new Map<string, string[]>(),
    audio: {
      uk: {
        phsym: '',
        url: '',
      },
      us: {
        phsym: '',
        url: '',
      },
    },
    collins: [],
    sentence: '',
  };

  // extract stars
  const $star = doc.querySelector('.star');
  if ($star) {
    result.stars = Number(($star.className.match(/\d+/) || [0])[0]);
  }

  // extract text
  const $text = doc.querySelector('.keyword');
  if ($text) {
    result.text = $text.textContent || '';
  }

  // extract audio
  doc.querySelectorAll('.baav .pronounce').forEach($pron => {
    const phsym = $pron.textContent || '';
    const $voice = $pron.querySelector<HTMLAnchorElement>('.dictvoice');
    if ($voice && $voice.dataset.rel) {
      const url = `https://dict.youdao.com/dictvoice?audio=${$voice.dataset.rel}`;

      if (phsym.includes('英')) {
        result.audio.uk = { phsym, url };
      } else if (phsym.includes('美')) {
        result.audio.us = { phsym, url };
      }
    }
  });

  // extract basic meanings
  const $basicContainer = doc.querySelector('#phrsListTab .trans-container');
  if ($basicContainer) {
    $basicContainer.querySelectorAll('ul li').forEach(li => {
      const text = li.textContent?.trim() || '';
      const match = text.match(/^([a-z]+\.)\s*(.+)$/i);
      if (match) {
        const [, partOfSpeech, definitionsText] = match;

        const definitions = definitionsText
          .split(/[;；,，、]/)
          .map(def => def.trim())
          .filter(def => def.length > 0);

        if (result.basicMeaning.has(partOfSpeech)) {
          result.basicMeaning.get(partOfSpeech)!.push(...definitions);
        } else {
          result.basicMeaning.set(partOfSpeech, definitions);
        }
      }
    });
  }

  // extract collins meanings
  const $collinsContainer = doc.querySelectorAll(
    '#collinsResult .wt-container .ol li'
  );
  if ($collinsContainer.length > 0) {
    $collinsContainer.forEach($container => {
      const item: collinsItem = {
        POS: [],
        meaning: '',
        examples: [],
      };

      // extract part1 of unit
      const $part1 = $container.querySelector('.collinsMajorTrans');

      if ($part1) {
        //extract part of speech in sentence
        $part1.querySelectorAll('.additional').forEach(el => {
          const text = el.textContent?.trim();
          if (text) {
            item.POS.push(text);
          }
        });

        //extract meaning
        const $meaning = $part1.querySelector('p');
        if ($meaning) {
          item.meaning = $meaning.innerHTML
            .replace(/<span.*?<\/span>/g, ' ')
            .trim();
        }
      }

      // extract part2 of unit
      const $part2 = $container.querySelector('.exampleLists');
      if ($part2) {
        $part2.querySelectorAll('p').forEach(el => {
          const text = el.innerHTML;
          if (text) {
            item.examples.push(text);
          }
        });
      }

      //add to result
      result.collins.push(item);
    });
  }

  result.sentence = extractHtmls(doc, '#authority .ol');

  return result;
};

async function youdaoTranslate(text: string): Promise<string | undefined> {
  const url = `https://dict.youdao.com/w/${encodeURIComponent(text.replace(/\s+/g, ' '))}`;
  const res = await fetchDirtyDOM(url);
  return (
    res.querySelector('#ydTrans .trans-container p:nth-child(2)')?.innerHTML ||
    ''
  );
}

export { search, youdaoTranslate };
export type { YoudaoResult };
