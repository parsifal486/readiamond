import { Prase, Word } from "sharedTypes/appGeneral";
import { unified, Processor } from "unified";

export class TxtPraser {

  prases: Prase[] = [];
  words: Map<string, Word> = new Map<string, Word>();
  processor: Processor;
  
  constructor(private txt: string) {
    this.processor = unified().use(remarkParse).use(remarkGfm);
  }
    
}

