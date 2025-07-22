import Dexie, { Table } from "dexie";

interface Expression {
    id?: number,
    expression: string,
    meaning: string,
    status: number,
    t: string,
    date: number,
    notes: string[],
    tags: Set<string>,
    sentences: Set<number>,
    connections: Map<string, string>,
}
interface Sentence {
    id?: number;
    text: string,
    trans: string,
    origin: string,
}

export default class WordDB extends Dexie {
    expressions!: Table<Expression, number>;
    sentences!: Table<Sentence, number>;
    dbName:string;

    constructor(dbName: string) {
        super(dbName);

        this.dbName = dbName;
        this.version(1).stores({
            expressions: "++id, &expression, status, t, date, *tags",
            sentences: "++id, &text"
        });
    }
}

