// Tipos baseados no Contrato_API_V1.pdf — Módulos Base (barbeiros, serviços, clientes)
import { ImageSourcePropType } from "react-native"
export type Perfil = 'Admin' | 'Barbeiro' | 'Cliente';

// ----- Barbeiro -----
export interface Barbeiro {
  id: string;
  name: string;
  password: string;
  img: ImageSourcePropType; // URL da imagem do barbeiro
  start_time: string; // HH:mm
  end_time: string; // HH:mm
}

export interface CreateBarbeiroDTO {
  name: string;
  password: string;
  start_time: string;
  end_time: string;
}

export interface UpdateBarbeiroDTO {
  name?: string;
  password: string;
  start_time?: string;
  end_time?: string;
}

// ----- Serviço -----
export interface Servico
{
  id: string;
  nome: string;
  descricao?: string | null;
  preco: number;
  duracao: number;
  imagemUrl?: string | null;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateServicoDTO {
  nome?: string;
  descricao?: string | null;
  preco?: number;
  duracao?: number;
  imagemUrl?: string | null;
  ativo?: boolean;
}

export interface CreateServicoDTO {
  nome: string;
  descricao?: string | null;
  preco: number;
  duracao: number;
  imagemUrl?: string | null;
  ativo?: boolean;
}

// ----- Cliente -----
export interface Cliente {
  id: string;
  name: string;
  phone_number: string;
  password: string;
  email: string;
}

export interface CreateClienteDTO {
  name: string;
  password: string;
  phone_number: string;
}

export interface UpdateClienteDTO {
  name?: string;
  password?: string;
  phone_number?: string;
}

// ----- Erro padrão -----
export type ApiErrorCode = 400 | 401 | 403 | 404 | 409;

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export class ApiRequestError extends Error {
  status: ApiErrorCode;
  code: string;

  constructor(status: ApiErrorCode, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export type CreateBarbeiro = Omit<Barbeiro, 'id'>;
export type UpdateBarbeiro = Partial<CreateBarbeiro>;
export type BarbeiroResponse = Omit<Barbeiro, 'password'>;

export type ClienteResponse = Omit<Cliente, 'password'>;