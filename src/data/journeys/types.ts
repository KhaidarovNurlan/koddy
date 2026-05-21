export type LessonType = 
  | 'lesson-theory'
  | 'lesson-all'
  | 'lesson-challenge'
  | 'lesson-mastery'
  | 'lesson-project'
  | 'lesson-trophy';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: LessonType;
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
