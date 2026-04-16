// =============================================================================
// Developer Portfolio Configuration
// Edit this file to customize all content across the site.
// =============================================================================

// -- Site-wide settings -------------------------------------------------------
export interface SiteConfig {
  title: string;
  description: string;
  language: string;
  author: string;
  url: string;
}

export const siteConfig: SiteConfig = {
  title: "Alex Developer | Fullstack Developer Portfolio",
  description: "Fullstack developer specializing in React, Node.js, and cloud technologies. Building scalable web applications with modern tools.",
  language: "en",
  author: "Alex Developer",
  url: "https://alexdeveloper.com",
};

// -- Navigation ---------------------------------------------------------------
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

// -- Hero Section -------------------------------------------------------------
export interface HeroConfig {
  name: string;
  title: string;
  tagline: string;
  roles: string[];
  ctaPrimary: string;
  ctaPrimaryTarget: string;
  ctaSecondary: string;
  ctaSecondaryTarget: string;
  resumeUrl: string;
  avatarUrl: string;
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export const heroConfig: HeroConfig = {
  name: "Alex Developer",
  title: "Fullstack Developer",
  tagline: "Building scalable web applications with modern technologies",
  roles: [
    "Fullstack Developer",
    "API Architect",
    "DevOps Enthusiast",
    "Open Source Contributor",
  ],
  ctaPrimary: "Get in Touch",
  ctaPrimaryTarget: "#contact",
  ctaSecondary: "View Projects",
  ctaSecondaryTarget: "#projects",
  resumeUrl: "/resume.pdf",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/alex", icon: "github" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/alex", icon: "linkedin" },
    { platform: "Twitter", url: "https://twitter.com/alex", icon: "twitter" },
    { platform: "Dribbble", url: "https://dribbble.com/alex", icon: "dribbble" },
  ],
};

// -- About Section ------------------------------------------------------------
export interface AboutConfig {
  bio: string[];
  yearsExperience: number;
  location: string;
  availability: string;
  funFacts: string[];
  profileImage: string;
  stats: {
    label: string;
    value: number;
    suffix?: string;
  }[];
}

export const aboutConfig: AboutConfig = {
  bio: [
    "I'm a passionate fullstack developer with over 8 years of experience building digital products. I specialize in creating performant, accessible, and beautiful web applications that solve real-world problems.",
    "My journey started with a curiosity for how things work on the web, which led me to dive deep into both frontend and backend technologies. Today, I work with modern stacks including React, Node.js, TypeScript, and cloud infrastructure.",
    "When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing my knowledge through blog posts and mentoring.",
  ],
  yearsExperience: 8,
  location: "San Francisco, CA",
  availability: "Available for freelance projects",
  funFacts: [
    "☕ Fueled by 3+ cups of coffee daily",
    "🌟 Contributed to 50+ open source projects",
    "🎮 Built my first game at age 14",
    "📚 Read 30+ tech books per year",
  ],
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
  stats: [
    { label: "Years Experience", value: 8, suffix: "+" },
    { label: "Projects Completed", value: 150, suffix: "+" },
    { label: "Happy Clients", value: 80, suffix: "+" },
    { label: "Cups of Coffee", value: 9999, suffix: "+" },
  ],
};

// -- Skills Section -----------------------------------------------------------
export interface Skill {
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "tools";
  icon: string;
  proficiency: number; // 1-5
}

export interface SkillsConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  skills: Skill[];
}

export const skillsConfig: SkillsConfig = {
  sectionLabel: "Expertise",
  sectionTitle: "Skills & Technologies",
  sectionDescription: "A comprehensive toolkit I've mastered over the years to build exceptional digital experiences.",
  skills: [
    // Frontend
    { name: "React", category: "frontend", icon: "react", proficiency: 5 },
    { name: "TypeScript", category: "frontend", icon: "typescript", proficiency: 5 },
    { name: "Next.js", category: "frontend", icon: "nextjs", proficiency: 5 },
    { name: "Tailwind CSS", category: "frontend", icon: "tailwind", proficiency: 5 },
    { name: "Vue.js", category: "frontend", icon: "vue", proficiency: 4 },
    // Backend
    { name: "Node.js", category: "backend", icon: "nodejs", proficiency: 5 },
    { name: "Express", category: "backend", icon: "express", proficiency: 5 },
    { name: "NestJS", category: "backend", icon: "nestjs", proficiency: 4 },
    { name: "Python", category: "backend", icon: "python", proficiency: 4 },
    { name: "GraphQL", category: "backend", icon: "graphql", proficiency: 4 },
    // Database
    { name: "PostgreSQL", category: "database", icon: "postgresql", proficiency: 5 },
    { name: "MongoDB", category: "database", icon: "mongodb", proficiency: 4 },
    { name: "Redis", category: "database", icon: "redis", proficiency: 4 },
    { name: "Prisma", category: "database", icon: "prisma", proficiency: 5 },
    // DevOps
    { name: "Docker", category: "devops", icon: "docker", proficiency: 4 },
    { name: "AWS", category: "devops", icon: "aws", proficiency: 4 },
    { name: "Kubernetes", category: "devops", icon: "kubernetes", proficiency: 3 },
    { name: "CI/CD", category: "devops", icon: "cicd", proficiency: 4 },
    // Tools
    { name: "Git", category: "tools", icon: "git", proficiency: 5 },
    { name: "Figma", category: "tools", icon: "figma", proficiency: 4 },
    { name: "VS Code", category: "tools", icon: "vscode", proficiency: 5 },
    { name: "Jest", category: "tools", icon: "jest", proficiency: 4 },
  ],
};

// -- Projects Section ---------------------------------------------------------
export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  category: "web" | "api" | "mobile" | "oss";
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
}

export interface ProjectsConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  projects: Project[];
}

export const projectsConfig: ProjectsConfig = {
  sectionLabel: "Portfolio",
  sectionTitle: "Featured Projects",
  sectionDescription: "A selection of projects that showcase my expertise in building scalable, user-centric applications.",
  projects: [
    {
      id: "ecommerce-platform",
      title: "E-Commerce Platform",
      description: "Full-featured online store with real-time inventory management and Stripe payments.",
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Redis"],
      category: "web",
      featured: true,
      liveUrl: "https://ecommerce-demo.com",
      githubUrl: "https://github.com/alex/ecommerce",
    },
    {
      id: "task-management",
      title: "Task Management App",
      description: "Collaborative project management tool with real-time updates and team analytics.",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
      category: "web",
      featured: true,
      liveUrl: "https://taskapp-demo.com",
      githubUrl: "https://github.com/alex/taskapp",
    },
    {
      id: "api-gateway",
      title: "API Gateway Service",
      description: "Microservices API gateway handling 10k+ requests per second with rate limiting.",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
      techStack: ["NestJS", "Redis", "Docker", "PostgreSQL", "JWT"],
      category: "api",
      featured: true,
      liveUrl: "https://api-docs.demo.com",
      githubUrl: "https://github.com/alex/api-gateway",
    },
    {
      id: "mobile-fitness",
      title: "Fitness Tracking App",
      description: "Cross-platform mobile fitness app with workout plans and progress tracking.",
      thumbnail: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
      techStack: ["React Native", "Firebase", "Node.js", "GraphQL"],
      category: "mobile",
      featured: false,
      liveUrl: "https://fitness-demo.com",
      githubUrl: "https://github.com/alex/fitness-app",
    },
    {
      id: "open-source-cli",
      title: "DevTools CLI",
      description: "Open source developer productivity toolkit with 5k+ GitHub stars.",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      techStack: ["TypeScript", "Node.js", "Commander.js", "Jest"],
      category: "oss",
      featured: true,
      liveUrl: "https://devtools-cli.dev",
      githubUrl: "https://github.com/alex/devtools-cli",
    },
    {
      id: "ai-dashboard",
      title: "AI Analytics Dashboard",
      description: "Real-time analytics dashboard with AI-powered insights and visualizations.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      techStack: ["React", "Python", "TensorFlow", "D3.js", "FastAPI"],
      category: "web",
      featured: false,
      liveUrl: "https://ai-dashboard.demo.com",
      githubUrl: "https://github.com/alex/ai-dashboard",
    },
  ],
};

// -- Experience Section -------------------------------------------------------
export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  location: string;
  type: "fulltime" | "contract" | "freelance";
}

export interface ExperienceConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  experiences: Experience[];
}

export const experienceConfig: ExperienceConfig = {
  sectionLabel: "Career",
  sectionTitle: "Work Experience",
  sectionDescription: "My professional journey through various roles and companies.",
  experiences: [
    {
      id: "exp-1",
      company: "TechCorp Inc.",
      role: "Senior Fullstack Developer",
      startDate: "2022-01",
      current: true,
      description: [
        "Lead development of microservices architecture serving 1M+ users",
        "Mentored team of 5 developers and established coding standards",
        "Reduced API response times by 60% through optimization",
        "Implemented CI/CD pipelines reducing deployment time by 75%",
      ],
      location: "San Francisco, CA",
      type: "fulltime",
    },
    {
      id: "exp-2",
      company: "StartupXYZ",
      role: "Fullstack Developer",
      startDate: "2020-03",
      endDate: "2021-12",
      current: false,
      description: [
        "Built MVP from scratch that secured $2M in seed funding",
        "Developed real-time collaboration features using WebSockets",
        "Implemented authentication and authorization systems",
        "Collaborated with design team to create pixel-perfect UI",
      ],
      location: "Remote",
      type: "fulltime",
    },
    {
      id: "exp-3",
      company: "Digital Agency Pro",
      role: "Frontend Developer",
      startDate: "2018-06",
      endDate: "2020-02",
      current: false,
      description: [
        "Developed 20+ client websites using React and Vue.js",
        "Optimized site performance achieving 95+ Lighthouse scores",
        "Integrated CMS solutions for content management",
        "Worked directly with clients to gather requirements",
      ],
      location: "New York, NY",
      type: "fulltime",
    },
    {
      id: "exp-4",
      company: "Freelance",
      role: "Web Developer",
      startDate: "2016-01",
      endDate: "2018-05",
      current: false,
      description: [
        "Delivered 30+ projects for clients worldwide",
        "Specialized in e-commerce and business websites",
        "Maintained 100% client satisfaction rating",
        "Managed full project lifecycle from concept to deployment",
      ],
      location: "Various",
      type: "freelance",
    },
  ],
};

// -- Testimonials Section -----------------------------------------------------
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface TestimonialsConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  testimonials: Testimonial[];
}

export const testimonialsConfig: TestimonialsConfig = {
  sectionLabel: "Testimonials",
  sectionTitle: "What Clients Say",
  sectionDescription: "Feedback from people I've had the pleasure of working with.",
  testimonials: [
    {
      id: "test-1",
      name: "Sarah Johnson",
      role: "CTO",
      company: "TechCorp Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      quote: "Alex is one of the most talented developers I've worked with. His ability to solve complex problems while maintaining clean, scalable code is remarkable. He consistently delivered beyond expectations.",
      rating: 5,
    },
    {
      id: "test-2",
      name: "Michael Chen",
      role: "Product Manager",
      company: "StartupXYZ",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote: "Working with Alex was a game-changer for our startup. He built our MVP in record time and his technical insights were invaluable. Highly recommend for any ambitious project.",
      rating: 5,
    },
    {
      id: "test-3",
      name: "Emily Rodriguez",
      role: "Design Lead",
      company: "Digital Agency Pro",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      quote: "Alex has a rare combination of technical excellence and design sensibility. He brought our designs to life with pixel-perfect precision and added delightful interactions.",
      rating: 5,
    },
  ],
};

// -- Blog Section -------------------------------------------------------------
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  slug: string;
}

export interface BlogConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  posts: BlogPost[];
}

export const blogConfig: BlogConfig = {
  sectionLabel: "Blog",
  sectionTitle: "Latest Articles",
  sectionDescription: "Thoughts, tutorials, and insights about web development and technology.",
  posts: [
    {
      id: "blog-1",
      title: "Building Scalable APIs with Node.js and TypeScript",
      excerpt: "Learn how to build production-ready APIs with proper architecture, error handling, and performance optimization techniques.",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
      tags: ["Node.js", "TypeScript", "API", "Backend"],
      publishedAt: "2024-01-15",
      readTime: 12,
      slug: "scalable-apis-nodejs-typescript",
    },
    {
      id: "blog-2",
      title: "React Performance Optimization: A Deep Dive",
      excerpt: "Master React performance with techniques like memoization, code splitting, and virtualization.",
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
      tags: ["React", "Performance", "Frontend"],
      publishedAt: "2024-02-01",
      readTime: 15,
      slug: "react-performance-optimization",
    },
    {
      id: "blog-3",
      title: "The Complete Guide to Modern CSS",
      excerpt: "Explore modern CSS features including Grid, Flexbox, Custom Properties, and Container Queries.",
      coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop",
      tags: ["CSS", "Frontend", "Design"],
      publishedAt: "2024-02-20",
      readTime: 10,
      slug: "modern-css-complete-guide",
    },
  ],
};

// -- Services Section ---------------------------------------------------------
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  highlighted: boolean;
}

export interface ServicesConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  services: Service[];
}

export const servicesConfig: ServicesConfig = {
  sectionLabel: "Services",
  sectionTitle: "What I Offer",
  sectionDescription: "Comprehensive development services tailored to your needs.",
  services: [
    {
      id: "svc-1",
      title: "Web Development",
      description: "Custom web applications built with modern technologies and best practices.",
      icon: "code",
      features: [
        "Full-stack development",
        "API design & integration",
        "Database architecture",
        "Performance optimization",
      ],
      highlighted: true,
    },
    {
      id: "svc-2",
      title: "Technical Consulting",
      description: "Expert guidance on architecture, technology choices, and best practices.",
      icon: "lightbulb",
      features: [
        "Architecture review",
        "Tech stack selection",
        "Code review & audits",
        "Performance analysis",
      ],
      highlighted: false,
    },
    {
      id: "svc-3",
      title: "DevOps & Cloud",
      description: "Streamline your deployment pipeline and cloud infrastructure.",
      icon: "cloud",
      features: [
        "CI/CD pipeline setup",
        "Cloud migration",
        "Docker & Kubernetes",
        "Infrastructure as Code",
      ],
      highlighted: false,
    },
  ],
};

// -- Contact Section ----------------------------------------------------------
export interface ContactConfig {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export const contactConfig: ContactConfig = {
  sectionLabel: "Contact",
  sectionTitle: "Let's Work Together",
  sectionDescription: "Have a project in mind? I'd love to hear about it. Send me a message and let's create something amazing.",
  email: "hello@alexdeveloper.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  availability: "Available for freelance projects",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/alex", icon: "github" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/alex", icon: "linkedin" },
    { platform: "Twitter", url: "https://twitter.com/alex", icon: "twitter" },
    { platform: "Dribbble", url: "https://dribbble.com/alex", icon: "dribbble" },
  ],
};

// -- Footer Section -----------------------------------------------------------
export interface FooterConfig {
  brandName: string;
  brandDescription: string;
  quickLinks: string[];
  copyrightText: string;
  socialLinks: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

export const footerConfig: FooterConfig = {
  brandName: "Alex Developer",
  brandDescription: "Fullstack developer building scalable web applications with modern technologies.",
  quickLinks: ["Home", "About", "Projects", "Blog", "Contact"],
  copyrightText: "© 2024 Alex Developer. All rights reserved.",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/alex", icon: "github" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/alex", icon: "linkedin" },
    { platform: "Twitter", url: "https://twitter.com/alex", icon: "twitter" },
    { platform: "Dribbble", url: "https://dribbble.com/alex", icon: "dribbble" },
  ],
};
