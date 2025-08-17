import Dexie, { Table } from 'dexie';
import { Card } from 'ts-fsrs';

interface Expression {
  id?: number; // auto increment id
  expression: string; // word
  meaning: string; // meaning
  sentences: Set<number>; // sentences
  notes: string[]; // notes

  // fsrs
  fsrsCard: Card;
}

interface Sentence {
  id?: number;
  text: string;
  trans: string;
  origin: string;
}

export default class WordDB extends Dexie {
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
}


