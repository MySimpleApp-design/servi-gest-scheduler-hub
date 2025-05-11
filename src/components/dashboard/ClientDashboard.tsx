
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    appointments, 
    getAppointmentsByClient, 
    getServiceById 
  } = useData();
  
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  if (!currentUser) return null;

  const clientAppointments = getAppointmentsByClient(currentUser.id);

  // Filter appointments by status if filter is set
  const filteredAppointments = filterStatus 
    ? clientAppointments.filter(app => app.status === filterStatus) 
    : clientAppointments;

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      case 'Concluído': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <Link to="/agendar">
          <Button size="lg" className="w-full md:w-auto">
            Agendar Novo Serviço
          </Button>
        </Link>

        <div className="w-full md:w-64">
          <Select 
            onValueChange={(value) => setFilterStatus(value === 'all' ? undefined : value)}
            defaultValue="all"
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Agendado">Agendado</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className="text-2xl font-semibold">Meus Agendamentos</h2>

      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              {filterStatus 
                ? `Você não possui agendamentos com status: ${filterStatus}`
                : 'Você ainda não possui agendamentos'}
            </p>
            <div className="mt-4 flex justify-center">
              <Link to="/agendar">
                <Button variant="outline">Agendar Agora</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment) => {
            const service = getServiceById(appointment.servicoId);
            return (
              <Card key={appointment.id} className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{service?.nome_servico || 'Serviço'}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(appointment.status)}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {format(new Date(appointment.data_hora), "PPP 'às' HH:mm", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Preço:</span> R$ {service?.preco.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Duração:</span> {service?.duracao || '60'} minutos
                    </p>
                    {appointment.observacao && (
                      <p className="text-sm">
                        <span className="font-medium">Observação:</span> {appointment.observacao}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
