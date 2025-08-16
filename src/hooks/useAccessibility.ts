import { useEffect } from 'react';

export function useAccessibility() {
  useEffect(() => {
    // Add alt text to images without it
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('logo')) {
        img.setAttribute('alt', 'Company logo');
      } else if (src.includes('map')) {
        img.setAttribute('alt', 'Location map');
      } else if (src.includes('hero')) {
        img.setAttribute('alt', 'Hero banner image');
      } else {
        img.setAttribute('alt', 'Image');
      }
    });

    // Add ARIA labels to buttons without them
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach((button) => {
      const text = button.textContent?.trim();
      if (text && !button.querySelector('span[class*="sr-only"]')) {
        button.setAttribute('aria-label', text);
      }
    });

    // Add ARIA labels to form inputs
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach((input) => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && !input.getAttribute('aria-labelledby')) {
        input.setAttribute('aria-labelledby', input.id + '-label');
        label.id = input.id + '-label';
      }
    });

    // Ensure focus indicators are visible
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach((element) => {
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    });
  }, []);
}