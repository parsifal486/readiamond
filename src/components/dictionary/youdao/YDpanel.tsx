import { useEffect, useState } from 'react';
import { search } from './engine';
import youdao from './youdao.svg';
import { YoudaoResult } from './engine';
import { FaStar } from 'react-icons/fa6';
import { AiFillSound } from 'react-icons/ai';

const YDpanel = ({ selectedWord }: { selectedWord: string }) => {
  const [result, setResult] = useState<YoudaoResult>({} as YoudaoResult);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testSearch = async () => {
      try {
        setLoading(true);
        const res: YoudaoResult = await search(selectedWord);
        setResult(res);
        setError(null);
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
          <img src={youdao} alt="youdao" className="w-4 h-4 mr-2" />
          <div className="text-theme-base font-thin text-xs">youdao</div>
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
          <img src={youdao} alt="youdao" className="w-4 h-4 mr-2" />
          <div className="text-theme-base font-thin text-xs">youdao</div>
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
        <img src={youdao} alt="youdao" className="w-4 h-4 mr-2" />
        <div className="text-theme-base font-thin text-xs">youdao</div>
      </div>

      {/* text */}
      <div className="text-theme-base my-0 text-m font-medium">
        {result.text}
      </div>

      {/* difficulty star */}
      {result.stars > 0 && (
        <div className="my-1">
          <div className="text-theme-base text-sm font-medium flex items-center ">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar
                key={index}
                className={`w-3 h-3 ${index < result.stars ? 'text-yellow-500' : 'text-gray-300'}`}
              />
            ))}{' '}
          </div>
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
                <span className="text-theme-strong  text-xs">
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
                <span className="text-theme-strong  text-xs">
                  US [{result.audio.us.phsym}]
                </span>
                <AiFillSound className="w-3.5 h-3.5 text-theme-base group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Basic Meanings */}
      {result.basicMeaning.size > 0 && (
        <div className="mb-1">
          <div className="space-y-1">
            {Array.from(result.basicMeaning.entries()).map(
              ([pos, definitions]: [string, string[]], index) => (
                <div key={index} className="text-theme-base text-sm">
                  <span className="font-medium text-blue-500">{pos}</span>
                  <span className="ml-2">{definitions.join('; ')}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* collins result */}
      {result.collins && (
        <div className="mb-3">
          {result.collins.map((item, index) => (
            <div key={index}>
              <div className="leading-3 my-1">
                <span className="text-theme-muted text-sm font-medium mr-1.5">
                  {item.POS}
                </span>
                <span
                  className="text-theme-base text-sm"
                  dangerouslySetInnerHTML={{ __html: item.meaning }}
                ></span>
              </div>

              <div className="border-l-2 pl-2 border-zinc-300">
                {item.examples.map((example, index) => (
                  <div className="text-theme-base text-sm" key={index}>
                    {example}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YDpanel;
