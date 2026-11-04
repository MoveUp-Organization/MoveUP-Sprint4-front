export function chavePorConta(chave: string): string {
  try {
    const usuarioSalvo = localStorage.getItem('moveupUsuario');
    const estaLogado = localStorage.getItem('moveupLogado') === 'true';

    if (estaLogado && usuarioSalvo) {
      const usuario = JSON.parse(usuarioSalvo);

      const email = String(usuario.email ?? '')
        .trim()
        .toLowerCase();

      if (email) {
        return `moveup:${email}:${chave}`;
      }
    }
  } catch (error) {
    console.error('Erro ao identificar conta:', error);
  }

  return `moveup:visitante:${chave}`;
}

export const armazenamentoLocalConta = {
  getItem(chave: string): string | null {
    return localStorage.getItem(chavePorConta(chave));
  },

  setItem(chave: string, valor: string): void {
    localStorage.setItem(chavePorConta(chave), valor);
  },

  removeItem(chave: string): void {
    localStorage.removeItem(chavePorConta(chave));
  },
};

export const armazenamentoSessaoConta = {
  getItem(chave: string): string | null {
    return sessionStorage.getItem(chavePorConta(chave));
  },

  setItem(chave: string, valor: string): void {
    sessionStorage.setItem(chavePorConta(chave), valor);
  },

  removeItem(chave: string): void {
    sessionStorage.removeItem(chavePorConta(chave));
  },
};