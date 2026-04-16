import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LoadingScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate logo
      gsap.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0, rotateY: -180 },
        { scale: 1, opacity: 1, rotateY: 0, duration: 0.8, ease: 'back.out(1.7)' }
      );

      // Animate progress bar
      gsap.fromTo(
        progressRef.current,
        { width: '0%' },
        { width: '100%', duration: 1.5, ease: 'power2.inOut', delay: 0.3 }
      );

      // Pulse animation for text
      gsap.to(textRef.current, {
        opacity: 0.5,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-void-black flex flex-col items-center justify-center"
    >
      {/* Logo Animation */}
      <div
        ref={logoRef}
        className="relative mb-8"
        style={{ perspective: '1000px' }}
      >
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-neon-cyan flex items-center justify-center shadow-glow-lg">
          <span className="text-3xl font-bold text-white font-heading">A</span>
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="absolute -top-2 left-1/2 w-2 h-2 rounded-full bg-neon-cyan" />
          <div className="absolute -bottom-2 left-1/2 w-2 h-2 rounded-full bg-primary" />
          <div className="absolute top-1/2 -left-2 w-2 h-2 rounded-full bg-neon-blue" />
          <div className="absolute top-1/2 -right-2 w-2 h-2 rounded-full bg-neon-soft" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-surface-light rounded-full overflow-hidden mb-4">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-primary to-neon-cyan rounded-full"
        />
      </div>

      {/* Loading Text */}
      <div ref={textRef} className="text-text-secondary font-mono text-sm">
        Loading experience...
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default LoadingScreen;
