
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type TipoTransporte = 'onibus' | 'metro' | 'bicicleta' | 'caminhada';

interface Metrica {
  titulo: string;
  valor: string;
  label: string;
  cor: string;
}

interface Atividade {
  id: number;
  data: string;
  tipo: string;
  distancia: number;
  pontos: string;
  co2Evitado: number;
}

interface MissaoSemana {
  id: number;
  titulo: string;
  descricao: string;
  concluida: boolean;
}

interface RegistroMobilidade {
  id: number;
  data: string;
  tipo: string;
  distanciaKm: number;
  pontos: number;
  co2Evitado: number;
}

const CHAVE_SALDO = 'moveup_saldo';
const CHAVE_PONTOS = 'greenPointsSaldo';
const CHAVE_ATIVIDADES = 'moveupAtividades';
const CHAVE_MISSOES = 'moveupMissoesSemana';
const CHAVE_MOBILIDADE = 'moveupRegistrosMobilidade';

const carregarMovePoints = (): number => {
  try {
    const saldoSalvo = sessionStorage.getItem(CHAVE_SALDO);

    if (saldoSalvo) {
      const dados = JSON.parse(saldoSalvo);

      const pontos = Number(
        dados.greenPointsAcumulados ??
        dados.greenPoints ??
        dados.movePoints ??
        1450
      );

      return Number.isFinite(pontos) ? pontos : 1450;
    }

    const pontosSalvos = localStorage.getItem(CHAVE_PONTOS);

    if (pontosSalvos !== null) {
      const pontos = JSON.parse(pontosSalvos);

      if (typeof pontos === 'number') {
        return pontos;
      }

      return Number(
        pontos.greenPointsAcumulados ??
        pontos.greenPoints ??
        pontos.movePoints ??
        1450
      );
    }

    // Valor inicial utilizado pelo projeto quando ainda não há saldo salvo.
    const saldoInicial = {
      saldo: 0,
      greenPointsAcumulados: 1450,
    };

    sessionStorage.setItem(CHAVE_SALDO, JSON.stringify(saldoInicial));
    localStorage.setItem(CHAVE_PONTOS, JSON.stringify(1450));

    return 1450;
  } catch (error) {
    console.error('Erro ao carregar MovePoints:', error);
    return 1450;
  }
};

const salvarMovePoints = (pontos: number) => {
  try {
    const saldoAtual = sessionStorage.getItem(CHAVE_SALDO);
    const dadosSaldo = saldoAtual ? JSON.parse(saldoAtual) : {};

    const novoSaldo = {
      ...dadosSaldo,
      saldo: Number(dadosSaldo.saldo ?? 0),
      greenPointsAcumulados: pontos,
    };

    sessionStorage.setItem(CHAVE_SALDO, JSON.stringify(novoSaldo));
    localStorage.setItem(CHAVE_PONTOS, JSON.stringify(pontos));
  } catch (error) {
    console.error('Erro ao salvar MovePoints:', error);
  }
};

const carregarAtividades = (): Atividade[] => {
  try {
    const atividadesSalvas = localStorage.getItem(CHAVE_ATIVIDADES);

    return atividadesSalvas ? JSON.parse(atividadesSalvas) : [];
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    return [];
  }
};

const carregarMissoes = (): MissaoSemana[] => {
  const missoesPadrao: MissaoSemana[] = [
    {
      id: 1,
      titulo: 'Vá de Bike',
      descricao: 'Pedale um total de 10 km nesta semana.',
      concluida: true,
    },
    {
      id: 2,
      titulo: 'Deixa o Carro em Casa',
      descricao: 'Use transporte público em 3 dias úteis.',
      concluida: false,
    },
    {
      id: 3,
      titulo: 'Passos Verdes',
      descricao: 'Caminhe pelo menos 5.000 passos em um único dia.',
      concluida: false,
    },
  ];

  try {
    const missoesSalvas = localStorage.getItem(CHAVE_MISSOES);

    return missoesSalvas ? JSON.parse(missoesSalvas) : missoesPadrao;
  } catch (error) {
    console.error('Erro ao carregar missões:', error);
    return missoesPadrao;
  }
};

const carregarRegistrosMobilidade = (): RegistroMobilidade[] => {
  try {
    const registrosSalvos = localStorage.getItem(CHAVE_MOBILIDADE);

    return registrosSalvos ? JSON.parse(registrosSalvos) : [];
  } catch (error) {
    console.error('Erro ao carregar registros de mobilidade:', error);
    return [];
  }
};

export default function Home() {
  const [nomeUsuario] = useState<string>(() => {
    try {
      const cadastroSalvo = localStorage.getItem('moveupUsuario');

      if (!cadastroSalvo) {
        return 'EcoViajante';
      }

      const cadastro = JSON.parse(cadastroSalvo);

      return typeof cadastro.nome === 'string' && cadastro.nome.trim()
        ? cadastro.nome
        : 'EcoViajante';
    } catch (error) {
      console.error('Erro ao recuperar dados do cadastro:', error);
      return 'EcoViajante';
    }
  });

  const [movePoints, setMovePoints] = useState(carregarMovePoints);

  const [co2Economizado, setCo2Economizado] = useState(() => {
    return carregarRegistrosMobilidade().reduce(
      (total, registro) => total + Number(registro.co2Evitado || 0),
      0
    );
  });

  const [distanciaSustentavel, setDistanciaSustentavel] = useState(() => {
    return carregarRegistrosMobilidade().reduce(
      (total, registro) => total + Number(registro.distanciaKm || 0),
      0
    );
  });

  const [missoesSemana, setMissoesSemana] = useState<MissaoSemana[]>(
    carregarMissoes
  );

  const [atividades, setAtividades] = useState<Atividade[]>(
    carregarAtividades
  );

  const [tipoTransporte, setTipoTransporte] =
    useState<TipoTransporte>('onibus');

  const [distanciaRegistrada, setDistanciaRegistrada] = useState('');

  const [dataAtividade, setDataAtividade] = useState(
    new Date().toLocaleDateString('en-CA')
  );

  const calcularCo2Evitado = (kmPercorrido: number): number => {
    const co2CarroPorKm = 0.21;
    const co2TransportePublicoPorKm = 0.05;

    return (
      (co2CarroPorKm - co2TransportePublicoPorKm) * kmPercorrido
    );
  };

  const formatarData = (data: string): string => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    document.title = 'MoveUP - Mobilidade Sustentável';
  }, []);

  // Salva os dados das missões e atividades sempre que forem atualizados.
  useEffect(() => {
    localStorage.setItem(CHAVE_MISSOES, JSON.stringify(missoesSemana));
  }, [missoesSemana]);

  useEffect(() => {
    localStorage.setItem(CHAVE_ATIVIDADES, JSON.stringify(atividades));
  }, [atividades]);

  // Atualiza os indicadores com base nos registros salvos.
  const atualizarIndicadoresMobilidade = (registros: RegistroMobilidade[]) => {
    const distanciaTotal = registros.reduce(
      (total, registro) => total + Number(registro.distanciaKm || 0),
      0
    );

    const co2Total = registros.reduce(
      (total, registro) => total + Number(registro.co2Evitado || 0),
      0
    );

    setDistanciaSustentavel(distanciaTotal);
    setCo2Economizado(co2Total);
  };

  const registrarAtividade = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const km = Number(distanciaRegistrada.replace(',', '.'));

    if (!Number.isFinite(km) || km <= 0) {
      alert('Informe uma distância válida maior que zero.');
      return;
    }

    if (
      !dataAtividade ||
      dataAtividade > new Date().toLocaleDateString('en-CA')
    ) {
      alert('Informe uma data válida, que não seja futura.');
      return;
    }

    const tipos: Record<TipoTransporte, string> = {
      onibus: '🚌 Ônibus',
      metro: '🚇 Metrô',
      bicicleta: '🚲 Bicicleta',
      caminhada: '🚶 Caminhada',
    };

    // A fórmula de CO₂ é aplicada somente ao transporte público.
    const co2Evitado =
      tipoTransporte === 'onibus' || tipoTransporte === 'metro'
        ? calcularCo2Evitado(km)
        : 0;

    const novaAtividade: Atividade = {
      id: Date.now(),
      data: formatarData(dataAtividade),
      tipo: tipos[tipoTransporte],
      distancia: km,
      pontos: '—',
      co2Evitado,
    };

    const novoRegistro: RegistroMobilidade = {
      id: novaAtividade.id,
      data: dataAtividade,
      tipo: tipoTransporte,
      distanciaKm: km,
      pontos: 0,
      co2Evitado,
    };

    // Salva o registro de mobilidade no armazenamento.
    const registrosAtuais = carregarRegistrosMobilidade();
    const novosRegistros = [...registrosAtuais, novoRegistro];

    localStorage.setItem(
      CHAVE_MOBILIDADE,
      JSON.stringify(novosRegistros)
    );

    setAtividades((prev) => [novaAtividade, ...prev]);
    atualizarIndicadoresMobilidade(novosRegistros);

    setDistanciaRegistrada('');

    alert(
      `Atividade registrada com sucesso!\n\nDistância: ${km.toFixed(2)} km\nCO₂ evitado: ${co2Evitado.toFixed(2)} kg`
    );
  };

  const concluirMissao = (id: number) => {
    const missao = missoesSemana.find((m) => m.id === id);

    if (!missao || missao.concluida) {
      return;
    }

    const pontosMap: Record<number, number> = {
      1: 300,
      2: 500,
      3: 200,
    };

    const pontosGanhos = pontosMap[id] || 200;
    const novosPontos = movePoints + pontosGanhos;

    // Atualiza e salva os MovePoints.
    setMovePoints(novosPontos);
    salvarMovePoints(novosPontos);

    // Atualiza e salva o status da missão.
    const novasMissoes = missoesSemana.map((m) =>
      m.id === id
        ? {
            ...m,
            concluida: true,
          }
        : m
    );

    setMissoesSemana(novasMissoes);
    localStorage.setItem(CHAVE_MISSOES, JSON.stringify(novasMissoes));

    // Registra a recompensa no histórico de atividades.
    const hoje = new Date().toLocaleDateString('pt-BR');

    const novaAtividade: Atividade = {
      id: Date.now(),
      data: hoje,
      tipo: '🎯 Missão',
      distancia: 0,
      pontos: `+${pontosGanhos} pts`,
      co2Evitado: 0,
    };

    setAtividades((prev) => [novaAtividade, ...prev]);

    alert(
      `🎉 Missão Concluída! Você ganhou +${pontosGanhos} MovePoints!`
    );
  };

  const metricas: Metrica[] = [
    {
      titulo: 'Seu Saldo',
      valor: movePoints.toLocaleString('pt-BR'),
      label: 'MovePoints acumulados',
      cor: 'from-blue-500 to-blue-900',
    },
    {
      titulo: 'Impacto Ambiental',
      valor: `${co2Economizado.toFixed(2).replace('.', ',')} kg`,
      label: 'de CO₂ economizados',
      cor: 'from-purple-700 to-violet-500',
    },
    {
      titulo: 'Distância Sustentável',
      valor: `${distanciaSustentavel.toFixed(1).replace('.', ',')} km`,
      label: 'percorridos de forma limpa',
      cor: 'from-cyan-600 to-blue-800',
    },
  ];

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 sm:p-8 text-white mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Olá, {nomeUsuario}!
        </h1>

        <p className="text-white/80">
          Seu impacto positivo em mobilidade sustentável hoje está ajudando a
          construir o amanhã.
        </p>
      </section>

      {/* Indicadores */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metricas.map((metrica) => (
          <div
            key={metrica.titulo}
            className={`bg-gradient-to-r ${metrica.cor} rounded-2xl p-6 text-white shadow-lg`}
          >
            <h2 className="text-center font-semibold text-base sm:text-lg mb-2">
              {metrica.titulo}
            </h2>

            <p className="text-center text-3xl sm:text-4xl font-extrabold">
              {metrica.valor}
            </p>

            <p className="text-center text-sm text-white/80 mt-1">
              {metrica.label}
            </p>
          </div>
        ))}
      </section>

      {/* Registro de atividades */}
      <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-dark mb-2">
          Registrar atividade 🚲
        </h2>

        <p className="text-sm text-gray-500 mb-5">
          Informe seu deslocamento para atualizar sua distância sustentável
          e seu impacto ambiental.
        </p>

        <form onSubmit={registrarAtividade}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="tipoTransporte"
                className="block text-sm font-semibold text-dark mb-2"
              >
                Tipo de transporte
              </label>

              <select
                id="tipoTransporte"
                value={tipoTransporte}
                onChange={(e) =>
                  setTipoTransporte(e.target.value as TipoTransporte)
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-3 outline-none focus:border-primary"
              >
                <option value="onibus">Ônibus</option>
                <option value="metro">Metrô</option>
                <option value="bicicleta">Bicicleta</option>
                <option value="caminhada">Caminhada</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="distancia"
                className="block text-sm font-semibold text-dark mb-2"
              >
                Distância percorrida (km)
              </label>

              <input
                id="distancia"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={distanciaRegistrada}
                onChange={(e) => setDistanciaRegistrada(e.target.value)}
                placeholder="Ex.: 5,2"
                className="w-full border border-gray-300 rounded-xl px-3 py-3 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="dataAtividade"
                className="block text-sm font-semibold text-dark mb-2"
              >
                Data da atividade
              </label>

              <input
                id="dataAtividade"
                type="date"
                required
                max={new Date().toLocaleDateString('en-CA')}
                value={dataAtividade}
                onChange={(e) => setDataAtividade(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-3 outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Registrar atividade
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4">
          O cálculo de CO₂ utiliza a diferença entre as emissões do carro
          (0,21 kg/km) e do transporte público (0,05 kg/km).
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Desafios da semana */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-dark mb-5">
            Desafios da Semana 🎯
          </h2>

          <div className="space-y-4">
            {missoesSemana.map((missao) => (
              <div
                key={missao.id}
                className={`rounded-xl p-4 flex items-center gap-4 ${
                  missao.concluida ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                    missao.concluida
                      ? 'bg-green-100 text-green-500'
                      : 'bg-yellow-100 text-yellow-500'
                  }`}
                >
                  {missao.concluida ? '✓' : '⌛'}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-dark">
                    {missao.titulo}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {missao.descricao}
                  </p>
                </div>

                {!missao.concluida && (
                  <button
                    type="button"
                    onClick={() => concluirMissao(missao.id)}
                    className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition"
                  >
                    Concluir
                  </button>
                )}
              </div>
            ))}
          </div>

          <Link
            to="/missoes"
            className="block text-center mt-5 text-primary font-semibold hover:underline"
          >
            Ver todas as missões →
          </Link>
        </div>

        {/* Atividades recentes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-dark mb-5">
            Atividades Recentes 🕒
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Data</th>
                  <th className="pb-3 font-medium">Tipo</th>
                  <th className="pb-3 font-medium">Distância</th>
                  <th className="pb-3 font-medium">Pontos</th>
                </tr>
              </thead>

              <tbody>
                {atividades.map((atividade) => (
                  <tr
                    key={atividade.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="py-4 text-sm text-dark">
                      {atividade.data}
                    </td>

                    <td className="py-4 text-sm text-dark">
                      {atividade.tipo}
                    </td>

                    <td className="py-4 text-sm text-dark">
                      {atividade.distancia > 0
                        ? `${atividade.distancia.toFixed(2)} km`
                        : '—'}
                    </td>

                    <td className="py-4 text-sm font-semibold text-green-500">
                      {atividade.pontos}
                    </td>
                  </tr>
                ))}

                {atividades.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-sm text-gray-400"
                    >
                      Nenhuma atividade registrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
