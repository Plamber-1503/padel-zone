/**
 * localClient.js — Adaptador del Backend Local para PadelZone
 *
 * Implementa exactamente la misma interfaz que esperaba `src/repositories/` y `AuthContext.jsx`,
 * pero comunicándose con nuestro servidor REST local en http://localhost:4000/api.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('padelzone_token') || localStorage.getItem('base44_access_token');
}

function setToken(token) {
  if (token) {
    localStorage.setItem('padelzone_token', token);
    localStorage.setItem('base44_access_token', token);
  } else {
    localStorage.removeItem('padelzone_token');
    localStorage.removeItem('base44_access_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'json' in options ? 'application/json' : undefined,
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: options.method || 'GET',
    headers,
    ...options
  };

  if (options.json) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(options.json);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

function makeEntityClient(entityName) {
  return {
    async list(sort, limit = 100) {
      const params = new URLSearchParams();
      if (sort) params.append('sort', sort);
      if (limit) params.append('limit', limit);
      return request(`/entities/${entityName}?${params.toString()}`);
    },

    async filter(conditions = {}, sort, limit = 100) {
      const params = new URLSearchParams();
      if (sort) params.append('sort', sort);
      if (limit) params.append('limit', limit);
      for (const [k, v] of Object.entries(conditions)) {
        if (v !== undefined && v !== null) {
          params.append(k, v);
        }
      }
      return request(`/entities/${entityName}?${params.toString()}`);
    },

    async get(id) {
      return request(`/entities/${entityName}/${id}`);
    },

    async create(data) {
      return request(`/entities/${entityName}`, {
        method: 'POST',
        json: data
      });
    },

    async update(id, data) {
      return request(`/entities/${entityName}/${id}`, {
        method: 'PUT',
        json: data
      });
    },

    async delete(id) {
      return request(`/entities/${entityName}/${id}`, {
        method: 'DELETE'
      });
    }
  };
}

export const localBase44 = {
  entities: {
    User: makeEntityClient('User'),
    Court: makeEntityClient('Court'),
    Booking: makeEntityClient('Booking'),
    Post: makeEntityClient('Post'),
    Comment: makeEntityClient('Comment'),
    ChatMessage: makeEntityClient('ChatMessage'),
    Follow: makeEntityClient('Follow'),
    Review: makeEntityClient('Review')
  },

  auth: {
    setToken,
    getToken,

    async me() {
      const token = getToken();
      if (!token) throw new Error('No token found');
      return request('/auth/me');
    },

    async loginViaEmailPassword(email, password) {
      const result = await request('/auth/login', {
        method: 'POST',
        json: { email, password }
      });
      if (result.access_token) {
        setToken(result.access_token);
      }
      return result.user;
    },

    async register({ email, password, full_name, role }) {
      const result = await request('/auth/register', {
        method: 'POST',
        json: { email, password, full_name, role }
      });
      if (result.access_token) {
        setToken(result.access_token);
      }
      return result;
    },

    async updateMe(data) {
      return request('/auth/me', {
        method: 'PUT',
        json: data
      });
    },

    logout(redirectUrl) {
      setToken(null);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.href = '/login';
      }
    },

    redirectToLogin(redirectUrl) {
      window.location.href = '/login';
    }
  },

  integrations: {
    Core: {
      async SendEmail(payload) {
        console.info('📧 [Local Backend] Simulación de correo enviado a:', payload.to, payload.subject);
        return { success: true };
      },

      async UploadFile({ file }) {
        const formData = new FormData();
        formData.append('file', file);
        const token = getToken();

        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        });

        if (!response.ok) {
          throw new Error('Error al subir el archivo');
        }

        return response.json();
      }
    }
  }
};
