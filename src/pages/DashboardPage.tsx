import React, { useState } from 'react';
import { Card, State } from 'ts-fsrs';
import { BiSearch, BiCalendar, BiNote } from 'react-icons/bi';
import { ExpressionWithSentences } from '@/services/db/db';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('learning');
  const [learningWords, setLearningWords] = useState<ExpressionWithSentences[]>([]);
  const [ignoredWords, setIgnoredWords] = useState<ExpressionWithSentences[]>([]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} days`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-main">
      {/* Search Bar - 搜索栏 */}
      <div className="px-6 pt-4 pb-0 bg-emphasis border-b split-line z-0 relative">
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-base" />
          <input
            type="text"
            placeholder="Search vocabulary..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-main text-theme-strong border split-line rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent
                     placeholder:text-theme-muted transition-all"
          />
        </div>

        <div className="flex gap-4 mt-4 text-sm ">
          {/* Learning words tab */}
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded-t transition-colors w-32 justify-center
              ${
                selectedTab === 'learning'
                  ? // Selected: merged with content, no bottom border, background matches content
                    'bg-main text-theme-strong  font-semibold cursor-default -mb-px border-t border-x split-line tab-active-beforeafter '
                  : // Unselected: visually separated, bottom border muted
                    'bg-emphasis text-theme-base  hover:font-semibold'
              }`}
            style={{
              zIndex: selectedTab === 'learning' ? 2 : 1, // Make "selected" sit on top for seamless appearance
            }}
            onClick={() => setSelectedTab('learning')}
          >
            learning words
          </button>
          {/* Ignored words tab */}
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded-t transition-colors w-32 justify-center
              ${
                selectedTab === 'ignored'
                  ? // Selected: merged with content, no bottom border, background matches content
                    'bg-main text-theme-strong  font-semibold cursor-default -mb-px border-t border-x split-line tab-active-beforeafter'
                  : // Unselected: visually separated, bottom border muted
                    'bg-emphasis text-theme-base  hover:font-semibold'
              }`}
            style={{
              zIndex: selectedTab === 'ignored' ? 2 : 1,
            }}
            onClick={() => setSelectedTab('ignored')}
          >
            ignored words
          </button>
        </div>
      </div>

      {/* Vocabulary List - 词汇列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {mockVocabularyData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
              <BiSearch className="w-12 h-12 mb-4 opacity-50" />
              <p>No vocabulary found</p>
            </div>
          ) : (
            mockVocabularyData.map(item => {
              const stateInfo = stateLabels[item.fsrsCard.state as State];

              return (
                <div
                  key={item.id}
                  className="p-4 bg-emphasis border split-line rounded-lg hover:border-theme-primary 
                           transition-all cursor-pointer group"
                >
                  {/* Header - 单词和状态 */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-theme-strong group-hover:text-theme-primary transition-colors">
                        {item.expression}
                      </h3>
                      <p className="text-sm text-theme-base mt-1">
                        {item.meaning}
                      </p>
                    </div>

                    {/* Status Badge - 状态徽章 */}
                    <span
                      className={`px-2 py-1 text-xs font-medium text-white rounded ${stateInfo.color}`}
                    >
                      {stateInfo.label}
                    </span>
                  </div>

                  {/* Notes - 笔记 */}
                  {item.notes && (
                    <div className="flex items-start gap-2 mb-3 mt-2">
                      <BiNote className="w-4 h-4 text-theme-base flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-theme-muted italic">
                        {item.notes}
                      </p>
                    </div>
                  )}

                  {/* Footer - 学习数据 */}
                  <div className="flex items-center gap-4 text-xs text-theme-muted pt-3 border-t split-line">
                    <div className="flex items-center gap-1">
                      <BiCalendar className="w-3.5 h-3.5" />
                      <span>Due: {formatDate(item.fsrsCard.due)}</span>
                    </div>
                    <div>
                      Reps:{' '}
                      <span className="font-medium">{item.fsrsCard.reps}</span>
                    </div>
                    <div>
                      Stability:{' '}
                      <span className="font-medium">
                        {item.fsrsCard.stability.toFixed(1)}
                      </span>
                    </div>
                    {item.fsrsCard.lapses > 0 && (
                      <div className="text-orange-500">
                        Lapses:{' '}
                        <span className="font-medium">
                          {item.fsrsCard.lapses}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

const mockVocabularyData = [
  {
    id: 1,
    expression: 'serendipity',
    meaning: 'n. 意外发现珍奇事物的本领；有意外发现的运气',
    notes: 'A happy accident or pleasant surprise',
    fsrsCard: {
      due: new Date('2025-11-08'),
      stability: 5.2,
      difficulty: 6.8,
      elapsed_days: 3,
      scheduled_days: 7,
      reps: 3,
      lapses: 0,
      state: 2, // Learning
      last_review: new Date('2025-11-01'),
    } as Card,
  },
  {
    id: 2,
    expression: 'ephemeral',
    meaning: 'adj. 短暂的；瞬息的',
    notes: 'Lasting for a very short time',
    fsrsCard: {
      due: new Date('2025-11-10'),
      stability: 8.5,
      difficulty: 5.2,
      elapsed_days: 5,
      scheduled_days: 10,
      reps: 5,
      lapses: 1,
      state: 2, // Learning
      last_review: new Date('2025-11-05'),
    } as Card,
  },
  {
    id: 3,
    expression: 'ubiquitous',
    meaning: 'adj. 无所不在的；普遍存在的',
    notes: 'Present, appearing, or found everywhere',
    fsrsCard: {
      due: new Date('2025-11-07'),
      stability: 2.1,
      difficulty: 7.5,
      elapsed_days: 1,
      scheduled_days: 3,
      reps: 1,
      lapses: 0,
      state: 0, // New
      last_review: new Date('2025-11-06'),
    } as Card,
  },
  {
    id: 4,
    expression: 'ameliorate',
    meaning: 'v. 改善；改良；改进',
    notes: 'To make something bad or unsatisfactory better',
    fsrsCard: {
      due: new Date('2025-11-15'),
      stability: 15.3,
      difficulty: 4.8,
      elapsed_days: 10,
      scheduled_days: 15,
      reps: 8,
      lapses: 0,
      state: 3, // Review
      last_review: new Date('2025-11-01'),
    } as Card,
  },
  {
    id: 5,
    expression: 'perspicacious',
    meaning: 'adj. 聪慧的；敏锐的；有洞察力的',
    notes: 'Having a ready insight into and understanding of things',
    fsrsCard: {
      due: new Date('2025-11-06'),
      stability: 1.2,
      difficulty: 8.9,
      elapsed_days: 0,
      scheduled_days: 1,
      reps: 2,
      lapses: 2,
      state: 1, // Relearning
      last_review: new Date('2025-11-05'),
    } as Card,
  },
  {
    id: 6,
    expression: 'quintessential',
    meaning: 'adj. 典型的；精髓的；完美的',
    notes: 'Representing the most perfect or typical example',
    fsrsCard: {
      due: new Date('2025-11-20'),
      stability: 25.7,
      difficulty: 3.2,
      elapsed_days: 15,
      scheduled_days: 25,
      reps: 12,
      lapses: 0,
      state: 3, // Review
      last_review: new Date('2025-10-26'),
    } as Card,
  },
];

const stateLabels: Record<State, { label: string; color: string }> = {
  [0]: { label: 'New', color: 'bg-gray-500' }, // New
  [1]: { label: 'Relearning', color: 'bg-orange-500' }, // Relearning
  [2]: { label: 'Learning', color: 'bg-blue-500' }, // Learning
  [3]: { label: 'Review', color: 'bg-green-500' }, // Review
};
