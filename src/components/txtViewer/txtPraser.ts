import retextEnglish from 'retext-english';
import { Word } from 'sharedTypes/appGeneral';
import { unified, Processor } from 'unified';
import { Parent, Node, Word as NlcstWord, Root, Literal } from 'nlcst';
import { visit } from 'unist-util-visit';
import { toString } from 'nlcst-to-string';

//temp mock data
const mockWords: Word[] = [
  {
    word: 'hello',
    status: 0,
  },
  {
    word: 'world',
    status: 0,
  },
  {
    word: 'in',
    status: 0,
  },
  {
    word: 'am',
    status: 0,
  },
];

const STATUS_MAP = ['ignore', 'learning', 'familiar', 'known', 'learned'];

export class TxtPraser {
  //todo：phrase logic
  //phrase and its location in the text
  // phrases: Phrase[] = [];
  // phraseIndex: number = 0;

  //word and its location in the text
  words: Map<string, Word> = new Map<string, Word>();
  processor: Processor<Root>;

  constructor() {
    this.processor = unified()
      .use(retextEnglish)
      .use(this.stringfy2HTML()) as Processor<Root>;
  }

  // addPhrases() {
  //   let selfThis = this;
  //       return function (option = {}) {
  //           const proto = this.Parser.prototype;
  //           proto.useFirst("tokenizeParagraph", selfThis.phraseModifier);
  //       };
  // }

  async parse(data: string) {
    const newHTML = await this.text2HTML(data.trim());
    return newHTML;
  }

  async text2HTML(data: string) {
    this.words.clear();

    const tree = await this.processor.parse(data);

    //get all words
    const wordSet: Set<string> = new Set<string>();
    visit(tree, 'WordNode', (node: NlcstWord) => {
      wordSet.add(toString(node).toLowerCase());
    });

    //get words' status
    mockWords.forEach(word => {
      this.words.set(word.word, word);
    });

    const newHTML = this.processor.stringify(tree) as string;
    return newHTML;
  }

  stringfy2HTML() {
    let selfThis = this;
    return function () {
      Object.assign(this, {
        Compiler: selfThis.compileHTML.bind(selfThis),
      });
    };
  }

  compileHTML(tree: Root) {
    return this.toHTMLString(tree);
  }

  toHTMLString(node: Node | Node[]): string {
    if (Object.prototype.hasOwnProperty.call(node, 'value')) {
      return (node as Literal).value; //leaf node
    }
    if (Object.prototype.hasOwnProperty.call(node, 'children')) {
      const n = node as Parent;
      switch (n.type) {
        case 'WordNode': {
          const text = toString(n.children); //get word text
          const textLower = text.toLowerCase(); //to lower case

          const status = this.words.has(textLower)
            ? STATUS_MAP[this.words.get(textLower)!.status]
            : 'new';

          return /[0-9\u4e00-\u9fa5]/.test(text) //not a word
            ? `<span class="other">${text}</span>`
            : `<span class="word-card ${status}">${text}</span>`;
        }
        // case 'PhraseNode': {
        //   const childText = toString(n.children); //get phrase text
        //   const text = this.toHTMLString(n.children); //recursively generate phrase content HTML
        //   //get phrase status
        //   const phrase = this.phrases.find(
        //     p => p.text === childText.toLowerCase()
        //   );
        //   const status = STATUS_MAP[phrase.status];

        //   return `<span class="phrase ${status}">${text}</span>`;
        // }
        case 'SentenceNode': {
          return `<span class="stns">${this.toHTMLString(n.children)}</span>`;
        }
        case 'ParagraphNode': {
          return `<p>${this.toHTMLString(n.children)}</p>`;
        }
        default: {
          return `<div class="article">${this.toHTMLString(n.children)}</div>`;
        }
      }
    }
    if (Array.isArray(node)) {
      const nodes = node as Node[];
      return nodes.map(n => this.toHTMLString(n)).join(''); //recursively process node array
    }
    return '';
  }
}
