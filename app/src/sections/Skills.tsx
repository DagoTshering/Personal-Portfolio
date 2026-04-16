import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Server, Database, Cloud, Wrench, Star } from 'lucide-react';
import { useSkills } from '../hooks/useData';

gsap.registerPlugin(ScrollTrigger);

type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'tools';

const categoryIcons: Record<SkillCategory, typeof Code2> = {
  frontend: Code2,
  backend: Server,
  database: Database,
  devops: Cloud,
  tools: Wrench,
};

const categoryLabels: Record<SkillCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps',
  tools: 'Tools',
};

const categoryColors: Record<SkillCategory, string> = {
  frontend: 'from-blue-500 to-cyan-500',
  backend: 'from-green-500 to-emerald-500',
  database: 'from-orange-500 to-amber-500',
  devops: 'from-purple-500 to-violet-500',
  tools: 'from-pink-500 to-rose-500',
};

interface SkillCardProps {
  name: string;
  proficiency: number;
  category: SkillCategory;
  index: number;
}

const SkillCard = ({ name, proficiency, category }: SkillCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { width: '0%' },
        {
          width: `${proficiency * 20}%`,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [proficiency]);

  return (
    <div ref={cardRef} className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[category]} flex items-center justify-center text-white text-lg`}>
            {name.charAt(0)}
          </div>
          <span className="text-white font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < proficiency ? 'text-primary fill-primary' : 'text-white/20'}`} />
          ))}
        </div>
      </div>

      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div ref={progressRef} className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${categoryColors[category]}`} style={{ width: '0%' }} />
      </div>

      <div className="mt-2 text-right text-sm text-text-muted">{proficiency * 20}% proficiency</div>
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${categoryColors[category]} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10 blur-xl`} />
    </div>
  );
};

const SkillsSkeleton = () => (
  <section id="skills" className="py-24 lg:py-32 bg-void-black">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="text-center mb-12">
        <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
        <div className="h-4 w-96 bg-white/5 rounded animate-pulse mx-auto" />
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 w-24 bg-white/5 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  </section>
);

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const hasAnimated = useRef(false);
  
  const { data: skillsData, isLoading } = useSkills();

  const categories: (SkillCategory | 'all')[] = ['all', 'frontend', 'backend', 'database', 'devops', 'tools'];

  const filteredSkills = activeCategory === 'all'
    ? skillsData || []
    : (skillsData || []).filter((skill: any) => skill.category === activeCategory);

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
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return <SkillsSkeleton />;
  }

  return (
    <section id="skills" ref={sectionRef} className="relative w-full py-24 lg:py-32 bg-void-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Expertise</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-4">Skills & <span className="text-primary">Technologies</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">A comprehensive toolkit I&apos;ve mastered over the years to build exceptional digital experiences.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => {
            const Icon = category === 'all' ? Code2 : categoryIcons[category as SkillCategory];
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category === 'all' ? 'All Skills' : categoryLabels[category as SkillCategory]}
              </button>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {filteredSkills.map((skill: any, index: number) => (
            <SkillCard
              key={skill.id}
              name={skill.name}
              proficiency={skill.proficiency}
              category={skill.category as SkillCategory}
              index={index}
            />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-text-muted">
          <span>Proficiency:</span>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-primary fill-primary" />
              ))}
            </div>
            <span>Expert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-primary fill-primary" />
              ))}
              {[...Array(2)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-white/20" />
              ))}
            </div>
            <span>Intermediate</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;