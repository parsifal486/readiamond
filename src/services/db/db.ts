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

type IgnoreWord = {
  id?: number;
  expression: string;
};

class WordDB extends Dexie {
  expressions!: Table<Expression, number>;
  sentences!: Table<Sentence, number>;
  ignoreWords!: Table<IgnoreWord, number>;
  dbName: string;

  constructor(dbName: string) {
    super(dbName);

    this.dbName = dbName;
    this.version(4).stores({
      expressions: '++id, &expression, fsrsCard.due',
      sentences: '++id',
      ignoreWords: '++id, &expression',
    });
  }

  async addExpression(
    expression: string,
    meaning: string,
    sentences: Sentence[],
    notes: string,
    wordStatus: 'learning' | 'familiar'
  ) {
    if (wordStatus === 'familiar') {
      await this.ignoreWords.add({
        expression,
      });
    } else {
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

        const result = await this.expressions.add({
          expression,
          meaning,
          sentences: sentenceIds,
          notes,
          fsrsCard,
        });
        console.log('submit result:', result);
      } catch (error) {
        console.error(error);
      }
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

  async getExpressionByWords(
    words: string[]
  ): Promise<{ word: string; status: number }[]> {
    const rawIgnoreWords = await this.ignoreWords
      .where('expression')
      .anyOf(words)
      .toArray();
    const ignoreWords = rawIgnoreWords.map(item => ({
      word: item.expression,
      status: -1,
    }));

    const rawExistingExpression = await this.expressions
      .where('expression')
      .anyOf(words)
      .toArray();
    const existingExpression = rawExistingExpression.map(item => ({
      word: item.expression,
      status: item.fsrsCard.state,
    }));

    return [...ignoreWords, ...existingExpression];
  }

  //get due cards for flash card review
  async getDueCards(limit?: number): Promise<ExpressionWithSentences[]> {
    try {
      const now = new Date();

      // Build query
      let query = this.expressions.where('fsrsCard.due').belowOrEqual(now);

      // Only apply limit if provided
      if (limit !== undefined) {
        query = query.limit(limit);
      }

      const dueExpressions = (await query.toArray()) as Expression[];

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

  //pageinate get data
  async getLearningExpressionsPaginated(
    offset: number,
    limit: number,
    searchQuery: string
  ): Promise<{ total: number; expressions: Expression[] }> {
    try {
      let collection = this.expressions.toCollection();
      const lowcaseQuery = searchQuery.trim().toLowerCase();

      //if query exists, filter the collection by the query
      if (lowcaseQuery) {
        collection = collection.filter(expr =>
          expr.expression.includes(lowcaseQuery)
        );
      }

      //when the query is empty
      const total = await collection.count();

      //get the paginated data
      const expressions = await collection
        .offset(offset)
        .limit(limit)
        .toArray();

      return {
        total,
        expressions,
      };
    } catch (error) {
      console.error(error);
      return { total: 0, expressions: [] };
    }
  }

  //get ignored words paginated
  async getIgnoredWordsPaginated(
    offset: number,
    limit: number,
    searchQuery: string
  ): Promise<{ total: number; words: IgnoreWord[] }> {
    try {
      const createFilteredCollection = () => {
        let collection = this.ignoreWords.toCollection();
        const lowcaseQuery = searchQuery.trim().toLowerCase();

        if (lowcaseQuery) {
          collection = collection.filter(word =>
            word.expression.toLowerCase().includes(lowcaseQuery)
          );
        }

        return collection;
      };

      const words = await createFilteredCollection()
        .offset(offset)
        .limit(limit)
        .toArray();
      const total = await createFilteredCollection().count();

      return { total, words };
    } catch (error) {
      console.error(error);
      return { total: 0, words: [] };
    }
  }

  //delete ignored word
  async deleteIgnoredWord(id: number) {
    try {
      await this.ignoreWords.delete(id);
    } catch (error) {
      console.error(error);
    }
  }

  //delete expression
  async deleteExpression(id: number) {
    try {
      //cascade delete the sentences
      const expression = await this.expressions.get(id);

      if (expression?.sentences) {
        await this.sentences.bulkDelete(Array.from(expression.sentences));
      }

      await this.expressions.delete(id);
    } catch (error) {
      console.error(error);
    }
  }

  //get single expression by word
  async getSingleExpressionByWord(
    word: string
  ): Promise<ExpressionWithSentences | undefined> {
    try {
      const expression = await this.expressions
        .where('expression')
        .equals(word)
        .first();

      if (!expression) {
        return undefined;
      }

      const sentenceIds = Array.from(expression.sentences);
      const sentences = await this.getSentencesByIds(sentenceIds);

      return {
        expression,
        sentences: sentences || [],
      };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  //update Expression
  async updateExpression(
    id: number,
    expression: string,
    meaning: string,
    sentences: Sentence[],
    notes: string
  ) {
    const existing = await this.expressions.get(id);

    // identify which sentences are new (no id)
    const newSentences = sentences.filter(s => !s.id);
    const existingSentences = sentences.filter(s => s.id);

    // add new sentences
    const newIds = await Promise.all(
      newSentences.map(s => this.sentences.add(s))
    );

    // update existing sentences
    await Promise.all(
      existingSentences.map(s => this.sentences.update(s.id!, s))
    );

    // identify which sentences to delete (old ones that are not in the new sentences)
    const keptIds = new Set(existingSentences.map(s => s.id!));
    const toDelete = Array.from(existing?.sentences || []).filter(
      id => !keptIds.has(id)
    );
    await this.sentences.bulkDelete(toDelete);

    // update the expression
    await this.expressions.update(id, {
      expression,
      meaning,
      sentences: new Set([...keptIds, ...newIds]),
      notes,
    });
  }
}

export type { Expression, Sentence, ExpressionWithSentences, IgnoreWord };
export const wordDB = new WordDB('wordDB');
