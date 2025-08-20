import Dexie, { Table } from 'dexie';
import { Card } from 'ts-fsrs';
import { createEmptyCard } from 'ts-fsrs';

type Expression = {
  id?: number; // auto increment id
  expression: string; // word
  meaning: string; // meaning
  sentences: Set<number>; // sentences
  notes: string; // notes

  // fsrs
  fsrsCard: Card;
};

type Sentence = {
  id?: number;
  text: string;
  trans: string;
};

class WordDB extends Dexie {
  expressions!: Table<Expression, number>;
  sentences!: Table<Sentence, number>;
  dbName: string;

  constructor(dbName: string) {
    super(dbName);

    this.dbName = dbName;
    this.version(1).stores({
      expressions: '++id, &expression',
      sentences: '++id, &text',
    });
  }

  addExpression(
    expression: string,
    meaning: string,
    sentences: Sentence[],
    notes: string
  ) {
    try {
      const sentenceIds = new Set<number>();
      sentences.forEach(async sentence => {
        const sentenceId = await this.sentences.add({
          text: sentence.text,
          trans: sentence.trans,
        });
        sentenceIds.add(sentenceId);
      });

      const fsrsCard = createEmptyCard(new Date());

      this.expressions.add({
        expression,
        meaning,
        sentences: sentenceIds,
        notes,
        fsrsCard,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export type { Expression, Sentence };
export const wordDB = new WordDB('wordDB');
