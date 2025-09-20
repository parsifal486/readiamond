export interface PageInfo {
  pageNumber: number;
  content: string;
  totalPages: number;
}

export class TextPaginator {
  private content: string = '';
  private pages: string[] = [];
  private linesPerPage: number;

  constructor(linesPerPage: number = 30) {
    this.linesPerPage = linesPerPage;
  }

  setContent(content: string): void {
    this.content = content;
    this.pages = this.paginate();
  }

  private paginate(): string[] {
    if (!this.content.trim()) return [''];

    const lines = this.content.split('\n');
    const pages: string[] = [];
    let currentPage: string[] = [];
    let currentLineCount: number = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      //add line to current page
      currentPage.push(line);
      currentLineCount++;

      //check if current page has reached the max lines
      if (currentLineCount >= this.linesPerPage) {
        pages.push(currentPage.join('\n'));
        currentPage = [];
        currentLineCount = 0;
      }
    }

    if (currentPage.length > 0) {
      pages.push(currentPage.join('\n'));
    }

    return pages;
  }

  getPage(pageNumber: number): PageInfo | null {
    //check if page number is valid
    if (pageNumber < 1 || pageNumber > this.pages.length) {
      return null;
    }

    const content = this.pages[pageNumber - 1];

    return {
      pageNumber: pageNumber,
      content: content,
      totalPages: this.getTotalPages(),
    };
  }

  getTotalPages(): number {
    return this.pages.length;
  }

  updateLinesPerPage(linesPerPage: number): void {
    this.linesPerPage = linesPerPage;
    if (this.content) {
      this.pages = this.paginate();
    }
  }
}
