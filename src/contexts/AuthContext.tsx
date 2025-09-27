import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'student' | 'professional' | 'organizer';
  company?: string;
  designation?: string;
  college?: string;
  year?: string;
  degree?: string;
  foodChoice: string;
  emergencyContact: string;
  registrationId: string;
  checkedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'registrationId' | 'checkedIn'>) => User;
  checkIn: (registrationId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const generateRegistrationId = () => {
    return 'IPX' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
  };

  const register = (userData: Omit<User, 'id' | 'registrationId' | 'checkedIn'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      registrationId: generateRegistrationId(),
      checkedIn: false,
    };

    // Save to all users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Set as current user
    setUser(newUser);
    
    return newUser;
  };

  const login = (loginUser: User) => {
    setUser(loginUser);
  };

  const logout = () => {
    setUser(null);
  };

  const checkIn = (registrationId: string) => {
    if (user && user.registrationId === registrationId) {
      const updatedUser = { ...user, checkedIn: true };
      setUser(updatedUser);

      // Update in all users list
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const index = users.findIndex((u: User) => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }

      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, checkIn }}>
      {children}
    </AuthContext.Provider>
  );
};