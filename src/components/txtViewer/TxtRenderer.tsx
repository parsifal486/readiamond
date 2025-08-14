import { setSelectedWord } from "@/store/slices/readingSlice";
import { TxtPraser } from "./txtPraser";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRef } from "react";

export const TxtRenderer = ({ content }: { content: string }) => {
  
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [parsedContent, setParsedContent] = useState<string>("");

  useEffect(()=>{
    const txtPraser = new TxtPraser();
    const parseContent = async () => {
      const html = await txtPraser.parse(content);
      setParsedContent(html);
    };
    parseContent();
  },[content])


  useEffect(()=>{

    const handleWordClick = (e:Event) =>{
      const target = e.target as HTMLElement;

      if(target && target.hasAttribute('data-word')){
        const word = target.getAttribute('data-word');
        if(word){
          dispatch(setSelectedWord(word));
        }
      }
    }

    const container = containerRef.current;

    if(container){
      console.log('container add event listener', container);
      container.addEventListener('click', handleWordClick);
    }

    return () => {
      if(container){
        console.log('container remove event listener', container);
        container.removeEventListener('click', handleWordClick);
      }
    }
  },[dispatch, parsedContent])


  return (
    <div ref={containerRef} className="w-full h-full bg-theme-base text-theme-primary focus:outline-none overflow-y-auto">
      <p>"《TextRenderer》"</p>
      <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
    </div>
  );
};
