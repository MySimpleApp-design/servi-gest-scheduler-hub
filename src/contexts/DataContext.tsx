
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Service, Appointment, AppointmentStatus } from '@/types';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Sample data
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    prestadorId: '1',
    nome_servico: 'Corte de Cabelo',
    descricao: 'Corte feminino completo',
    preco: 80.00,
    duracao: 60,
  },
  {
    id: '2',
    prestadorId: '1',
    nome_servico: 'Manicure',
    descricao: 'Tratamento completo para unhas das mãos',
    preco: 40.00,
    duracao: 45,
  },
  {
    id: '3',
    prestadorId: '3',
    nome_servico: 'Massagem Relaxante',
    descricao: 'Massagem corporal para relaxamento',
    preco: 120.00,
    duracao: 60,
  }
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    clienteId: '2',
    prestadorId: '1',
    servicoId: '1',
    data_hora: new Date('2025-05-12T10:00:00'),
    status: 'Agendado',
    observacao: 'Primeira visita'
  },
  {
    id: '2',
    clienteId: '2',
    prestadorId: '3',
    servicoId: '3',
    data_hora: new Date('2025-05-15T14:30:00'),
    status: 'Agendado'
  },
  {
    id: '3',
    clienteId: '2',
    prestadorId: '1',
    servicoId: '2',
    data_hora: new Date('2025-05-10T09:00:00'),
    status: 'Concluído'
  }
];

interface DataContextType {
  services: Service[];
  appointments: Appointment[];
  addService: (service: Omit<Service, 'id' | 'prestadorId'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  getServiceById: (id: string) => Service | undefined;
  getServicesByProvider: (providerId: string) => Service[];
  getAppointmentsByClient: (clientId: string) => Appointment[];
  getAppointmentsByProvider: (providerId: string) => Appointment[];
  getAllProviders: () => { id: string, nome: string }[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([...MOCK_SERVICES]);
  const [appointments, setAppointments] = useState<Appointment[]>([...MOCK_APPOINTMENTS]);
  const { currentUser } = useAuth();

  // Get service by ID
  const getServiceById = (id: string) => {
    return services.find(service => service.id === id);
  };

  // Get services by provider
  const getServicesByProvider = (providerId: string) => {
    return services.filter(service => service.prestadorId === providerId);
  };

  // Get appointments by client
  const getAppointmentsByClient = (clientId: string) => {
    return appointments.filter(appointment => appointment.clienteId === clientId);
  };

  // Get appointments by provider
  const getAppointmentsByProvider = (providerId: string) => {
    return appointments.filter(appointment => appointment.prestadorId === providerId);
  };

  // Get all providers (simplified for demo)
  const getAllProviders = () => {
    const providerIds = [...new Set(services.map(service => service.prestadorId))];
    return providerIds.map(id => ({ id, nome: `Prestador ${id}` }));
  };

  // Add a new service
  const addService = (service: Omit<Service, 'id' | 'prestadorId'>) => {
    if (!currentUser) return;
    
    const newService = {
      ...service,
      id: `${services.length + 1}`,
      prestadorId: currentUser.id,
    };
    
    setServices([...services, newService]);
  };

  // Update an existing service
  const updateService = (updatedService: Service) => {
    setServices(services.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
  };

  // Delete a service
  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  // Add a new appointment
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointment,
      id: `${appointments.length + 1}`,
    };
    
    setAppointments([...appointments, newAppointment]);
  };

  // Update appointment status
  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status } : appointment
    ));
  };

  return (
    <DataContext.Provider 
      value={{ 
        services, 
        appointments, 
        addService, 
        updateService, 
        deleteService, 
        addAppointment, 
        updateAppointmentStatus,
        getServiceById,
        getServicesByProvider,
        getAppointmentsByClient,
        getAppointmentsByProvider,
        getAllProviders
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
