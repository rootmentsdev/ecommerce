const API_BASE_URL = 'http://localhost:5000/api';

class AuthService {
  // Register new user
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Login user
  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          message: 'No token found'
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Logout user
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get stored user data
  static getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Forgot password - Request reset code
  static async forgotPassword(emailOrPhone) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrPhone }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Reset password with verification code
  static async resetPassword(resetToken, verificationCode, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken,
          verificationCode,
          newPassword
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }
}

export default AuthService;
