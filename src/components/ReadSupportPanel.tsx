import { useEffect, useState } from 'react';
import { AutoResizeTextarea } from './AutoResizeTextarea';

const ReadSupportPanel = ({
  selectedWord,
  selectedSentence,
}: {
  selectedWord: string;
  selectedSentence: string;
}) => {
  const [Word, setWord] = useState(selectedWord);
  const [Sentence, setSentence] = useState(selectedSentence);

  useEffect(() => {
    setWord(selectedWord);
  }, [selectedWord]);

  useEffect(() => {
    setSentence(selectedSentence);
  }, [selectedSentence]);

  return (
    <div>
      {/* {edit before add to database} */}
      {/* {input of expression} */}
      <div className="mb-1.5">
        <div className="text-theme-primary text-lg mb-1">expression</div>
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
        <div className="text-theme-primary text-lg mb-1">sentence</div>
        <AutoResizeTextarea
          value={Sentence}
          onChange={e => setSentence(e)}
          placeholder="A short definition"
          minRows={1}
          maxRows={8}
          className="w-full bg-main p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
        />
      </div>

      {/* {word status selection： learing or familiar} */}
      <div className="mb-1.5">
        <div className="text-theme-primary text-lg mb-1">word status</div>
        <div className="flex items-center gap-2">
          <input type="radio" name="wordStatus" id="learning" />
          <label htmlFor="learning">learning</label>
          <input type="radio" name="wordStatus" id="familiar" />
          <label htmlFor="familiar">familiar</label>
        </div>
      </div>
    </div>
  );
};

export default ReadSupportPanel;
