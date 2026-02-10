// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Generic fetch wrapper
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    console.log('🔵 Calling API:', `${API_URL}${endpoint}`);
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('🟢 Response status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error('🔴 API Error:', data);
      return {
        success: false,
        error: data.error || 'An error occurred',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('🔴 Network Error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

// ==================== AUTH API ====================
export const authAPI = {
  register: (data: any) =>
    fetchAPI<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (credentials: any) =>
    fetchAPI<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ==================== IDEAS API ====================
export const ideasAPI = {
  getAll: () => fetchAPI<any[]>('/ideas'),

  getById: (id: string) => fetchAPI<any>(`/ideas/${id}`),

  create: (data: any, userId: string) =>
    fetchAPI<any>('/ideas', {
      method: 'POST',
      body: JSON.stringify({ ...data, userId }),
    }),

  like: (id: string) =>
    fetchAPI<any>(`/ideas/${id}/like`, {
      method: 'POST',
    }),

  fund: (id: string, amount: number) =>
    fetchAPI<any>(`/ideas/${id}/fund`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  getByUserId: (userId: string) =>
    fetchAPI<any[]>(`/ideas/user/${userId}`),
};

// ==================== CONNECTIONS API ====================
export const connectionsAPI = {
  getByUserId: (userId: string) =>
    fetchAPI<any[]>(`/connections/${userId}`),

  create: (data: any, fromUserId: string) =>
    fetchAPI<any>('/connections', {
      method: 'POST',
      body: JSON.stringify({ ...data, fromUserId }),
    }),

  updateStatus: (id: string, status: 'accepted' | 'rejected') =>
    fetchAPI<any>(`/connections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ==================== USERS API ====================
export const usersAPI = {
  getMentors: () => fetchAPI<any[]>('/users/mentors'),

  getInvestors: () => fetchAPI<any[]>('/users/investors'),

  getById: (id: string) => fetchAPI<any>(`/users/${id}`),
};