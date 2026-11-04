
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
  getItem(chave: string) {
    return localStorage.getItem(chavePorConta(chave));
  },

  setItem(chave: string, valor: string) {
    localStorage.setItem(chavePorConta(chave), valor);
  },
};

export const armazenamentoSessaoConta = {
  getItem(chave: string) {
    return sessionStorage.getItem(chavePorConta(chave));
  },

  setItem(chave: string, valor: string) {
    sessionStorage.setItem(chavePorConta(chave), valor);
  },
};
