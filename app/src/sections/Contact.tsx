import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Dribbble, Check, Loader2 } from 'lucide-react';
import { useSettings, useSocialLinks } from '../hooks/useData';
import api from '../lib/api';

gsap.registerPlugin(ScrollTrigger);

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble,
};

const ContactSkeleton = () => (
  <section id="contact" className="py-24 lg:py-32 bg-void-black">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="text-center mb-16">
        <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
        <div className="h-4 w-96 bg-white/5 rounded animate-pulse mx-auto" />
      </div>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
        <div className="p-6 rounded-2xl bg-white/5 animate-pulse">
          <div className="h-20 bg-white/5 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded" />
            ))}
          </div>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 animate-pulse">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="h-14 bg-white/5 rounded-xl" />
            <div className="h-14 bg-white/5 rounded-xl" />
          </div>
          <div className="h-14 bg-white/5 rounded-xl mb-6" />
          <div className="h-32 bg-white/5 rounded-xl mb-6" />
          <div className="h-14 bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  </section>
);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: socialLinks, isLoading: linksLoading } = useSocialLinks();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (settingsLoading || hasAnimated.current) return;
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
        infoRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
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

      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.3,
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
  }, [settingsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.sendContact(formState);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (settingsLoading) {
    return <ContactSkeleton />;
  }

  return (
    <section id="contact" ref={sectionRef} className="relative w-full py-24 lg:py-32 bg-void-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Contact</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-4">Let&apos;s Work <span className="text-primary">Together</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">Have a project in mind? I&apos;d love to hear about it. Send me a message and let&apos;s create something amazing.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
          <div ref={infoRef}>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-neon-cyan/20 border border-primary/30 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50" />
                </div>
                <span className="text-white font-medium">{settings?.availability || 'Available for freelance projects'}</span>
              </div>
              <p className="text-text-secondary text-sm">I&apos;m currently taking on new projects. Let&apos;s discuss how I can help bring your ideas to life.</p>
            </div>

            <div className="space-y-6 mb-8">
              {settings?.email && (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted mb-1">Email</div>
                    <a href={`mailto:${settings.email}`} className="text-white hover:text-primary transition-colors">{settings.email}</a>
                  </div>
                </div>
              )}

              {settings?.phone && (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-neon-cyan/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted mb-1">Phone</div>
                    <a href={`tel:${settings.phone}`} className="text-white hover:text-neon-cyan transition-colors">{settings.phone}</a>
                  </div>
                </div>
              )}

              {settings?.location && (
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-neon-blue/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-neon-blue" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted mb-1">Location</div>
                    <span className="text-white">{settings.location}</span>
                  </div>
                </div>
              )}
            </div>

            {!linksLoading && socialLinks && socialLinks.length > 0 && (
              <div>
                <div className="text-sm text-text-muted mb-4">Follow me on</div>
                <div className="flex gap-3">
                  {socialLinks.map((link: any) => {
                    const Icon = socialIcons[link.icon?.toLowerCase()];
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        aria-label={link.platform}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="p-8 rounded-3xl bg-surface border border-white/10">
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <label htmlFor="name" className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'name' || formState.name ? '-top-2.5 text-xs text-primary bg-surface px-2' : 'top-4 text-text-muted'}`}>Your Name</label>
                <input type="text" id="name" name="name" value={formState.name} onChange={handleChange} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} required className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors" />
              </div>

              <div className="relative">
                <label htmlFor="email" className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'email' || formState.email ? '-top-2.5 text-xs text-primary bg-surface px-2' : 'top-4 text-text-muted'}`}>Your Email</label>
                <input type="email" id="email" name="email" value={formState.email} onChange={handleChange} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} required className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors" />
              </div>
            </div>

            <div className="relative mb-6">
              <label htmlFor="subject" className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'subject' || formState.subject ? '-top-2.5 text-xs text-primary bg-surface px-2' : 'top-4 text-text-muted'}`}>Subject</label>
              <input type="text" id="subject" name="subject" value={formState.subject} onChange={handleChange} onFocus={() => setFocusedField('subject')} onBlur={() => setFocusedField(null)} required className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors" />
            </div>

            <div className="relative mb-6">
              <label htmlFor="message" className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'message' || formState.message ? '-top-2.5 text-xs text-primary bg-surface px-2' : 'top-4 text-text-muted'}`}>Your Message</label>
              <textarea id="message" name="message" value={formState.message} onChange={handleChange} onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)} required rows={5} className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary focus:outline-none transition-colors resize-none" />
            </div>

            <button type="submit" disabled={isSubmitting || isSubmitted} className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${isSubmitted ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-600 hover:shadow-glow'} disabled:cursor-not-allowed`}>
              {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Sending...</>) : isSubmitted ? (<><Check className="w-5 h-5" />Message Sent!</>) : (<><Send className="w-5 h-5" />Send Message</>)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;