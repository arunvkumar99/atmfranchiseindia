import { useEffect, useRef } from 'react';

/**
 * Hook to add micro-animations to elements
 */
export function useAnimation(animationClass: string, threshold = 0.1) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add(animationClass);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animationClass, threshold]);

  return elementRef;
}

/**
 * Hook to add button press animation
 */
export function useButtonAnimation() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    button.classList.add('btn-press');
  }, []);

  return buttonRef;
}

/**
 * Hook to add card hover animation
 */
export function useCardAnimation() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.classList.add('card-hover');
  }, []);

  return cardRef;
}

/**
 * Hook to add input focus animation
 */
export function useInputAnimation() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.classList.add('input-focus');
  }, []);

  return inputRef;
}