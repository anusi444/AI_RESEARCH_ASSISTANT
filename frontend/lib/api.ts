const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (userData: { email: string; password: string; name: string }) =>
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// Notes API
export const notesApi = {
  getAllNotes: () => fetchWithAuth('/notes'),
  createNote: (note: { title: string; content: string }) =>
    fetchWithAuth('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    }),
  updateNote: (id: string, note: { title: string; content: string }) =>
    fetchWithAuth(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    }),
  deleteNote: (id: string) =>
    fetchWithAuth(`/notes/${id}`, {
      method: 'DELETE',
    }),
};

// Citations API
export const citationsApi = {
  getAllCitations: () => fetchWithAuth('/citations'),
  createCitation: (citation: { title: string; source: string; content: string }) =>
    fetchWithAuth('/citations', {
      method: 'POST',
      body: JSON.stringify(citation),
    }),
  updateCitation: (id: string, citation: { title: string; source: string; content: string }) =>
    fetchWithAuth(`/citations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(citation),
    }),
  deleteCitation: (id: string) =>
    fetchWithAuth(`/citations/${id}`, {
      method: 'DELETE',
    }),
};

// Summarizer API
export const summarizerApi = {
  summarize: (text: string) =>
    fetchWithAuth('/summarize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
};

// ChatGPT API
export const chatGptApi = {
  // Send a message and get a response
  sendMessage: (message: string) =>
    fetchWithAuth('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  
  // Get conversation history
  getHistory: () => fetchWithAuth('/chat/history'),
  
  // Generate research insights
  generateInsights: (topic: string, context?: string) =>
    fetchWithAuth('/chat/research', {
      method: 'POST',
      body: JSON.stringify({ topic, context }),
    }),
    
  // Generate citations or references
  generateReferences: (text: string) =>
    fetchWithAuth('/chat/references', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
};
