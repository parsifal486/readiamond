import { useEffect, useState } from 'react';
import { AutoResizeTextarea } from './AutoResizeTextarea';
import { deeplTranslate } from './dictionary/deepL/engine';
import { wordDB } from '../services/db/db';
import { Sentence } from '../services/db/db';

const ReadSupportPanel = ({
  selectedWord,
  selectedSentence,
}: {
  selectedWord: string;
  selectedSentence: string;
}) => {
  const [Word, setWord] = useState(selectedWord);
  const [wordStatus, setWordStatus] = useState<'learning' | 'familiar'>(
    'learning'
  );
  const [Meaning, setMeaning] = useState('');
  const [Notes, setNotes] = useState('');

  const [sentences, setSentences] = useState<Sentence[]>([]);

  useEffect(() => {
    setWord(selectedWord);

    //get the translation of the sentence
    if (selectedSentence && selectedSentence.length > 0) {
      const getTranslation = async () => {
        //empty the sentences of former word
        setSentences([]);

        const res = await deeplTranslate(selectedSentence);
        setSentences(prev => {
          // check if the sentence already exists, avoid duplicate
          const exists = prev.some(s => s.text === selectedSentence);
          if (exists) return prev;

          return [{ text: selectedSentence, trans: res || '' }, ...prev];
        });
      };
      getTranslation();
    }
  }, [selectedWord, selectedSentence]);

  const handleWordStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWordStatus(e.target.value as 'learning' | 'familiar');
  };

  const handleSubmit = () => {
    wordDB.addExpression(Word, Meaning, sentences, Notes);
    console.log('submit');
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
        {sentences.map((sentence, index) => (
          <div key={index} className="mb-4 flex flex-col gap-0.5">
            <AutoResizeTextarea
              value={sentence.text}
              onChange={e =>
                setSentences(prev =>
                  prev.map((s, i) => (i === index ? { ...s, text: e } : s))
                )
              }
              placeholder=""
              minRows={1}
              maxRows={8}
              className="w-full bg-main p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
            />

            <AutoResizeTextarea
              value={sentence.trans}
              onChange={e =>
                setSentences(prev =>
                  prev.map((s, i) => (i === index ? { ...s, trans: e } : s))
                )
              }
              placeholder=""
              minRows={1}
              maxRows={8}
              className="w-full bg-main p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
            />
          </div>
        ))}
      </div>

      {/* {notes} */}
      <div className="mb-1.5">
        <div className="text-theme-primary text-lg mb-0.5">notes</div>
        <AutoResizeTextarea
          value={Notes}
          onChange={e => setNotes(e)}
          placeholder=""
          minRows={1}
          maxRows={8}
          className="w-full bg-main p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
        />
      </div>

      <button
        className="bg-theme-main w-full text-theme-strong border-theme-secondary border-2 border-[var(--color-theme-primary)] px-4 py-2 rounded-md hover:bg-theme-secondary"
        onClick={handleSubmit}
      >
        submit
      </button>
    </div>
  );
};

export default ReadSupportPanel;
