# readiamond

## 1.Product Overview

1.1 ProductName: readiamond
1.2 Product Goal
To provide a Markdown reader focused on Language learning(especialy English rightnow, but more Language is expected to support in the future) by offering features like word lookup, vocabulary note management, example sentence support, and vocabulary flashcard generation. By integrating Dictionary and spaced repetition algorithms, the application helps users efficiently learn words while reading English texts.
1.3 Target Audience
English learners (from beginner to advanced levels)
Students and professionals looking to improve their English reading skills
Users preparing for English proficiency tests (e.g., TOEFL, IELTS, GRE)

## 2.Core feature and Requirements

2.1 markdown File Reading

- Support importing, creating, modifying, opening, and browsing local Markdown files (.md).
- Display files in a tree view(just like obsidian or vscode), sorted by name or modification date.
- Display recent reading history for quick access to recantly opend documents
- Allow font size adjustments
- Support night mode for improved readability.
- familar word in the datebase will be marked in the article

  2.2 Word Lookup Feature

- When the user selects an English word in the article, it automatically triggers the Dictionary API to fetch definitions, pronunciation, phonetic symbols, and example sentences.
- A sidebar at the right side of the app lookup panel will display the word's details, including Word definition/Pronunciation (American/British)/Example sentences and translations/Word class and inflections
- user can add the looking up result into the database with editing the result of looking up and the sentence as a example.
- Support a hotkey to add the word into its database.

  2.3 Vocabulary Note Management

- The note records will include: the word, definition, example sentence, time of addition, and source (specific document path), and the familar score(which will using for the spaced repetition algorithm later).
- Users can manually edit or delete word entries.
- Display statistics: number of words learned, familiarity curve.

  2.4 Vocabulary Flashcard Generation

- Automatically generate flashcards from selected vocabulary words (front: word in English, back: definition and example sentence).
- Memorization Algorithm: Integrate a spaced repetition algorithm (e.g., Leitner System) to support=> Automatic flashcard generation for review based on familiarity level/Push review flashcards based on the spaced repetition model.

  2.5 Data Persistence and Storage

- Use IndexedDB for local data persistence
- User preference settings (theme, font size, shortcuts)

  2.6 Data Import/Export

- Allow exporting vocabulary and progress data (CSV format).
- Support data backup and restoration.

## 3. Technical Stack and Architecture

- Framework: React + TypeScript
- tailwindcss
- Data Persistence: IndexedDB
- Electron: Use Vite + Electron for building the desktop application. File system operations (for importing Markdown files). Window management (main window and functional sidebar)

## 4. UI/UX Design

- File list + Markdown reading area + Word lookup panel(sidebar on the right side).
- Table view + Card view of word notes.
- Vocabulary Management: Table view + Card view of word notes.
- Flashcard Review: Review mode selection + Flashcard flip animation.
- Word selection triggers automatic dictionary panel refresh.
- Quick keyboard shortcuts to enhance user experience (e.g., Ctrl + N to open the vocabulary list, Ctrl + A to add the word current selected to the database within the sentence in article).

## 5.Version Plan
-beta

Todo:

- feature to be implemented
* Unified pop-up alert componet

- defect need to be fixed
* get all cards

-- feature add future
* extract the lits item in DashboardPage to seperate component
currently working on:
* shortcut to review the flash card

