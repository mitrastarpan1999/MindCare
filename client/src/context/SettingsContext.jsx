import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    backgroundColor: '#f9fafb',
    siteTitle: 'Mental Health Platform',
    siteDescription: 'Connect with professional psychologists',
    contactEmail: 'support@mentalhealth.com',
    contactPhone: '+1-555-0100',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/public/settings');
        if (response.data && Object.keys(response.data).length > 0) {
          setSettings((prev) => ({ ...prev, ...response.data }));
        }
      } catch (error) {
        console.log('Using default settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Apply CSS variables to document root
  useEffect(() => {
    if (!loading) {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
      document.documentElement.style.setProperty('--background-color', settings.backgroundColor);
      document.body.style.backgroundColor = settings.backgroundColor;
    }
  }, [settings, loading]);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
