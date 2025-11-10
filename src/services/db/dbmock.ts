// 1. 导入数据库实例和类型
import { wordDB } from './db';
import type { Sentence } from './db';
import { Card, State } from 'ts-fsrs';

// 2. 定义词汇项的类型
type VocabularyItem = {
  word: string;
  meaning: string;
};

// 3. 模拟词汇库（英语高频词汇）- 添加类型注解
const mockVocabulary: VocabularyItem[] = [
  { word: 'serendipity', meaning: 'n. 意外发现珍奇事物的本领；偶然发现' },
  { word: 'ephemeral', meaning: 'adj. 短暂的；瞬息的' },
  { word: 'ubiquitous', meaning: 'adj. 无所不在的；普遍存在的' },
  { word: 'eloquent', meaning: 'adj. 雄辩的；有说服力的' },
  { word: 'resilient', meaning: 'adj. 有韧性的；能恢复的' },
  { word: 'meticulous', meaning: 'adj. 一丝不苟的；精确的' },
  { word: 'pragmatic', meaning: 'adj. 实用主义的；务实的' },
  { word: 'ambiguous', meaning: 'adj. 模棱两可的；含糊不清的' },
  { word: 'benevolent', meaning: 'adj. 仁慈的；善意的' },
  { word: 'coherent', meaning: 'adj. 连贯的；一致的' },
  { word: 'diligent', meaning: 'adj. 勤奋的；勤勉的' },
  { word: 'elaborate', meaning: 'adj. 精心制作的；详尽的' },
  { word: 'feasible', meaning: 'adj. 可行的；可能的' },
  { word: 'genuine', meaning: 'adj. 真正的；真诚的' },
  { word: 'hypothesis', meaning: 'n. 假设；假说' },
  { word: 'inevitable', meaning: 'adj. 不可避免的；必然的' },
  { word: 'juxtapose', meaning: 'v. 并列；并置' },
  { word: 'kaleidoscope', meaning: 'n. 万花筒；千变万化' },
  { word: 'lucid', meaning: 'adj. 清晰的；明白易懂的' },
  { word: 'manifest', meaning: 'v. 显示；证明' },
  { word: 'negligible', meaning: 'adj. 可忽略的；微不足道的' },
  { word: 'obscure', meaning: 'adj. 模糊的；不清楚的' },
  { word: 'paradigm', meaning: 'n. 范例；模式' },
  { word: 'quintessential', meaning: 'adj. 典型的；完美的' },
  { word: 'redundant', meaning: 'adj. 多余的；累赘的' },
  { word: 'sophisticated', meaning: 'adj. 复杂的；精致的' },
  { word: 'tangible', meaning: 'adj. 有形的；实际的' },
  { word: 'ubiquitous', meaning: 'adj. 无处不在的' },
  { word: 'versatile', meaning: 'adj. 多才多艺的；通用的' },
  { word: 'whimsical', meaning: 'adj. 异想天开的；古怪的' },
];

// 4. 生成随机例句 - 添加类型注解
const generateSentence = (word: string): Sentence => {
  const templates: string[] = [
    `The ${word} in this context is quite significant.`,
    `We need to understand the ${word} better.`,
    `The concept of ${word} plays a crucial role.`,
    `Many people find ${word} fascinating.`,
    `The ${word} demonstrates the complexity of language.`,
  ];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return {
    text: template,
    trans: `这个句子包含了单词 ${word} 的用法示例。`,
  };
};

// 5. 生成随机 FSRS 卡片数据 - 添加类型注解
const generateFSRSCard = (): Card => {
  const states: State[] = [0, 1, 2, 3]; // New, Relearning, Learning, Review
  const state: State = states[Math.floor(Math.random() * states.length)];

  const now = new Date();
  const daysOffset = Math.floor(Math.random() * 30) - 15; // -15 到 +15 天
  const dueDate = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000);

  return {
    due: dueDate,
    stability: Math.random() * 30, // 0-30
    difficulty: Math.random() * 10, // 0-10
    elapsed_days: Math.floor(Math.random() * 20),
    scheduled_days: Math.floor(Math.random() * 30),
    reps: Math.floor(Math.random() * 15),
    lapses: Math.floor(Math.random() * 3),
    state: state,
    last_review: new Date(
      now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ),
  } as Card;
};

// 6. 批量插入数据的函数 - 添加类型注解
async function addMockData(count: number = 100): Promise<void> {
  console.log(`🚀 开始添加 ${count} 条模拟数据...`);

  let successCount: number = 0;
  let errorCount: number = 0;

  for (let i = 0; i < count; i++) {
    try {
      // 随机选择一个词汇
      const vocab: VocabularyItem =
        mockVocabulary[Math.floor(Math.random() * mockVocabulary.length)];

      // 为每个词添加数字后缀，避免重复
      const word: string = `${vocab.word}_${i}`;

      // 生成 1-3 个例句
      const sentenceCount: number = Math.floor(Math.random() * 3) + 1;
      const sentences: number[] = [];

      for (let j = 0; j < sentenceCount; j++) {
        const sentence: Sentence = generateSentence(word);
        const sentenceId: number = await wordDB.sentences.add(sentence);
        sentences.push(sentenceId);
      }

      // 创建 Expression 对象
      const expression = {
        expression: word,
        meaning: vocab.meaning,
        sentences: new Set(sentences),
        notes: `这是第 ${i + 1} 个模拟单词的笔记`,
        fsrsCard: generateFSRSCard(),
      };

      // 插入数据库
      await wordDB.expressions.add(expression);

      successCount++;

      // 每 20 条打印一次进度
      if ((i + 1) % 20 === 0) {
        console.log(`📝 已添加 ${successCount} 条数据...`);
      }
    } catch (error) {
      console.error(`❌ 添加第 ${i + 1} 条数据失败:`, error);
      errorCount++;
    }
  }

  console.log(`✅ 完成！成功: ${successCount}, 失败: ${errorCount}`);
  const totalCount: number = await wordDB.expressions.count();
  console.log(`📊 数据库总计: ${totalCount} 条表达式`);
}

const mockIgnoredWords: string[] = [
  'in',
  'the',
  'and',
  'of',
  'to',
  'in',
  'for',
  'with',
  'as',
  'by',
  'on',
  'at',
  'from',
  'up',
  'out',
  'apple',
  'banana',
  'cherry',
  'date',
  'elderberry',
  'fig',
  'grape',
  'honeydew',
  'kiwi',
  'lemon',
  'lime',
  'mango',
  'nectarine',
  'orange',
  'pear',
  'pineapple',
  'plum',
  'pomegranate',
  'raspberry',
  'strawberry',
  'watermelon',
  'pear',
  'pineapple',
  'plum',
  'pomegranate',
  'raspberry',
  'strawberry',
  'watermelon',
  'pear',
  'pineapple',
  'plum',
  'pomegranate',
  'raspberry',
  'strawberry',
  'watermelon',
  'pear',
  'pineapple',
  'plum',
  'pomegranate',
  'raspberry',
  'strawberry',
  'watermelon',
];

// mockdata for ignored words 
async function addMockIgnoredWords(count: number = 100): Promise<void> {
  console.log(`🚀 开始添加 ${count} 条模拟忽略词汇...`);
  wordDB.ignoreWords.bulkAdd(mockIgnoredWords.map(word => ({ expression: word })));
  console.log(`✅ 完成！成功: ${mockIgnoredWords.length} 条忽略词汇`);
}

export { addMockData, addMockIgnoredWords };