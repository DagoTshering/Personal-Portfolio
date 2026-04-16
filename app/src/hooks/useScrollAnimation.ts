import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';
  delay?: number;
  duration?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.2,
    triggerOnce = true,
    animation = 'fade-up',
    delay = 0,
    duration = 0.6,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const getAnimationConfig = () => {
      switch (animation) {
        case 'fade-up':
          return { y: 40, opacity: 0 };
        case 'fade-in':
          return { opacity: 0 };
        case 'scale-in':
          return { scale: 0.9, opacity: 0 };
        case 'slide-left':
          return { x: -60, opacity: 0 };
        case 'slide-right':
          return { x: 60, opacity: 0 };
        default:
          return { y: 40, opacity: 0 };
      }
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        getAnimationConfig(),
        {
          y: 0,
          x: 0,
          scale: 1,
          opacity: 1,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: `top ${100 - threshold * 100}%`,
            toggleActions: triggerOnce ? 'play none none none' : 'play reverse play reverse',
            onEnter: () => setIsVisible(true),
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [animation, delay, duration, threshold, triggerOnce]);

  return { ref, isVisible };
};

export const useStaggerAnimation = (
  itemCount: number,
  options: UseScrollAnimationOptions & { staggerDelay?: number } = {}
) => {
  const {
    threshold = 0.2,
    triggerOnce = true,
    animation = 'fade-up',
    delay = 0,
    duration = 0.5,
    staggerDelay = 0.1,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.children;
    if (items.length === 0) return;

    const getAnimationConfig = () => {
      switch (animation) {
        case 'fade-up':
          return { y: 30, opacity: 0 };
        case 'fade-in':
          return { opacity: 0 };
        case 'scale-in':
          return { scale: 0.9, opacity: 0 };
        case 'slide-left':
          return { x: -40, opacity: 0 };
        case 'slide-right':
          return { x: 40, opacity: 0 };
        default:
          return { y: 30, opacity: 0 };
      }
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        getAnimationConfig(),
        {
          y: 0,
          x: 0,
          scale: 1,
          opacity: 1,
          duration,
          delay,
          stagger: staggerDelay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: `top ${100 - threshold * 100}%`,
            toggleActions: triggerOnce ? 'play none none none' : 'play reverse play reverse',
            onEnter: () => setIsVisible(true),
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [animation, delay, duration, itemCount, staggerDelay, threshold, triggerOnce]);

  return { ref: containerRef, isVisible };
};

export const useCountUp = (
  end: number,
  duration: number = 2,
  startOnView: boolean = true
) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (startOnView) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasStarted) {
              setHasStarted(true);
              
              const startTime = Date.now();
              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / (duration * 1000), 1);
                
                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentCount = Math.floor(easeOut * end);
                
                setCount(currentCount);
                
                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  setCount(end);
                }
              };
              
              requestAnimationFrame(animate);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    } else {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * end);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [end, duration, startOnView, hasStarted]);

  return { ref, count };
};

export default useScrollAnimation;
