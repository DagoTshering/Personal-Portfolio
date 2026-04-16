import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, MapPin, Calendar, Building2 } from 'lucide-react';
import { useExperience } from '../hooks/useData';

gsap.registerPlugin(ScrollTrigger);

const ExperienceSkeleton = () => (
  <section id="experience" className="py-24 lg:py-32 bg-void-black">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="text-center mb-16">
        <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
        <div className="h-4 w-96 bg-white/5 rounded animate-pulse mx-auto" />
      </div>
      <div className="relative max-w-4xl mx-auto space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-8">
            <div className="w-4 h-4 rounded-full bg-white/5 animate-pulse" />
            <div className="flex-1 p-6 rounded-2xl bg-white/5 animate-pulse">
              <div className="h-6 w-32 bg-white/5 rounded animate-pulse mb-4" />
              <div className="h-4 w-48 bg-white/5 rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
            </div>
            <div className="hidden md:block w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  const { data: experienceData, isLoading } = useExperience();

  useEffect(() => {
    if (isLoading || hasAnimated.current) return;
    hasAnimated.current = true;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      const items = timelineRef.current?.querySelectorAll('.experience-item');
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 70%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return <ExperienceSkeleton />;
  }

  return (
    <section id="experience" ref={sectionRef} className="relative w-full py-24 lg:py-32 bg-void-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Career</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-4">Work <span className="text-primary">Experience</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">My professional journey through various roles and companies.</p>
        </div>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10">
            <div ref={lineRef} className="absolute inset-x-0 top-0 bg-gradient-to-b from-primary via-neon-cyan to-primary origin-top" style={{ height: '100%' }} />
          </div>

          <div className="space-y-12">
            {(experienceData || []).map((exp: any, index: number) => (
              <div key={exp.id} className={`experience-item relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                  <div className={`w-4 h-4 rounded-full border-4 border-void-black ${exp.current ? 'bg-primary animate-pulse-glow' : 'bg-neon-cyan'}`} />
                  {exp.current && <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />}
                </div>

                <div className={`pl-12 md:pl-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="p-6 rounded-2xl bg-surface border border-white/10 hover:border-primary/30 transition-all duration-300 group">
                    {exp.current && (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-4 ${index % 2 === 0 ? 'md:ml-auto' : ''}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />Current
                      </div>
                    )}

                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                        <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">{exp.role}</h3>
                        <p className="text-text-secondary">{exp.company}</p>
                      </div>
                    </div>

                    <div className={`flex flex-wrap gap-4 mb-4 text-sm text-text-muted ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        <span className="capitalize">{exp.type}</span>
                      </div>
                    </div>

                    <ul className={`space-y-2 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {exp.description?.map((item: string, i: number) => (
                        <li key={i} className={`flex items-start gap-2 text-text-secondary text-sm ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-1.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;