import { Barbeiro, Cliente, Servico } from './types';

// Dados fake em memória — simula o que viria do banco real.
// Ids como strings pra já bater com o formato esperado da API real.

export const barbeiroImages: Record<string, any> = {
  '1': require('../../../assets/images/Screenshot from 2026-09-25 13-54-10.png'),
  '2': require('../../../assets/images/Screenshot from 2026-09-25 13-54-10.png'),
  '3': require('../../../assets/images/Screenshot from 2026-09-25 13-54-10.png'),
  '4': require('../../../assets/images/Screenshot from 2026-09-25 13-54-10.png'),
};

export let mockBarbeiros: Barbeiro[] = [
  { id: '1', name: 'João Silva', start_time: '09:00', password: "something", end_time: '18:00', img: require('../../../assets/images/Screenshot from 2026-09-25 13-54-10.png') },
  { id: '2', name: 'Carlos Souza', start_time: '10:00', password: "something", end_time: '19:00', img: require('../../../assets/images/Screenshot from 2026-09-25 13-54-10.png') },
  { id: '3', name: 'Mario Oliveira', start_time: '08:00', password: "something", end_time: '17:00', img: require('../../../assets/images/Screenshot from 2026-09-25 13-54-10.png') },
  { id: '4', name: 'Analto Santos', start_time: '09:00', password: "something", end_time: '18:00', img: require('../../../assets/images/Screenshot from 2026-09-25 13-54-10.png') },
];

export let mockServicos: Servico[] = [
  {
    id: '1', name: 'Corte de cabelo', preco: 35, serv_time: 30,
    ativo: false,
    createdAt: undefined,
    updatedAt: undefined
  },
  {
    id: '2', name: 'Barba', preco: 20, serv_time: 20,
    ativo: false,
    createdAt: undefined,
    updatedAt: undefined
  },
  {
    id: '3', name: 'Corte + Barba', preco: 50, serv_time: 45,
    ativo: false,
    createdAt: undefined,
    updatedAt: undefined
  },
  {
    id: '4', name: 'Barba', preco: 50, serv_time: 45,
    ativo: false,
    createdAt: undefined,
    updatedAt: undefined
  },
  {
    id: '5', name: 'Pintura', preco: 50, serv_time: 45,
    ativo: false,
    createdAt: undefined,
    updatedAt: undefined
  },
];

export let mockClientes: Cliente[] = [
  { id: '1', name: 'Pedro Lima', phone_number: '11999990000', password: "something", email: "something@gmail.com" },
];

// Simula quem está "logado" — troque conforme a tela/perfil que estiver testando
export const mockSession: { id: string; perfil: 'Admin' | 'Barbeiro' | 'Cliente' } =
{
  id: '1',
  perfil: 'Admin',
};
