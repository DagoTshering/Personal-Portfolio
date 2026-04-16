import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../lib/api';

interface UseDataOptions {
  enabled?: boolean;
}

export function useData<T>(
  fetchFn: () => Promise<{ success: boolean; data?: T; message?: string }>,
  options: UseDataOptions = {}
) {
  const { enabled = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);
  const fetchFnRef = useRef(fetchFn);
  
  fetchFnRef.current = fetchFn;

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchFnRef.current();
        
        if (response.success && response.data) {
          setData(response.data);
          isInitialized.current = true;
        } else {
          setError(response.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [enabled]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    fetchData().catch(console.error);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetchFnRef.current();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch, isInitialized: isInitialized.current };
}

// Pre-configured hooks for each data type
export const useHero = () => useData(api.getHero);
export const useAbout = () => useData(api.getAbout);
export const useSkills = () => useData(api.getSkills);
export const useProjects = (params?: { featured?: boolean; category?: string }) => 
  useData(() => api.getProjects(params));
export const useExperience = () => useData(api.getExperience);
export const useTestimonials = () => useData(api.getTestimonials);
export const useBlogPosts = (params?: { published?: boolean; page?: number; limit?: number }) => 
  useData(() => api.getBlogPosts(params));
export const useServices = () => useData(api.getServices);
export const useSocialLinks = () => useData(api.getSocialLinks);
export const useSettings = () => useData(api.getSettings);

export default useData;