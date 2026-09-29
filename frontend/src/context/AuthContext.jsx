import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [apiHealth, setApiHealth] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('prime_user');

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('prime_user');
        }
      }

      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setApiHealth(data);
        } else {
          setApiHealth({ status: 'DOWN', service: 'Backend unreachable' });
        }
      } catch (err) {
        setApiHealth({ status: 'OFFLINE', service: 'Local fallback active' });
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 1. Password Login
  const loginWithPassword = async (identifier, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Account does not exist or password incorrect.' };
      }

      localStorage.setItem('prime_token', data.token);
      localStorage.setItem('prime_user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Server error during login' };
    }
  };

  // 2. Request Login OTP
  const sendLoginOtp = async (identifier) => {
    try {
      const response = await fetch('/api/auth/send-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Account does not exist. Please sign up first.' };
      }

      return {
        success: true,
        message: data.message,
        previewUrl: data.previewUrl,
        emailSent: data.emailSent,
      };
    } catch (error) {
      return { success: false, error: error.message || 'Server error sending login OTP' };
    }
  };

  // 3. Verify Login OTP
  const verifyLoginOtp = async (identifier, otp) => {
    try {
      const response = await fetch('/api/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'OTP verification failed' };
      }

      localStorage.setItem('prime_token', data.token);
      localStorage.setItem('prime_user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Server error verifying login OTP' };
    }
  };

  // 4. Request Signup OTP (Name, Email, Phone, Password)
  const sendSignupOtp = async (name, email, phone, password) => {
    try {
      const response = await fetch('/api/auth/send-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to send verification OTP' };
      }

      return {
        success: true,
        message: data.message,
        previewUrl: data.previewUrl,
        emailSent: data.emailSent,
      };
    } catch (error) {
      return { success: false, error: error.message || 'Server error sending signup OTP' };
    }
  };

  // 5. Verify Signup OTP & Create Account
  const verifySignupOtp = async (email, otp) => {
    try {
      const response = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'OTP verification failed' };
      }

      localStorage.setItem('prime_token', data.token);
      localStorage.setItem('prime_user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Server error completing registration' };
    }
  };

  // 6. Request Password Reset OTP
  const sendResetPasswordOtp = async (identifier) => {
    try {
      const response = await fetch('/api/auth/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Account does not exist. Please sign up first.' };
      }

      return {
        success: true,
        message: data.message,
        previewUrl: data.previewUrl,
        emailSent: data.emailSent,
      };
    } catch (error) {
      return { success: false, error: error.message || 'Server error sending password reset OTP' };
    }
  };

  // 7. Reset Password with OTP
  const resetPassword = async (identifier, otp, newPassword) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Password reset failed' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message || 'Server error resetting password' };
    }
  };

  // 8. Reset Database (Wipe All Existing Users)
  const resetDatabase = async () => {
    try {
      await fetch('/api/auth/reset-db', { method: 'POST' });
    } catch (e) {
      console.warn('Reset DB request sent');
    }
    localStorage.removeItem('prime_token');
    localStorage.removeItem('prime_user');
    setUser(null);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem('prime_token');
    localStorage.removeItem('prime_user');
    setUser(null);
  };

  const toggleWatchlist = (movieId) => {
    setWatchlist((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithPassword,
        sendLoginOtp,
        verifyLoginOtp,
        sendSignupOtp,
        verifySignupOtp,
        sendResetPasswordOtp,
        resetPassword,
        resetDatabase,
        logout,
        watchlist,
        toggleWatchlist,
        apiHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
