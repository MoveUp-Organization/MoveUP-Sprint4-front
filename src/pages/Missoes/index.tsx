import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  armazenamentoLocalConta,
  armazenamentoSessaoConta,
} from '../../services/armazenamentoConta';

interface Missao {
  id: number;
  titulo: string;
  descricao: string;
  recompensa: number;
  categoria: 'diaria' | 'conteudo' | 'desafio' | 'especial';
  concluida: boolean;
}

interface ModalDados {
  titulo: string;
  recompensa: number;
  co2Evitado: number | null;
  distanciaKm: number;
}

interface RegistroMobilidade {
  id: string;
  data: string;
  tipo: string;
  distanciaKm: number;
  pontos: number;
  co2Evitado: number;
}

interface Atividade {
  id: number;
  data: string;
  tipo: string;
  distancia: string;
  pontos: string;
  co2Evitado: number;
}

interface DadosSaldo {
  saldo?: number;
  greenPointsAcumulados?: number;
}

const CHAVE_MISSOES = 'moveupMissoes';
const CHAVE_REGISTROS = 'moveupRegistrosMobilidade';
const CHAVE_ATIVIDADES = 'moveupAtividades';
const CHAVE_SALDO = 'moveup_saldo';
const CHAVE_PONTOS = 'greenPointsSaldo';

const missoesIniciais: Missao[] = [
  {
    id: 1,
    titulo: 'Check-in Diário',
    descricao: 'Abra a plataforma hoje para garantir seus pontos de presença.',
    recompensa: 50,
    categoria: 'diaria',
    concluida: false,
  },
  {
    id: 2,
    titulo: 'Primeiros Passos',
    descricao:
      'Assista ao vídeo de introdução e aprenda a usar nossa plataforma sustentável.',
    recompensa: 150,
    categoria: 'conteudo',
    concluida: false,
  },
  {
    id: 3,
    titulo: 'Perfil Completo',
    descricao:
      'Preencha seus dados de usuário e adicione uma foto de perfil para maior segurança.',
    recompensa: 300,
    categoria: 'desafio',
    concluida: false,
  },
  {
    id: 4,
    titulo: 'Consciência Verde',
    descricao:
      'Responda corretamente ao quiz semanal sobre reciclagem e descarte sustentável.',
    recompensa: 500,
    categoria: 'especial',
    concluida: false,
  },
  {
    id: 5,
    titulo: 'Pedale 5km',
    descricao:
      'Use bicicleta para percorrer pelo menos 5 km em um dia e ganhe pontos extras.',
    recompensa: 200,
    categoria: 'desafio',
    concluida: false,
  },
  {
    id: 6,
    titulo: 'Transporte Público',
    descricao:
      'Utilize o transporte público no trajeto para o trabalho ou escola por 3 dias.',
    recompensa: 350,
    categoria: 'especial',
    concluida: false,
  },
];

const coresBadge: Record<string, string> = {
  diaria: 'bg-blue-100 text-blue-700',
  conteudo: 'bg-purple-100 text-purple-700',
  desafio: 'bg-amber-100 text-amber-700',
  especial: 'bg-emerald-100 text-emerald-700',
};

const labelBadge: Record<string, string> = {
  diaria: 'Diária',
  conteudo: 'Conteúdo',
  desafio: 'Desafio',
  especial: 'Especial',
};

const calcularCo2Evitado = (kmPercorrido: number): number => {
  const co2CarroPorKm = 0.21;
  const co2TransportePublicoPorKm = 0.05;

  return (co2CarroPorKm - co2TransportePublicoPorKm) * kmPercorrido;
};

const lerLista = <T,>(chave: string): T[] => {
  try {
    const valor = armazenamentoLocalConta.getItem(chave);

    if (!valor) return [];

    const dados: unknown = JSON.parse(valor);

    return Array.isArray(dados) ? (dados as T[]) : [];
  } catch {
    return [];
  }
};

const carregarMissoes = (): Missao[] => {
  try {
    const salvas = armazenamentoLocalConta.getItem(CHAVE_MISSOES);

    if (!salvas) return missoesIniciais;

    const missoesSalvas: unknown = JSON.parse(salvas);

    if (!Array.isArray(missoesSalvas)) return missoesIniciais;

    return missoesIniciais.map((missao) => {
      const salva = missoesSalvas.find(
        (item: Partial<Missao>) => item.id === missao.id
      );

      return salva
        ? { ...missao, concluida: salva.concluida === true }
        : missao;
    });
  } catch {
    return missoesIniciais;
  }
};

const carregarPontos = (): number => {
  try {
    const saldoSalvo = armazenamentoSessaoConta.getItem(CHAVE_SALDO);

    if (saldoSalvo) {
      const dados: DadosSaldo = JSON.parse(saldoSalvo);

      if (
        typeof dados.greenPointsAcumulados === 'number' &&
        Number.isFinite(dados.greenPointsAcumulados)
      ) {
        return dados.greenPointsAcumulados;
      }
    }

    const pontosLocais = armazenamentoLocalConta.getItem(CHAVE_PONTOS);

    if (pontosLocais) {
      const pontos: unknown = JSON.parse(pontosLocais);

      if (typeof pontos === 'number' && Number.isFinite(pontos)) {
        return pontos;
      }
    }

    return 0;
  } catch {
    return 0;
  }
};

const salvarPontos = (pontos: number): void => {
  let saldo: DadosSaldo = {};

  try {
    const salvo = armazenamentoSessaoConta.getItem(CHAVE_SALDO);

    if (salvo) {
      saldo = JSON.parse(salvo);
    }
  } catch {
    saldo = {};
  }

  armazenamentoSessaoConta.setItem(
    CHAVE_SALDO,
    JSON.stringify({
      ...saldo,
      greenPointsAcumulados: pontos,
    })
  );

  armazenamentoLocalConta.setItem(CHAVE_PONTOS, JSON.stringify(pontos));
};

const salvarRegistroMobilidade = (
  tipo: string,
  distanciaKm: number,
  co2Evitado: number
): void => {
  const registros = lerLista<RegistroMobilidade>(CHAVE_REGISTROS);

  registros.push({
    id: `${Date.now()}-${Math.random()}`,
    data: new Date().toLocaleDateString('en-CA'),
    tipo,
    distanciaKm,
    pontos: 0,
    co2Evitado,
  });

  armazenamentoLocalConta.setItem(
    CHAVE_REGISTROS,
    JSON.stringify(registros)
  );
};

const salvarAtividade = (
  titulo: string,
  pontos: number,
  distanciaKm: number,
  co2Evitado: number
): void => {
  const atividades = lerLista<Atividade>(CHAVE_ATIVIDADES);

  atividades.unshift({
    id: Date.now(),
    data: new Date().toLocaleDateString('pt-BR'),
    tipo: `🎯 Missão: ${titulo}`,
    distancia: `${distanciaKm} km`,
    pontos: `+${pontos} pts`,
    co2Evitado,
  });

  armazenamentoLocalConta.setItem(
    CHAVE_ATIVIDADES,
    JSON.stringify(atividades)
  );
};

export default function Missoes() {
  const [missoes, setMissoes] = useState<Missao[]>(carregarMissoes);
  const [movePoints, setMovePoints] = useState<number>(carregarPontos);
  const [modal, setModal] = useState<ModalDados | null>(null);
  const [distancia, setDistancia] = useState('');

  const missoesEmProcessamento = useRef<Set<number>>(new Set());

  useEffect(() => {
    armazenamentoLocalConta.setItem(
      CHAVE_MISSOES,
      JSON.stringify(missoes)
    );
  }, [missoes]);

  const finalizarMissao = (
    missao: Missao,
    distanciaKm: number,
    co2Evitado: number
  ): void => {
    if (
      missao.concluida ||
      missoesEmProcessamento.current.has(missao.id)
    ) {
      return;
    }

    missoesEmProcessamento.current.add(missao.id);

    try {
      const novasMissoes = missoes.map((item) =>
        item.id === missao.id
          ? { ...item, concluida: true }
          : item
      );

      const novosPontos = movePoints + missao.recompensa;

      const tipo = missao.id === 5 ? 'bicicleta' : 'onibus';

      if (distanciaKm > 0) {
        salvarRegistroMobilidade(tipo, distanciaKm, co2Evitado);
      }

      salvarAtividade(
        missao.titulo,
        missao.recompensa,
        distanciaKm,
        co2Evitado
      );

      salvarPontos(novosPontos);

      armazenamentoLocalConta.setItem(
        CHAVE_MISSOES,
        JSON.stringify(novasMissoes)
      );

      setMissoes(novasMissoes);
      setMovePoints(novosPontos);

      setModal({
        titulo: missao.titulo,
        recompensa: missao.recompensa,
        co2Evitado,
        distanciaKm,
      });
    } catch {
      window.alert(
        'Não foi possível concluir a missão. Tente novamente.'
      );
    } finally {
      missoesEmProcessamento.current.delete(missao.id);
    }
  };

  const concluirMissao = (id: number): void => {
    const missao = missoes.find((item) => item.id === id);

    if (
      !missao ||
      missao.concluida ||
      missoesEmProcessamento.current.has(id)
    ) {
      return;
    }

    if (missao.id === 6) {
      setModal({
        titulo: missao.titulo,
        recompensa: missao.recompensa,
        co2Evitado: null,
        distanciaKm: 0,
      });

      return;
    }

    if (missao.id === 5) {
      finalizarMissao(missao, 5, 0);
      return;
    }

    finalizarMissao(missao, 0, 0);
  };

  const confirmarTransportePublico = (): void => {
    const kmPercorrido = Number(distancia.replace(',', '.'));

    if (
      !distancia.trim() ||
      !Number.isFinite(kmPercorrido) ||
      kmPercorrido <= 0
    ) {
      return;
    }

    const missao = missoes.find((item) => item.id === 6);

    if (!missao || missao.concluida) return;

    const co2Evitado = calcularCo2Evitado(kmPercorrido);

    finalizarMissao(missao, kmPercorrido, co2Evitado);
    setDistancia('');
  };

  const fecharModal = (): void => {
    setModal(null);
    setDistancia('');
  };

  return (
    <main className="w-full max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <section className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-3">
          Missões Disponíveis
        </h1>

        <p className="text-gray-500 text-base sm:text-lg">
          Complete as tarefas abaixo para acumular pontos e subir de nível!
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {missoes.map((missao) => (
          <article
            key={missao.id}
            className="min-w-0 bg-white rounded-2xl p-4 sm:p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${coresBadge[missao.categoria]}`}
              >
                {labelBadge[missao.categoria]}
              </span>

              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h2 className="text-lg font-bold text-dark break-words">
                  {missao.titulo}
                </h2>

                <span className="text-green font-bold text-sm whitespace-nowrap">
                  +{missao.recompensa} pts
                </span>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {missao.descricao}
              </p>
            </div>

            <div className="flex flex-col min-[400px]:flex-row gap-2">
              {missao.concluida ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-emerald-100 text-green font-bold text-sm cursor-not-allowed"
                >
                  Concluído ✓
                </button>
              ) : (
                <>
                  <button
                    onClick={() => concluirMissao(missao.id)}
                    className="flex-1 min-w-0 py-2.5 px-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 cursor-pointer"
                  >
                    Concluir Missão
                  </button>

                  <Link
                    to={`/missoes/${missao.id}`}
                    className="text-center py-2.5 px-4 rounded-xl border-2 border-primary text-primary font-bold text-sm transition-colors hover:bg-primary hover:text-white"
                  >
                    Detalhes
                  </Link>
                </>
              )}
            </div>
          </article>
        ))}
      </section>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 sm:px-4 py-4"
          onClick={fecharModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal"
            className="bg-white w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-2xl p-5 sm:p-7 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-3xl text-emerald-600">✓</span>
            </div>

            <h2
              id="titulo-modal"
              className="text-xl sm:text-2xl font-extrabold text-dark mb-2"
            >
              {modal.co2Evitado === null &&
              modal.titulo === 'Transporte Público'
                ? 'Registre sua distância!'
                : 'Missão concluída!'}
            </h2>

            {modal.co2Evitado === null &&
            modal.titulo === 'Transporte Público' ? (
              <>
                <p className="text-gray-500 mb-5 text-sm sm:text-base">
                  Informe a distância total percorrida nos três dias de
                  transporte público.
                </p>

                <div className="text-left mb-5">
                  <label
                    htmlFor="distancia"
                    className="block text-sm font-semibold text-dark mb-2"
                  >
                    Distância total percorrida (km)
                  </label>

                  <input
                    id="distancia"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={distancia}
                    onChange={(e) => setDistancia(e.target.value)}
                    placeholder="Ex.: 15"
                    className="w-full min-w-0 border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

                <button
                  onClick={confirmarTransportePublico}
                  disabled={
                    !distancia.trim() ||
                    !Number.isFinite(Number(distancia.replace(',', '.'))) ||
                    Number(distancia.replace(',', '.')) <= 0
                  }
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Calcular CO₂ e Concluir
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-5 text-sm sm:text-base">
                  Parabéns! Você completou a missão {modal.titulo}.
                </p>

                <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 mb-4">
                  <p className="text-white text-sm font-medium">
                    Você ganhou
                  </p>

                  <p className="text-white text-2xl sm:text-3xl font-extrabold break-words">
                    +{modal.recompensa} MovePoints
                  </p>
                </div>

                {modal.distanciaKm > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-blue-700 font-semibold mb-1">
                      Distância registrada
                    </p>

                    <p className="text-blue-800 text-2xl font-extrabold">
                      {modal.distanciaKm.toFixed(2)} km
                    </p>
                  </div>
                )}

                {modal.co2Evitado !== null && modal.co2Evitado > 0 && (
                  <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p className="text-emerald-700 font-semibold mb-1">
                      🌱 CO₂ evitado
                    </p>

                    <p className="text-emerald-800 text-2xl font-extrabold">
                      {modal.co2Evitado.toFixed(2)} kg
                    </p>
                  </div>
                )}

                <button
                  onClick={fecharModal}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold transition-all hover:opacity-90"
                >
                  Continuar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
