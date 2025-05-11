
export type UserType = "Cliente" | "Prestador";

export interface User {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  tipo: UserType;
}

export interface Service {
  id: string;
  prestadorId: string;
  nome_servico: string;
  descricao: string;
  preco: number;
  duracao: number;
}

export type AppointmentStatus = "Agendado" | "Concluído" | "Cancelado";

export interface Appointment {
  id: string;
  clienteId: string;
  prestadorId: string;
  servicoId: string;
  data_hora: Date;
  status: AppointmentStatus;
  observacao?: string;
}

export interface Cliente extends User {
  tipo: "Cliente";
}

export interface Prestador extends User {
  tipo: "Prestador";
}
