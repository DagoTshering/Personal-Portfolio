import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, Star, Code, Layers, Smartphone, Box } from 'lucide-react';
import { useProjects } from '../hooks/useData';

gsap.registerPlugin(ScrollTrigger);

type ProjectCategory = 'all' | 'web' | 'api' | 'mobile' | 'oss';

const categoryIcons: Record<string, typeof Layers> = {
  web: Layers,
  api: Code,
  mobile: Smartphone,
  oss: Box,
};

const categoryLabels: Record<string, string> = {
  all: 'All Projects',
  web: 'Web Apps',
  api: 'APIs',
  mobile: 'Mobile',
  oss: 'Open Source',
};

interface ProjectCardProps {
  project: any;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
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
  }, [index]);

  const CategoryIcon = categoryIcons[project.category] || Layers;

  return (
    <div ref={cardRef} className="group relative rounded-2xl overflow-hidden bg-surface border border-white/10 hover:border-primary/50 transition-all duration-500">
      {project.featured && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 text-white text-xs font-medium">
          <Star className="w-3.5 h-3.5 fill-current" />Featured
        </div>
      )}

      <div className="relative aspect-video overflow-hidden">
        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="w-full">
            <p className="text-text-secondary text-sm mb-4 line-clamp-2">{project.description}</p>
            <div className="flex gap-3">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="w-4 h-4" />Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Github className="w-4 h-4" />Code
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-text-muted text-xs">
            <CategoryIcon className="w-3.5 h-3.5" />
            {categoryLabels[project.category]}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">{project.title}</h3>

        <div className="flex flex-wrap gap-2">
          {project.techStack?.slice(0, 4).map((tech: string) => (
            <span key={tech} className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-text-secondary border border-white/5">{tech}</span>
          ))}
          {project.techStack?.length > 4 && (
            <span className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-text-secondary">+{project.techStack.length - 4}</span>
          )}
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-neon-cyan opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 blur-xl" />
    </div>
  );
};

const ProjectsSkeleton = () => (
  <section id="projects" className="py-24 lg:py-32 bg-void-black">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="text-center mb-12">
        <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
        <div className="h-4 w-96 bg-white/5 rounded animate-pulse mx-auto" />
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-28 bg-white/5 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <div className="aspect-video bg-white/5 animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-white/5 rounded animate-pulse" />
                <div className="h-6 w-16 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const hasAnimated = useRef(false);
  
  const { data: projectsData, isLoading } = useProjects();

  const categories: ProjectCategory[] = ['all', 'web', 'api', 'mobile', 'oss'];

  const filteredProjects = activeCategory === 'all'
    ? projectsData || []
    : (projectsData || []).filter((project: any) => project.category === activeCategory);

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
    return <ProjectsSkeleton />;
  }

  return (
    <section id="projects" ref={sectionRef} className="relative w-full py-24 lg:py-32 bg-void-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Portfolio</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-4">Featured <span className="text-primary">Projects</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">A selection of projects that showcase my expertise in building scalable, user-centric applications.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => {
            const Icon = category === 'all' ? Layers : categoryIcons[category];
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
                {categoryLabels[category]}
              </button>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredProjects.map((project: any, index: number) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="https://github.com/alex" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300">
            <Github className="w-5 h-5" />View More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;