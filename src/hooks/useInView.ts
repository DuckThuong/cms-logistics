import { useEffect, useRef, useState } from 'react';

type UseInViewOptions = IntersectionObserverInit;

export const useInView = (options: UseInViewOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const { threshold = 0.12, root, rootMargin } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin]);

  return { ref, inView };
};

export const animateClass = (effect: string, inView: boolean, delay?: number) =>
  [
    'hk-animate',
    `hk-animate--${effect}`,
    inView && 'hk-animate--visible',
    delay !== undefined && `hk-animate--delay-${delay}`,
  ]
    .filter(Boolean)
    .join(' ');
