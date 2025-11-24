import { useEffect, useState } from 'react';
import cambridge from './cambridge.png';
import { CambridgeResult, search } from './engine';

export default function CambridgePanel({
  selectedWord,
}: {
  selectedWord: string;
}) {
  const [result, setResult] = useState<CambridgeResult>({} as CambridgeResult);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testSearch = async () => {
      try {
        setLoading(true);
        const res: CambridgeResult = await search(selectedWord);
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
          <img src={cambridge} alt="cambridge" className="w-4 h-4 mr-2" />
          <div className="text-theme-base font-thin text-xs">cambridge</div>
        </div>
      </div>
    );
  }

  if(error) {
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
    </div>
  );
}
