
import YDpanel from './dictionary/youdao/YDpanel'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const WordExplorer = () => {
  const selectedWord = useSelector((state: RootState) => state.reading.selectedWord);
  // getting enabled dictionary from settings
  const { youdaoEnabled } = useSelector((state: RootState) => state.settings.dictionary);
  

  return (
    <div className='h-full overflow-y-auto scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thin'>
      {youdaoEnabled && <YDpanel selectedWord={selectedWord}/>}
    </div>
  )
}

export default WordExplorer

