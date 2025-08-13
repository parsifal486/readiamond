
import YDpanel from './dictionary/youdao/YDpanel'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const WordExplorer = () => {
  const selectedWord = useSelector((state: RootState) => state.reading.selectedWord);
  


  return (
    <div className='h-full overflow-y-auto'>
      <YDpanel selectedWord={selectedWord}/>
    </div>
  )
}

export default WordExplorer

