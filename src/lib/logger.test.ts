import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from './logger';

describe('Logger', () => {
  let consoleSpy: {
    log: any;
    info: any;
    warn: any;
    error: any;
    group: any;
    groupEnd: any;
  };

  beforeEach(() => {
    // Spy on console methods
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      group: vi.spyOn(console, 'group').mockImplementation(() => {}),
      groupEnd: vi.spyOn(console, 'groupEnd').mockImplementation(() => {}),
    };

    // Reset environment
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe('Development Mode', () => {
    it('logs debug messages in development', () => {
      logger.debug('Debug message', { test: true }, 'TestSource');
      
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        expect.stringContaining('TestSource'),
        'Debug message',
        { test: true }
      );
    });

    it('logs info messages in development', () => {
      logger.info('Info message', { data: 'test' }, 'TestSource');
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        expect.stringContaining('TestSource'),
        'Info message',
        { data: 'test' }
      );
    });

    it('logs warnings in development', () => {
      logger.warn('Warning message', { warning: true }, 'TestSource');
      
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        expect.stringContaining('TestSource'),
        'Warning message',
        { warning: true }
      );
    });

    it('logs errors in development', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error, 'TestSource');
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('TestSource'),
        'Error occurred',
        error
      );
    });
  });

  describe('Production Mode', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production');
    });

    it('does not log debug messages in production', () => {
      logger.debug('Debug message', { test: true }, 'TestSource');
      
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('does not log info messages in production', () => {
      logger.info('Info message', { data: 'test' }, 'TestSource');
      
      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    it('logs warnings in production', () => {
      logger.warn('Warning message', { warning: true }, 'TestSource');
      
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        expect.stringContaining('TestSource'),
        'Warning message',
        { warning: true }
      );
    });

    it('logs errors in production', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error, 'TestSource');
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.stringContaining('TestSource'),
        'Error occurred',
        error
      );
    });
  });

  describe('Specialized Logging', () => {
    it('logs form submissions', () => {
      logger.logFormSubmission('ContactForm', true);
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'Form submission',
        expect.objectContaining({
          formName: 'ContactForm',
          success: true,
        })
      );
    });

    it('logs form submission errors', () => {
      logger.logFormSubmission('ContactForm', false, 'Validation failed');
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'Form submission failed',
        expect.objectContaining({
          formName: 'ContactForm',
          error: 'Validation failed',
        })
      );
    });

    it('logs API calls', () => {
      logger.logApiCall('GET', '/api/users', 200);
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'API call',
        expect.objectContaining({
          method: 'GET',
          endpoint: '/api/users',
          status: 200,
        })
      );
    });

    it('logs API errors', () => {
      logger.logApiCall('POST', '/api/users', 500, 'Internal server error');
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'API call failed',
        expect.objectContaining({
          method: 'POST',
          endpoint: '/api/users',
          status: 500,
          error: 'Internal server error',
        })
      );
    });

    it('logs performance metrics', () => {
      logger.logPerformance('PageLoad', 1234);
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'Performance',
        expect.objectContaining({
          metric: 'PageLoad',
          value: 1234,
        })
      );
    });

    it('logs performance with object metrics', () => {
      const metrics = { FCP: 1200, LCP: 2500 };
      logger.logPerformance('WebVitals', metrics);
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'Performance',
        expect.objectContaining({
          metric: 'WebVitals',
          value: metrics,
        })
      );
    });
  });

  describe('Log Buffer', () => {
    it('maintains a log buffer', () => {
      logger.info('Message 1');
      logger.info('Message 2');
      logger.info('Message 3');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(3);
      expect(logs[0]).toMatchObject({
        level: 'info',
        message: 'Message 1',
      });
    });

    it('limits buffer size to 100 entries', () => {
      for (let i = 0; i < 150; i++) {
        logger.info(`Message ${i}`);
      }
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(100);
      expect(logs[0]).toMatchObject({
        message: 'Message 50', // First 50 messages should be dropped
      });
    });

    it('can clear the log buffer', () => {
      logger.info('Message 1');
      logger.info('Message 2');
      
      logger.clearLogs();
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(0);
    });
  });

  describe('Export Functionality', () => {
    it('exports logs as JSON', () => {
      logger.info('Test message', { data: 'test' });
      logger.error('Error message', new Error('Test'));
      
      const exported = logger.exportLogs();
      const parsed = JSON.parse(exported);
      
      expect(parsed).toHaveProperty('logs');
      expect(parsed).toHaveProperty('metadata');
      expect(parsed.logs).toHaveLength(2);
      expect(parsed.metadata).toHaveProperty('exportedAt');
      expect(parsed.metadata).toHaveProperty('environment');
    });
  });

  describe('Group Logging', () => {
    it('groups related logs', () => {
      logger.group('Test Group');
      logger.info('Grouped message 1');
      logger.info('Grouped message 2');
      logger.groupEnd();
      
      expect(consoleSpy.group).toHaveBeenCalledWith('Test Group');
      expect(consoleSpy.info).toHaveBeenCalledTimes(2);
      expect(consoleSpy.groupEnd).toHaveBeenCalled();
    });
  });
});