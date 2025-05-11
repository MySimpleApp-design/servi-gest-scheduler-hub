
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, setHours, setMinutes, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

const Booking = () => {
  const { currentUser } = useAuth();
  const { services, addAppointment } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Providers list
  const [providers, setProviders] = useState<{id: string, nome: string}[]>([]);

  // Get unique providers from services
  useEffect(() => {
    const uniqueProviders = Array.from(new Set(services.map(s => s.prestadorId)))
      .map(id => ({ id, nome: `Prestador ${id}` }));
    
    setProviders(uniqueProviders);
  }, [services]);

  // Check if user is authorized to access this page
  useEffect(() => {
    if (currentUser?.tipo !== 'Cliente') {
      navigate('/dashboard');
      toast({
        title: "Acesso restrito",
        description: "Apenas clientes podem acessar esta página.",
        variant: "destructive",
      });
    }
  }, [currentUser, navigate, toast]);

  if (!currentUser || currentUser.tipo !== 'Cliente') return null;

  // Get services by selected provider
  const getProviderServices = () => {
    if (!selectedProviderId) return [];
    return services.filter(service => service.prestadorId === selectedProviderId);
  };

  // Get selected service
  const selectedService = selectedServiceId 
    ? services.find(service => service.id === selectedServiceId) 
    : undefined;

  // Generate time slots - 8AM to 6PM in 30min increments
  const getTimeSlots = () => {
    if (!selectedDate) return [];
    
    const timeSlots = [];
    const startTime = setHours(setMinutes(selectedDate, 0), 8); // 8:00 AM
    const endTime = setHours(setMinutes(selectedDate, 0), 18);  // 6:00 PM
    
    let currentTime = startTime;
    while (currentTime < endTime) {
      timeSlots.push(format(currentTime, 'HH:mm'));
      currentTime = addMinutes(currentTime, 30);
    }
    
    return timeSlots;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !selectedProviderId || !selectedServiceId || !selectedDate || !selectedTime) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    // Convert selectedTime (HH:mm) to full date
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes);
    
    try {
      setIsLoading(true);
      
      addAppointment({
        clienteId: currentUser.id,
        prestadorId: selectedProviderId,
        servicoId: selectedServiceId,
        data_hora: appointmentDate,
        status: 'Agendado',
        observacao: notes || undefined
      });
      
      toast({
        title: "Agendamento concluído!",
        description: "Seu agendamento foi realizado com sucesso.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro no agendamento",
        description: "Não foi possível concluir o agendamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-3xl font-bold">Agendar Serviço</h1>
        <p className="text-gray-500">Escolha um prestador e serviço para agendar</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Formulário de Agendamento</CardTitle>
            <CardDescription>Preencha os dados para realizar seu agendamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider selection */}
            <div className="space-y-2">
              <Label htmlFor="provider">Selecione o Prestador *</Label>
              <Select 
                value={selectedProviderId}
                onValueChange={value => {
                  setSelectedProviderId(value);
                  setSelectedServiceId('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prestador" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service selection */}
            <div className="space-y-2">
              <Label htmlFor="service">Selecione o Serviço *</Label>
              <Select 
                value={selectedServiceId}
                onValueChange={setSelectedServiceId}
                disabled={!selectedProviderId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedProviderId ? "Selecione um serviço" : "Primeiro selecione um prestador"} />
                </SelectTrigger>
                <SelectContent>
                  {getProviderServices().map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.nome_servico} - R$ {service.preco.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedService && (
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                  <p><strong>Detalhes do serviço:</strong></p>
                  <p>{selectedService.descricao || "Sem descrição disponível"}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="font-medium">Preço:</span>
                      <p>R$ {selectedService.preco.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Duração:</span>
                      <p>{selectedService.duracao} minutos</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Date selection */}
            <div className="space-y-2">
              <Label>Selecione a Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                    disabled={!selectedServiceId}
                  >
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    fromDate={new Date()}
                    toDate={addDays(new Date(), 60)}
                    disabled={!selectedServiceId}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time selection */}
            <div className="space-y-2">
              <Label>Selecione o Horário *</Label>
              <Select 
                value={selectedTime} 
                onValueChange={setSelectedTime}
                disabled={!selectedDate}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedDate ? "Selecione um horário" : "Primeiro selecione uma data"} />
                </SelectTrigger>
                <SelectContent>
                  {getTimeSlots().map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações para o prestador"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !selectedServiceId || !selectedDate || !selectedTime}>
              {isLoading ? "Confirmando..." : "Confirmar Agendamento"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Layout>
  );
};

export default Booking;
