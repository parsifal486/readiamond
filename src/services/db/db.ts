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

type ExpressionWithSentences = {
  expression: Expression;
  sentences: Sentence[];
};

class WordDB extends Dexie {
  expressions!: Table<Expression, number>;
  sentences!: Table<Sentence, number>;
  dbName: string;

  constructor(dbName: string) {
    super(dbName);

    this.dbName = dbName;
    this.version(1).stores({
      expressions: '++id, &expression, fsrsCard.due',
      sentences: '++id, &text',
    });
  }

  async addExpression(
    expression: string,
    meaning: string,
    sentences: Sentence[],
    notes: string
  ) {
    try {
      const sentencePromises = sentences.map(async sentence => {
        return await this.sentences.add({
          text: sentence.text,
          trans: sentence.trans,
        });
      });

      const ids = await Promise.all(sentencePromises);
      const sentenceIds = new Set(ids);

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

  async getExpressionById(id: number): Promise<Expression | undefined> {
    try {
      const expression = await this.expressions.get(id);
      if (!expression) {
        return undefined;
      }
      return expression;
    } catch (error) {
      console.error(error);
    }
  }

  async getSentencesByIds(ids: number[]): Promise<Sentence[] | undefined> {
    try {
      return await this.sentences.where('id').anyOf(ids).toArray();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getDueCards(limit: number = 20): Promise<ExpressionWithSentences[]> {
    try {
      const now = new Date();
      const dueExpressions = (await this.expressions
        .where('fsrsCard.due')
        .belowOrEqual(now)
        .limit(limit)
        .toArray()) as Expression[];

      const dueExpressionsWithSentences = await Promise.all(
        dueExpressions.map(async expression => {
          const sentenceIds = Array.from(expression.sentences);
          const sentences = await this.getSentencesByIds(sentenceIds);

          return {
            expression,
            sentences: sentences || [],
          };
        })
      );
      console.log('dueExpressionsWithSentences:', dueExpressionsWithSentences);
      return dueExpressionsWithSentences;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

export type { Expression, Sentence, ExpressionWithSentences };
export const wordDB = new WordDB('wordDB');
