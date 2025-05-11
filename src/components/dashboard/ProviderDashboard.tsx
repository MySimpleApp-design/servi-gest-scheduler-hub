
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { PieChart, Pie, Cell as PieCell, Legend } from 'recharts';

const ProviderDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    appointments, 
    services,
    getServiceById,
    getAppointmentsByProvider,
    getServicesByProvider
  } = useData();
  
  if (!currentUser) return null;
  
  const providerAppointments = getAppointmentsByProvider(currentUser.id);
  const providerServices = getServicesByProvider(currentUser.id);

  // Calculate total appointments
  const totalAppointments = providerAppointments.length;
  
  // Calculate monthly revenue (completed appointments)
  const monthlyRevenue = providerAppointments
    .filter(app => app.status === 'Concluído')
    .reduce((total, app) => {
      const service = getServiceById(app.servicoId);
      return total + (service?.preco || 0);
    }, 0);

  // Get upcoming appointments
  const upcomingAppointments = providerAppointments
    .filter(app => app.status === 'Agendado' && new Date(app.data_hora) > new Date())
    .sort((a, b) => new Date(a.data_hora).getTime() - new Date(b.data_hora).getTime())
    .slice(0, 5);

  // Prepare data for service popularity chart
  const serviceStats = providerServices.map(service => {
    const count = providerAppointments.filter(app => app.servicoId === service.id).length;
    return {
      name: service.nome_servico,
      count
    };
  }).sort((a, b) => b.count - a.count);

  // Prepare data for appointment status chart
  const statusCounts = {
    Agendado: providerAppointments.filter(app => app.status === 'Agendado').length,
    Concluído: providerAppointments.filter(app => app.status === 'Concluído').length,
    Cancelado: providerAppointments.filter(app => app.status === 'Cancelado').length,
  };
  
  const statusData = [
    { name: 'Agendado', value: statusCounts.Agendado },
    { name: 'Concluído', value: statusCounts.Concluído },
    { name: 'Cancelado', value: statusCounts.Cancelado },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Agendamentos</CardTitle>
            <CardDescription>Em todos os períodos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAppointments}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Receita do Mês</CardTitle>
            <CardDescription>De agendamentos concluídos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {monthlyRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Serviços Oferecidos</CardTitle>
            <CardDescription>Total de serviços cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{providerServices.length}</p>
          </CardContent>
          <CardFooter>
            <Link to="/meus-servicos">
              <Button variant="ghost" size="sm" className="w-full">Ver Todos</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/meus-servicos">
          <Button size="lg" className="w-full">
            Ver Meus Serviços
          </Button>
        </Link>
        <Link to="/meus-clientes">
          <Button variant="outline" size="lg" className="w-full">
            Ver Meus Clientes
          </Button>
        </Link>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Popular Services Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Serviços Mais Agendados</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={serviceStats}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Status Distribution Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Status dos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <PieCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Próximos Agendamentos</h2>
        
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-gray-500">Você não possui agendamentos próximos</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-3 px-4 font-medium">Serviço</th>
                  <th className="py-3 px-4 font-medium">Data e Hora</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Observação</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((appointment) => {
                  const service = getServiceById(appointment.servicoId);
                  return (
                    <tr key={appointment.id} className="border-t">
                      <td className="py-3 px-4">{service?.nome_servico || 'Serviço'}</td>
                      <td className="py-3 px-4">
                        {format(new Date(appointment.data_hora), "PPP 'às' HH:mm", { locale: ptBR })}
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant="outline" 
                          className={appointment.status === 'Agendado' ? 'bg-blue-100 text-blue-800' : 
                            appointment.status === 'Concluído' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}
                        >
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{appointment.observacao || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
