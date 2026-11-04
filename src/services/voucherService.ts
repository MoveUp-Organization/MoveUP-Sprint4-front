
import { apiRequest } from './api';

export interface Voucher {
  cdCartao: number | null;
  numeroCartao: string;
  titular: string;
  tipo: string;
  status: 'ATIVO' | 'INATIVO';
  saldoDisponivel: number;
}

export type NovoVoucher = Omit<Voucher, 'cdCartao'>;

export const voucherService = {
  listar: () =>
    apiRequest<Voucher[]>('/voucher'),

  buscarPorId: (id: number) =>
    apiRequest<Voucher>(`/voucher/${id}`),

  cadastrar: (voucher: NovoVoucher) =>
    apiRequest<Voucher>('/voucher', {
      method: 'POST',
      body: JSON.stringify(voucher),
    }),

  atualizar: (id: number, voucher: NovoVoucher) =>
    apiRequest<Voucher>(`/voucher/${id}`, {
      method: 'PUT',
      body: JSON.stringify(voucher),
    }),

  excluir: (id: number) =>
    apiRequest<void>(`/voucher/${id}`, {
      method: 'DELETE',
    }),
};
