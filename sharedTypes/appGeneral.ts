type ViewState = 'reading' | 'reviewing' | 'setting' | 'dashboard';

type LeftPanelState = 'dictionary' | 'file';

type MainPanelState = 'editing' | 'reading';

type Word = {
  word: string;
  status: number;
};

type Phrase = {
  text: string;
  status: number;
};

export type { ViewState, LeftPanelState, MainPanelState, Word, Phrase };
