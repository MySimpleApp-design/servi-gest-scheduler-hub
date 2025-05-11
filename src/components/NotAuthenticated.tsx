
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NotAuthenticatedProps {
  children: React.ReactNode;
}

const NotAuthenticated: React.FC<NotAuthenticatedProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !currentUser) {
      toast({
        title: "Acesso restrito",
        description: "Você precisa estar logado para acessar esta página.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [currentUser, loading, navigate, location, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-lg font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
};

export default NotAuthenticated;
