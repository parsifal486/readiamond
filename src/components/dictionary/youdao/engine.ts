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
  const url = `${HOST}/w/${encodeURIComponent(text.replace(/\s+/g, ' '))}`;
  const doc = await fetchDirtyDOM(url).then(res => parseDOM(res));
  // .then(doc =>
  //   checkResult(doc, options, null)
  // );
  console.log('rawDOM ===>', doc);
  return doc;
};

const parseDOM = (doc: DocumentFragment) => {
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
    console.log('collinsContainer ===>', $collinsContainer);
    $collinsContainer.forEach($container => {
      const item: collinsItem = {
        POS: [],
        meaning: '',
        examples: [],
      };

      // extract part1 of unit
      const $part1 = $container.querySelector('.collinsMajorTrans');
      console.log('unit ===>', $part1);

      if ($part1) {
        //extract part of speech in sentence
        $part1.querySelectorAll('.additional').forEach(el => {
          const text = el.textContent?.trim();
          console.log('text ===>', text);
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

export { search };
export type { YoudaoResult };