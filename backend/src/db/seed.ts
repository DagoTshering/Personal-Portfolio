import { db } from './index.js';
import { 
  hero, 
  about, 
  skills, 
  projects, 
  experience, 
  testimonials, 
  blogPosts, 
  services, 
  socialLinks, 
  siteSettings,
  adminUsers 
} from './schema.js';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // Clear existing data (optional - remove in production)
    await db.delete(contactMessages).catch(() => {});
    await db.delete(adminUsers).catch(() => {});
    await db.delete(socialLinks).catch(() => {});
    await db.delete(blogPosts).catch(() => {});
    await db.delete(testimonials).catch(() => {});
    await db.delete(services).catch(() => {});
    await db.delete(experience).catch(() => {});
    await db.delete(projects).catch(() => {});
    await db.delete(skills).catch(() => {});
    await db.delete(about).catch(() => {});
    await db.delete(hero).catch(() => {});
    await db.delete(siteSettings).catch(() => {});

    // Seed Admin User
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(adminUsers).values({
      email: 'admin@portfolio.com',
      password: hashedPassword,
      name: 'Admin User',
      isActive: true,
    });

    // Seed Site Settings
    console.log('⚙️ Creating site settings...');
    await db.insert(siteSettings).values({
      siteName: 'Alex Developer',
      siteTitle: 'Alex Developer | Fullstack Developer Portfolio',
      siteDescription: 'Fullstack developer specializing in React, Node.js, and cloud technologies. Building scalable web applications with modern tools.',
      email: 'hello@alexdeveloper.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      availability: 'Available for freelance projects',
    });

    // Seed Hero
    console.log('🦸 Creating hero section...');
    await db.insert(hero).values({
      name: 'Alex Developer',
      title: 'Fullstack Developer',
      tagline: 'Building scalable web applications with modern technologies',
      roles: ['Fullstack Developer', 'API Architect', 'DevOps Enthusiast', 'Open Source Contributor'],
      ctaPrimary: 'Get in Touch',
      ctaPrimaryTarget: '#contact',
      ctaSecondary: 'View Projects',
      ctaSecondaryTarget: '#projects',
      resumeUrl: '/resume.pdf',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      isVisible: true,
    });

    // Seed About
    console.log('👤 Creating about section...');
    await db.insert(about).values({
      bio: `I'm a passionate fullstack developer with over 8 years of experience building digital products. I specialize in creating performant, accessible, and beautiful web applications that solve real-world problems.

My journey started with a curiosity for how things work on the web, which led me to dive deep into both frontend and backend technologies. Today, I work with modern stacks including React, Node.js, TypeScript, and cloud infrastructure.

When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing my knowledge through blog posts and mentoring.`,
      yearsExperience: 8,
      location: 'San Francisco, CA',
      availability: 'Available for freelance projects',
      funFacts: [
        '☕ Fueled by 3+ cups of coffee daily',
        '🌟 Contributed to 50+ open source projects',
        '🎮 Built my first game at age 14',
        '📚 Read 30+ tech books per year',
      ],
      profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face',
      stats: [
        { label: 'Years Experience', value: 8, suffix: '+' },
        { label: 'Projects Completed', value: 150, suffix: '+' },
        { label: 'Happy Clients', value: 80, suffix: '+' },
        { label: 'Cups of Coffee', value: 9999, suffix: '+' },
      ],
    });

    // Seed Skills
    console.log('🛠️ Creating skills...');
    const skillsData = [
      { name: 'React', category: 'frontend' as const, icon: 'code', proficiency: 5, order: 1 },
      { name: 'TypeScript', category: 'frontend' as const, icon: 'code', proficiency: 5, order: 2 },
      { name: 'Next.js', category: 'frontend' as const, icon: 'code', proficiency: 5, order: 3 },
      { name: 'Tailwind CSS', category: 'frontend' as const, icon: 'code', proficiency: 5, order: 4 },
      { name: 'Vue.js', category: 'frontend' as const, icon: 'code', proficiency: 4, order: 5 },
      { name: 'Node.js', category: 'backend' as const, icon: 'server', proficiency: 5, order: 6 },
      { name: 'Express', category: 'backend' as const, icon: 'server', proficiency: 5, order: 7 },
      { name: 'NestJS', category: 'backend' as const, icon: 'server', proficiency: 4, order: 8 },
      { name: 'Python', category: 'backend' as const, icon: 'server', proficiency: 4, order: 9 },
      { name: 'GraphQL', category: 'backend' as const, icon: 'server', proficiency: 4, order: 10 },
      { name: 'PostgreSQL', category: 'database' as const, icon: 'database', proficiency: 5, order: 11 },
      { name: 'MongoDB', category: 'database' as const, icon: 'database', proficiency: 4, order: 12 },
      { name: 'Redis', category: 'database' as const, icon: 'database', proficiency: 4, order: 13 },
      { name: 'Docker', category: 'devops' as const, icon: 'cloud', proficiency: 4, order: 14 },
      { name: 'AWS', category: 'devops' as const, icon: 'cloud', proficiency: 4, order: 15 },
      { name: 'Git', category: 'tools' as const, icon: 'wrench', proficiency: 5, order: 16 },
      { name: 'Figma', category: 'tools' as const, icon: 'wrench', proficiency: 4, order: 17 },
    ];
    await db.insert(skills).values(skillsData);

    // Seed Projects
    console.log('📁 Creating projects...');
    const projectsData = [
      {
        title: 'E-Commerce Platform',
        slug: 'ecommerce-platform',
        description: 'Full-featured online store with real-time inventory management and Stripe payments.',
        longDescription: 'A comprehensive e-commerce solution built with Next.js, featuring real-time inventory management, Stripe payments, and a custom admin dashboard.',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'],
        techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Redis'],
        category: 'web' as const,
        featured: true,
        order: 1,
        liveUrl: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/alex/ecommerce',
      },
      {
        title: 'Task Management App',
        slug: 'task-management',
        description: 'Collaborative project management tool with real-time updates and team analytics.',
        longDescription: 'A Trello-like task management application with real-time collaboration, drag-and-drop interfaces, and team analytics.',
        thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
        images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'],
        techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
        category: 'web' as const,
        featured: true,
        order: 2,
        liveUrl: 'https://taskapp-demo.com',
        githubUrl: 'https://github.com/alex/taskapp',
      },
      {
        title: 'API Gateway Service',
        slug: 'api-gateway',
        description: 'Microservices API gateway handling 10k+ requests per second with rate limiting.',
        longDescription: 'A high-performance API gateway built with NestJS, featuring rate limiting, request caching, authentication middleware, and comprehensive logging.',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
        images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop'],
        techStack: ['NestJS', 'Redis', 'Docker', 'PostgreSQL', 'JWT'],
        category: 'api' as const,
        featured: true,
        order: 3,
        liveUrl: 'https://api-docs.demo.com',
        githubUrl: 'https://github.com/alex/api-gateway',
      },
      {
        title: 'DevTools CLI',
        slug: 'devtools-cli',
        description: 'Open source developer productivity toolkit with 5k+ GitHub stars.',
        longDescription: 'A command-line tool for automating common development tasks. Includes project scaffolding, code generation, deployment automation, and utility functions.',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'],
        techStack: ['TypeScript', 'Node.js', 'Commander.js', 'Jest'],
        category: 'oss' as const,
        featured: true,
        order: 4,
        liveUrl: 'https://devtools-cli.dev',
        githubUrl: 'https://github.com/alex/devtools-cli',
      },
    ];
    await db.insert(projects).values(projectsData);

    // Seed Experience
    console.log('💼 Creating experience entries...');
    const experienceData = [
      {
        company: 'TechCorp Inc.',
        role: 'Senior Fullstack Developer',
        startDate: '2022-01',
        endDate: null,
        current: true,
        description: [
          'Lead development of microservices architecture serving 1M+ users',
          'Mentored team of 5 developers and established coding standards',
          'Reduced API response times by 60% through optimization',
          'Implemented CI/CD pipelines reducing deployment time by 75%',
        ],
        location: 'San Francisco, CA',
        type: 'fulltime' as const,
        order: 1,
      },
      {
        company: 'StartupXYZ',
        role: 'Fullstack Developer',
        startDate: '2020-03',
        endDate: '2021-12',
        current: false,
        description: [
          'Built MVP from scratch that secured $2M in seed funding',
          'Developed real-time collaboration features using WebSockets',
          'Implemented authentication and authorization systems',
          'Collaborated with design team to create pixel-perfect UI',
        ],
        location: 'Remote',
        type: 'fulltime' as const,
        order: 2,
      },
      {
        company: 'Digital Agency Pro',
        role: 'Frontend Developer',
        startDate: '2018-06',
        endDate: '2020-02',
        current: false,
        description: [
          'Developed 20+ client websites using React and Vue.js',
          'Optimized site performance achieving 95+ Lighthouse scores',
          'Integrated CMS solutions for content management',
          'Worked directly with clients to gather requirements',
        ],
        location: 'New York, NY',
        type: 'fulltime' as const,
        order: 3,
      },
    ];
    await db.insert(experience).values(experienceData);

    // Seed Testimonials
    console.log('💬 Creating testimonials...');
    const testimonialsData = [
      {
        name: 'Sarah Johnson',
        role: 'CTO',
        company: 'TechCorp Inc.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        quote: 'Alex is one of the most talented developers I\'ve worked with. His ability to solve complex problems while maintaining clean, scalable code is remarkable.',
        rating: 5,
        order: 1,
      },
      {
        name: 'Michael Chen',
        role: 'Product Manager',
        company: 'StartupXYZ',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        quote: 'Working with Alex was a game-changer for our startup. He built our MVP in record time and his technical insights were invaluable.',
        rating: 5,
        order: 2,
      },
      {
        name: 'Emily Rodriguez',
        role: 'Design Lead',
        company: 'Digital Agency Pro',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        quote: 'Alex has a rare combination of technical excellence and design sensibility. He brought our designs to life with pixel-perfect precision.',
        rating: 5,
        order: 3,
      },
    ];
    await db.insert(testimonials).values(testimonialsData);

    // Seed Blog Posts
    console.log('📝 Creating blog posts...');
    const blogPostsData = [
      {
        title: 'Building Scalable APIs with Node.js and TypeScript',
        slug: 'scalable-apis-nodejs-typescript',
        excerpt: 'Learn how to build production-ready APIs with proper architecture, error handling, and performance optimization techniques.',
        content: `# Building Scalable APIs with Node.js and TypeScript

In this comprehensive guide, we'll explore best practices for building scalable APIs using Node.js and TypeScript...

## Why TypeScript?

TypeScript brings type safety to JavaScript, catching errors at compile time rather than runtime...

## Architecture Patterns

### Layered Architecture
A well-structured API should separate concerns into distinct layers...`,
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
        tags: ['Node.js', 'TypeScript', 'API', 'Backend'],
        publishedAt: '2024-01-15',
        readTime: 12,
        published: true,
      },
      {
        title: 'React Performance Optimization: A Deep Dive',
        slug: 'react-performance-optimization',
        excerpt: 'Master React performance with techniques like memoization, code splitting, and virtualization.',
        content: `# React Performance Optimization: A Deep Dive

Performance is crucial for modern web applications. Let's explore techniques to optimize React apps...`,
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
        tags: ['React', 'Performance', 'Frontend'],
        publishedAt: '2024-02-01',
        readTime: 15,
        published: true,
      },
      {
        title: 'The Complete Guide to Modern CSS',
        slug: 'modern-css-complete-guide',
        excerpt: 'Explore modern CSS features including Grid, Flexbox, Custom Properties, and Container Queries.',
        content: `# The Complete Guide to Modern CSS

CSS has evolved dramatically. From Grid to Custom Properties, let's explore modern CSS capabilities...`,
        coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop',
        tags: ['CSS', 'Frontend', 'Design'],
        publishedAt: '2024-02-20',
        readTime: 10,
        published: true,
      },
    ];
    await db.insert(blogPosts).values(blogPostsData);

    // Seed Services
    console.log('🎯 Creating services...');
    const servicesData = [
      {
        title: 'Web Development',
        description: 'Custom web applications built with modern technologies and best practices.',
        icon: 'code',
        features: [
          'Full-stack development',
          'API design & integration',
          'Database architecture',
          'Performance optimization',
        ],
        highlighted: true,
        order: 1,
      },
      {
        title: 'Technical Consulting',
        description: 'Expert guidance on architecture, technology choices, and best practices.',
        icon: 'lightbulb',
        features: [
          'Architecture review',
          'Tech stack selection',
          'Code review & audits',
          'Performance analysis',
        ],
        highlighted: false,
        order: 2,
      },
      {
        title: 'DevOps & Cloud',
        description: 'Streamline your deployment pipeline and cloud infrastructure.',
        icon: 'cloud',
        features: [
          'CI/CD pipeline setup',
          'Cloud migration',
          'Docker & Kubernetes',
          'Infrastructure as Code',
        ],
        highlighted: false,
        order: 3,
      },
    ];
    await db.insert(services).values(servicesData);

    // Seed Social Links
    console.log('🔗 Creating social links...');
    const socialLinksData = [
      { platform: 'GitHub', url: 'https://github.com/alex', icon: 'github', order: 1 },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/alex', icon: 'linkedin', order: 2 },
      { platform: 'Twitter', url: 'https://twitter.com/alex', icon: 'twitter', order: 3 },
      { platform: 'Dribbble', url: 'https://dribbble.com/alex', icon: 'dribbble', order: 4 },
    ];
    await db.insert(socialLinks).values(socialLinksData);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin Credentials:');
    console.log('  Email: admin@portfolio.com');
    console.log('  Password: admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

import { contactMessages } from './schema.js';
seed();
