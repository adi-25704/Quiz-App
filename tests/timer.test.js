import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createCountdownTimer } from '../src/timer.js';

describe('createCountdownTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with correct duration', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      expect(timer.getMinutes()).toBe(0);
      expect(timer.getSeconds()).toBe(0);
    });

    it('should start in stopped state', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      expect(timer.getStatus()).toBe(false);
    });
  });

  describe('start', () => {
    it('should set running status to true', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      expect(timer.getStatus()).toBe(true);
    });

    it('should call onTick callback with minutes and seconds', () => {
      const onTick = jest.fn();
      const timer = createCountdownTimer({ duration: 60, onTick, onComplete: jest.fn() });
      
      timer.start();
      jest.advanceTimersByTime(1000);
      
      expect(onTick).toHaveBeenCalledWith(0, 59);
    });

    it('should call onTick with correct minutes and seconds values', () => {
      const onTick = jest.fn();
      const timer = createCountdownTimer({ duration: 125, onTick, onComplete: jest.fn() });
      
      timer.start();
      jest.advanceTimersByTime(1000);
      
      expect(onTick).toHaveBeenCalledWith(2, 4);
    });

    it('should call onTick multiple times as time progresses', () => {
      const onTick = jest.fn();
      const timer = createCountdownTimer({ duration: 60, onTick, onComplete: jest.fn() });
      
      timer.start();
      jest.advanceTimersByTime(3000);
      
      expect(onTick).toHaveBeenCalledTimes(3);
      expect(onTick).toHaveBeenNthCalledWith(1, 0, 59);
      expect(onTick).toHaveBeenNthCalledWith(2, 0, 58);
      expect(onTick).toHaveBeenNthCalledWith(3, 0, 57);
    });

    it('should not start if already running', () => {
      const onTick = jest.fn();
      const timer = createCountdownTimer({ duration: 60, onTick, onComplete: jest.fn() });
      
      timer.start();
      timer.start();
      jest.advanceTimersByTime(1000);
      
      expect(onTick).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop', () => {
    it('should set running status to false', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      timer.stop();
      expect(timer.getStatus()).toBe(false);
    });

    it('should stop calling onTick', () => {
      const onTick = jest.fn();
      const timer = createCountdownTimer({ duration: 60, onTick, onComplete: jest.fn() });
      
      timer.start();
      jest.advanceTimersByTime(1000);
      timer.stop();
      jest.advanceTimersByTime(2000);
      
      expect(onTick).toHaveBeenCalledTimes(1);
    });

    it('should not stop if not running', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      expect(() => timer.stop()).not.toThrow();
    });

    it('should preserve elapsed time when stopped', () => {
      const timer = createCountdownTimer({ duration: 120, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      jest.advanceTimersByTime(5000);
      timer.stop();
      expect(timer.getMinutes()).toBe(0);
      expect(timer.getSeconds()).toBe(5);
    });
  });

  describe('reset', () => {
    it('should reset to original duration', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      jest.advanceTimersByTime(10000);
      timer.reset();
      expect(timer.getMinutes()).toBe(0);
      expect(timer.getSeconds()).toBe(0);
    });

    it('should reset to new duration if provided', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      jest.advanceTimersByTime(10000);
      timer.reset(30);
      expect(timer.getMinutes()).toBe(0);
      expect(timer.getSeconds()).toBe(0);
    });

    it('should stop the timer', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      timer.reset();
      expect(timer.getStatus()).toBe(false);
    });

    it('should clear callbacks', () => {
      const onTick = jest.fn();
      const timer = createCountdownTimer({ duration: 60, onTick, onComplete: jest.fn() });
      timer.start();
      jest.advanceTimersByTime(1000);
      timer.reset();
      jest.advanceTimersByTime(2000);
      
      expect(onTick).toHaveBeenCalledTimes(1);
    });
  });

  describe('onComplete callback', () => {
    it('should call onComplete when timer reaches 0', () => {
      const onComplete = jest.fn();
      const timer = createCountdownTimer({ duration: 3, onTick: jest.fn(), onComplete });
      
      timer.start();
      jest.advanceTimersByTime(3000);
      
      
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should stop timer when onComplete is called', () => {
      const onComplete = jest.fn();
      const timer = createCountdownTimer({ duration: 3, onTick: jest.fn(), onComplete });
      
      timer.start();
      jest.advanceTimersByTime(3000);
      
      expect(timer.getStatus()).toBe(false);
    });

    it('should handle missing onComplete callback gracefully', () => {
      const timer = createCountdownTimer({ duration: 1, onTick: jest.fn() });
      expect(() => {
        timer.start();
        jest.advanceTimersByTime(1000);
      }).not.toThrow();
    });
  });

  describe('getMinutes and getSeconds', () => {
    it('should return elapsed minutes', () => {
      const timer = createCountdownTimer({ duration: 300, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      jest.advanceTimersByTime(125000); 
      expect(timer.getMinutes()).toBe(2); 
    });

    it('should return elapsed seconds', () => {
      const timer = createCountdownTimer({ duration: 300, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      jest.advanceTimersByTime(125000); 
      expect(timer.getSeconds()).toBe(5); 
    });

    it('should return 0 when timer just started', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      expect(timer.getMinutes()).toBe(0);
      expect(timer.getSeconds()).toBe(0);
    });

    it('should accumulate elapsed time correctly', () => {
      const timer = createCountdownTimer({ duration: 600, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      jest.advanceTimersByTime(275000); 
      expect(timer.getMinutes()).toBe(4); 
      expect(timer.getSeconds()).toBe(35); 
    });
  });

  describe('getStatus', () => {
    it('should return true when running', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      expect(timer.getStatus()).toBe(true);
    });

    it('should return false when stopped', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      timer.stop();
      expect(timer.getStatus()).toBe(false);
    });

    it('should return false after reset', () => {
      const timer = createCountdownTimer({ duration: 60, onTick: jest.fn(), onComplete: jest.fn() });
      timer.start();
      timer.reset();
      expect(timer.getStatus()).toBe(false);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle start-stop-start cycle', () => {
      const onTick = jest.fn();
      const timer = createCountdownTimer({ duration: 60, onTick, onComplete: jest.fn() });
      
      timer.start();
      jest.advanceTimersByTime(2000);
      timer.stop();
      timer.start();
      jest.advanceTimersByTime(2000);
      
      expect(onTick).toHaveBeenCalledTimes(4);
    });

    it('should handle reset during countdown', () => {
      const onTick = jest.fn();
      const timer = createCountdownTimer({ duration: 60, onTick, onComplete: jest.fn() });
      
      timer.start();
      jest.advanceTimersByTime(5000);
      timer.reset(30);
      timer.start();
      jest.advanceTimersByTime(2000);
      
      expect(timer.getMinutes()).toBe(0);
      expect(timer.getSeconds()).toBe(2);
    });
  });

  describe('Edge cases', () => {
    it('should work with duration of 0', () => {
      const onComplete = jest.fn();
      const timer = createCountdownTimer({ duration: 0, onTick: jest.fn(), onComplete });
      
      timer.start();
      jest.advanceTimersByTime(1000);
      
      expect(onComplete).toHaveBeenCalled();
    });

    it('should handle missing callbacks', () => {
      const timer = createCountdownTimer({ duration: 5 });
      expect(() => {
        timer.start();
        jest.advanceTimersByTime(5000);
      }).not.toThrow();
    });
  });
});
