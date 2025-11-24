import YDpanel from './dictionary/youdao/YDpanel';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import CambridgePanel from './dictionary/cambridge/CambridgePanel';

const WordExplorer = () => {
  const selectedWord = useSelector(
    (state: RootState) => state.reading.selectedWord
  );
  // getting enabled dictionary from settings
  const { youdaoEnabled, cambridgeEnabled } = useSelector(
    (state: RootState) => state.settings.dictionary
  );

  return (
    <div className="h-full overflow-y-auto scrollbar-theme">
      {cambridgeEnabled && <CambridgePanel selectedWord={selectedWord} />}
      {youdaoEnabled && <YDpanel selectedWord={selectedWord} />}
    </div>
  );
};

export default WordExplorer;
