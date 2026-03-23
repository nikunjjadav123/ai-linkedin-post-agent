import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/linkedin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateHooks = async (topic: string) => {
  const { data } = await api.post('/hooks', { topic });
  return data.hooks;
};

export const findBestHook = async (hooks: any[]) => {
  const { data } = await api.post('/best-hook', { hooks });
  return data;
};

export const generatePost = async (hook: string) => {
  const { data } = await api.post('/post/generate', { hook });
  return data;
};

export const evaluatePost = async (linkedinPost: string) => {
  const { data } = await api.post('/post/evaluate', { linkedin_post: linkedinPost });
  return data;
};

export const generateHashtags = async (linkedinPost: string) => {
  const { data } = await api.post('/post/hashtags', { linkedin_post: linkedinPost });
  return data.hashtags;
};

export const publishPost = async (linkedinPost: string, hashtags: string[]) => {
  const { data } = await api.post('/post/publish', { 
    linkedin_post: linkedinPost, 
    hashtags 
  });
  return data;
};
