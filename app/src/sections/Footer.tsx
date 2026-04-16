import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, Heart, Github, Linkedin, Twitter, Dribbble } from 'lucide-react';
import { useSettings, useSocialLinks } from '../hooks/useData';
import { navItems } from '../config';

gsap.registerPlugin(ScrollTrigger);

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble,
};

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  const { data: settings } = useSettings();
  const { data: socialLinks, isLoading: linksLoading } = useSocialLinks();

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const siteName = settings?.siteName || 'Alex Developer';

  return (
    <footer ref={footerRef} className="relative w-full bg-void-black border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[80px]" />
      </div>

      <div ref={contentRef} className="relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-neon-cyan flex items-center justify-center">
                  <span className="text-xl font-bold text-white font-heading">{siteName.charAt(0)}</span>
                </div>
                <span className="text-xl font-semibold text-white font-heading">{siteName.split(' ')[0]}</span>
              </div>
              <p className="text-text-secondary mb-6 max-w-xs">{settings?.siteDescription || 'Fullstack developer building scalable web applications with modern technologies.'}</p>
              
              {!linksLoading && socialLinks && socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((link: any) => {
                    const Icon = socialIcons[link.icon?.toLowerCase()];
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        aria-label={link.platform}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {navItems.slice(0, 5).map((item) => (
                  <li key={item.href}>
                    <a href={item.href} onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }} className="text-text-secondary hover:text-primary transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                <li><span className="text-text-secondary">Web Development</span></li>
                <li><span className="text-text-secondary">API Development</span></li>
                <li><span className="text-text-secondary">Technical Consulting</span></li>
                <li><span className="text-text-secondary">DevOps & Cloud</span></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6">Get in Touch</h3>
              <ul className="space-y-3">
                {settings?.email && (
                  <li><a href={`mailto:${settings.email}`} className="text-text-secondary hover:text-primary transition-colors">{settings.email}</a></li>
                )}
                {settings?.location && (
                  <li><span className="text-text-secondary">{settings.location}</span></li>
                )}
                {settings?.phone && (
                  <li><span className="text-text-secondary">{settings.phone}</span></li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
            <p className="text-text-muted text-sm flex items-center gap-1">
              © {new Date().getFullYear()} {siteName}. Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using React & Node.js
            </p>

            <button onClick={scrollToTop} className="group flex items-center gap-2 text-text-muted hover:text-white transition-colors">
              <span className="text-sm">Back to top</span>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;