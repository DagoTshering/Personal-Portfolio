import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    if (error.response?.status === 401) {
      return 'Your session expired. Please login again.';
    }

    if (error.response?.status === 403) {
      return 'You are not allowed to perform this action.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};
