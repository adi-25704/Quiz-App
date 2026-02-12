import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createQuizEngine } from '../src/quizEngine.js';

describe('createQuizEngine', () => {
  let mockQuizData;
  let quizEngine;

  beforeEach(() => {
    mockQuizData = [
      { id: 1, question: 'Q1?', answers: ['A', 'B', 'C'], correct: 0, selected: null },
      { id: 2, question: 'Q2?', answers: ['A', 'B', 'C'], correct: 1, selected: null },
      { id: 3, question: 'Q3?', answers: ['A', 'B', 'C'], correct: 2, selected: null },
    ];
    quizEngine = createQuizEngine(mockQuizData);
  });

  describe('getCurrentQuestion', () => {
    it('should return the first question initially', () => {
      const question = quizEngine.getCurrentQuestion();
      expect(question.id).toBe(1);
      expect(question.question).toBe('Q1?');
    });

    it('should return current question after navigation', () => {
      quizEngine.getNextQuestion();
      const question = quizEngine.getCurrentQuestion();
      expect(question.id).toBe(2);
    });
  });

  describe('selectAnswer', () => {
    it('should set the selected answer for current question', () => {
      quizEngine.selectAnswer(1);
      const question = quizEngine.getCurrentQuestion();
      expect(question.selected).toBe(1);
    });

    it('should overwrite previous selection', () => {
      quizEngine.selectAnswer(0);
      expect(quizEngine.getCurrentQuestion().selected).toBe(0);
      quizEngine.selectAnswer(2);
      expect(quizEngine.getCurrentQuestion().selected).toBe(2);
    });

    it('should only select answer for current question', () => {
      quizEngine.selectAnswer(1);
      const prevQuestion = quizEngine.getCurrentQuestion();
      quizEngine.getNextQuestion();
      const currentQuestion = quizEngine.getCurrentQuestion();
      expect(prevQuestion.selected).toBe(1);
      expect(currentQuestion.selected).toBe(null);
    });
  });

  describe('getProgress', () => {
    it('should return 0% when no answers are selected', () => {
      const progress = quizEngine.getProgress();
      expect(progress).toBe(0);
    });

    it('should return 33.33...% when one answer is selected', () => {
      quizEngine.selectAnswer(0);
      const progress = quizEngine.getProgress();
      expect(progress).toBeCloseTo(33.33, 1);
    });

    it('should return 100% when all answers are selected', () => {
      quizEngine.selectAnswer(0);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(2);
      const progress = quizEngine.getProgress();
      expect(progress).toBe(100);
    });
  });

  describe('getNextQuestion', () => {
    it('should move to next question', () => {
      const nextQuestion = quizEngine.getNextQuestion();
      expect(nextQuestion.id).toBe(2);
    });

    it('should increment the index', () => {
      expect(quizEngine.getIndex()).toBe(0);
      quizEngine.getNextQuestion();
      expect(quizEngine.getIndex()).toBe(1);
    });

    it('should return undefined when at the last question', () => {
      quizEngine.getNextQuestion();
      quizEngine.getNextQuestion();
      const result = quizEngine.getNextQuestion();
      expect(result).toBeUndefined();
    });
  });

  describe('getPreviousQuestion', () => {
    it('should move to previous question', () => {
      quizEngine.getNextQuestion();
      quizEngine.getNextQuestion();
      const prevQuestion = quizEngine.getPreviousQuestion();
      expect(prevQuestion.id).toBe(2);
    });

    it('should decrement the index', () => {
      quizEngine.getNextQuestion();
      expect(quizEngine.getIndex()).toBe(1);
      quizEngine.getPreviousQuestion();
      expect(quizEngine.getIndex()).toBe(0);
    });

    it('should return undefined when at the first question', () => {
      const result = quizEngine.getPreviousQuestion();
      expect(result).toBeUndefined();
    });
  });

  describe('getScore', () => {
    it('should return 0 when no correct answers are selected', () => {
      quizEngine.selectAnswer(2);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(2);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      const score = quizEngine.getScore();
      expect(score).toBe(0);
    });

    it('should return count of correct answers', () => {
      quizEngine.selectAnswer(0);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      const score = quizEngine.getScore();
      expect(score).toBe(2);
    });

    it('should return perfect score when all answers are correct', () => {
      quizEngine.selectAnswer(0); 
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1); 
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(2);
      const score = quizEngine.getScore();
      expect(score).toBe(3);
    });
  });

  describe('resetQuiz', () => {
    it('should reset index to 0', () => {
      quizEngine.getNextQuestion();
      quizEngine.getNextQuestion();
      quizEngine.resetQuiz();
      expect(quizEngine.getIndex()).toBe(0);
    });

    it('should clear all selected answers', () => {
      quizEngine.selectAnswer(0);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      quizEngine.resetQuiz();
      
      expect(quizEngine.getCurrentQuestion().selected).toBe(null);
      quizEngine.getNextQuestion();
      expect(quizEngine.getCurrentQuestion().selected).toBe(null);
    });

    it('should reset progress to 0%', () => {
      quizEngine.selectAnswer(0);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      
      quizEngine.resetQuiz();
      expect(quizEngine.getProgress()).toBe(0);
    });
  });

  describe('getIndex', () => {
    it('should return current question index', () => {
      expect(quizEngine.getIndex()).toBe(0);
      quizEngine.getNextQuestion();
      expect(quizEngine.getIndex()).toBe(1);
    });
  });

  describe('getIsComplete', () => {
    it('should return false when no answers are selected', () => {
      expect(quizEngine.getIsComplete()).toBe(false);
    });

    it('should return false when some answers are selected', () => {
      quizEngine.selectAnswer(0);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      expect(quizEngine.getIsComplete()).toBe(false);
    });

    it('should return true when all answers are selected', () => {
      quizEngine.selectAnswer(0);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(2);
      expect(quizEngine.getIsComplete()).toBe(true);
    });
  });

  describe('hasAnsweredCurrent', () => {
    it('should return false when current question is not answered', () => {
      expect(quizEngine.hasAnsweredCurrent()).toBe(false);
    });

    it('should return true when current question is answered', () => {
      quizEngine.selectAnswer(0);
      expect(quizEngine.hasAnsweredCurrent()).toBe(true);
    });

    it('should return correct value after navigation', () => {
      quizEngine.selectAnswer(0);
      quizEngine.getNextQuestion();
      expect(quizEngine.hasAnsweredCurrent()).toBe(false);
      
      quizEngine.selectAnswer(1);
      expect(quizEngine.hasAnsweredCurrent()).toBe(true);
    });
  });

  describe('isSelected', () => {
    it('should return false when answer is not selected', () => {
      expect(quizEngine.isSelected(0)).toBe(false);
      expect(quizEngine.isSelected(1)).toBe(false);
    });

    it('should return true for the selected answer', () => {
      quizEngine.selectAnswer(1);
      expect(quizEngine.isSelected(1)).toBe(true);
    });

    it('should return false for non-selected answers', () => {
      quizEngine.selectAnswer(1);
      expect(quizEngine.isSelected(0)).toBe(false);
      expect(quizEngine.isSelected(2)).toBe(false);
    });

    it('should work correctly after changing selection', () => {
      quizEngine.selectAnswer(0);
      expect(quizEngine.isSelected(0)).toBe(true);
      quizEngine.selectAnswer(2);
      expect(quizEngine.isSelected(0)).toBe(false);
      expect(quizEngine.isSelected(2)).toBe(true);
    });
  });

  describe('isLast', () => {
    it('should return true at first question', () => {
      expect(quizEngine.isLast()).toBe(true);
    });

    it('should return true at middle questions', () => {
      quizEngine.getNextQuestion();
      expect(quizEngine.isLast()).toBe(true);
    });

    it('should return true at last question', () => {
      quizEngine.getNextQuestion();
      quizEngine.getNextQuestion();
      expect(quizEngine.isLast()).toBe(true);
    });

    it('should return false beyond last question', () => {
      quizEngine.getNextQuestion();
      quizEngine.getNextQuestion();
      quizEngine.getNextQuestion();
      expect(quizEngine.isLast()).toBe(false);
    });
  });

  describe('isFirst', () => {
    it('should return true at first question', () => {
      expect(quizEngine.isFirst()).toBe(true);
    });

    it('should return true at middle questions', () => {
      quizEngine.getNextQuestion();
      expect(quizEngine.isFirst()).toBe(true);
    });

    it('should return true at last question', () => {
      quizEngine.getNextQuestion();
      quizEngine.getNextQuestion();
      expect(quizEngine.isFirst()).toBe(true);
    });

    it('should return true when navigating backwards from middle', () => {
      quizEngine.getNextQuestion();
      quizEngine.getPreviousQuestion();
      expect(quizEngine.isFirst()).toBe(true);
    });
  });

  describe('Data isolation', () => {
    it('should not modify original quiz data', () => {
      const originalData = [
        { id: 1, question: 'Q1?', answers: ['A', 'B', 'C'], correct: 0, selected: null },
      ];
      const engine = createQuizEngine(originalData);
      engine.selectAnswer(1);
      
      expect(originalData[0].selected).toBe(null);
    });
  });

  describe('Integration scenarios', () => {
    it('should track completion as questions are answered', () => {
      expect(quizEngine.getIsComplete()).toBe(false);
      
      quizEngine.selectAnswer(0);
      expect(quizEngine.getIsComplete()).toBe(false);
      
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      expect(quizEngine.getIsComplete()).toBe(false);
      
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(2);
      expect(quizEngine.getIsComplete()).toBe(true);
    });

    it('should correctly identify navigation boundaries', () => {
      expect(quizEngine.isFirst()).toBe(true);
      expect(quizEngine.isLast()).toBe(true);
      
      quizEngine.getNextQuestion();
      expect(quizEngine.isFirst()).toBe(true);
      expect(quizEngine.isLast()).toBe(true);
      
      quizEngine.getNextQuestion();
      expect(quizEngine.isFirst()).toBe(true);
      expect(quizEngine.isLast()).toBe(true);
    });

    it('should maintain answer selection across navigation', () => {
      quizEngine.selectAnswer(0);
      expect(quizEngine.isSelected(0)).toBe(true);
      
      quizEngine.getNextQuestion();
      quizEngine.selectAnswer(1);
      
      quizEngine.getPreviousQuestion();
      expect(quizEngine.isSelected(0)).toBe(true);
      expect(quizEngine.hasAnsweredCurrent()).toBe(true);
    });
  });
});
