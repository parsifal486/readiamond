import { useEffect, useState, useRef } from 'react';
import { AutoResizeTextarea } from './AutoResizeTextarea';
import { youdaoTranslate } from './dictionary/youdao/engine';
import { wordDB } from '../services/db/db';
import { Sentence } from '../services/db/db';
import { useDispatch } from 'react-redux';
import { triggerWordDatabaseUpdate } from '@/store/slices/readingSlice';
import { FaGem } from 'react-icons/fa';
import { RiDeleteBin4Line } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { generateWordNotes } from '@/services/llm/siliconflow';
import LoadingDots from '@/components/loadingDots';
import { addNotice } from '@/store/slices/noticeSlice';

const ReadSupportPanel = ({
  selectedWord,
  selectedSentence,
}: {
  selectedWord: string;
  selectedSentence: string;
}) => {
  const dispatch = useDispatch();
  const [Word, setWord] = useState(selectedWord);
  const [wordStatus, setWordStatus] = useState<'learning' | 'familiar'>(
    'learning'
  );

  const [Meaning, setMeaning] = useState('');
  const [Notes, setNotes] = useState('');

  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [expressionId, setExpressionId] = useState<number | null>(null);
  const [isNotGeneratingNotes, setIsNotGeneratingNotes] = useState(false);

  //getting enabled translation engine from settings
  const translationEngine = useSelector(
    (state: RootState) => state.settings.translationEngine
  );

  useEffect(() => {
    // 1. Reset word display
    setWord(selectedWord);

    // 2. Abort any ongoing translation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 3. Check if word exists in database
    const checkAndLoadWord = async () => {
      try {
        // Call the new getSingleExpressionByWord method
        const existingData =
          await wordDB.getSingleExpressionByWord(selectedWord);

        if (existingData) {
          // ========== WORD EXISTS - UPDATE MODE ==========
          console.log(
            'Word found in database, entering update mode',
            existingData
          );

          // Set update mode state
          setIsUpdateMode(true);
          setExpressionId(existingData.expression.id!);

          // Load existing data from database
          setMeaning(existingData.expression.meaning);
          setNotes(existingData.expression.notes);
          setWordStatus('learning'); // existing words are always 'learning'

          // Load existing sentences from database
          const dbSentences: Sentence[] = existingData.sentences.map(s => ({
            id: s.id, // Keep the id for tracking
            text: s.text,
            trans: s.trans,
          }));

          // If there's a new selected sentence, add it at the beginning
          if (selectedSentence && selectedSentence.trim().length > 0) {
            // Add new sentence (without id, so it's recognized as new)
            const newSentence: Sentence = {
              text: selectedSentence,
              trans: '',
            };

            setSentences([newSentence, ...dbSentences]);

            // Translate the new sentence
            setIsTranslating(true);
            const translateNewSentence = async () => {
              try {
                const controller = new AbortController();
                abortControllerRef.current = controller;

                if (translationEngine === 'youdao') {
                  const res = await youdaoTranslate(selectedSentence);
                  setSentences(prev =>
                    prev.map((s, i) =>
                      i === 0 ? { ...s, trans: res || '' } : s
                    )
                  );
                } else {
                  setSentences(prev =>
                    prev.map((s, i) => (i === 0 ? { ...s, trans: '' } : s))
                  );
                }
              } catch (error) {
                console.error('Translation error:', error);
              } finally {
                setIsTranslating(false);
              }
            };
            translateNewSentence();
          } else {
            // No new sentence, just show existing ones
            setSentences(dbSentences);
          }
        } else {
          // ========== WORD DOES NOT EXIST - ADD MODE ==========
          console.log('Word not found in database, entering add mode');

          // Set add mode state
          setIsUpdateMode(false);
          setExpressionId(null);

          // Reset fields
          setMeaning('');
          setNotes('');
          setWordStatus('learning');

          // Handle new sentence translation (original logic)
          if (selectedSentence && selectedSentence.trim().length > 0) {
            setSentences([
              {
                text: selectedSentence,
                trans: '',
              },
            ]);
            setIsTranslating(true);

            const getTranslation = async () => {
              try {
                const controller = new AbortController();
                abortControllerRef.current = controller;

                if (translationEngine === 'youdao') {
                  const res = await youdaoTranslate(selectedSentence);
                  setSentences(prev =>
                    prev.map((s, i) =>
                      i === 0 ? { ...s, trans: res || '' } : s
                    )
                  );
                } else {
                  setSentences(prev =>
                    prev.map((s, i) => (i === 0 ? { ...s, trans: '' } : s))
                  );
                }
              } catch (error) {
                console.error('Translation error:', error);
              } finally {
                setIsTranslating(false);
              }
            };
            getTranslation();
          } else {
            // No sentence selected, clear sentences
            setSentences([]);
          }
        }
      } catch (error) {
        console.error('Error checking word in database:', error);
        // If error occurs, treat as new word
        setIsUpdateMode(false);
        setExpressionId(null);
      }
    };

    // Execute the check
    checkAndLoadWord();
  }, [selectedWord, selectedSentence, translationEngine]);

  const handleSubmit = async () => {
    // Validation
    if (wordStatus === 'learning' && Meaning.trim() === '') {
      dispatch(addNotice({ id: 'meaning-required', content: 'meaning is required' }));
      return;
    }
    if (Word.trim() === '') {
      dispatch(addNotice({ id: 'word-required', content: 'word is required' }));
      return;
    }

    try {
      if (isUpdateMode && expressionId !== null) {
        // ========== UPDATE MODE ==========
        console.log('Updating expression with id:', expressionId);
        console.log('Sentences to update:', sentences);

        // Call the updateExpression method
        await wordDB.updateExpression(
          expressionId, // expression id in database
          Word, // (possibly edited) expression text
          Meaning, // (possibly edited) meaning
          sentences, // all sentences (with/without id)
          Notes // (possibly edited) notes
        );
      } else {
        // ========== ADD MODE ==========
        console.log('Adding new expression');

        // Call the original addExpression method
        await wordDB.addExpression(Word, Meaning, sentences, Notes, wordStatus);
      }

      // Trigger redux update to refresh word list in other components
      dispatch(triggerWordDatabaseUpdate());
    } catch (error) {
      console.error('Submit error:', error);
      dispatch(addNotice({ id: 'submit-error', content: `Failed to ${isUpdateMode ? 'update' : 'add'} expression: ${error}` }));
    }
  };

  const handleDeleteSentence = (indexToDelete: number) => {
    setSentences(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleGenerateNotes = async () => {
    const contextSentence = sentences.length > 0 ? sentences[0].text : '';

    setIsNotGeneratingNotes(true);

    try {
      console.log(
        'Generating notes for:',
        Word,
        'with context:',
        contextSentence
      );
      const generatedContent = await generateWordNotes(Word, contextSentence);

      console.log('Generated notes:', generatedContent);
      setNotes(generatedContent);
    } catch (error) {
      console.error('Failed to generate notes:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'generate notes failed, please try again';
      dispatch(addNotice({ id: 'generate-notes-error', content: errorMessage }));
    } finally {
      setIsNotGeneratingNotes(false);
    }
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
          className="w-full bg-main text-theme-strong p-1 resize-none overflow-hidden min-h-[2.5rem] placeholder:text-theme-base"
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
          className=" w-full bg-main text-theme-strong p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base "
        />
      </div>

      {/* {word status selection： learing or familiar} */}
      <div className="mb-1.5">
        <div className="text-theme-primary text-lg mb-0.5">word status</div>
        <div className="inline-flex rounded-lg bg-emphasis p-1 gap-1">
          <button
            type="button"
            onClick={() => setWordStatus('learning')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              wordStatus === 'learning'
                ? 'bg-theme-primary text-white shadow-sm'
                : 'text-theme-base hover:text-theme-strong hover:bg-main'
            }`}
          >
            Learning
          </button>
          <button
            type="button"
            onClick={() => setWordStatus('familiar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              wordStatus === 'familiar'
                ? 'bg-theme-primary text-white shadow-sm'
                : 'text-theme-base hover:text-theme-strong hover:bg-main'
            }`}
          >
            Familiar
          </button>
        </div>
      </div>

      {/* context sentence */}

      <div className="mb-1.5 mt-6">
        <div className="text-theme-primary text-lg mb-0.5">sentence</div>
        {sentences.map((sentence, index) => (
          <div className="flex items-start " key={index}>
            <button
              className="text-theme-primary text-lg mb-0.5 mr-1 bg-main rounded-md p-1 hover:bg-theme-primary hover:text-white transition-colors"
              onClick={() => handleDeleteSentence(index)}
            >
              <RiDeleteBin4Line className="w-4 h-4" />
            </button>
            <div key={index} className="mb-4 flex flex-1 flex-col gap-0.5">
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
                className="w-full bg-main text-theme-strong p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
              />

              <AutoResizeTextarea
                value={isTranslating ? 'translating...' : sentence.trans}
                onChange={e =>
                  setSentences(prev =>
                    prev.map((s, i) => (i === index ? { ...s, trans: e } : s))
                  )
                }
                placeholder=""
                minRows={1}
                maxRows={8}
                className="w-full bg-main text-theme-strong p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
              />
            </div>
          </div>
        ))}
      </div>

      {/* {notes} */}
      <div className="mb-1.5">
        <div className="flex items-center justify-between ">
          <div className="text-theme-primary text-lg mb-0.5">notes</div>
          <button
            className="text-theme-primary text-lg mb-0.5 bg-main rounded-md p-1 hover:bg-theme-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-main transition-all"
            onClick={handleGenerateNotes}
            disabled={!Word || Word.trim() === '' || isNotGeneratingNotes}
          >
            {isNotGeneratingNotes ? <LoadingDots /> : <FaGem />}
          </button>
        </div>

        <AutoResizeTextarea
          value={Notes}
          onChange={e => setNotes(e)}
          placeholder=""
          minRows={1}
          maxRows={8}
          className="w-full bg-main text-theme-strong p-1 resize-none overflow-y-auto min-h-[2.5rem] placeholder:text-theme-base"
        />
      </div>

      <button
        className="bg-main w-full text-theme-strong border-2 border-[var(--color-theme-primary)] px-4 py-2 rounded-md hover:bg-theme-primary hover:text-white transition-colors"
        onClick={handleSubmit}
      >
        {isUpdateMode ? 'update' : 'add'}
      </button>
    </div>
  );
};

export default ReadSupportPanel;
