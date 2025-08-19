import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Provider wrapper for tests
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockFormData = (overrides?: Partial<any>) => ({
  name: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  message: 'Test message',
  ...overrides,
});

export const createMockApiResponse = <T,>(data: T, overrides?: Partial<any>) => ({
  success: true,
  data,
  statusCode: 200,
  ...overrides,
});

// Mock handlers
export const mockFetch = (response: any) => {
  const { t } = useTranslation('forms');
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => response,
    text: async () => JSON.stringify(response),
    status: 200,
  });
};

export const mockFetchError = (error: string, status = 500) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error }),
    text: async () => error,
    status,
  });
};

// Wait utilities
export const waitForLoadingToFinish = () =>
  waitFor(() => {
    const loadingElements = screen.queryAllByText(/loading/i);
    expect(loadingElements).toHaveLength(0);
  });

// Accessibility testing
export const expectNoA11yViolations = async (container: HTMLElement) => {
  // This would use axe-core in a real implementation
  // For now, just check basic accessibility attributes
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
      throw new Error('Button missing accessible label');
    }
  });

  const images = container.querySelectorAll('img');
  images.forEach(img => {
    if (!img.getAttribute('alt')) {
      throw new Error('Image missing alt text');
    }
  });

  const inputs = container.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    if (!id) return;
    const label = container.querySelector(`label[for="${id}"]`);
    if (!label && !input.getAttribute('aria-label')) {
      throw new Error('Form input missing label');
    }
  });
};

import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';