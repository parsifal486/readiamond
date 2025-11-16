import { useState, useEffect, useCallback } from 'react';
import { Rating } from 'ts-fsrs';
import { FSRSEngine } from '../services/fsrs/fsrsEngine';
import { ExpressionWithSentences } from '../services/db/db';

const ReviewingPage = () => {
  const [currentCard, setCurrentCard] =
    useState<ExpressionWithSentences | null>(null);
  const [dueCards, setDueCards] = useState<ExpressionWithSentences[]>([]);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const fsrsEngine = FSRSEngine.instance;

  const loadDueCards = useCallback(async () => {
    try {
      setLoading(true);
      const cards = await fsrsEngine.getDueCards();
      setDueCards(cards);
      setCurrentCard(cards[0] || null);
    } catch (error) {
      console.error('Failed to load due cards:', error);
    } finally {
      setLoading(false);
    }
  }, [fsrsEngine]);

  // Load due cards on component mount
  useEffect(() => {
    loadDueCards();
  }, [loadDueCards]);

  const handleRating = async (rating: Rating) => {
    if (!currentCard?.expression.id) return;

    try {
      await fsrsEngine.repeat(currentCard.expression.id, rating);

      // Move to next card
      const nextCards = dueCards.slice(1);
      setDueCards(nextCards);
      setCurrentCard(nextCards[0] || null);
      setReviewedCount(prev => prev + 1);
      setShowAnswer(false);
    } catch (error) {
      console.error('Failed to rate card:', error);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading cards...</div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center mx-auto justify-center h-full space-y-4">
        <div className="text-2xl font-bold">🎉 All done!</div>
        <div className="text-lg">
          You've reviewed {reviewedCount} cards today.
        </div>
        <button
          onClick={loadDueCards}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Check for more cards
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-6 overflow-y-auto scrollbar-hide">
      <div className="flex-1 w-140 flex flex-col justify-between ">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress: {reviewedCount} reviewed</span>
            <span>{dueCards.length} remaining</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(reviewedCount / (reviewedCount + dueCards.length)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Card content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Word */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {currentCard.expression.expression}
            </h1>
          </div>

          {/* Answer section */}
          {showAnswer ? (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Meaning:
                </h2>
                <p className="text-lg text-gray-600">
                  {currentCard.expression.meaning}
                </p>
              </div>

              {currentCard.expression.notes && (
                <div className="text-center border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Notes:
                  </h3>
                  <div className="relative">
                    <p
                      className={`text-gray-600 whitespace-pre-wrap transition-all duration-300 ${
                        isNotesExpanded ? '' : 'line-clamp-6'
                      }`}
                    >
                      {currentCard.expression.notes}
                    </p>

                    {/* Show expand button only if content is long */}
                    {currentCard.expression.notes.length > 200 && (
                      <button
                        onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                        className="text-blue-500 hover:text-blue-600 text-sm mt-2 transition-colors"
                      >
                        {isNotesExpanded ? 'Show less ↑' : 'Show more ↓'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-lg mb-2">Think about the meaning...</p>
              <p className="text-sm">Try to recall from memory</p>
            </div>
          )}
        </div>

        {/* Button area - unified for both Show Answer and Rating buttons */}
        <div className="grid grid-cols-4 gap-3">
          {showAnswer ? (
            <>
              {/* Rating buttons */}
              <button
                onClick={() => handleRating(Rating.Again)}
                className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Again
              </button>
              <button
                onClick={() => handleRating(Rating.Hard)}
                className="py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Hard
              </button>
              <button
                onClick={() => handleRating(Rating.Good)}
                className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Good
              </button>
              <button
                onClick={() => handleRating(Rating.Easy)}
                className="py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Easy
              </button>
            </>
          ) : (
            <>
              {/* Show Answer button - spans all 4 columns */}
              <button
                onClick={toggleAnswer}
                className="col-span-4 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-medium transition-colors"
              >
                Show Answer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewingPage;
