import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const DEFAULT_PROFILES = [
  { id: 'p1', name: 'User', avatarColor: 'bg-sky-500', isKids: false },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [apiHealth, setApiHealth] = useState(null);

  // Dynamic Profiles State
  const [profiles, setProfiles] = useState(DEFAULT_PROFILES);
  const [activeProfile, setActiveProfile] = useState(DEFAULT_PROFILES[0]);

  const fetchUserWatchlist = async (overrideProfileId) => {
    const token = localStorage.getItem('netflix_token');
    if (!token) return;
    const profileId = overrideProfileId || activeProfile?.id || 'p1';
    try {
      const res = await fetch(`/api/movies/watchlist/user?profileId=${profileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.watchlist)) {
          setWatchlist(data.watchlist);
        }
      }
    } catch (err) {
      console.error('Error fetching user watchlist:', err);
    }
  };

  useEffect(() => {
    if (user && activeProfile?.id) {
      fetchUserWatchlist(activeProfile.id);
    }
  }, [user, activeProfile?.id]);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('netflix_user');
      const storedProfiles = localStorage.getItem('netflix_profiles');
      const storedActiveProfile = localStorage.getItem('netflix_active_profile');

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          fetchUserWatchlist();
          // If user has a name, sync primary profile name
          if (parsedUser?.name) {
            setProfiles((prev) =>
              prev.map((p, idx) => (idx === 0 ? { ...p, name: parsedUser.name } : p))
            );
          }
        } catch (e) {
          localStorage.removeItem('netflix_user');
        }
      }

      if (storedProfiles) {
        try {
          const parsed = JSON.parse(storedProfiles);
          const filtered = parsed.filter(
            (p) => !['p2', 'p3', 'p4'].includes(p.id) && !['Gokul', 'Yash', 'Kids'].includes(p.name)
          );
          const finalProfiles = filtered.length > 0 ? filtered : DEFAULT_PROFILES;
          setProfiles(finalProfiles);
          localStorage.setItem('netflix_profiles', JSON.stringify(finalProfiles));
        } catch (e) {
          localStorage.removeItem('netflix_profiles');
        }
      }

      if (storedActiveProfile) {
        try {
          setActiveProfile(JSON.parse(storedActiveProfile));
        } catch (e) {
          localStorage.removeItem('netflix_active_profile');
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

  // Save Profiles Changes to LocalStorage
  const updateProfilesList = (newProfilesList) => {
    setProfiles(newProfilesList);
    localStorage.setItem('netflix_profiles', JSON.stringify(newProfilesList));
  };

  // Add New Custom Profile
  const addProfile = (name, isKids = false, avatarColor = 'bg-red-600') => {
    const newProfile = {
      id: `p_${Date.now()}`,
      name: name.trim() || 'New Profile',
      isKids,
      avatarColor: avatarColor || 'bg-[#E50914]',
    };
    const updated = [...profiles, newProfile];
    updateProfilesList(updated);
    switchProfile(newProfile);
    return newProfile;
  };

  // Switch Active Profile
  const switchProfile = (profileOrId) => {
    const target =
      typeof profileOrId === 'string'
        ? profiles.find((p) => p.id === profileOrId) || profiles[0]
        : profileOrId;

    setActiveProfile(target);
    localStorage.setItem('netflix_active_profile', JSON.stringify(target));
    if (target?.id) {
      fetchUserWatchlist(target.id);
    }
  };

  // Delete Profile
  const deleteProfile = (profileId) => {
    if (profiles.length <= 1) return; // Keep at least one profile
    const updated = profiles.filter((p) => p.id !== profileId);
    updateProfilesList(updated);
    if (activeProfile?.id === profileId) {
      switchProfile(updated[0]);
    }
  };

  // Edit Profile Name
  const editProfile = (profileId, newName) => {
    const updated = profiles.map((p) =>
      p.id === profileId ? { ...p, name: newName.trim() } : p
    );
    updateProfilesList(updated);
    if (activeProfile?.id === profileId) {
      setActiveProfile({ ...activeProfile, name: newName.trim() });
    }
  };

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

      localStorage.setItem('netflix_token', data.token);
      localStorage.setItem('netflix_user', JSON.stringify(data));
      setUser(data);

      if (data.name) {
        const updated = [...profiles];
        updated[0] = { ...updated[0], name: data.name };
        updateProfilesList(updated);
        switchProfile(updated[0]);
      }

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

      localStorage.setItem('netflix_token', data.token);
      localStorage.setItem('netflix_user', JSON.stringify(data));
      setUser(data);

      if (data.name) {
        const updated = [...profiles];
        updated[0] = { ...updated[0], name: data.name };
        updateProfilesList(updated);
        switchProfile(updated[0]);
      }

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

      localStorage.setItem('netflix_token', data.token);
      localStorage.setItem('netflix_user', JSON.stringify(data));
      setUser(data);

      if (data.name) {
        const updated = [...profiles];
        updated[0] = { ...updated[0], name: data.name };
        updateProfilesList(updated);
        switchProfile(updated[0]);
      }

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

  // 8. Reset Database
  const resetDatabase = async () => {
    try {
      await fetch('/api/auth/reset-db', { method: 'POST' });
    } catch (e) {
      console.warn('Reset DB request sent');
    }
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem('netflix_token');
    localStorage.removeItem('netflix_user');
    setUser(null);
  };

  const toggleWatchlist = async (movieId) => {
    if (!movieId) return;
    const profileId = activeProfile?.id || 'p1';

    setWatchlist((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );

    const token = localStorage.getItem('netflix_token');
    if (token) {
      try {
        const res = await fetch('/api/movies/watchlist/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ movieId, profileId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.watchlist)) {
            setWatchlist(data.watchlist);
          }
        }
      } catch (err) {
        console.error('Watchlist sync error:', err);
      }
    }
  };

  const toggleLike = (movieId) => {
    setLikedMovies((prev) =>
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
        profiles,
        activeProfile,
        addProfile,
        switchProfile,
        deleteProfile,
        editProfile,
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
        likedMovies,
        toggleLike,
        apiHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
