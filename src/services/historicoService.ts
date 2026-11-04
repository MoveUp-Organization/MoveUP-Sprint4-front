
import { apiRequest } from './api';

export interface Historico {
  idHistorico: number | null;
  data: string;
  transporte: string;
  quantidadePassagem: number;
  pontos: number;
  status: 'ATIVO' | 'INATIVO';
}

export type NovoHistorico = Omit<Historico, 'idHistorico'>;

export const historicoService = {
  listar: () =>
    apiRequest<Historico[]>('/historico'),

  buscarPorId: (id: number) =>
    apiRequest<Historico>(`/historico/${id}`),

  cadastrar: (historico: NovoHistorico) =>
    apiRequest<Historico>('/historico', {
      method: 'POST',
      body: JSON.stringify(historico),
    }),

  atualizar: (id: number, historico: NovoHistorico) =>
    apiRequest<Historico>(`/historico/${id}`, {
      method: 'PUT',
      body: JSON.stringify(historico),
    }),

  excluir: (id: number) =>
    apiRequest<void>(`/historico/${id}`, {
      method: 'DELETE',
    }),
};
