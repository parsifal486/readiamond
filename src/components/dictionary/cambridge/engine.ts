import { fetchDirtyDOM, getFullLink } from '../utils';

const HOST = 'https://dictionary.cambridge.org';
const SUB_URL = 'search/direct/?datasetsearch=english&q=';
interface Audio {
  uk: {
    phsym: string;
    url: string;
  };
  us: {
    phsym: string;
    url: string;
  };
}

interface Definition {
  explanation: string;
  audio: Audio;
  examples: string[];
}

// Array of definitions
type CambridgeResult = {
  text: string;
  basicMeaning: Map<string, string[]>;
  audio: Audio;
  definitions: Definition[];
  sentence: string;
};

const search = async (text: string) => {
  try {
    const url = `${HOST}/${SUB_URL}${encodeURIComponent(text.replace(/\s+/g, ' '))}`;
    const doc = await fetchDirtyDOM(url);
    const result = parseCambridgeDOM(doc);
    return result;
  } catch (error) {
    throw new Error('Failed to parse dictionary response');
  }
};

const parseCambridgeDOM = (doc: DocumentFragment) => {
  const result: CambridgeResult = {
    text: '',
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
    definitions: [],
    sentence: '',
  };

  // remove unwanted elements
  doc
    .querySelectorAll('.smartt, .grammar, .bb, .dimg, .xref')
    .forEach(el => el.remove());

  //extract data
  const definitions = extractDefinitions(doc);
  result.definitions = definitions;

  console.log(doc);
  return result;
};

function extractDefinitions($element: DocumentFragment | Element) {
  const definitions: Definition[] = [];

  // Extract all definition blocks (both regular and phrase-based)
  const defBlocks = $element.querySelectorAll('.def-block');

  defBlocks.forEach(($defBlock: Element) => {
    const explanation =
      $defBlock.querySelector('.def.ddef_d.db')?.textContent.trim() || '';
    const examples = [];

    // Extract examples from def-body
    const exampleElements = $defBlock.querySelectorAll('.examp.dexamp .eg.deg');
    exampleElements.forEach(($example: Element) => {
      examples.push($example.textContent?.trim() || '');
    });

    // Check if this definition is a phrase-based definition
    const isPhrase = $defBlock.querySelector('.phrase-block');
    if (isPhrase) {
      // Handling phrase definition with additional structure
      const phraseTitle =
        $defBlock
          .querySelector('.phrase-title.dphrase-title')
          ?.textContent.trim() || '';
      examples.unshift(phraseTitle); // Add phrase title as the first example
    }

    // Extracting audio properties for UK and US
    const audio: Audio = {
      uk: { phsym: '', url: '' },
      us: { phsym: '', url: '' },
    };

    // Loop through each pronunciation block for audio extraction
    $defBlock.querySelectorAll('.dpron-i').forEach(($dpron: Element) => {
      // Get the phonetic symbol (phsym)
      const $phsym = $dpron.querySelector('.dipa');
      const phsym = $phsym?.textContent?.trim() || '';

      // Get the audio URL for the term
      const $daud = $dpron.querySelector('.daud');
      if ($daud) {
        const $source = $daud.querySelector('source[type="audio/mpeg"]');
        if ($source) {
          const url = getFullLink(HOST, $source, 'src');

          // Determine if it's a UK or US pronunciation and store the details
          const $type = $dpron.querySelector('.region');
          const type = $type?.textContent?.trim() || '';
          if (type.includes('UK')) {
            audio.uk = { phsym, url };
          } else if (type.includes('US')) {
            audio.us = { phsym, url };
          }
        }
      }
    });

    // Add the extracted explanation, examples, and audio to the definitions array
    definitions.push({
      explanation: explanation,
      audio: audio,
      examples: examples,
    });
  });

  return definitions;
}

export { search };
export type { CambridgeResult };
