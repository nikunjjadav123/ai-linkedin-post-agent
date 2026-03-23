import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

export const runWorkflow = async (topic: string): Promise<WorkflowResponse> => {
  const { data } = await api.post('/workflow/run', { topic });
  return data;
};

export const resumeWorkflow = async (threadId: string, updates: Record<string, any>): Promise<WorkflowResponse> => {
  const { data } = await api.post('/workflow/resume', { 
    thread_id: threadId, 
    updates 
  });
  return data;
};
