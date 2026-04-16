import { useEffect, useState } from 'react';
import './index.css';
import useLenis from './hooks/useLenis';
import { useHero, useAbout, useSkills, useProjects, useExperience, useTestimonials, useServices, useBlogPosts, useSocialLinks, useSettings } from './hooks/useData';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Testimonials from './sections/Testimonials';
import Services from './sections/Services';
import Blog from './sections/Blog';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';

function App() {
  useLenis();

  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: hero, isLoading: heroLoading } = useHero();
  const { data: about, isLoading: aboutLoading } = useAbout();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: experience, isLoading: experienceLoading } = useExperience();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: blogPosts, isLoading: blogLoading } = useBlogPosts({ published: true });
  const { data: socialLinks, isLoading: linksLoading } = useSocialLinks();

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (!settingsLoading && !heroLoading && !aboutLoading && !skillsLoading && 
        !projectsLoading && !experienceLoading && !testimonialsLoading && 
        !servicesLoading && !blogLoading && !linksLoading) {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [settingsLoading, heroLoading, aboutLoading, skillsLoading, projectsLoading, 
      experienceLoading, testimonialsLoading, servicesLoading, blogLoading, linksLoading]);

  useEffect(() => {
    if (settings?.siteTitle) {
      document.title = settings.siteTitle;
    }

    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }, [settings]);

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="relative w-full min-h-screen bg-void-black overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
    </main>
  );
}

export default App;