import retextEnglish from 'retext-english';
import { Word } from 'sharedTypes/appGeneral';
import { unified, Processor } from 'unified';
import { Parent, Node, Word as NlcstWord, Root, Literal } from 'nlcst';
import { visit } from 'unist-util-visit';
import { toString } from 'nlcst-to-string';
import { wordDB } from '@/services/db/db';



const STATUS_MAP = ['ignore', 'learning'];

export class TxtPraser {
  //todo：phrase logic
  //phrase and its location in the text
  // phrases: Phrase[] = [];
  // phraseIndex: number = 0;

  //word and its location in the text
  words: Map<string, Word> = new Map<string, Word>();
  processor: Processor<Root>;
  currentSentence: string = '';
  private sentenceCache: Map<Node, string> = new Map();

  constructor() {
    this.processor = unified()
      .use(retextEnglish)
      .use(this.stringify2HTML()) as Processor<Root>;
  }

  // addPhrases() {
  //   let selfThis = this;
  //       return function (option = {}) {
  //           const proto = this.Parser.prototype;
  //           proto.useFirst("tokenizeParagraph", selfThis.phraseModifier);
  //       };
  // }

  async parse(data: string) {
    this.words.clear();

    const tree = await this.processor.parse(data.trim());

    //sentence cache build
    visit(tree, 'SentenceNode', (sentenceNode: Parent) => {
      const sentenceText = toString(sentenceNode.children).trim();
      visit(sentenceNode, 'WordNode', (wordNode: NlcstWord) => {
        this.sentenceCache.set(wordNode, sentenceText);
      });
    });

    //get all words
    const wordSet: Set<string> = new Set<string>();
    visit(tree, 'WordNode', (node: NlcstWord) => {
      wordSet.add(toString(node).toLowerCase());
    });

    const wordsStatus = await wordDB.getExpressionByWords(Array.from(wordSet));

    //get words' status
    wordsStatus.forEach(e => {
      this.words.set(e.word, e);
    });

    const newHTML = this.processor.stringify(tree) as string;
    return newHTML;
  }

  // stringify the tree to HTML string
  stringify2HTML() {
    //eslint-disable-next-line @typescript-eslint/no-this-alias
    const txtPraser = this;
    return function (this: { Compiler?: (tree: Root) => string }) {
      Object.assign(this, {
        Compiler: txtPraser.compileHTML.bind(txtPraser),
      });
    };
  }

  // compile the tree to HTML string
  compileHTML(tree: Root) {
    return this.toHTMLString(tree);
  }

  // recursively convert the node to HTML string
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
            : 'normal';

          if (/[0-9\u4e00-\u9fa5]/.test(text)) {
            return `<span class="other">${text}</span>`;
          } else {
            const clickableClass = 'cursor-pointer hover:underline';
            const sentence = this.sentenceCache.get(n) || '';
            const sentenceAttr = sentence
              ? `data-sentence="${this.escapeHtml(sentence)}"`
              : '';

            switch (status) {
              case 'ignore':
                return `<span class="word-card-ignored ${clickableClass}" data-word="${textLower}" ${sentenceAttr}>${text}</span>`;
              case 'learning':
                return `<span class="word-card-learning ${clickableClass}" data-word="${textLower}" ${sentenceAttr}>${text}</span>`;
              default:
                return `<span class="word-card-normal ${clickableClass}" data-word="${textLower}" ${sentenceAttr}>${text}</span>`;
            }
          }
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

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
