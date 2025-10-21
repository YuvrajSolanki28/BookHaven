// frontend/src/components/UserPreferences.jsx
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const UserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: { email: true, push: true, newReleases: true },
    privacy: { profileVisible: true, purchaseHistory: false }
  });
  const [loading, setLoading] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
    setPreferences(prev => ({
      ...prev,
      theme: isDark ? 'dark' : 'light'
    }));
  }, [user, isDark]);


  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`https://book-haven-iota.vercel.app/api/user/preferences/${user.id}`);
      setPreferences(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Failed to fetch preferences');
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      await axios.put(`https://book-haven-iota.vercel.app/api/user/preferences/${user.id}`, preferences);
      toast.success('Preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (path, value) => {
    if (path === 'theme') {
      // Apply theme immediately based on selection
      if (value === 'dark') {
        if (!isDark) toggleTheme();
      } else if (value === 'light') {
        if (isDark) toggleTheme();
      } else if (value === 'auto') {
        // Auto mode: follow system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark && !isDark) toggleTheme();
        if (!systemPrefersDark && isDark) toggleTheme();
      }
    }

    setPreferences(prev => {
      const newPrefs = { ...prev };
      const keys = path.split('.');
      let current = newPrefs;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newPrefs;
    });
  };

  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">User Preferences</h2>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <div>
          <label className="block mb-2 text-sm font-medium dark:text-white">Theme</label>
          <select
            value={preferences.theme}
            onChange={(e) => updatePreference('theme', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block mb-2 text-sm font-medium dark:text-white">Language</label>
          <select
            value={preferences.language}
            onChange={(e) => updatePreference('language', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="mb-3 text-lg font-medium dark:text-white">Notifications</h3>
          <div className="space-y-2">
            {Object.entries(preferences.notifications).map(([key, value]) => (
              <label key={key} className="flex items-center dark:text-white">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updatePreference(`notifications.${key}`, e.target.checked)}
                  className="mr-2"
                />
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div>
          <h3 className="mb-3 text-lg font-medium dark:text-white">Privacy</h3>
          <div className="space-y-2">
            {Object.entries(preferences.privacy).map(([key, value]) => (
              <label key={key} className="flex items-center dark:text-white">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updatePreference(`privacy.${key}`, e.target.checked)}
                  className="mr-2"
                />
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={savePreferences}
          disabled={loading}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default UserPreferences;
