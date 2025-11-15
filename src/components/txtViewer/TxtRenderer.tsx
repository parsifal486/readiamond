import {
  setSelectedSentence,
  setSelectedWord,
} from '@/store/slices/readingSlice';
import { TxtPraser } from './txtPraser';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { TextPaginator } from '@/utils/textPaginator';
import PageNavigation from '../PageNavigation';
import { RootState } from '@/store/store';

export const TxtRenderer = ({ content }: { content: string }) => {
  //temp paginator config (later we can fetch from settings)
  const linesPerPage = 8;

  const dispatch = useDispatch();
  const databaseVersion = useSelector(
    (state: RootState) => state.reading.databaseVersion
  ); // a trigger to re-parse the content when the database is updated(add word of update word status)

  const containerRef = useRef<HTMLDivElement>(null);
  const [parsedContent, setParsedContent] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  //paginator & txt praser
  const paginator = useMemo(() => {
    return new TextPaginator(linesPerPage);
  }, [linesPerPage]);
  const txtPraser = useMemo(() => {
    return new TxtPraser();
  }, []);

  //paginate content(if content changed, paginate the content)
  useEffect(() => {
    paginator.setContent(content);
    const totalPages = paginator.getTotalPages();
    setTotalPages(totalPages);
  }, [content, paginator]);

  //the hook to parse the content(if content changed, parse the content)
  useEffect(() => {
    const parseContent = async () => {
      const html = await txtPraser.parse(
        paginator.getPage(currentPage)?.content || ''
      );
      setParsedContent(html);
    };
    parseContent();
  }, [currentPage, txtPraser, paginator, content, databaseVersion]);

  useEffect(() => {
    const page = paginator.getPage(currentPage);
    if (page) {
      setParsedContent(page.content);
    }
  }, [currentPage, paginator]);

  //the hook to handle content change
  useEffect(() => {
    //bind to handle the word click
    const handleWordClick = (e: Event) => {
      const target = e.target as HTMLElement;

      //get the selected word
      if (target && target.hasAttribute('data-word')) {
        console.log('target in txtRenderer===>', target);
        const word = target.getAttribute('data-word');
        if (word) {
          dispatch(setSelectedWord(word));
        }
      }

      //get the selected sentence
      if (target && target.hasAttribute('data-sentence')) {
        const sentence = target.getAttribute('data-sentence');
        console.log('sentence in txtRenderer===>', sentence);
        if (sentence) {
          dispatch(setSelectedSentence(sentence));
        }
      }
    };

    const container = containerRef.current;

    if (container) {
      console.log('container add event listener', container);
      container.addEventListener('click', handleWordClick);
    }

    return () => {
      if (container) {
        console.log('container remove event listener', container);
        container.removeEventListener('click', handleWordClick);
      }
    };
  }, [dispatch, parsedContent]);

  return (
    <div
      ref={containerRef}
      className="pb-10 w-full h-full bg-theme-base text-theme-primary focus:outline-none overflow-y-auto static scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thin"
    >
      <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
      <PageNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
