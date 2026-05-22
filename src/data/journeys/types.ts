export type LessonType = 
  | 'lesson-theory'
  | 'lesson-all'
  | 'lesson-challenge'
  | 'lesson-mastery'
  | 'lesson-project'
  | 'lesson-trophy';

export type QuestionType = 'mark-lines' | 'multiple-choice' | 'fill-in-blank';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  options: QuizOption[];
}

export interface Quiz {
  title: string;
  description: string;
  xp: number;
  tokens: number;
  energy: number;
  questions: QuizQuestion[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface CodingChallenge {
  title: string;
  description: string;
  solution: string;
  hints: string[];
  starterCode: string;
  testCases?: TestCase[];
  challengeDescription: string;
  requiredOutput: string;
  xp: number;
  tokens: number;
  energy: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  quiz?: Quiz;
  codingChallenge?: CodingChallenge;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Journey {
  id: string;
  language: string;
  title: string;
  chapters: Chapter[];
}
