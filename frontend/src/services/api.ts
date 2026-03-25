import axios from 'axios';
// console.log("API URL:", import.meta.env.VITE_BACKEND_URL);
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/linkedin`,
  headers: {
    'Content-Type': 'application/json',
  },
});


export interface WorkflowResponse {
  thread_id: string;
  state: any;
  next_node: string[];
  is_finished: boolean;
}

export const getAuthUrl = async (): Promise<{ url: string }> => {
  const redirectUri = `${window.location.origin}/auth/callback`;
  const { data } = await axios.get(`${API_BASE_URL}/auth/linkedin/url?redirect_uri=${encodeURIComponent(redirectUri)}`);
  return data;
};

export const verifyAuthCode = async (code: string): Promise<{ linkedin_token: string, linkedin_person_id: string }> => {
  const redirectUri = `${window.location.origin}/auth/callback`;
  const { data } = await axios.post(`${API_BASE_URL}/auth/linkedin/callback?code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`);
  return data;
};

export const runWorkflow = async (topic: string): Promise<WorkflowResponse> => {
  const token = localStorage.getItem('linkedin_token') || undefined;
  const personId = localStorage.getItem('linkedin_person_id') || undefined;

  const { data } = await api.post('/workflow/run', {
    input: topic,
    linkedin_token: token,
    linkedin_person_id: personId
  });
  return data;
};

export const resumeWorkflow = async (threadId: string, updates: Record<string, any>): Promise<WorkflowResponse> => {
  const token = localStorage.getItem('linkedin_token') || undefined;
  const personId = localStorage.getItem('linkedin_person_id') || undefined;

  const { data } = await api.post('/workflow/resume', {
    thread_id: threadId,
    updates,
    linkedin_token: token,
    linkedin_person_id: personId
  });
  return data;
};
