const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch function
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Public API endpoints
export const api = {
  // Hero
  getHero: () => fetchAPI<any>('/hero'),
  
  // About
  getAbout: () => fetchAPI<any>('/about'),
  
  // Skills
  getSkills: () => fetchAPI<any[]>('/skills'),
  
  // Projects
  getProjects: (params?: { featured?: boolean; category?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.featured) queryParams.append('featured', 'true');
    if (params?.category) queryParams.append('category', params.category);
    const query = queryParams.toString();
    return fetchAPI<any[]>(`/projects${query ? `?${query}` : ''}`);
  },
  getProject: (slug: string) => fetchAPI<any>(`/projects/${slug}`),
  
  // Experience
  getExperience: () => fetchAPI<any[]>('/experience'),
  
  // Testimonials
  getTestimonials: () => fetchAPI<any[]>('/testimonials'),
  
  // Blog
  getBlogPosts: (params?: { published?: boolean; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.published) queryParams.append('published', 'true');
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return fetchAPI<any[]>(`/blog${query ? `?${query}` : ''}`);
  },
  getBlogPost: (slug: string) => fetchAPI<any>(`/blog/${slug}`),
  
  // Services
  getServices: () => fetchAPI<any[]>('/services'),
  
  // Social Links
  getSocialLinks: () => fetchAPI<any[]>('/social-links'),
  
  // Settings
  getSettings: () => fetchAPI<any>('/settings'),
  
  // Contact
  sendContact: (data: { name: string; email: string; subject: string; message: string }) =>
    fetchAPI<any>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export default api;
