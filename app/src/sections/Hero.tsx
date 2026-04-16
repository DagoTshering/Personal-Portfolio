import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, Github, Linkedin, Twitter, Dribbble } from 'lucide-react';
import { useHero, useSocialLinks } from '../hooks/useData';

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble,
};

const HeroSkeleton = () => (
  <section id="hero" className="min-h-screen flex items-center justify-center bg-void-black">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 pt-20">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
        <div className="text-center lg:text-left space-y-6">
          <div className="h-10 w-48 bg-white/5 rounded-full animate-pulse mx-auto lg:mx-0" />
          <div className="h-16 w-full max-w-md bg-white/5 rounded-lg animate-pulse mx-auto lg:mx-0" />
          <div className="h-10 w-80 bg-white/5 rounded-lg animate-pulse mx-auto lg:mx-0" />
          <div className="h-24 w-full max-w-xl bg-white/5 rounded-lg animate-pulse mx-auto lg:mx-0" />
          <div className="flex gap-4 justify-center lg:justify-start">
            <div className="h-14 w-40 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-14 w-40 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  </section>
);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const hasAnimated = useRef(false);

  const { data: hero, isLoading: heroLoading } = useHero();
  const { data: socialLinks, isLoading: linksLoading } = useSocialLinks();

  const particles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      left: `${10 + (i * 7) % 80}%`,
      top: `${10 + (i * 13) % 75}%`,
      delay: `${(i * 0.4) % 5}s`,
      duration: `${4 + (i * 0.3) % 4}s`,
    })), []
  );

  useEffect(() => {
    if (!hero?.roles?.length) return;
    
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % hero.roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [hero?.roles]);

  useEffect(() => {
    if (heroLoading || hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, skewX: -10 },
        { opacity: 1, y: 0, skewX: 0, duration: 1, ease: 'power4.out' }
      );

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );

      tl.fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        '-=0.4'
      );

      tl.fromTo(
        avatarRef.current,
        { opacity: 0, scale: 0.8, rotateY: -30 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1, ease: 'back.out(1.7)' },
        '-=0.8'
      );

      tl.fromTo(
        orbitRef.current?.children || [],
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' },
        '-=0.5'
      );

      gsap.to(avatarRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [heroLoading]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (heroLoading || !hero) {
    return <HeroSkeleton />;
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-void-black"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-cyan/15 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-neon-cyan/40 rounded-full animate-float will-change-transform"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-text-secondary">Available for freelance</span>
            </div>

            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-heading leading-tight mb-4"
            >
              Hi, I&apos;m{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-neon-cyan to-primary bg-clip-text text-transparent bg-[length:200%] animate-gradient-shift">
                  {hero.name?.split(' ')[0] || 'Alex'}
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" className="animate-draw-line" style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }} />
                  <defs><linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#6C47FF" /><stop offset="1" stopColor="#00D4FF" /></linearGradient></defs>
                </svg>
              </span>
            </h1>

            {hero.roles?.length > 0 && (
              <div className="h-10 mb-6">
                <p className="text-xl sm:text-2xl text-neon-cyan font-mono">
                  <span className="text-text-secondary">{'< '}</span>
                  {hero.roles[currentRoleIndex]}
                  <span className="text-text-secondary">{' />'}</span>
                  <span className="animate-blink ml-1">|</span>
                </p>
              </div>
            )}

            <p ref={subtitleRef} className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 mb-8">
              {hero.tagline}
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <button
                onClick={() => scrollToSection(hero.ctaPrimaryTarget || '#contact')}
                className="group relative px-8 py-4 bg-primary text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:shadow-glow-lg hover:scale-105"
              >
                <span className="relative z-10">{hero.ctaPrimary || 'Get in Touch'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                onClick={() => scrollToSection(hero.ctaSecondaryTarget || '#projects')}
                className="px-8 py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                {hero.ctaSecondary || 'View Projects'}
              </button>
            </div>

            {!linksLoading && socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-4 justify-center lg:justify-start">
                {socialLinks.map((link: any) => {
                  const Icon = socialIcons[link.icon?.toLowerCase()];
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
                      aria-label={link.platform}
                    >
                      {Icon && <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <div ref={orbitRef} className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] rounded-full border border-white/5 animate-spin-slow">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-lg bg-surface border border-primary/50 flex items-center justify-center shadow-glow">
                  <span className="text-xs">⚛️</span>
                </div>
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-lg bg-surface border border-neon-cyan/50 flex items-center justify-center shadow-glow-cyan">
                  <span className="text-xs">▲</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-lg bg-surface border border-neon-blue/50 flex items-center justify-center">
                  <span className="text-xs">●</span>
                </div>
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-lg bg-surface border border-neon-soft/50 flex items-center justify-center">
                  <span className="text-xs">◆</span>
                </div>
              </div>
              <div className="absolute w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] rounded-full border border-white/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }}>
                <div className="absolute -top-3 left-1/3 w-6 h-6 rounded-full bg-primary/30" />
                <div className="absolute -bottom-3 right-1/3 w-6 h-6 rounded-full bg-neon-cyan/30" />
              </div>
            </div>

            <div ref={avatarRef} className="relative z-10" style={{ perspective: '1000px' }}>
              <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-neon-cyan opacity-50 blur-2xl animate-pulse" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                  <img
                    src={hero.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -inset-4 rounded-full border-2 border-dashed border-white/10 animate-spin-slow" style={{ animationDuration: '20s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-sm text-text-muted">Scroll to explore</span>
        <button
          onClick={() => scrollToSection('#about')}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-text-secondary hover:text-white hover:border-primary transition-all duration-300 animate-bounce-subtle"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default Hero;