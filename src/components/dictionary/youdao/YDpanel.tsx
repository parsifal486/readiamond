import React, { useEffect, useState } from 'react'
import { search } from './engine'

const YDpanel = () => {
  const [result, setResult] = useState('')

  useEffect(() => {
    const testSearch = async () => {
      try {
        console.log('开始测试 search 函数...');
        const searchResult = await search('hello');
        console.log('search 返回结果:', searchResult);
        setResult(searchResult);
      } catch (error) {
        console.error('search 函数出错:', error);
        setResult(`错误: ${error as string}`);
      }
    };

    testSearch();
  }, []);

  return (
    <div>
      <h3>词典测试</h3>
      <div>查询单词: hello</div>
      <div>结果:</div>
      <div dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  )
}

export default YDpanel