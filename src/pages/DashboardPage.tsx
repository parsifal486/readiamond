import React, { useCallback, useEffect, useState } from 'react';
import { Card, State } from 'ts-fsrs';
import { BiSearch, BiCalendar, BiNote } from 'react-icons/bi';
import { Expression, IgnoreWord, wordDB } from '@/services/db/db';
import { addMockData, addMockIgnoredWords } from '@/services/db/dbmock';

const DashboardPage = () => {
  //search state and tab state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('learning');

  //data state
  const [learningWords, setLearningWords] = useState<Expression[]>([]);
  const [ignoredWords, setIgnoredWords] = useState<IgnoreWord[]>([]);

  //pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //loading state
  const [loading, setLoading] = useState(false);

  //data loading functions
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      if (selectedTab === 'learning') {
        // load learning words
        const { total, expressions } =
          await wordDB.getLearningExpressionsPaginated(
            (currentPage - 1) * pageSize,
            pageSize,
            searchQuery
          );
        setLearningWords(expressions);
        setTotalPages(Math.ceil(total / pageSize));
      } else {
        // load ignored words
        const { total, words } = await wordDB.getIgnoredWordsPaginated(
          (currentPage - 1) * pageSize,
          pageSize,
          searchQuery
        );
        setIgnoredWords(words);
        setTotalPages(Math.ceil(total / pageSize));
      }
    } catch (error) {
      console.error(`Failed to load ${selectedTab} words:`, error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, selectedTab]);

  //data loading on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

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
      {/* Search Bar */}
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
        {/* <button onClick={() => addMockData(200)} className="text-sm text-theme-base bg-emphasis border split-line rounded-lg px-2 py-1">mock</button>
        <button onClick={() => addMockIgnoredWords(100)} className="text-sm text-theme-base bg-emphasis border split-line rounded-lg px-2 py-1">mock ignored words</button> */}
        {/* data base switch button */}
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
            onClick={() => {
              setSelectedTab('learning');
              setCurrentPage(1);
            }}
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
            onClick={() => {
              setSelectedTab('ignored');
              setCurrentPage(1);
            }}
          >
            ignored words
          </button>
        </div>
      </div>

      {/* Vocabulary List - 词汇列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {selectedTab === 'learning' ? (
            learningWords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
                <BiSearch className="w-12 h-12 mb-4 opacity-50" />
                <p>No vocabulary found</p>
              </div>
            ) : (
              learningWords.map(item => {
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
                        <span className="font-medium">
                          {item.fsrsCard.reps}
                        </span>
                      </div>
                      <div>
                        Stability:{' '}
                        <span className="font-medium">
                          {item.fsrsCard.stability.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : ignoredWords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
              <BiSearch className="w-12 h-12 mb-4 opacity-50" />
              <p>No vocabulary found</p>
            </div>
          ) : (
            ignoredWords.map(item => {
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
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-2 border-t split-line bg-emphasis">
        <button
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
          disabled={currentPage === 1}
          className="px-2 py-1 bg-theme-base text-theme-muted rounded-md font-light text-sm"
        >
          Previous
        </button>
        <span className="mx-4 text-theme-muted">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          className="px-2 py-1 bg-theme-base text-theme-muted rounded-md font-light text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;

const stateLabels: Record<State, { label: string; color: string }> = {
  [0]: { label: 'New', color: 'bg-gray-500' }, // New
  [1]: { label: 'Relearning', color: 'bg-orange-500' }, // Relearning
  [2]: { label: 'Learning', color: 'bg-blue-500' }, // Learning
  [3]: { label: 'Review', color: 'bg-green-500' }, // Review
};
