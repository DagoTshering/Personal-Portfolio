import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTestimonials } from '../hooks/useData';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSkeleton = () => (
  <section id="testimonials" className="py-24 lg:py-32 bg-void-black">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="text-center mb-16">
        <div className="h-6 w-32 bg-white/5 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
        <div className="h-4 w-96 bg-white/5 rounded animate-pulse mx-auto" />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/5 animate-pulse">
          <div className="flex gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-white/5" />
            ))}
          </div>
          <div className="h-8 w-full bg-white/5 rounded animate-pulse mb-4" />
          <div className="h-8 w-3/4 bg-white/5 rounded animate-pulse mb-8" />
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/5 animate-pulse" />
            <div>
              <div className="h-4 w-32 bg-white/5 rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const hasAnimated = useRef(false);

  const { data: testimonialsData, isLoading } = useTestimonials();
  const testimonials = testimonialsData || [];

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
        carouselRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
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

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % testimonials.length);
  };

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" ref={sectionRef} className="relative w-full py-24 lg:py-32 bg-void-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-4">What Clients <span className="text-primary">Say</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">Feedback from people I&apos;ve had the pleasure of working with.</p>
        </div>

        <div ref={carouselRef} className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {testimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="relative p-8 sm:p-12 rounded-3xl bg-surface border border-white/10">
                    <div className="absolute -top-6 left-8 w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                      <Quote className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/20'}`} />
                      ))}
                    </div>

                    <blockquote className="text-lg sm:text-xl text-white leading-relaxed mb-8">"{testimonial.quote}"</blockquote>

                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/50">
                          <img src={testimonial.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'} alt={testimonial.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-primary/30 blur-md -z-10" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-text-secondary">{testimonial.role} at {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={goToPrev} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300" aria-label="Previous testimonial">
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-primary w-8' : 'bg-white/20 hover:bg-white/40'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button onClick={goToNext} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300" aria-label="Next testimonial">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;