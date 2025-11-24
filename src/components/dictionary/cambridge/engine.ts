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
  examples: string[];
}

// Array of definitions
type CambridgeResult = {
  text: string;
  audio: Audio;
  definitions: Definition[];
};

const search = async (text: string) => {
  try {
    const url = `${HOST}/${SUB_URL}${encodeURIComponent(text.replace(/\s+/g, ' '))}`;
    const doc = await fetchDirtyDOM(url);
    const result = parseCambridgeDOM(doc);
    result.text = text;
    return result;
  } catch (error) {
    throw new Error('Failed to parse dictionary response');
  }
};

const parseCambridgeDOM = (doc: DocumentFragment) => {
  const result: CambridgeResult = {
    text: '',
    audio: {
      uk: { phsym: '', url: '' },
      us: { phsym: '', url: '' },
    },
    definitions: [],
  };

  // remove unwanted elements
  doc
    .querySelectorAll('.smartt, .grammar, .bb, .dimg, .xref')
    .forEach(el => el.remove());

  // Extract audio from pos-header (top-level pronunciation)
  const posHeader = doc.querySelector('.pos-header');
  if (posHeader) {
    const audio = extractAudio(posHeader);
    result.audio = audio;
  }

  // Extract definitions
  const entryBody = doc.querySelector('.entry-body__el');
  const definitions = extractDefinitions(entryBody || doc);
  result.definitions = definitions;

  return result;
};

// Extract audio information from pos-header element
function extractAudio(posHeader: Element): Audio {
  const audio: Audio = {
    uk: { phsym: '', url: '' },
    us: { phsym: '', url: '' },
  };

  // Find all pronunciation blocks (.uk.dpron-i and .us.dpron-i)
  const pronBlocks = posHeader.querySelectorAll('.uk.dpron-i, .us.dpron-i');

  pronBlocks.forEach(($dpron: Element) => {
    // Get the phonetic symbol from .ipa.dipa
    const $phsym = $dpron.querySelector('.ipa.dipa');
    const phsym = $phsym?.textContent?.trim() || '';

    // Get the audio URL from .daud > audio > source[type="audio/mpeg"]
    const $daud = $dpron.querySelector('.daud');
    if ($daud) {
      const $audio = $daud.querySelector('audio');
      if ($audio) {
        const $source = $audio.querySelector('source[type="audio/mpeg"]');
        if ($source) {
          const url = getFullLink(HOST, $source, 'src');

          // Determine if it's UK or US by checking the class or region text
          const $region = $dpron.querySelector('.region.dreg');
          const region = $region?.textContent?.trim().toLowerCase() || '';

          // Also check class name as fallback
          const isUK = $dpron.classList.contains('uk') || region.includes('uk');
          const isUS = $dpron.classList.contains('us') || region.includes('us');

          if (isUK && phsym && url) {
            audio.uk = { phsym, url };
          } else if (isUS && phsym && url) {
            audio.us = { phsym, url };
          }
        }
      }
    }
  });

  return audio;
}

// Extract definitions from entry body
function extractDefinitions($element: DocumentFragment | Element) {
  const definitions: Definition[] = [];

  // Extract all definition blocks
  const defBlocks = $element.querySelectorAll('.def-block.ddef_block');

  defBlocks.forEach(($defBlock: Element) => {
    // Extract explanation from .def.ddef_d.db
    const $explanation = $defBlock.querySelector('.def.ddef_d.db');
    const explanation = $explanation?.textContent?.trim() || '';

    // Skip if no explanation found
    if (!explanation) return;

    const examples: string[] = [];

    // Extract examples from .examp.dexamp .eg.deg
    const exampleElements = $defBlock.querySelectorAll('.examp.dexamp .eg.deg');
    exampleElements.forEach(($example: Element) => {
      const exampleText = $example.textContent?.trim();
      if (exampleText) {
        examples.push(exampleText);
      }
    });

    // Handle phrase-based definitions
    const $phraseBlock = $defBlock.closest('.phrase-block');
    if ($phraseBlock) {
      const $phraseTitle = $phraseBlock.querySelector(
        '.phrase-title.dphrase-title'
      );
      const phraseTitle = $phraseTitle?.textContent?.trim();
      if (phraseTitle) {
        examples.unshift(phraseTitle);
      }
    }

    definitions.push({
      explanation,
      examples,
    });
  });

  return definitions;
}

export { search };
export type { CambridgeResult };
