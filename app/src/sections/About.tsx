import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Briefcase, Coffee, Code } from 'lucide-react';
import { useAbout } from '../hooks/useData';
import { useCountUp } from '../hooks/useScrollAnimation';

gsap.registerPlugin(ScrollTrigger);

const StatItem = ({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) => {
  const { ref, count } = useCountUp(value, 2);

  return (
    <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 group">
      <div className="text-3xl sm:text-4xl font-bold text-white font-heading mb-2 group-hover:text-primary transition-colors">
        <span ref={ref}>{count}</span>
        {suffix}
      </div>
      <div className="text-sm text-text-secondary">{label}</div>
    </div>
  );
};

const AboutSkeleton = () => (
  <section id="about" className="py-24 lg:py-32 bg-void-black">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="text-center mb-16">
        <div className="h-8 w-32 bg-white/5 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-12 w-64 bg-white/5 rounded-lg animate-pulse mx-auto" />
      </div>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-80 bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  </section>
);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  const { data: about, isLoading } = useAbout();

  useEffect(() => {
    if (isLoading || hasAnimated.current) return;
    hasAnimated.current = true;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 50, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading || !about) {
    return <AboutSkeleton />;
  }

  const bioParagraphs = about.bio?.split('\n\n') || [];

  return (
    <section id="about" ref={sectionRef} className="relative w-full py-24 lg:py-32 bg-void-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">About Me</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading">Know Who <span className="text-primary">I Am</span></h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          <div ref={contentRef}>
            <div className="space-y-4 mb-8">
              {bioParagraphs.map((paragraph: string, index: number) => (
                <p key={index} className="text-text-secondary leading-relaxed">{paragraph}</p>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-text-muted">Location</div>
                  <div className="text-white font-medium">{about.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <div className="text-sm text-text-muted">Availability</div>
                  <div className="text-white font-medium">{about.availability}</div>
                </div>
              </div>
            </div>

            {about.funFacts?.length > 0 && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-neon-cyan/10 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-primary" />Fun Facts
                </h3>
                <ul className="space-y-2">
                  {about.funFacts.map((fact: string, index: number) => (
                    <li key={index} className="flex items-center gap-3 text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />{fact}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div ref={imageRef} className="relative">
            <div className="relative rounded-3xl">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-neon-cyan opacity-30 blur-2xl" />
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/10">
                <img src={about.profileImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face'} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-void-black/60 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-4 right-4 sm:-bottom-6 sm:-right-6 p-4 rounded-2xl bg-surface border border-white/10 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{about.yearsExperience}+</div>
                    <div className="text-sm text-text-secondary">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-neon-cyan/20 blur-xl" />
          </div>
        </div>

        {about.stats?.length > 0 && (
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-5xl mx-auto">
            {about.stats.map((stat: any, index: number) => (
              <StatItem key={index} label={stat.label} value={stat.value} suffix={stat.suffix} />
            ))}
          </div>
        )}

        <div className="mt-20 max-w-3xl mx-auto text-center">
          <blockquote className="relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-8xl text-primary/20 font-serif">"</div>
            <p className="text-xl sm:text-2xl text-white font-heading italic mb-4">Code is like humor. When you have to explain it, it&apos;s bad.</p>
            <footer className="text-text-secondary">— Cory House, Software Developer</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default About;