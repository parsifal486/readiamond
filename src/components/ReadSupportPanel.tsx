import { useEffect, useState } from 'react';
import { AutoResizeTextarea } from './AutoResizeTextarea';
import { deeplTranslate } from './dictionary/deepL/engine';

const ReadSupportPanel = ({
  selectedWord,
  selectedSentence,
}: {
  selectedWord: string;
  selectedSentence: string;
}) => {
  const [Word, setWord] = useState(selectedWord);
  const [Sentence, setSentence] = useState(selectedSentence);
  const [wordStatus, setWordStatus] = useState<'learning' | 'familiar'>(
    'learning'
  );
  const [Meaning, setMeaning] = useState('');
  const [Translation, setTranslation] = useState('');

  useEffect(() => {
    setWord(selectedWord);
    setSentence(selectedSentence);

    //get the translation of the sentence
    if (selectedSentence && selectedSentence.length > 0) {
      const getTranslation = async () => {
        const res = await deeplTranslate(selectedSentence);
        setTranslation(res || '');
      };
      getTranslation();
    }
  }, [selectedWord, selectedSentence]);

  const handleWordStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWordStatus(e.target.value as 'learning' | 'familiar');
  };

  return (
    <div>
      {/* {edit before add to database} */}
      {/* {input of expression} */}
      <div className="mb-1.5">
        <div className="text-theme-primary text-lg mb-0.5">expression</div>
        <AutoResizeTextarea
          value={Word}
          onChange={e => setWord(e)}
          placeholder="A word or a phrase"
          minRows={1}
          maxRows={2}
          className="w-full bg-main p-1 resize-none overflow-hidden min-h-[2.5rem] placeholder:text-theme-base"
        />
      </div>

      {/* {input of meaning} */}
      <div className="mb-1.5">
        <div className="text-theme-primary text-lg mb-0.5">meaning</div>
        <AutoResizeTextarea
          value={Meaning}
          onChange={e => setMeaning(e)}
          placeholder="A short definition"
          minRows={1}
          maxRows={8}
          className="w-full bg-main p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
        />
      </div>

      {/* {word status selection： learing or familiar} */}
      <div className="mb-1.5">
        <div className="text-theme-primary text-lg mb-0.5">word status</div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="wordStatus"
            checked={wordStatus === 'learning'}
            value="learning"
            onChange={handleWordStatusChange}
          />
          <label htmlFor="learning">learning</label>
          <input
            type="radio"
            name="wordStatus"
            checked={wordStatus === 'familiar'}
            value="familiar"
            onChange={handleWordStatusChange}
          />
          <label htmlFor="familiar">familiar</label>
        </div>
      </div>

      {/* context sentence */}
      <div className="mb-1.5 mt-6">
        <div className="text-theme-primary text-lg mb-0.5">sentence</div>
        <AutoResizeTextarea
          value={Sentence}
          onChange={e => setSentence(e)}
          placeholder=""
          minRows={1}
          maxRows={8}
          className="w-full bg-main p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
        />
      </div>

      {/* translation */}
      <div className="mb-1.5">
        <div className="text-theme-primary text-lg mb-0.5">
          translation & explanation
        </div>
        <AutoResizeTextarea
          value={Translation}
          onChange={e => setTranslation(e)}
          placeholder=""
          minRows={1}
          maxRows={8}
          className="w-full bg-main p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
        />
      </div>

      <button className="bg-theme-main w-full text-theme-strong border-theme-secondary border-2 border-[var(--color-theme-primary)] px-4 py-2 rounded-md">
        submit
      </button>
    </div>
  );
};

export default ReadSupportPanel;
