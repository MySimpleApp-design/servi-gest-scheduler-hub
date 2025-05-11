
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import ProviderDashboard from '@/components/dashboard/ProviderDashboard';

const Dashboard = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-lg font-medium">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Bem-vindo(a), {currentUser.nome}</p>
      </div>

      {currentUser.tipo === 'Cliente' ? (
        <ClientDashboard />
      ) : (
        <ProviderDashboard />
      )}
    </Layout>
  );
};

export default Dashboard;
