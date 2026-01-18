/**
 * API Configuration and Helper Functions
 */

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'api';

/**
 * Build full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.indexOf('/') === 0 ? endpoint.slice(1) : endpoint;
  
  // Clean base URL to remove potential trailing slash
  const cleanBase = API_BASE_URL.slice(-1) === '/' ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  return `${cleanBase}/${API_VERSION}/${cleanEndpoint}`;
};

/**
 * Generic API request function
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = buildApiUrl(endpoint);

  // Default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Check if response has content before parsing JSON
  // DELETE requests typically return 204 No Content
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    if (!response.ok) {
      throw new Error('HTTP error! status: ' + response.status);
    }
    return null; // No content to parse
  }

  var contentType = response.headers.get('content-type');
  var data;

  if (contentType && contentType.indexOf('application/json') !== -1) {
    data = await response.json();
  } else {
    // If response is not JSON (e.g. HTML error page or 404 from proxy)
    var text = await response.text();
    
    // If it's an error status, throw with the text content preview
    if (!response.ok) {
      // Create a plain error message from the response text (truncated)
      var preview = text.slice(0, 200).replace(/\s+/g, ' ').trim();
      throw new Error('Server returned ' + response.status + ' (' + response.statusText + '). Response: ' + preview);
    }
    
    // If status is 200 but content is not JSON (e.g. unexpected HTML fallback)
    if (text.trim().indexOf('<') === 0) {
       throw new Error('Unexpected HTML response from API: ' + text.slice(0, 100) + '...');
    }
    
    // Try to parse as JSON just in case the header was wrong, otherwise return text
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
  }

  if (!response.ok) {
    // Automatic logout on 401 Unauthorized
    if (response.status === 401) {
      console.warn('Authentication failed (401). Clearing session and redirecting to login.');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_email');
      
      if (window.location.pathname.indexOf('/login') === -1) {
        window.location.href = '/login';
        return; // Stop execution
      }
    }

    // Handle Django REST Framework validation errors
    if (data.email || data.password || data.password_confirm || data.first_name || data.last_name) {
      const errorMessages = [];
      if (data.email) errorMessages.push(`Email: ${Array.isArray(data.email) ? data.email[0] : data.email}`);
      if (data.password) errorMessages.push(`Password: ${Array.isArray(data.password) ? data.password[0] : data.password}`);
      if (data.password_confirm) errorMessages.push(`Password confirm: ${Array.isArray(data.password_confirm) ? data.password_confirm[0] : data.password_confirm}`);
      if (data.first_name) errorMessages.push(`First name: ${Array.isArray(data.first_name) ? data.first_name[0] : data.first_name}`);
      if (data.last_name) errorMessages.push(`Last name: ${Array.isArray(data.last_name) ? data.last_name[0] : data.last_name}`);
      throw new Error(errorMessages.join(' | '));
    }
    throw new Error(data.message || data.detail || `HTTP error! status: ${response.status}`);
  }

  return data;
};

/**
 * Authentication API calls
 */
export const authAPI = {
  /**
   * Step 1: Login with email/password
   */
  login: async (email: string, password: string) => {
    return apiRequest('auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Step 2: Verify 2FA code
   */
  verify2FA: async (email: string, code: string) => {
    return apiRequest('auth/verify-2fa/', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  /**
   * Google OAuth login
   */
  googleLogin: async (accessToken: string) => {
    return apiRequest('auth/google/', {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken }),
    });
  },

  /**
   * Register new user
   */
  register: async (userData: any) => {
    return apiRequest('auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string) => {
    return apiRequest('auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string) => {
    const requestBody: any = { email };

    return apiRequest('auth/password-reset/', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  /**
   * Reset password confirm
   */
  resetPassword: async (uidb64: string, token: string, password: string) => {
    return apiRequest('auth/password-reset-confirm/', {
      method: 'POST',
      body: JSON.stringify({
        uidb64,
        token,
        password,
        password_confirm: password
      }),
    });
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    return apiRequest('auth/me/', {
      method: 'GET',
    });
  },

  /**
   * Logout
   */
  logout: async () => {
    return apiRequest('auth/logout/', {
      method: 'POST',
    });
  },
};


/**
 * Area Creation API calls
 */
export const areasAPI = {
  /**
   * Get all available services with their actions and reactions
   */
  about: async () => {
    return apiRequest('core/about.json', {
      method: 'GET',
    });
  },

  /**
   * Create a new AREA
   */
  createArea: async (areaData: any) => {
    return apiRequest('areas/', {
      method: 'POST',
      body: JSON.stringify(areaData),
    });
  },

  /**
   * Get user's AREAs
   */
  getUserAreas: async () => {
    return apiRequest('areas/', {
      method: 'GET',
    });
  },

  /**
   * Get a single AREA by ID
   */
  getArea: async (areaId: string) => {
    return apiRequest(`areas/${areaId}/`, {
      method: 'GET',
    });
  },

  /**
   * Update an existing AREA
   */
  updateArea: async (areaId: string, areaData: any) => {
    return apiRequest(`areas/${areaId}/`, {
      method: 'PUT',
      body: JSON.stringify(areaData),
    });
  },

  /**
   * Delete an AREA
   */
  deleteArea: async (areaId: string) => {
    console.log('Deleting area with ID:', areaId);
    return apiRequest(`areas/${areaId}/`, {
      method: 'DELETE',
    });
  },

  /**
   * Get execution history for a specific AREA
   */
  getAreaHistory: async (areaId: string) => {
    return apiRequest(`areas/${areaId}/history/`, {
      method: 'GET',
    });
  },

  /**
   * Get global statistics for user's AREAs
   */
  getStatistics: async () => {
    return apiRequest('areas/statistics/', {
      method: 'GET',
    });
  },

  /**
   * Toggle AREA active status
   */
  toggleAreaActive: async (areaId: string) => {
    return apiRequest(`areas/${areaId}/toggle_active/`, {
      method: 'POST',
    });
  },
};

/**
 * OAuth Service Integration API calls
 */
export const oauthAPI = {
  /**
   * Get OAuth connection status for all services
   */
  getConnectionStatus: async () => {
    return apiRequest('oauth/status/', {
      method: 'GET',
    });
  },

  /**
   * Get OAuth authorization URL for a service
   */
  getAuthUrl: async (serviceName: string) => {
    return apiRequest(`oauth/${serviceName}/authorize/`, {
      method: 'GET',
    });
  },

  /**
   * Complete OAuth flow with authorization code or access token
   */
  completeOAuth: async (serviceName: string, tokenOrCode: string, state?: string) => {
    // Determine the correct field name based on service and token format
    const payload: any = { state };
    
    // Discord, GitHub, and new Google implementations use authorization codes
    // Legacy Google implementation might use access tokens, but backend handles both in 'code' or 'access_token'
    if (serviceName === 'discord' || serviceName === 'github' || serviceName.indexOf('google') === 0) {
      payload.code = tokenOrCode;
    } else {
      payload.access_token = tokenOrCode;
    }
    
    return apiRequest(`oauth/${serviceName}/complete/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Disconnect OAuth service
   */
  disconnectService: async (serviceName: string) => {
    return apiRequest(`oauth/${serviceName}/disconnect/`, {
      method: 'DELETE',
    });
  },

  /**
   * Refresh OAuth token for a service
   */
  refreshToken: async (serviceName: string) => {
    return apiRequest(`oauth/${serviceName}/refresh/`, {
      method: 'POST',
    });
  },
};

/**
 * Generic API Service for direct HTTP calls
 * Used when you need more control over the request
 */
export const apiService = {
  /**
   * Generic GET request
   */
  get: async (endpoint: string) => {
    const url = endpoint.startsWith('/api') 
      ? `${API_BASE_URL}${endpoint}` 
      : buildApiUrl(endpoint);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw { response: { data: { message: `HTTP ${response.status}` } } };
    }
    
    return { data: await response.json() };
  },

  /**
   * Generic POST request
   */
  post: async (endpoint: string, data?: any) => {
    const url = endpoint.startsWith('/api') 
      ? `${API_BASE_URL}${endpoint}` 
      : buildApiUrl(endpoint);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(url, { 
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    
    if (response.status === 204) {
      return { data: null };
    }
    
    return { data: await response.json() };
  },

  /**
   * Generic PATCH request
   */
  patch: async (endpoint: string, data?: any) => {
    const url = endpoint.startsWith('/api') 
      ? `${API_BASE_URL}${endpoint}` 
      : buildApiUrl(endpoint);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(url, { 
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    
    if (response.status === 204) {
      return { data: null };
    }
    
    return { data: await response.json() };
  },

  /**
   * Generic DELETE request
   */
  delete: async (endpoint: string) => {
    const url = endpoint.startsWith('/api') 
      ? `${API_BASE_URL}${endpoint}` 
      : buildApiUrl(endpoint);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(url, { 
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw { response: { data: errorData } };
    }
    
    return { data: null };
  },
};