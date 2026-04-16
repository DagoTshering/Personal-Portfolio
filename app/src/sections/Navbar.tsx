import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Menu, X, Download } from 'lucide-react';
import { navItems } from '../config';
import { useSettings, useHero } from '../hooks/useData';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const { data: settings } = useSettings();
  const { data: hero } = useHero();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navItems.map((item) => item.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      '.navbar',
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 2.2, ease: 'power3.out' }
    );
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const siteName = settings?.siteName || hero?.name || 'Alex Developer';
  const resumeUrl = hero?.resumeUrl;

  return (
    <>
      <nav className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-void-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-neon-cyan flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <span className="text-lg font-bold text-white font-heading">{siteName.charAt(0)}</span>
              </div>
              <span className="hidden sm:block text-white font-heading font-semibold text-lg">{siteName.split(' ')[0]}</span>
            </a>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${activeSection === item.href.replace('#', '') ? 'text-white' : 'text-text-secondary hover:text-white'}`}
                >
                  {activeSection === item.href.replace('#', '') && <span className="absolute inset-0 bg-white/10 rounded-lg" />}
                  <span className="relative">{item.label}</span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {resumeUrl && (
                <a href={resumeUrl} download className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300">
                  <Download className="w-4 h-4" />Resume
                </a>
              )}
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 transition-all duration-300 hover:shadow-glow">
                Hire Me
              </a>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Toggle menu">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-void-black/95 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-20 left-4 right-4 bg-surface rounded-2xl border border-white/10 p-6 transition-all duration-500 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                className={`px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${activeSection === item.href.replace('#', '') ? 'bg-primary/20 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-3">
            {resumeUrl && (
              <a href={resumeUrl} download className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300">
                <Download className="w-4 h-4" />Download Resume
              </a>
            )}
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-600 transition-all duration-300">
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
