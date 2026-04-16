export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const createResponse = <T>(
  success: boolean,
  data?: T,
  message?: string,
  meta?: Record<string, any>
) => {
  const response: any = { success };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  if (meta) response.meta = meta;
  return response;
};
