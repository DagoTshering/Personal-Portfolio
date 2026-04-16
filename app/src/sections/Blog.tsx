import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { useBlogPosts } from '../hooks/useData';

gsap.registerPlugin(ScrollTrigger);

interface BlogCardProps {
  post: any;
  index: number;
  featured?: boolean;
}

const BlogCard = ({ post, index, featured = false }: BlogCardProps) => {
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

  if (featured) {
    return (
      <div ref={cardRef} className="group relative rounded-3xl overflow-hidden bg-surface border border-white/10 hover:border-primary/50 transition-all duration-500">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto overflow-hidden">
            <img src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop'} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-void-black/60 to-transparent" />
          </div>

          <div className="p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.slice(0, 3).map((tag: string) => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>

            <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
            <p className="text-text-secondary mb-6 line-clamp-3">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-sm text-text-muted mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />{post.readTime} min read
              </div>
            </div>

            <a href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-primary font-medium hover:text-neon-cyan transition-colors">
              Read Article<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="group relative rounded-2xl overflow-hidden bg-surface border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-video overflow-hidden">
        <img src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop'} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {post.tags?.slice(0, 2).map((tag: string) => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs">{tag}</span>
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Draft'}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />{post.readTime} min
            </div>
          </div>

          <a href={`/blog/${post.slug}`} className="text-primary hover:text-neon-cyan transition-colors">
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

const BlogSkeleton = () => (
  <section id="blog" className="py-24 lg:py-32 bg-void-black">
    <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
      <div className="text-center mb-16">
        <div className="h-6 w-24 bg-white/5 rounded-full animate-pulse mx-auto mb-4" />
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse mx-auto mb-4" />
        <div className="h-4 w-96 bg-white/5 rounded animate-pulse mx-auto" />
      </div>
      <div className="mb-8">
        <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden bg-white/5 animate-pulse">
          <div className="aspect-video md:aspect-auto bg-white/5" />
          <div className="p-8">
            <div className="h-4 w-24 bg-white/5 rounded-full mb-4" />
            <div className="h-8 w-3/4 bg-white/5 rounded mb-4" />
            <div className="h-4 w-full bg-white/5 rounded mb-2" />
            <div className="h-4 w-2/3 bg-white/5 rounded mb-6" />
            <div className="h-4 w-32 bg-white/5 rounded" />
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-white/5 animate-pulse">
            <div className="aspect-video bg-white/5" />
            <div className="p-6">
              <div className="h-6 w-3/4 bg-white/5 rounded mb-3" />
              <div className="h-4 w-full bg-white/5 rounded mb-2" />
              <div className="h-4 w-2/3 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Blog = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  const { data: blogPosts, isLoading } = useBlogPosts({ published: true });

  const posts = blogPosts || [];
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 3);

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
    return <BlogSkeleton />;
  }

  if (posts.length === 0) return null;

  return (
    <section id="blog" ref={sectionRef} className="relative w-full py-24 lg:py-32 bg-void-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20">
        <div ref={headerRef} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Blog</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading mb-4">Latest <span className="text-primary">Articles</span></h2>
          <p className="text-text-secondary max-w-2xl mx-auto">Thoughts, tutorials, and insights about web development and technology.</p>
        </div>

        {featuredPost && (
          <div className="mb-8">
            <BlogCard post={featuredPost} index={0} featured />
          </div>
        )}

        {otherPosts.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6">
            {otherPosts.map((post: any, index: number) => (
              <BlogCard key={post.id} post={post} index={index + 1} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <a href="/blog" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300">
            View All Articles<ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;