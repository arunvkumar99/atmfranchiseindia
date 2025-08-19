import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTranslation } from 'react-i18next';
import { render, screen, fireEvent, waitFor } from '@/test/utils';
import { UnifiedForm, formConfigs } from './UnifiedForm';
import userEvent from '@testing-library/user-event';

describe('UnifiedForm', () => {
  const mockOnSubmitSuccess = vi.fn();
  const mockOnSubmitError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch for form submission
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  describe('Rendering', () => {
    it('renders all form fields correctly', () => {
      render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('renders select fields with options', () => {
      render(
        <UnifiedForm
          {...formConfigs.franchise}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      const stateSelect = screen.getByRole('combobox', { name: /state/i });
      expect(stateSelect).toBeInTheDocument();
    });

    it('marks required fields with asterisk', () => {
      render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      const requiredLabels = screen.getAllByText('*');
      expect(requiredLabels.length).toBeGreaterThan(0);
    });
  });

  describe('Validation', () => {
    it('shows validation errors for empty required fields', async () => {
      render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/required/i)).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('validates phone number format', async () => {
      render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      const phoneInput = screen.getByLabelText(/phone number/i);
      await userEvent.type(phoneInput, '123'); // Invalid phone

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/invalid phone/i)).toBeInTheDocument();
      });
    });
  });

  describe('Submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      
      render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      // Fill form with valid data
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '9876543210');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'Test message content');

      // Submit form
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockOnSubmitSuccess).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            subject: 'Test Subject',
            message: 'Test message content',
          })
        );
      });
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      
      // Mock slow fetch
      global.fetch = vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true }),
        }), 100))
      );

      render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      // Fill minimum required fields
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '9876543210');
      await user.type(screen.getByLabelText(/subject/i), 'Test');
      await user.type(screen.getByLabelText(/message/i), 'Test');

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Check for loading state
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
      
      // Wait for submission to complete
      await waitFor(() => {
        expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument();
      });
    });

    it('handles submission errors', async () => {
      const user = userEvent.setup();
      
      // Mock fetch error
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitError={mockOnSubmitError}
        />
      );

      // Fill form
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '9876543210');
      await user.type(screen.getByLabelText(/subject/i), 'Test');
      await user.type(screen.getByLabelText(/message/i), 'Test');

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockOnSubmitError).toHaveBeenCalledWith(
          expect.any(Error)
        );
      });
    });
  });

  describe('Rate Limiting', () => {
    it('prevents rapid submissions', async () => {
      const user = userEvent.setup();
      
      render(
        <UnifiedForm
          {...formConfigs.contact}
          rateLimit={{ maxAttempts: 1, windowMs: 60000 }}
          onSubmitError={mockOnSubmitError}
        />
      );

      // Fill form
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '9876543210');
      await user.type(screen.getByLabelText(/subject/i), 'Test');
      await user.type(screen.getByLabelText(/message/i), 'Test');

      // First submission
      await user.click(screen.getByRole('button', { name: /submit/i }));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      // Try second submission
      await user.click(screen.getByRole('button', { name: /submit/i }));
      
      await waitFor(() => {
        expect(mockOnSubmitError).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('has accessible form labels', () => {
      const { container } = render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      const inputs = container.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        const id = input.getAttribute('id');
        if (id) {
          const label = container.querySelector(`label[for="${id}"]`);
          expect(label).toBeInTheDocument();
        }
      });
    });

    it('supports keyboard navigation', async () => {
      render(
        <UnifiedForm
          {...formConfigs.contact}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      );

      const firstInput = screen.getByLabelText(/full name/i);
      firstInput.focus();
      expect(document.activeElement).toBe(firstInput);

      // Tab to next field
      fireEvent.keyDown(firstInput, { key: 'Tab' });
    });
  });
});