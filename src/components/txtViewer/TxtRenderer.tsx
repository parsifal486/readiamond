import { TxtPraser } from "./txtPraser";
import { useEffect, useState } from "react";

export const TxtRenderer = ({ content }: { content: string }) => {
  
  const [parsedContent, setParsedContent] = useState<string>("");

  useEffect(()=>{
    const txtPraser = new TxtPraser();
    const parseContent = async () => {
      const html = await txtPraser.parse(content);
      setParsedContent(html);
    };
    parseContent();
  },[content])


  return (
    <div className="w-full h-full bg-theme-base text-theme-primary focus:outline-none overflow-y-auto">
      <p>"《TextRenderer》"</p>
      <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
    </div>
  );
};
