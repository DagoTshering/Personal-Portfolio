import { PrismaClient, SkillCategory, ProjectCategory, EmploymentType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@portfolio.com' },
    update: {},
    create: {
      email: 'admin@portfolio.com',
      name: 'Admin User',
      password: adminPassword,
      isAdmin: true,
    },
  })
  console.log('Created admin user:', admin.email)

  // Create Hero
  const hero = await prisma.hero.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Alex Developer',
      title: 'Fullstack Developer',
      tagline: 'Building scalable web applications with modern technologies',
      ctaText: 'Get in Touch',
      ctaLink: '#contact',
      resumeUrl: '/resume.pdf',
      avatarUrl: '/avatar.jpg',
      backgroundType: 'gradient',
      isVisible: true,
    },
  })
  console.log('Created hero section')

  // Create About
  const about = await prisma.about.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      bio: `I'm a passionate fullstack developer with over 8 years of experience building digital products. I specialize in creating performant, accessible, and beautiful web applications that solve real-world problems.

My journey started with a curiosity for how things work on the web, which led me to dive deep into both frontend and backend technologies. Today, I work with modern stacks including React, Node.js, TypeScript, and cloud infrastructure.

When I'm not coding, you'll find me exploring new technologies, contributing to open source, or sharing my knowledge through blog posts and mentoring.`,
      yearsExperience: 8,
      location: 'San Francisco, CA',
      availability: 'Available for freelance projects',
      funFacts: JSON.stringify([
        '☕ Fueled by 3+ cups of coffee daily',
        '🌟 Contributed to 50+ open source projects',
        '🎮 Built my first game at age 14',
        '📚 Read 30+ tech books per year',
      ]),
      profileImageUrl: '/profile.jpg',
    },
  })
  console.log('Created about section')

  // Create Skills
  const skills = [
    { name: 'React', category: SkillCategory.FRONTEND, icon: 'react', proficiencyLevel: 5, order: 1 },
    { name: 'TypeScript', category: SkillCategory.FRONTEND, icon: 'typescript', proficiencyLevel: 5, order: 2 },
    { name: 'Next.js', category: SkillCategory.FRONTEND, icon: 'nextjs', proficiencyLevel: 5, order: 3 },
    { name: 'Tailwind CSS', category: SkillCategory.FRONTEND, icon: 'tailwind', proficiencyLevel: 5, order: 4 },
    { name: 'Vue.js', category: SkillCategory.FRONTEND, icon: 'vue', proficiencyLevel: 4, order: 5 },
    { name: 'Node.js', category: SkillCategory.BACKEND, icon: 'nodejs', proficiencyLevel: 5, order: 6 },
    { name: 'Express', category: SkillCategory.BACKEND, icon: 'express', proficiencyLevel: 5, order: 7 },
    { name: 'NestJS', category: SkillCategory.BACKEND, icon: 'nestjs', proficiencyLevel: 4, order: 8 },
    { name: 'Python', category: SkillCategory.BACKEND, icon: 'python', proficiencyLevel: 4, order: 9 },
    { name: 'GraphQL', category: SkillCategory.BACKEND, icon: 'graphql', proficiencyLevel: 4, order: 10 },
    { name: 'PostgreSQL', category: SkillCategory.DATABASE, icon: 'postgresql', proficiencyLevel: 5, order: 11 },
    { name: 'MongoDB', category: SkillCategory.DATABASE, icon: 'mongodb', proficiencyLevel: 4, order: 12 },
    { name: 'Redis', category: SkillCategory.DATABASE, icon: 'redis', proficiencyLevel: 4, order: 13 },
    { name: 'Prisma', category: SkillCategory.DATABASE, icon: 'prisma', proficiencyLevel: 5, order: 14 },
    { name: 'Docker', category: SkillCategory.DEVOPS, icon: 'docker', proficiencyLevel: 4, order: 15 },
    { name: 'AWS', category: SkillCategory.DEVOPS, icon: 'aws', proficiencyLevel: 4, order: 16 },
    { name: 'Kubernetes', category: SkillCategory.DEVOPS, icon: 'kubernetes', proficiencyLevel: 3, order: 17 },
    { name: 'CI/CD', category: SkillCategory.DEVOPS, icon: 'cicd', proficiencyLevel: 4, order: 18 },
    { name: 'Git', category: SkillCategory.TOOLS, icon: 'git', proficiencyLevel: 5, order: 19 },
    { name: 'Figma', category: SkillCategory.TOOLS, icon: 'figma', proficiencyLevel: 4, order: 20 },
    { name: 'VS Code', category: SkillCategory.TOOLS, icon: 'vscode', proficiencyLevel: 5, order: 21 },
    { name: 'Jest', category: SkillCategory.TOOLS, icon: 'jest', proficiencyLevel: 4, order: 22 },
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: skill.name.toLowerCase().replace(/\s+/g, '-'),
        ...skill,
      },
    })
  }
  console.log(`Created ${skills.length} skills`)

  // Create Projects
  const projects = [
    {
      id: 'ecommerce-platform',
      title: 'E-Commerce Platform',
      slug: 'ecommerce-platform',
      description: 'Full-featured online store with real-time inventory',
      longDescription: 'A comprehensive e-commerce solution built with Next.js, featuring real-time inventory management, Stripe payments, and a custom admin dashboard. Includes product recommendations powered by machine learning.',
      thumbnailUrl: '/projects/ecommerce.jpg',
      images: JSON.stringify(['/projects/ecommerce-1.jpg', '/projects/ecommerce-2.jpg']),
      liveDemoUrl: 'https://ecommerce-demo.com',
      githubUrl: 'https://github.com/alex/ecommerce',
      techStack: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Redis']),
      category: ProjectCategory.WEB_APP,
      featured: true,
      order: 1,
    },
    {
      id: 'task-management',
      title: 'Task Management App',
      slug: 'task-management',
      description: 'Collaborative project management tool',
      longDescription: 'A Trello-like task management application with real-time collaboration, drag-and-drop interfaces, and team analytics. Features include custom workflows, time tracking, and integration with popular tools.',
      thumbnailUrl: '/projects/taskapp.jpg',
      images: JSON.stringify(['/projects/taskapp-1.jpg', '/projects/taskapp-2.jpg']),
      liveDemoUrl: 'https://taskapp-demo.com',
      githubUrl: 'https://github.com/alex/taskapp',
      techStack: JSON.stringify(['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express']),
      category: ProjectCategory.WEB_APP,
      featured: true,
      order: 2,
    },
    {
      id: 'api-gateway',
      title: 'API Gateway Service',
      slug: 'api-gateway',
      description: 'Microservices API gateway with rate limiting',
      longDescription: 'A high-performance API gateway built with NestJS, featuring rate limiting, request caching, authentication middleware, and comprehensive logging. Handles 10k+ requests per second.',
      thumbnailUrl: '/projects/api.jpg',
      images: JSON.stringify(['/projects/api-1.jpg']),
      liveDemoUrl: 'https://api-docs.demo.com',
      githubUrl: 'https://github.com/alex/api-gateway',
      techStack: JSON.stringify(['NestJS', 'Redis', 'Docker', 'PostgreSQL', 'JWT']),
      category: ProjectCategory.API,
      featured: true,
      order: 3,
    },
    {
      id: 'mobile-fitness',
      title: 'Fitness Tracking App',
      slug: 'fitness-tracking',
      description: 'Cross-platform mobile fitness application',
      longDescription: 'A React Native fitness tracking app with workout plans, progress tracking, and social features. Integrates with health APIs and wearable devices for comprehensive health monitoring.',
      thumbnailUrl: '/projects/fitness.jpg',
      images: JSON.stringify(['/projects/fitness-1.jpg', '/projects/fitness-2.jpg']),
      liveDemoUrl: 'https://fitness-demo.com',
      githubUrl: 'https://github.com/alex/fitness-app',
      techStack: JSON.stringify(['React Native', 'Firebase', 'Node.js', 'GraphQL']),
      category: ProjectCategory.MOBILE,
      featured: false,
      order: 4,
    },
    {
      id: 'open-source-cli',
      title: 'DevTools CLI',
      slug: 'devtools-cli',
      description: 'Open source developer productivity toolkit',
      longDescription: 'A command-line tool for automating common development tasks. Includes project scaffolding, code generation, deployment automation, and utility functions. 5k+ stars on GitHub.',
      thumbnailUrl: '/projects/cli.jpg',
      images: JSON.stringify(['/projects/cli-1.jpg']),
      liveDemoUrl: 'https://devtools-cli.dev',
      githubUrl: 'https://github.com/alex/devtools-cli',
      techStack: JSON.stringify(['TypeScript', 'Node.js', 'Commander.js', 'Jest']),
      category: ProjectCategory.OSS,
      featured: true,
      order: 5,
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: project,
    })
  }
  console.log(`Created ${projects.length} projects`)

  // Create Experience
  const experiences = [
    {
      id: 'exp-1',
      company: 'TechCorp Inc.',
      role: 'Senior Fullstack Developer',
      startDate: new Date('2022-01-01'),
      endDate: null,
      current: true,
      description: JSON.stringify([
        'Lead development of microservices architecture serving 1M+ users',
        'Mentored team of 5 developers and established coding standards',
        'Reduced API response times by 60% through optimization',
        'Implemented CI/CD pipelines reducing deployment time by 75%',
      ]),
      companyLogoUrl: '/companies/techcorp.jpg',
      location: 'San Francisco, CA',
      type: EmploymentType.FULLTIME,
      order: 1,
    },
    {
      id: 'exp-2',
      company: 'StartupXYZ',
      role: 'Fullstack Developer',
      startDate: new Date('2020-03-01'),
      endDate: new Date('2021-12-31'),
      current: false,
      description: JSON.stringify([
        'Built MVP from scratch that secured $2M in seed funding',
        'Developed real-time collaboration features using WebSockets',
        'Implemented authentication and authorization systems',
        'Collaborated with design team to create pixel-perfect UI',
      ]),
      companyLogoUrl: '/companies/startupxyz.jpg',
      location: 'Remote',
      type: EmploymentType.FULLTIME,
      order: 2,
    },
    {
      id: 'exp-3',
      company: 'Digital Agency Pro',
      role: 'Frontend Developer',
      startDate: new Date('2018-06-01'),
      endDate: new Date('2020-02-29'),
      current: false,
      description: JSON.stringify([
        'Developed 20+ client websites using React and Vue.js',
        'Optimized site performance achieving 95+ Lighthouse scores',
        'Integrated CMS solutions for content management',
        'Worked directly with clients to gather requirements',
      ]),
      companyLogoUrl: '/companies/agency.jpg',
      location: 'New York, NY',
      type: EmploymentType.FULLTIME,
      order: 3,
    },
    {
      id: 'exp-4',
      company: 'Freelance',
      role: 'Web Developer',
      startDate: new Date('2016-01-01'),
      endDate: new Date('2018-05-31'),
      current: false,
      description: JSON.stringify([
        'Delivered 30+ projects for clients worldwide',
        'Specialized in e-commerce and business websites',
        'Maintained 100% client satisfaction rating',
        'Managed full project lifecycle from concept to deployment',
      ]),
      companyLogoUrl: '/companies/freelance.jpg',
      location: 'Various',
      type: EmploymentType.FREELANCE,
      order: 4,
    },
  ]

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: {},
      create: exp,
    })
  }
  console.log(`Created ${experiences.length} experiences`)

  // Create Testimonials
  const testimonials = [
    {
      id: 'test-1',
      name: 'Sarah Johnson',
      role: 'CTO',
      company: 'TechCorp Inc.',
      avatarUrl: '/testimonials/sarah.jpg',
      quote: 'Alex is one of the most talented developers I\'ve worked with. His ability to solve complex problems while maintaining clean, scalable code is remarkable. He consistently delivered beyond expectations.',
      rating: 5,
      featured: true,
      order: 1,
    },
    {
      id: 'test-2',
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'StartupXYZ',
      avatarUrl: '/testimonials/michael.jpg',
      quote: 'Working with Alex was a game-changer for our startup. He built our MVP in record time and his technical insights were invaluable. Highly recommend for any ambitious project.',
      rating: 5,
      featured: true,
      order: 2,
    },
    {
      id: 'test-3',
      name: 'Emily Rodriguez',
      role: 'Design Lead',
      company: 'Digital Agency Pro',
      avatarUrl: '/testimonials/emily.jpg',
      quote: 'Alex has a rare combination of technical excellence and design sensibility. He brought our designs to life with pixel-perfect precision and added delightful interactions that elevated the entire experience.',
      rating: 5,
      featured: true,
      order: 3,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.id },
      update: {},
      create: testimonial,
    })
  }
  console.log(`Created ${testimonials.length} testimonials`)

  // Create Blog Posts
  const blogPosts = [
    {
      id: 'blog-1',
      title: 'Building Scalable APIs with Node.js and TypeScript',
      slug: 'scalable-apis-nodejs-typescript',
      content: `# Building Scalable APIs with Node.js and TypeScript

In this comprehensive guide, we'll explore best practices for building scalable APIs using Node.js and TypeScript...

## Why TypeScript?

TypeScript brings type safety to JavaScript, catching errors at compile time rather than runtime...

## Architecture Patterns

### Layered Architecture
A well-structured API should separate concerns into distinct layers...`,
      excerpt: 'Learn how to build production-ready APIs with proper architecture, error handling, and performance optimization techniques.',
      coverImage: '/blog/api-architecture.jpg',
      tags: JSON.stringify(['Node.js', 'TypeScript', 'API', 'Backend']),
      published: true,
      publishedAt: new Date('2024-01-15'),
      readTime: 12,
    },
    {
      id: 'blog-2',
      title: 'React Performance Optimization: A Deep Dive',
      slug: 'react-performance-optimization',
      content: `# React Performance Optimization: A Deep Dive

Performance is crucial for modern web applications. Let's explore techniques to optimize React apps...

## Understanding Re-renders

React's reconciliation algorithm is efficient, but unnecessary re-renders can still impact performance...`,
      excerpt: 'Master React performance with techniques like memoization, code splitting, and virtualization.',
      coverImage: '/blog/react-performance.jpg',
      tags: JSON.stringify(['React', 'Performance', 'Frontend']),
      published: true,
      publishedAt: new Date('2024-02-01'),
      readTime: 15,
    },
    {
      id: 'blog-3',
      title: 'The Complete Guide to Modern CSS',
      slug: 'modern-css-complete-guide',
      content: `# The Complete Guide to Modern CSS

CSS has evolved dramatically. From Grid to Custom Properties, let's explore modern CSS capabilities...

## CSS Grid Layout

Grid layout revolutionized two-dimensional layouts on the web...`,
      excerpt: 'Explore modern CSS features including Grid, Flexbox, Custom Properties, and Container Queries.',
      coverImage: '/blog/modern-css.jpg',
      tags: JSON.stringify(['CSS', 'Frontend', 'Design']),
      published: true,
      publishedAt: new Date('2024-02-20'),
      readTime: 10,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: {},
      create: post,
    })
  }
  console.log(`Created ${blogPosts.length} blog posts`)

  // Create Services
  const services = [
    {
      id: 'svc-1',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies and best practices.',
      icon: 'code',
      features: JSON.stringify([
        'Full-stack development',
        'API design & integration',
        'Database architecture',
        'Performance optimization',
      ]),
      highlighted: true,
      order: 1,
    },
    {
      id: 'svc-2',
      title: 'Technical Consulting',
      description: 'Expert guidance on architecture, technology choices, and best practices.',
      icon: 'lightbulb',
      features: JSON.stringify([
        'Architecture review',
        'Tech stack selection',
        'Code review & audits',
        'Performance analysis',
      ]),
      highlighted: false,
      order: 2,
    },
    {
      id: 'svc-3',
      title: 'DevOps & Cloud',
      description: 'Streamline your deployment pipeline and cloud infrastructure.',
      icon: 'cloud',
      features: JSON.stringify([
        'CI/CD pipeline setup',
        'Cloud migration',
        'Docker & Kubernetes',
        'Infrastructure as Code',
      ]),
      highlighted: false,
      order: 3,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    })
  }
  console.log(`Created ${services.length} services`)

  // Create Social Links
  const socialLinks = [
    { id: 'social-1', platform: 'GitHub', url: 'https://github.com/alex', icon: 'github', order: 1 },
    { id: 'social-2', platform: 'LinkedIn', url: 'https://linkedin.com/in/alex', icon: 'linkedin', order: 2 },
    { id: 'social-3', platform: 'Twitter', url: 'https://twitter.com/alex', icon: 'twitter', order: 3 },
    { id: 'social-4', platform: 'Dribbble', url: 'https://dribbble.com/alex', icon: 'dribbble', order: 4 },
  ]

  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: { id: link.id },
      update: {},
      create: link,
    })
  }
  console.log(`Created ${socialLinks.length} social links`)

  // Create Site Settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      siteName: 'Alex Developer',
      seoTitle: 'Alex Developer | Fullstack Developer Portfolio',
      seoDescription: 'Fullstack developer specializing in React, Node.js, and cloud technologies. Building scalable web applications with modern tools.',
      ogImage: '/og-image.jpg',
      googleAnalyticsId: '',
      maintenanceMode: false,
    },
  })
  console.log('Created site settings')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
