import { fsrs, generatorParameters, type Rating, type Card } from 'ts-fsrs';
import { Expression, ExpressionWithSentences, wordDB } from '../db/db';

export class FSRSEngine {
  private static _instance: FSRSEngine | null = null;
  private readonly engine: ReturnType<typeof fsrs>;

  public static get instance(): FSRSEngine {
    if (!FSRSEngine._instance) {
      FSRSEngine._instance = new FSRSEngine();
    }
    return FSRSEngine._instance;
  }

  private constructor() {
    //init the parameters for the fsrs engine
    const params = generatorParameters({});
    this.engine = fsrs(params);
  }

  async getDueCards(): Promise<ExpressionWithSentences[]> {
    return await wordDB.getDueCards();
  }

  async repeat(expressionId: number, rating: Rating): Promise<Card> {
    const expr = await wordDB.expressions.get(expressionId);
    if (!expr?.fsrsCard) {
      throw new Error(`card ${expressionId} not found`);
    }

    const now = new Date();
    const schedulingCards = this.engine.repeat(expr.fsrsCard, now);

    if (!(rating in schedulingCards)) {
      throw new Error('invalid rating');
    }

    const updatedCard = (schedulingCards as any)[rating].card;

    await wordDB.expressions.update(expressionId, { fsrsCard: updatedCard });

    return updatedCard;
  }

  formatInterval(card: Card): string {
    const days = Math.round(card.scheduled_days);
    return days === 1 ? 'tomorrow' : `${days} days later`;
  }
}
