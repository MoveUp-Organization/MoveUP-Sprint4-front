// MOVEUP-CONVERSAO-VERIFICADO: arquivo completo revisado em 2026-11-01
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import Botao from '../../components/Botao/Botao';

interface DadosUsuario {
  nome: string;
}

const carregarDadosUsuario = (): DadosUsuario => {
  try {
    const cadastroSalvo = localStorage.getItem('moveupUsuario');

    if (cadastroSalvo) {
      const cadastro = JSON.parse(cadastroSalvo);

      return {
        nome: cadastro.nome || 'EcoViajante',
      };
    }
  } catch (error) {
    console.error('Erro ao recuperar dados do cadastro:', error);
  }

  return {
    nome: 'EcoViajante',
  };
};

const carregarSaldo = (): number => {
  const saldoSalvo = localStorage.getItem('greenPointsSaldo');

  if (saldoSalvo !== null) {
    const saldoNumerico = Number(saldoSalvo);

    if (
      saldoSalvo.trim() !== '' &&
      Number.isFinite(saldoNumerico) &&
      saldoNumerico >= 0
    ) {
      return saldoNumerico;
    }
  }

  return 5000;
};

type PassagemId = 1 | 2;

interface Passagem {
  id: PassagemId;
  titulo: string;
  valorReais: number;
  custoUnitario: number;
}

interface HistoricoItem {
  id: string;
  data: string;
  transporte: string;
  quantidade: number;
  pontos: number;
  valorReais: number;
}

const PONTOS_BASE = 5000;
const VALOR_BASE = 45;

const reaisParaPontos = (valorReais: number): number => {
  return Math.round((valorReais / VALOR_BASE) * PONTOS_BASE);
};

const opcoesPassagens: Passagem[] = [
  {
    id: 1,
    titulo: 'Passagem de Ônibus',
    valorReais: 5.3,
    custoUnitario: reaisParaPontos(5.3),
  },
  {
    id: 2,
    titulo: 'Passagem de Trem / Metrô',
    valorReais: 5.4,
    custoUnitario: reaisParaPontos(5.4),
  },
];

interface ConversaoFormData {
  quantidades: number[];
}

export default function Conversao() {
  const { control, setValue } = useForm<ConversaoFormData>({
    defaultValues: {
      quantidades: [1, 1],
    },
  });
  const [dados] = useState<DadosUsuario>(carregarDadosUsuario);

  const [saldo, setSaldo] = useState<number>(carregarSaldo);

  const quantidades = useWatch({
  control,
  name: 'quantidades',
}) ?? [1, 1];

const [historico, setHistorico] = useState<HistoricoItem[]>(() => {
  try {
    const historicoSalvo = localStorage.getItem('voucherHistorico');

    if (!historicoSalvo) {
      return [];
    }

    const dados: unknown = JSON.parse(historicoSalvo);

    return Array.isArray(dados) ? dados as HistoricoItem[] : [];
  } catch (error) {
    console.error('Erro ao recuperar histórico:', error);
    return [];
  }
});

  const handleQuantidadeChange = (id: PassagemId, value: string) => {
    let num = parseInt(value, 10);

    if (isNaN(num) || num < 1) {
      num = 1;
    }

    if (num > 50) {
      num = 50;
    }

    setValue(`quantidades.${id - 1}` as const, num, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleResgatar = (passagem: Passagem) => {
    const qtd = quantidades[passagem.id - 1] ?? 1;

    const totalCusto = qtd * passagem.custoUnitario;
    const totalEmReais = qtd * passagem.valorReais;

    if (saldo < totalCusto) {
      alert(
        `❌ MovePoints insuficientes! Este resgate precisa de ${totalCusto.toLocaleString('pt-BR')} pts. 
        Você tem apenas ${saldo.toLocaleString('pt-BR')} pts.`
      );

      return;
    }

    const confirmar = window.confirm(
      `CONFIRMAÇÃO DE RESGATE:

      Tipo: ${passagem.titulo}
      Quantidade: ${qtd} passagem(ns)
      Valor: ${totalEmReais.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
      Total de Pontos: ${totalCusto.toLocaleString('pt-BR')} pts

      Clique em OK para confirmar o débito.`
    );

    if (!confirmar) {
      return;
    }

    const novoSaldo = saldo - totalCusto;

    setSaldo(novoSaldo);

    localStorage.setItem('greenPointsSaldo', novoSaldo.toString());

    const novoHistoricoItem: HistoricoItem = {
      id: Math.random().toString(36).substring(2, 11),
      data: new Date().toLocaleDateString('pt-BR'),
      transporte: passagem.titulo,
      quantidade: qtd,
      pontos: totalCusto,
      valorReais: totalEmReais,
    };

    const novoHistorico = [novoHistoricoItem, ...historico];

    setHistorico(novoHistorico);

    localStorage.setItem(
      'voucherHistorico',
      JSON.stringify(novoHistorico)
    );

    setValue(`quantidades.${passagem.id - 1}` as const, 1, {
      shouldDirty: true,
      shouldValidate: true,
    });

    alert(
      `✓ Sucesso! Foram creditadas ${qtd} passagem(ns).

      Valor: ${totalEmReais.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
      Pontos utilizados: ${totalCusto.toLocaleString('pt-BR')} pts
      Saldo restante: ${novoSaldo.toLocaleString('pt-BR')} pts`
    );
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-6">

      {/* SAUDAÇÃO */}

      <section className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-1">
          Olá, {dados.nome}!
        </h1>

        <p className="text-gray-500 text-base sm:text-lg">
          Gerencie sua mobilidade de forma simples e sustentável.
        </p>
      </section>

      {/* TRANSFERIR PONTOS */}

      <section className="mb-10">

        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-3">
            Converter Pontos
          </h2>

          <p className="text-gray-500 text-lg">
            Converta seus MovePoints em créditos para seu cartão de transporte.
          </p>
        </div>

        {/* SALDO */}

        <section className="bg-linear-to-br from-purple-600 to-blue-700 text-white p-8 rounded-3xl text-center max-w-[400px] mx-auto mb-12 shadow-lg shadow-cyan/20">
          <h3 className="text-white/90 text-lg font-medium mb-2">
            Seus MovePoints
          </h3>

          <p className="text-4xl sm:text-5xl font-bold">
            {saldo.toLocaleString('pt-BR')}

            <span className="text-2xl font-normal opacity-80">
              {' '}pts
            </span>
          </p>
        </section>

        {/* CARDS DE PASSAGENS */}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[760px] mx-auto">

          {opcoesPassagens.map((passagem) => {
            const qtd = quantidades[passagem.id - 1] ?? 1;
            const total = qtd * passagem.custoUnitario;
            const totalReais = qtd * passagem.valorReais;

            return (
              <article
                key={passagem.id}
                className="bg-white p-8 rounded-3xl shadow-md text-center flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-dark mb-3">
                    {passagem.titulo}
                  </h3>

                  <p className="text-gray-500 mb-2">
                    Valor da passagem:
                  </p>

                  <p className="text-cyan text-2xl font-bold mb-6">
                    {passagem.valorReais.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>

                  <p className="text-secondary font-bold text-sm mb-6">
                    {passagem.custoUnitario.toLocaleString('pt-BR')} pts / viagem
                  </p>

                  <div className="flex flex-col items-center gap-2 mb-6">
                    <label
                      htmlFor={`qtd-${passagem.id}`}
                      className="text-sm font-medium text-gray-500"
                    >
                      Quantidade:
                    </label>


                    <Controller
                      control={control}
                      name={`quantidades.${passagem.id - 1}` as const}
                      render={({ field }) => (
                        <input
                          {...field}
                          id={`qtd-${passagem.id}`}
                          type="number"
                          min="1"
                          max="50"
                          value={field.value ?? 1}
                          onChange={(e) =>
                            handleQuantidadeChange(passagem.id, e.target.value)
                          }
                          className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg text-center font-bold focus:border-cyan outline-none"
                        />
                      )}
                    />

                  </div>

                  <p className="font-bold text-dark mb-2">
                    Total:{' '}
                    <span className="text-cyan text-xl">
                      {total.toLocaleString('pt-BR')}
                    </span>{' '}
                    pts
                  </p>

                  <p className="text-gray-500 text-sm mb-6">
                    Total:{' '}
                    <span className="font-bold text-cyan">
                      {totalReais.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </p>
                </div>

                <Botao
                  texto="Resgatar Créditos"
                  larguraTotal
                  className="bg-cyan hover:bg-[#009ecf] text-dark shadow-[0_3px_10px_rgba(0,194,255,0.2)]"
                  onClick={() => handleResgatar(passagem)}
                />
              </article>
            );
          })}

        </section>
      </section>

      {/* HISTÓRICO DE GERAÇÃO */}

      <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-md mt-12 mb-10">

        <h2 className="text-2xl font-bold text-dark mb-2">
          Histórico de Geração
        </h2>

        <p className="text-gray-500 mb-6">
          Confira o histórico dos seus MovePoints convertidos.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">

            <thead className="bg-gray-50 text-gray-600 border-b-2 border-gray-100">
              <tr>
                <th className="py-4 px-4 font-semibold">Data</th>
                <th className="py-4 px-4 font-semibold">Transporte</th>
                <th className="py-4 px-4 font-semibold">Quantidade</th>
                <th className="py-4 px-4 font-semibold">Pontos</th>
                <th className="py-4 px-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {historico.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-400"
                  >
                    Nenhum voucher gerado ainda.
                  </td>
                </tr>
              ) : (
                historico.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 bg-[#e6fcf5] transition-colors"
                  >
                    <td className="py-4 px-4">
                      {item.data}
                    </td>

                    <td className="py-4 px-4 font-bold">
                      {item.transporte}
                    </td>

                    <td className="py-4 px-4 font-bold text-purple">
                      {item.quantidade}
                    </td>

                    <td className="py-4 px-4 font-bold text-danger">
                      -{item.pontos.toLocaleString('pt-BR')} pts
                    </td>

                    <td className="py-4 px-4 font-bold text-green">
                      ✓ Gerado
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </section>

      {/* SUA MOBILIDADE É NOSSA PRIORIDADE — ÚLTIMA SEÇÃO */}

      <section className="bg-gradient-to-r from-dark to-[#2a2f7e] rounded-2xl p-6 sm:p-8 flex items-center gap-6 shadow-lg">

        <span className="text-4xl shrink-0">
          🛡️
        </span>

        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
            Sua mobilidade é nossa prioridade
          </h2>

          <p className="text-white/70 text-sm sm:text-base">
            Segurança, sustentabilidade e praticidade.
          </p>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-6 h-6 text-white/60 shrink-0 hidden sm:block"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 011.06-.02z"
            clipRule="evenodd"
          />
        </svg>

      </section>

    </main>
  );
}
