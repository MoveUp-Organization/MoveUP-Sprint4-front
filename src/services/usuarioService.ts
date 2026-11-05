import { apiRequest } from './api';
export interface Usuario {
  idUsuario: number | null;
  nomeUsuario: string;
  email: string;
  senha: string;
}

export type NovoUsuario = Omit<Usuario, 'idUsuario'>;

export const usuarioService = {
  listar: () =>
    apiRequest<Usuario[]>('/usuario'),

  buscarPorId: (id: number) =>
    apiRequest<Usuario>(`/usuario/${id}`),

  cadastrar: (usuario: NovoUsuario) => {
    console.log('Dados enviados para cadastro:', {
      nomeUsuario: usuario.nomeUsuario,
      email: usuario.email,
    });

    return apiRequest<Usuario>('/usuario', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
  },

  atualizar: (id: number, usuario: NovoUsuario) =>
    apiRequest<Usuario>(`/usuario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario),
    }),

  excluir: (id: number) =>
    apiRequest<void>(`/usuario/${id}`, {
      method: 'DELETE',
    }),
};
