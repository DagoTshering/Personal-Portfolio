import axios from 'axios';
import type {
  About,
  ApiResponse,
  AdminUser,
  BlogPost,
  ContactMessage,
  DashboardStats,
  Experience,
  Hero,
  Project,
  Service,
  SiteSetting,
  Skill,
  SocialLink,
  Testimonial,
} from '../types/api';
import { getErrorMessage } from './errors';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mappedMessage = getErrorMessage(error);
    return Promise.reject(new Error(mappedMessage));
  }
);

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: AdminUser }>>('/auth/login', payload),
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
  me: () => api.get<ApiResponse<{ user: AdminUser }>>('/auth/me'),
};

export const adminApi = {
  dashboard: () => api.get<ApiResponse<{ stats: DashboardStats }>>('/admin/dashboard'),
};

export const skillsApi = {
  list: () => api.get<ApiResponse<Skill[]>>('/skills'),
  create: (payload: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Skill>>('/skills', payload),
  update: (id: number, payload: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.put<ApiResponse<Skill>>(`/skills/${id}`, payload),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/skills/${id}`),
};

export const heroApi = {
  get: () => api.get<ApiResponse<Hero>>('/hero'),
  update: (payload: Omit<Hero, 'id'>) => api.put<ApiResponse<Hero>>('/hero', payload),
};

export const aboutApi = {
  get: () => api.get<ApiResponse<About>>('/about'),
  update: (payload: Omit<About, 'id'>) => api.put<ApiResponse<About>>('/about', payload),
};

export const settingsApi = {
  get: () => api.get<ApiResponse<SiteSetting>>('/settings'),
  update: (payload: Omit<SiteSetting, 'id'>) => api.put<ApiResponse<SiteSetting>>('/settings', payload),
};

export const projectsApi = {
  list: () => api.get<ApiResponse<Project[]>>('/projects'),
  create: (payload: Omit<Project, 'id'>) => api.post<ApiResponse<Project>>('/projects', payload),
  update: (id: number, payload: Omit<Project, 'id'>) =>
    api.put<ApiResponse<Project>>(`/projects/${id}`, payload),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/projects/${id}`),
};

export const experienceApi = {
  list: () => api.get<ApiResponse<Experience[]>>('/experience'),
  create: (payload: Omit<Experience, 'id'>) =>
    api.post<ApiResponse<Experience>>('/experience', payload),
  update: (id: number, payload: Omit<Experience, 'id'>) =>
    api.put<ApiResponse<Experience>>(`/experience/${id}`, payload),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/experience/${id}`),
};

export const servicesApi = {
  list: () => api.get<ApiResponse<Service[]>>('/services'),
  create: (payload: Omit<Service, 'id'>) => api.post<ApiResponse<Service>>('/services', payload),
  update: (id: number, payload: Omit<Service, 'id'>) =>
    api.put<ApiResponse<Service>>(`/services/${id}`, payload),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/services/${id}`),
};

export const testimonialsApi = {
  list: () => api.get<ApiResponse<Testimonial[]>>('/testimonials'),
  create: (payload: Omit<Testimonial, 'id'>) =>
    api.post<ApiResponse<Testimonial>>('/testimonials', payload),
  update: (id: number, payload: Omit<Testimonial, 'id'>) =>
    api.put<ApiResponse<Testimonial>>(`/testimonials/${id}`, payload),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/testimonials/${id}`),
};

export const blogApi = {
  list: () => api.get<ApiResponse<BlogPost[]>>('/blog?limit=200&page=1'),
  create: (payload: Omit<BlogPost, 'id'>) => api.post<ApiResponse<BlogPost>>('/blog', payload),
  update: (id: number, payload: Omit<BlogPost, 'id'>) =>
    api.put<ApiResponse<BlogPost>>(`/blog/${id}`, payload),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/blog/${id}`),
};

export const socialLinksApi = {
  list: () => api.get<ApiResponse<SocialLink[]>>('/social-links'),
  create: (payload: Omit<SocialLink, 'id'>) =>
    api.post<ApiResponse<SocialLink>>('/social-links', payload),
  update: (id: number, payload: Omit<SocialLink, 'id'>) =>
    api.put<ApiResponse<SocialLink>>(`/social-links/${id}`, payload),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/social-links/${id}`),
};

export const contactApi = {
  list: () => api.get<ApiResponse<ContactMessage[]>>('/contact'),
  markRead: (id: number) => api.put<ApiResponse<null>>(`/contact/${id}/read`),
  remove: (id: number) => api.delete<ApiResponse<null>>(`/contact/${id}`),
};

export const uploadApi = {
  image: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<ApiResponse<{ url: string; publicId: string }>>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  removeImage: (payload: { publicId?: string; url?: string }) =>
    api.delete<ApiResponse<{ publicId: string; status: 'ok' | 'not found' | 'failed' }>>('/upload/image', {
      data: payload,
    }),
};
