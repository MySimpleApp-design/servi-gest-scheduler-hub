
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserType } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nome: string, email: string, password: string, tipo: UserType) => Promise<void>;
  logout: () => void;
}

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    email: 'maria@exemplo.com',
    foto: 'https://i.pravatar.cc/150?img=1',
    tipo: 'Prestador',
  },
  {
    id: '2',
    nome: 'João Santos',
    email: 'joao@exemplo.com',
    foto: 'https://i.pravatar.cc/150?img=2',
    tipo: 'Cliente',
  },
  {
    id: '3',
    nome: 'Ana Oliveira',
    email: 'ana@exemplo.com',
    foto: 'https://i.pravatar.cc/150?img=3',
    tipo: 'Prestador',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a user in localStorage
    const savedUser = localStorage.getItem('servigest_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Mock login logic
    try {
      // In a real app, you would validate with an API
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      setCurrentUser(user);
      localStorage.setItem('servigest_user', JSON.stringify(user));
      console.log('Login bem-sucedido:', user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nome: string, email: string, password: string, tipo: UserType) => {
    setLoading(true);
    // Mock register logic
    try {
      // Check if user exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('E-mail já cadastrado');
      }

      // Create new user
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        nome,
        email,
        tipo,
      };

      // In a real app, you would save this to your backend
      // For mock purposes, we'll just update our client state
      MOCK_USERS.push(newUser);
      
      setCurrentUser(newUser);
      localStorage.setItem('servigest_user', JSON.stringify(newUser));
      console.log('Cadastro bem-sucedido:', newUser);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('servigest_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
