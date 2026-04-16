import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Lightbulb, Cloud, Check, ArrowRight } from 'lucide-react';
import { useServices } from '../hooks/useData';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, typeof Code> = {
  code: Code,
  lightbulb: Lightbulb,
  cloud: Cloud,
};

interface ServiceCardProps {
  service: any;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const Icon = iconMap[service.icon] || Code;

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
          delay: index * 0.15,
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

  return (
    <div ref={cardRef} className={`group relative p-8 rounded-3xl transition-all duration-500 ${service.highlighted ? 'bg-gradient-to-br from-primary/20 to-neon-cyan/20 border-2 border-primary/50' : 'bg-surface border border-white/10 hover:border-primary/30'}`}>
      {service.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-sm font-medium">Most Popular</div>
      )}

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${service.highlighted ? 'bg-primary text-white' : 'bg-white/10 text-primary group-hover:bg-primary group-hover:text-white'} transition-all duration-300`}>
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
      <p className="text-text-secondary mb-6">{service.description}</p>

      <ul className="space-y-3 mb-8">
        {service.features?.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-text-secondary">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${service.highlighted ? 'bg-primary/20' : 'bg-white/10'}`}>
              <Check className={`w-3 h-3 ${service.highlighted ? 'text-primary' : 'text-neon-cyan'}`} />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }} className={`inline-flex items-center gap-2 font-medium transition-all duration-300 ${service.highlighted ? 'text-primary hover:text-neon-cyan' : 'text-white hover:text-primary'}`}>
        Get Started
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </a>

      {service.highlighted && <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl -z-10" />}
    </div>
  );
};

const ServicesSkeleton = () => (
  <section id="services" className="py-24 lg:py-32 bg-void-black">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="text-center mb-16">
        <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
        <div className="h-4 w-96 bg-white/5 rounded animate-pulse mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-8 rounded-3xl bg-white/5 animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-white/5 mb-6" />
            <div className="h-8 w-3/4 bg-white/5 rounded animate-pulse mb-4" />
            <div className="h-4 w-full bg-white/5 rounded animate-pulse mb-2" />
            <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse mb-6" />
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-4 w-full bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  const { data: servicesData, isLoading } = useServices();

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
    return <ServicesSkeleton />;
  }

  return (
    <section id="services" ref={sectionRef} className="relative w-full py-24 lg:py-32 bg-void-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Services</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-4">What I <span className="text-primary">Offer</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">Comprehensive development services tailored to your needs.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(servicesData || []).map((service: any, index: number) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;