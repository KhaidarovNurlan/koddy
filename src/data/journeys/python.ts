import type { Journey } from './types';

export const pythonJourney: Journey = {
  id: 'python-journey',
  language: 'python',
  title: 'Python Journey',
  chapters: [
    {
      id: 'ch1',
      title: 'Introduction',
      description: 'Get started with Python',
      lessons: [
        {
          id: 'py-ch1-l1',
          title: 'The Language',
          description: 'Learn the basics of Python programming.',
          type: 'lesson-theory',
        },
        {
          id: 'py-ch1-l2',
          title: 'Your First Program',
          description: 'Write your first Python script.',
          type: 'lesson-all',
        },
        {
          id: 'py-ch1-l3',
          title: 'Mastery Challenge',
          description: 'Prove your knowledge with Mastery!',
          type: 'lesson-mastery',
        },
        {
          id: 'py-ch1-l4',
          title: 'Basic Syntax',
          description: 'Understand how to write Python code correctly.',
          type: 'lesson-all',
        },
        {
          id: 'py-ch1-l5',
          title: 'Chapter 1 Completed',
          description: 'Automatically completed when the previous lesson is done.',
          type: 'lesson-trophy',
        },
      ],
    },
    {
      id: 'ch2',
      title: 'Loops & Functions',
      description: 'Reusable blocks of code',
      lessons: [
        {
          id: 'py-ch2-l1',
          title: 'What are Functions?',
          description: 'Learn how to encapsulate logic.',
          type: 'lesson-all',
        },
        {
          id: 'py-ch2-l2',
          title: 'Arguments & Returns',
          description: 'Pass data in and get data out.',
          type: 'lesson-all',
        },
        {
          id: 'py-ch2-l3',
          title: 'Scope',
          description: 'Understand local and global variables.',
          type: 'lesson-all',
        },
        {
          id: 'py-ch2-l4',
          title: 'Mastery Challenge',
          description: 'Prove your knowledge with Mastery!',
          type: 'lesson-mastery',
        },
        {
          id: 'py-ch2-l5',
          title: 'Functions Challenge',
          description: 'Test your understanding of functions.',
          type: 'lesson-challenge',
        },
        {
          id: 'py-ch2-l6',
          title: 'Calculator Project',
          description: 'Apply your knowledge in a mini-project.',
          type: 'lesson-project',
        },
        {
          id: 'py-ch2-l7',
          title: 'Chapter 2 Completed',
          description: 'Automatically completed when the previous lesson is done.',
          type: 'lesson-trophy',
        },
      ],
    },
    {
      id: 'ch3',
      title: 'Calculator',
      description: 'Classes and Objects in Python',
      lessons: [
        {
          id: 'py-ch3-l1',
          title: 'Classes & Objects',
          description: 'The foundation of OOP.',
          type: 'lesson-challenge',
        },
        {
          id: 'py-ch3-l2',
          title: 'Methods & Properties',
          description: 'Adding behavior to objects.',
          type: 'lesson-project',
        },
        {
          id: 'py-ch3-l3',
          title: 'Inheritance',
          description: 'Reuse and extend classes.',
          type: 'lesson-project',
        },
        {
          id: 'py-ch3-l4',
          title: 'Inheritance',
          description: 'Reuse and extend classes.',
          type: 'lesson-mastery',
        },
        {
          id: 'py-ch3-l5',
          title: 'Mastery Challenge',
          description: 'Prove your knowledge with Mastery!',
          type: 'lesson-project',
        },
        {
          id: 'py-ch3-l6',
          title: 'RPG Game Project',
          description: 'Build a small text-based RPG.',
          type: 'lesson-all',
        },
        {
          id: 'py-ch3-l7',
          title: 'Chapter 3 Completed',
          description: 'Automatically completed when the previous lesson is done.',
          type: 'lesson-trophy',
        },
      ],
    },
  ],
};
