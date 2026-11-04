import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import Botao from '../../components/Botao/Botao';
import {
  armazenamentoLocalConta,
  armazenamentoSessaoConta,
} from '../../services/armazenamentoConta';

interface MissaoDetalheData {
  id: number;
  titulo: string;
  descricao: string;
  descricaoCompleta: string;
  recompensa: number;
  categoria: string;
  dificuldade: string;
  prazo: string;
}

interface MissaoSalva {
  id: number;
  concluida: boolean;
}

interface DadosSaldo {
  saldo?: number;
  greenPointsAcumulados?: number;
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

const CHAVE_MISSOES = 'moveupMissoes';
const CHAVE_REGISTROS = 'moveupRegistrosMobilidade';
const CHAVE_ATIVIDADES = 'moveupAtividades';
const CHAVE_SALDO = 'moveup_saldo';
const CHAVE_PONTOS = 'greenPointsSaldo';

const missoesData: MissaoDetalheData[] = [
  {
    id: 1,
    titulo: 'Check-in Diário',
    descricao: 'Abra a plataforma hoje para garantir seus pontos de presença.',
    descricaoCompleta:
      'Acesse a plataforma MoveUp diariamente para ganhar pontos de presença. Esta missão incentiva o uso regular da plataforma e mantém você atualizado sobre novas missões e recompensas disponíveis.',
    recompensa: 50,
    categoria: 'Diária',
    dificuldade: 'Fácil',
    prazo: 'Diário',
  },
  {
    id: 2,
    titulo: 'Primeiros Passos',
    descricao: 'Assista ao vídeo de introdução e aprenda a usar nossa plataforma sustentável.',
    descricaoCompleta:
      'Complete o tutorial de boas-vindas assistindo ao vídeo introdutório da MoveUp. Entenda como acumular MovePoints, concluir missões e converter seus pontos em benefícios reais para o transporte público.',
    recompensa: 150,
    categoria: 'Conteúdo',
    dificuldade: 'Fácil',
    prazo: 'Sem prazo',
  },
  {
    id: 3,
    titulo: 'Perfil Completo',
    descricao: 'Preencha seus dados de usuário e adicione uma foto de perfil.',
    descricaoCompleta:
      'Complete todas as informações do seu perfil na plataforma MoveUp, incluindo foto, dados pessoais e preferências de mobilidade. Um perfil completo garante uma experiência personalizada e maior segurança.',
    recompensa: 300,
    categoria: 'Desafio',
    dificuldade: 'Média',
    prazo: 'Sem prazo',
  },
  {
    id: 4,
    titulo: 'Consciência Verde',
    descricao: 'Responda ao quiz semanal sobre reciclagem e descarte sustentável.',
    descricaoCompleta:
      'Teste seus conhecimentos sobre sustentabilidade respondendo ao quiz semanal. Acerte pelo menos 70% das perguntas sobre reciclagem, descarte responsável e práticas sustentáveis para ganhar os pontos.',
    recompensa: 500,
    categoria: 'Especial',
    dificuldade: 'Difícil',
    prazo: 'Semanal',
  },
  {
    id: 5,
    titulo: 'Pedale 5km',
    descricao: 'Use bicicleta para percorrer pelo menos 5 km em um dia.',
    descricaoCompleta:
      'Registre um trajeto de pelo menos 5 km utilizando bicicleta. Contribua para a redução de emissões de CO₂ e ganhe pontos extras por escolher um transporte limpo e saudável.',
    recompensa: 200,
    categoria: 'Desafio',
    dificuldade: 'Média',
    prazo: 'Diário',
  },
  {
    id: 6,
    titulo: 'Transporte Público',
    descricao: 'Utilize transporte público por 3 dias consecutivos.',
    descricaoCompleta:
      'Utilize ônibus, metrô ou trem no seu trajeto para o trabalho ou escola por 3 dias consecutivos. Cada dia registrado contribui para a redução da sua pegada de carbono na cidade.',
    recompensa: 350,
    categoria: 'Especial',
    dificuldade: 'Média',
    prazo: 'Semanal',
  },
];

const calcularCo2Evitado = (kmPercorrido: number): number => {
  return (0.21 - 0.05) * kmPercorrido;
};

const carregarMissoesSalvas = (): MissaoSalva[] => {
  try {
    const dados = armazenamentoLocalConta.getItem(CHAVE_MISSOES);

    if (!dados) return [];

    const resultado: unknown = JSON.parse(dados);

    return Array.isArray(resultado) ? resultado : [];
  } catch {
    return [];
  }
};

const verificarConclusao = (id: number): boolean => {
  const missaoSalva = carregarMissoesSalvas().find(
    (missao) => missao.id === id
  );

  return missaoSalva?.concluida === true;
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
  let registros: RegistroMobilidade[] = [];

  try {
    const dados = armazenamentoLocalConta.getItem(CHAVE_REGISTROS);

    if (dados) {
      const resultado: unknown = JSON.parse(dados);
      registros = Array.isArray(resultado) ? resultado : [];
    }
  } catch {
    registros = [];
  }

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
  let atividades: Atividade[] = [];

  try {
    const dados = armazenamentoLocalConta.getItem(CHAVE_ATIVIDADES);

    if (dados) {
      const resultado: unknown = JSON.parse(dados);
      atividades = Array.isArray(resultado) ? resultado : [];
    }
  } catch {
    atividades = [];
  }

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

export default function MissaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const missaoId = Number(id);
  const missao = missoesData.find((m) => m.id === missaoId);

  const [concluida, setConcluida] = useState(() =>
    missao ? verificarConclusao(missao.id) : false
  );

  const [distancia, setDistancia] = useState('');
  const [solicitandoDistancia, setSolicitandoDistancia] = useState(false);

  const [modalResultado, setModalResultado] = useState<{
    recompensa: number;
    distanciaKm: number;
    co2Evitado: number;
  } | null>(null);

  const processando = useRef(false);

  if (!missao) {
    return (
      <main className="max-w-[800px] mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-dark mb-4">
          Missão não encontrada
        </h1>

        <p className="text-gray-500 mb-6">
          A missão com ID "{id}" não existe.
        </p>

        <Botao
          texto="Voltar para Missões"
          onClick={() => navigate('/missoes')}
        />
      </main>
    );
  }

  const concluirMissao = (
    distanciaKm: number,
    co2Evitado: number
  ): void => {
    if (concluida || processando.current || verificarConclusao(missao.id)) {
      setConcluida(true);
      return;
    }

    processando.current = true;

    try {
      const missoesSalvas = carregarMissoesSalvas();

      const novasMissoes = missoesData.map((item) => {
        const salva = missoesSalvas.find(
          (missaoSalva) => missaoSalva.id === item.id
        );

        return {
          id: item.id,
          concluida:
            item.id === missao.id || salva?.concluida === true,
        };
      });

      const novosPontos = carregarPontos() + missao.recompensa;

      if (distanciaKm > 0) {
        salvarRegistroMobilidade(
          missao.id === 5 ? 'bicicleta' : 'onibus',
          distanciaKm,
          co2Evitado
        );
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

      setConcluida(true);
      setSolicitandoDistancia(false);
      setDistancia('');

      setModalResultado({
        recompensa: missao.recompensa,
        distanciaKm,
        co2Evitado,
      });
    } catch {
      window.alert(
        'Não foi possível concluir a missão. Tente novamente.'
      );
    } finally {
      processando.current = false;
    }
  };

  const handleConcluir = (): void => {
    if (concluida || processando.current) return;

    if (missao.id === 6) {
      setSolicitandoDistancia(true);
      return;
    }

    if (missao.id === 5) {
      concluirMissao(5, 0);
      return;
    }

    concluirMissao(0, 0);
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

    const co2Evitado = calcularCo2Evitado(kmPercorrido);

    concluirMissao(kmPercorrido, co2Evitado);
  };

  return (
    <main className="max-w-[800px] mx-auto px-4 sm:px-8 py-10">
      <nav className="mb-6 text-sm text-gray-400">
        <button
          onClick={() => navigate('/missoes')}
          className="hover:text-secondary transition-colors cursor-pointer"
        >
          Missões
        </button>

        <span className="mx-2">›</span>

        <span className="text-dark font-medium">{missao.titulo}</span>
      </nav>

      <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
            {missao.categoria}
          </span>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            {missao.dificuldade}
          </span>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
            ⏰ {missao.prazo}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark mb-4">
          {missao.titulo}
        </h1>

        <div className="bg-gradient-to-r from-green/10 to-emerald-50 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-3xl">🏆</span>

          <div>
            <p className="text-sm text-gray-500">Recompensa</p>
            <p className="text-2xl font-bold text-green">
              +{missao.recompensa} pts
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-dark mb-3">
            Descrição da Missão
          </h2>

          <p className="text-gray-500 leading-relaxed">
            {missao.descricaoCompleta}
          </p>
        </div>

        {solicitandoDistancia && (
          <div className="mb-6 rounded-xl bg-gray-50 p-5">
            <label
              htmlFor="distancia-transporte"
              className="block text-sm font-semibold text-dark mb-2"
            >
              Distância total percorrida no transporte público (km)
            </label>

            <input
              id="distancia-transporte"
              type="number"
              min="0.01"
              step="0.01"
              value={distancia}
              onChange={(e) => setDistancia(e.target.value)}
              placeholder="Ex.: 15"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary"
            />

            <p className="text-xs text-gray-500 mt-2">
              Informe a distância total simulada para os três dias da missão.
            </p>

            <button
              type="button"
              onClick={confirmarTransportePublico}
              disabled={
                !distancia.trim() ||
                !Number.isFinite(Number(distancia.replace(',', '.'))) ||
                Number(distancia.replace(',', '.')) <= 0
              }
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Calcular CO₂ e Concluir
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {concluida ? (
            <Botao
              texto="Missão Concluída ✓"
              variante="sucesso"
              desabilitado
              larguraTotal
            />
          ) : (
            <Botao
              texto="Concluir Missão"
              onClick={handleConcluir}
              larguraTotal
            />
          )}

          <Botao
            texto="← Voltar"
            variante="secundario"
            onClick={() => navigate('/missoes')}
          />
        </div>
      </article>

      {modalResultado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-resultado"
            className="bg-white w-full max-w-md rounded-2xl p-7 shadow-2xl text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-3xl text-emerald-600">✓</span>
            </div>

            <h2
              id="titulo-resultado"
              className="text-2xl font-extrabold text-dark mb-2"
            >
              Missão concluída!
            </h2>

            <p className="text-gray-500 mb-5">
              Parabéns! Você completou a missão {missao.titulo}.
            </p>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 mb-4">
              <p className="text-white text-sm font-medium">
                Você ganhou
              </p>

              <p className="text-white text-3xl font-extrabold">
                +{modalResultado.recompensa} MovePoints
              </p>
            </div>

            {modalResultado.distanciaKm > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-blue-700 font-semibold mb-1">
                  Distância registrada
                </p>

                <p className="text-blue-800 text-2xl font-extrabold">
                  {modalResultado.distanciaKm.toFixed(2)} km
                </p>
              </div>
            )}

            {modalResultado.co2Evitado > 0 && (
              <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                <p className="text-emerald-700 font-semibold mb-1">
                  🌱 CO₂ evitado
                </p>

                <p className="text-emerald-800 text-2xl font-extrabold">
                  {modalResultado.co2Evitado.toFixed(2)} kg
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/missoes')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold transition-all hover:opacity-90"
            >
              Voltar para Missões
            </button>
          </div>
        </div>
      )}
    </main>
  );
}