type ViewState = 'reading' | 'reviewing' | 'setting' | 'dashboard' 

type LeftPanelState = "dictinary" | "file" ;

type MainPanelState = "editing" | "reading";

type Word = {
    word: string;
    status: number;
    offset: number;
}

type Prase = {
  text: string;
  status: number;
  offset: number;
}


export type { ViewState, LeftPanelState, MainPanelState, Word, Prase };