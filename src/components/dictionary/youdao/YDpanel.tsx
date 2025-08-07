import React, { useEffect, useState } from 'react'
import { search, YoudaoResultLex } from './engine'
import { HTMLString } from '@sharedTypes/dictionary';
import youdao from './youdao.svg';

const YDpanel = () => {
  const [result, setResult] = useState<HTMLString>('')

  useEffect(() => {
    const testSearch = async () => {
      try {
        console.log('开始测试 search 函数...');
        const res = await search('hello');
        const searchResult = res.result as YoudaoResultLex;
        console.log('search.basic ===>', searchResult.basic);
        setResult(searchResult.basic || '');
      } catch (error) {
        console.error('search 函数出错:', error);
        setResult(`错误: ${error as string}`);
      }
    };

    testSearch();
  }, []);

  return (
    <div className='m-3 p-2 bg-main rounded-lg'>
      <div>
        <div className='flex items-start gap-2'>
          <img src={youdao} alt="youdao" className='w-4 h-4 mr-2' />
          <div className='text-theme-base font-thin text-xs'>youdao</div>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  )
}

export default YDpanel