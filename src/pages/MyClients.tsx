
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const MyClients = () => {
  const { currentUser } = useAuth();
  const { appointments } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authorized to access this page
  useEffect(() => {
    if (currentUser?.tipo !== 'Prestador') {
      navigate('/dashboard');
      toast({
        title: "Acesso restrito",
        description: "Apenas prestadores de serviço podem acessar esta página.",
        variant: "destructive",
      });
    }
  }, [currentUser, navigate, toast]);

  if (!currentUser || currentUser.tipo !== 'Prestador') return null;

  // Mock client data (in a real app, this would come from the backend)
  const mockClients = [
    { id: '2', nome: 'João Santos', email: 'joao@exemplo.com' },
    { id: '4', nome: 'Carlos Mendes', email: 'carlos@exemplo.com' },
    { id: '5', nome: 'Lucia Ferreira', email: 'lucia@exemplo.com' },
  ];

  // Get appointments by provider
  const providerAppointments = appointments.filter(
    app => app.prestadorId === currentUser.id
  );

  // Calculate appointment counts by client
  const clientStats = mockClients.map(client => {
    const clientAppointments = providerAppointments.filter(app => app.clienteId === client.id);
    const total = clientAppointments.length;
    const completed = clientAppointments.filter(app => app.status === 'Concluído').length;
    const scheduled = clientAppointments.filter(app => app.status === 'Agendado').length;
    const canceled = clientAppointments.filter(app => app.status === 'Cancelado').length;
    
    return {
      ...client,
      total,
      completed,
      scheduled,
      canceled
    };
  }).filter(client => client.total > 0); // Only show clients with appointments

  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-3xl font-bold">Meus Clientes</h1>
        <p className="text-gray-500">Visualize os clientes que agendaram serviços com você</p>
      </div>

      {clientStats.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-500">Você ainda não possui clientes com agendamentos</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Total de Agendamentos</TableHead>
                  <TableHead className="text-center">Agendados</TableHead>
                  <TableHead className="text-center">Concluídos</TableHead>
                  <TableHead className="text-center">Cancelados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientStats.map(client => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.nome}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell className="text-center">{client.total}</TableCell>
                    <TableCell className="text-center">
                      {client.scheduled > 0 ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {client.scheduled}
                        </Badge>
                      ) : (
                        '0'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {client.completed > 0 ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {client.completed}
                        </Badge>
                      ) : (
                        '0'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {client.canceled > 0 ? (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          {client.canceled}
                        </Badge>
                      ) : (
                        '0'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default MyClients;
