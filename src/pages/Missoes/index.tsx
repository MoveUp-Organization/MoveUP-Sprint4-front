
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    concluida: true,
  },
  {
    id: 2,
    titulo: 'Primeiros Passos',
    descricao: 'Assista ao vídeo de introdução e aprenda a usar nossa plataforma sustentável.',
    recompensa: 150,
    categoria: 'conteudo',
    concluida: false,
  },
  {
    id: 3,
    titulo: 'Perfil Completo',
    descricao: 'Preencha seus dados de usuário e adicione uma foto de perfil para maior segurança.',
    recompensa: 300,
    categoria: 'desafio',
    concluida: false,
  },
  {
    id: 4,
    titulo: 'Consciência Verde',
    descricao: 'Responda corretamente ao quiz semanal sobre reciclagem e descarte sustentável.',
    recompensa: 500,
    categoria: 'especial',
    concluida: false,
  },
  {
    id: 5,
    titulo: 'Pedale 5km',
    descricao: 'Use bicicleta para percorrer pelo menos 5 km em um dia e ganhe pontos extras.',
    recompensa: 200,
    categoria: 'desafio',
    concluida: false,
  },
  {
    id: 6,
    titulo: 'Transporte Público',
    descricao: 'Utilize o transporte público no trajeto para o trabalho ou escola por 3 dias.',
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

const carregarMissoes = (): Missao[] => {
  try {
    const salvas = localStorage.getItem(CHAVE_MISSOES);

    if (!salvas) return missoesIniciais;

    const missoesSalvas: Missao[] = JSON.parse(salvas);

    return missoesIniciais.map((missao) => {
      const salva = missoesSalvas.find((item) => item.id === missao.id);
      return salva ? { ...missao, concluida: salva.concluida } : missao;
    });
  } catch {
    return missoesIniciais;
  }
};

const carregarPontos = (): number => {
  try {
    const saldoSalvo = sessionStorage.getItem(CHAVE_SALDO);

    if (saldoSalvo) {
      const dados: DadosSaldo = JSON.parse(saldoSalvo);

      if (typeof dados.greenPointsAcumulados === 'number') {
        return dados.greenPointsAcumulados;
      }
    }

    const pontosLocais = localStorage.getItem(CHAVE_PONTOS);

    if (pontosLocais) {
      const pontos = JSON.parse(pontosLocais);

      if (typeof pontos === 'number') return pontos;
    }

    return 1450;
  } catch {
    return 1450;
  }
};

const salvarPontos = (pontos: number) => {
  let saldo: DadosSaldo = {};

  try {
    const salvo = sessionStorage.getItem(CHAVE_SALDO);
    if (salvo) saldo = JSON.parse(salvo);
  } catch {
    saldo = {};
  }

  sessionStorage.setItem(
    CHAVE_SALDO,
    JSON.stringify({
      ...saldo,
      greenPointsAcumulados: pontos,
    })
  );

  localStorage.setItem(CHAVE_PONTOS, JSON.stringify(pontos));
};

const salvarRegistroMobilidade = (
  tipo: string,
  distanciaKm: number,
  co2Evitado: number
) => {
  const registros: RegistroMobilidade[] = JSON.parse(
    localStorage.getItem(CHAVE_REGISTROS) || '[]'
  );

  registros.push({
    id: `${Date.now()}-${Math.random()}`,
    data: new Date().toLocaleDateString('en-CA'),
    tipo,
    distanciaKm,
    pontos: 0,
    co2Evitado,
  });

  localStorage.setItem(CHAVE_REGISTROS, JSON.stringify(registros));
};

const salvarAtividade = (
  titulo: string,
  pontos: number,
  distanciaKm: number,
  co2Evitado: number
) => {
  const atividades: Atividade[] = JSON.parse(
    localStorage.getItem(CHAVE_ATIVIDADES) || '[]'
  );

  atividades.unshift({
    id: Date.now(),
    data: new Date().toLocaleDateString('pt-BR'),
    tipo: `🎯 Missão: ${titulo}`,
    distancia: `${distanciaKm} km`,
    pontos: `+${pontos} pts`,
    co2Evitado,
  });

  localStorage.setItem(CHAVE_ATIVIDADES, JSON.stringify(atividades));
};

export default function Missoes() {
  const [missoes, setMissoes] = useState<Missao[]>(carregarMissoes);
  const [movePoints, setMovePoints] = useState<number>(carregarPontos);
  const [modal, setModal] = useState<ModalDados | null>(null);
  const [distancia, setDistancia] = useState('');

  useEffect(() => {
    localStorage.setItem(CHAVE_MISSOES, JSON.stringify(missoes));
  }, [missoes]);

  const finalizarMissao = (
    missao: Missao,
    distanciaKm: number,
    co2Evitado: number
  ) => {
    if (missao.concluida) return;

    const novasMissoes = missoes.map((item) =>
      item.id === missao.id ? { ...item, concluida: true } : item
    );

    setMissoes(novasMissoes);
    localStorage.setItem(CHAVE_MISSOES, JSON.stringify(novasMissoes));

    const novosPontos = movePoints + missao.recompensa;

    setMovePoints(novosPontos);
    salvarPontos(novosPontos);

    if (distanciaKm > 0) {
      const tipo = missao.id === 5 ? 'bicicleta' : 'onibus';

      salvarRegistroMobilidade(tipo, distanciaKm, co2Evitado);
    }

    salvarAtividade(
      missao.titulo,
      missao.recompensa,
      distanciaKm,
      co2Evitado
    );

    setModal({
      titulo: missao.titulo,
      recompensa: missao.recompensa,
      co2Evitado,
      distanciaKm,
    });
  };

  const concluirMissao = (id: number) => {
    const missao = missoes.find((item) => item.id === id);

    if (!missao || missao.concluida) return;

    // A missão de transporte público exige a distância percorrida.
    if (missao.id === 6) {
      setModal({
        titulo: missao.titulo,
        recompensa: missao.recompensa,
        co2Evitado: null,
        distanciaKm: 0,
      });
      return;
    }

    // A missão de bicicleta registra os 5 km previstos na descrição.
    if (missao.id === 5) {
      finalizarMissao(missao, 5, 0);
      return;
    }

    // As demais missões não geram distância ou CO₂.
    finalizarMissao(missao, 0, 0);
  };

  const confirmarTransportePublico = () => {
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

  const fecharModal = () => {
    setModal(null);
    setDistancia('');
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10">
      <section className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-3">
          Missões Disponíveis
        </h1>

        <p className="text-gray-500 text-lg">
          Complete as tarefas abaixo para acumular pontos e subir de nível!
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {missoes.map((missao) => (
          <article
            key={missao.id}
            className="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
          >
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${coresBadge[missao.categoria]}`}
              >
                {labelBadge[missao.categoria]}
              </span>

              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-dark">
                  {missao.titulo}
                </h2>

                <span className="text-green font-bold text-sm">
                  +{missao.recompensa} pts
                </span>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {missao.descricao}
              </p>
            </div>

            <div className="flex gap-2">
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
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 cursor-pointer"
                  >
                    Concluir Missão
                  </button>

                  <Link
                    to={`/missoes/${missao.id}`}
                    className="py-2.5 px-4 rounded-xl border-2 border-primary text-primary font-bold text-sm transition-colors hover:bg-primary hover:text-white"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={fecharModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal"
            className="bg-white w-full max-w-md rounded-2xl p-7 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-3xl text-emerald-600">✓</span>
            </div>

            <h2
              id="titulo-modal"
              className="text-2xl font-extrabold text-dark mb-2"
            >
              {modal.co2Evitado === null &&
              modal.titulo === 'Transporte Público'
                ? 'Registre sua distância!'
                : 'Missão concluída!'}
            </h2>

            {modal.co2Evitado === null &&
            modal.titulo === 'Transporte Público' ? (
              <>
                <p className="text-gray-500 mb-5">
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
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary"
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
                <p className="text-gray-500 mb-5">
                  Parabéns! Você completou a missão {modal.titulo}.
                </p>

                <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 mb-4">
                  <p className="text-white text-sm font-medium">
                    Você ganhou
                  </p>

                  <p className="text-white text-3xl font-extrabold">
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
