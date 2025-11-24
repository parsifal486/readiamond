import { useEffect, useState } from 'react';
import cambridge from './cambridge.png';
import { CambridgeResult, search } from './engine';
import { AiFillSound } from 'react-icons/ai';
import { BiCollapseVertical } from 'react-icons/bi';

export default function CambridgePanel({
  selectedWord,
}: {
  selectedWord: string;
}) {
  const [result, setResult] = useState<CambridgeResult>({} as CambridgeResult);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const testSearch = async () => {
      try {
        setLoading(true);
        const res: CambridgeResult = await search(selectedWord);
        setResult(res);
        setError(null);
        setIsExpanded(false); // Reset expand state when word changes
      } catch (error) {
        console.error('search error:', error);
        setError(`Search error: ${error as string}`);
      } finally {
        setLoading(false);
      }
    };

    testSearch();
  }, [selectedWord]);

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  if (loading) {
    return (
      <div className="my-1 mx-1 p-2 bg-main rounded-lg">
        <div className="flex items-start gap-2">
          <img src={cambridge} alt="cambridge" className="w-4 h-4 mr-2" />
          <div className="text-theme-base font-thin text-xs">cambridge</div>
        </div>
        <div className="text-theme-base text-sm mt-2">loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-1 mx-1 p-2 bg-main rounded-lg">
        {/* Header with youdao logo */}
        <div className="flex items-start gap-2">
          <img src={cambridge} alt="cambridge" className="w-4 h-4 mr-2" />
          <div className="text-theme-base font-thin text-xs">cambridge</div>
        </div>

        {/* Error message */}
        <div className="text-theme-base text-sm mt-2">
          <div className="text-red-500 font-medium">
            Request failed: {error}
          </div>
          <div className="mt-2 text-theme-muted text-xs">Please try again</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-1 mx-1 p-2 bg-main rounded-lg">
      {/* Header */}
      <div className="flex items-start gap-2 mb-1">
        <img className="w-4 h-4 mr-1.5" src={cambridge} alt="cambridge" />
        <div className="text-theme-base font-thin text-xs">cambridge</div>
      </div>

      {/* text */}
      {result.text && (
        <div className="text-theme-base my-0 text-m font-medium">
          {result.text}
        </div>
      )}

      {/* Audio */}
      {(result.audio.uk.url || result.audio.us.url) && (
        <div className="my-1">
          <div className="flex gap-3 flex-wrap">
            {result.audio.uk.url && (
              <div
                className="flex items-center gap-1.5 cursor-pointer group transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => playSound(result.audio.uk.url)}
              >
                <span className="text-theme-strong text-xs">
                  UK [{result.audio.uk.phsym}]
                </span>
                <AiFillSound className="w-3.5 h-3.5 text-theme-base group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
              </div>
            )}
            {result.audio.us.url && (
              <div
                className="flex items-center gap-1.5 cursor-pointer group transition-all duration-200 hover:scale-105 active:scale-95"
                onClick={() => playSound(result.audio.us.url)}
              >
                <span className="text-theme-strong text-xs">
                  US [{result.audio.us.phsym}]
                </span>
                <AiFillSound className="w-3.5 h-3.5 text-theme-base group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Definitions */}
      {result.definitions.length > 0 && (
        <div className="mb-3">
          {(() => {
            const shouldShowCollapse = result.definitions.length > 2;
            const firstDefinition = result.definitions[0];
            const remainingDefinitions = result.definitions.slice(1);

            // Render a single definition item
            const renderDefinition = (
              item: typeof firstDefinition,
              index: number
            ) => (
              <div key={index} className="mb-2">
                {/* Definition explanation */}
                <div className="leading-3 my-1">
                  <span className="text-theme-base text-sm">
                    {item.explanation}
                  </span>
                </div>

                {/* Examples */}
                {item.examples.length > 0 && (
                  <div className="border-l-2 pl-2 border-zinc-300 mt-1">
                    {item.examples.map((example, exampleIndex) => (
                      <div
                        className="text-theme-base text-sm"
                        key={exampleIndex}
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );

            return (
              <>
                {/* First definition - always shown */}
                {renderDefinition(firstDefinition, 0)}

                {/* Collapse/Expand button - shown in the middle */}
                {shouldShowCollapse && (
                  <div
                    className="flex items-center gap-1 cursor-pointer text-theme-muted hover:text-theme-base my-2"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <BiCollapseVertical
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                    <span className="text-xs">
                      {isExpanded
                        ? 'Show less'
                        : `Show ${remainingDefinitions.length} more`}
                    </span>
                  </div>
                )}

                {/* Remaining definitions - shown when expanded */}
                {shouldShowCollapse && isExpanded && (
                  <>
                    {remainingDefinitions.map((item, index) =>
                      renderDefinition(item, index + 1)
                    )}
                  </>
                )}

                {/* If no collapse needed, show all definitions */}
                {!shouldShowCollapse &&
                  remainingDefinitions.map((item, index) =>
                    renderDefinition(item, index + 1)
                  )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
