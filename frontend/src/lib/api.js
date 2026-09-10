const API_BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }
  
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    }).then(r => { if (!r.ok) throw new Error('Invalid credentials'); return r.json(); });
  },
  getMe: () => request('/auth/me'),
  
  // Boards
  getBoards: () => request('/boards'),
  getBoard: (id) => request(`/boards/${id}`),
  createBoard: (data) => request('/boards', { method: 'POST', body: JSON.stringify(data) }),
  updateBoard: (id, data) => request(`/boards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBoard: (id) => request(`/boards/${id}`, { method: 'DELETE' }),
  
  // Columns
  createColumn: (boardId, data) => request(`/boards/${boardId}/columns`, { method: 'POST', body: JSON.stringify(data) }),
  updateColumn: (id, data) => request(`/columns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteColumn: (id) => request(`/columns/${id}`, { method: 'DELETE' }),
  
  // Tasks
  createTask: (columnId, data) => request(`/columns/${columnId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  moveTask: (id, data) => request(`/tasks/${id}/move`, { method: 'PATCH', body: JSON.stringify(data) }),
};
