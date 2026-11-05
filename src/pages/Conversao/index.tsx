
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Botao from '../../components/Botao/Botao';
import { chavePorConta } from '../../services/armazenamentoConta';
import { voucherService, type Voucher } from '../../services/voucherService';
import { historicoService } from '../../services/historicoService';

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

  return { nome: 'EcoViajante' };
};

const carregarSaldo = (): number => {
  try {
    const saldoSessao = sessionStorage.getItem(
      chavePorConta('moveup_saldo')
    );

    if (saldoSessao) {
      const dados = JSON.parse(saldoSessao);

      const pontos = Number(
        dados.greenPointsAcumulados ??
        dados.greenPoints ??
        dados.movePoints ??
        0
      );

      if (Number.isFinite(pontos) && pontos >= 0) {
        return pontos;
      }
    }

    const saldoLocal = localStorage.getItem(
      chavePorConta('greenPointsSaldo')
    );

    if (saldoLocal !== null) {
      const dadosPontos = JSON.parse(saldoLocal);

      const pontos =
        typeof dadosPontos === 'number'
          ? dadosPontos
          : Number(
              dadosPontos?.greenPointsAcumulados ??
              dadosPontos?.greenPoints ??
              dadosPontos?.movePoints ??
              0
            );

      if (Number.isFinite(pontos) && pontos >= 0) {
        return pontos;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar MovePoints:', error);
  }

  return 0;
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

const obterDataISO = (): string => {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
};

const carregarHistoricoLocal = (): HistoricoItem[] => {
  try {
    const historicoSalvo = localStorage.getItem(
      chavePorConta('voucherHistorico')
    );

    if (!historicoSalvo) return [];

    const dados: unknown = JSON.parse(historicoSalvo);

    return Array.isArray(dados)
      ? dados as HistoricoItem[]
      : [];
  } catch (error) {
    console.error('Erro ao recuperar histórico:', error);
    return [];
  }
};

export default function Conversao() {
  const { control, setValue } = useForm<ConversaoFormData>({
    defaultValues: {
      quantidades: [1, 1],
    },
  });

  const [dados] = useState<DadosUsuario>(carregarDadosUsuario);
  const [saldo, setSaldo] = useState<number>(carregarSaldo);
  const [resgatando, setResgatando] = useState(false);

  const [quantidades, setQuantidades] = useState<number[]>([1, 1]);

  const [historico, setHistorico] = useState<HistoricoItem[]>(
    carregarHistoricoLocal
  );

  const handleQuantidadeChange = (
    id: PassagemId,
    value: string
  ) => {
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

    setQuantidades((prev) => {
      const novasQuantidades = [...prev];
      novasQuantidades[id - 1] = num;
      return novasQuantidades;
    });
  };

  const handleResgatar = async (passagem: Passagem) => {
    if (resgatando) return;

    const qtd = quantidades[passagem.id - 1] ?? 1;

    if (!Number.isInteger(qtd) || qtd < 1 || qtd > 50) {
      alert('Informe uma quantidade válida de passagens.');
      return;
    }

    const totalCusto = qtd * passagem.custoUnitario;

    const totalEmReais = Number(
      (qtd * passagem.valorReais).toFixed(2)
    );

    if (saldo < totalCusto) {
      alert('MovePoints insuficientes para realizar a conversão.');
      return;
    }

    const numeroCartao = localStorage.getItem('moveupNumeroCartao');

    if (
      localStorage.getItem('moveupLogado') !== 'true' ||
      !numeroCartao
    ) {
      alert('Faça login para acessar seu cartão.');
      return;
    }

    const confirmar = window.confirm(
      `Confirmar conversão de ${totalCusto} MovePoints em R$ ${totalEmReais.toFixed(2)} de créditos?`
    );

    if (!confirmar) return;

    setResgatando(true);

    let saldoCartaoAnterior: number | null = null;
    let idHistoricoCriado: number | null = null;

    try {
      const vouchers = await voucherService.listar();

      const voucher = vouchers.find(
        (item) => item.numeroCartao === numeroCartao
      );

      if (!voucher || voucher.cdCartao == null) {
        alert('Não foi possível encontrar seu cartão no Java.');
        return;
      }

      if (voucher.status !== 'ATIVO') {
        alert('Seu cartão não está ativo.');
        return;
      }

      const saldoAtualCartao = Number(voucher.saldoDisponivel);

      if (
        !Number.isFinite(saldoAtualCartao) ||
        saldoAtualCartao < 0
      ) {
        alert('O saldo atual do cartão retornou um valor inválido.');
        return;
      }

      saldoCartaoAnterior = saldoAtualCartao;

      const novoSaldoCartao = Number(
        (saldoAtualCartao + totalEmReais).toFixed(2)
      );

      const novoSaldoMovePoints = saldo - totalCusto;

      const voucherAtualizado = await voucherService.atualizar(
        voucher.cdCartao,
        {
          numeroCartao: voucher.numeroCartao,
          titular: voucher.titular,
          tipo: voucher.tipo,
          status: voucher.status,
          saldoDisponivel: novoSaldoCartao,
        }
      );

      const vouchersAtualizados: Voucher[] = vouchers.map((item) =>
        item.cdCartao === voucher.cdCartao
          ? voucherAtualizado
          : item
      );

      try {
        const registroCriado = await historicoService.cadastrar({
          data: obterDataISO(),
          transporte: passagem.titulo,
          quantidadePassagem: qtd,
          pontos: totalCusto,
          status: 'ATIVO',
        });

        idHistoricoCriado = registroCriado.idHistorico;
      } catch (error) {
        console.error('Erro ao registrar histórico no Java:', error);

        try {
          await voucherService.atualizar(voucher.cdCartao, {
            numeroCartao: voucher.numeroCartao,
            titular: voucher.titular,
            tipo: voucher.tipo,
            status: voucher.status,
            saldoDisponivel: saldoCartaoAnterior,
          });

          alert(
            'O histórico não foi registrado. O saldo anterior do cartão foi restaurado. Nenhum MovePoint foi descontado.'
          );
        } catch (erroRollback) {
          console.error(
            'Não foi possível restaurar o saldo do cartão:',
            erroRollback
          );

          alert(
            'A atualização do cartão foi realizada, mas o histórico falhou e não foi possível restaurar o saldo anterior. Não tente novamente antes de verificar o cartão.'
          );
        }

        return;
      }

      const novoHistoricoItem: HistoricoItem = {
        id: crypto.randomUUID(),
        data: new Date().toLocaleDateString('pt-BR'),
        transporte: passagem.titulo,
        quantidade: qtd,
        pontos: totalCusto,
        valorReais: totalEmReais,
      };

      const novoHistorico = [
        novoHistoricoItem,
        ...historico,
      ];

      const chavePontos = chavePorConta('greenPointsSaldo');
      const chaveSaldo = chavePorConta('moveup_saldo');
      const chaveHistorico = chavePorConta('voucherHistorico');
      const chaveVouchers = chavePorConta('moveupVouchers');

      const pontosAnteriores = localStorage.getItem(chavePontos);
      const saldoSessaoAnterior = sessionStorage.getItem(chaveSaldo);
      const historicoAnterior = localStorage.getItem(chaveHistorico);
      const vouchersAnteriores = localStorage.getItem(chaveVouchers);

      try {
        const dadosSaldo = saldoSessaoAnterior
          ? JSON.parse(saldoSessaoAnterior)
          : {};

        localStorage.setItem(
          chavePontos,
          JSON.stringify(novoSaldoMovePoints)
        );

        sessionStorage.setItem(
          chaveSaldo,
          JSON.stringify({
            ...dadosSaldo,
            greenPointsAcumulados: novoSaldoMovePoints,
          })
        );

        localStorage.setItem(
          chaveHistorico,
          JSON.stringify(novoHistorico)
        );

        localStorage.setItem(
          chaveVouchers,
          JSON.stringify(vouchersAtualizados)
        );
      } catch (erroArmazenamento) {
        console.error(
          'Erro ao salvar os dados locais da conversão:',
          erroArmazenamento
        );

        try {
          if (pontosAnteriores === null) {
            localStorage.removeItem(chavePontos);
          } else {
            localStorage.setItem(chavePontos, pontosAnteriores);
          }

          if (saldoSessaoAnterior === null) {
            sessionStorage.removeItem(chaveSaldo);
          } else {
            sessionStorage.setItem(chaveSaldo, saldoSessaoAnterior);
          }

          if (historicoAnterior === null) {
            localStorage.removeItem(chaveHistorico);
          } else {
            localStorage.setItem(chaveHistorico, historicoAnterior);
          }

          if (vouchersAnteriores === null) {
            localStorage.removeItem(chaveVouchers);
          } else {
            localStorage.setItem(chaveVouchers, vouchersAnteriores);
          }
        } catch (erroRestauracaoLocal) {
          console.error(
            'Erro ao restaurar os dados locais:',
            erroRestauracaoLocal
          );
        }

        try {
          if (idHistoricoCriado !== null) {
            await historicoService.excluir(idHistoricoCriado);
          } else {
            throw new Error(
              'A API não retornou o identificador do histórico.'
            );
          }

          await voucherService.atualizar(voucher.cdCartao, {
            numeroCartao: voucher.numeroCartao,
            titular: voucher.titular,
            tipo: voucher.tipo,
            status: voucher.status,
            saldoDisponivel: saldoCartaoAnterior,
          });

          alert(
            'Não foi possível salvar a conversão no navegador. O histórico Java foi removido e o saldo do cartão foi restaurado.'
          );
        } catch (erroCompensacao) {
          console.error(
            'Não foi possível desfazer a conversão na API:',
            erroCompensacao
          );

          alert(
            'Ocorreu uma falha ao salvar os dados locais e não foi possível desfazer todas as operações no Java. Verifique o cartão e o histórico antes de tentar novamente.'
          );
        }

        return;
      }

      setSaldo(novoSaldoMovePoints);
      setHistorico(novoHistorico);

      setValue(`quantidades.${passagem.id - 1}` as const, 1);

      setQuantidades((prev) => {
        const novasQuantidades = [...prev];
        novasQuantidades[passagem.id - 1] = 1;
        return novasQuantidades;
      });

      alert(
        `Conversão concluída!\n\nMovePoints utilizados: ${totalCusto}\nCréditos adicionados: R$ ${totalEmReais.toFixed(2)}`
      );
    } catch (error) {
      console.error('Erro ao realizar conversão:', error);

      alert(
        'Não foi possível confirmar a conversão. Confira o saldo do cartão e o histórico antes de tentar novamente.'
      );
    } finally {
      setResgatando(false);
    }
  };

  return (
    <main className="w-full max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
      {/* Saudação */}
      <section className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-1 break-words">
          Olá, {dados.nome}!
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed">
          Gerencie sua mobilidade de forma simples e sustentável.
        </p>
      </section>

      {/* Transferir pontos */}
      <section className="mb-8 sm:mb-10">
        <div className="text-center mb-7 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3">
            Converter Pontos
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed max-w-[650px] mx-auto">
            Converta seus MovePoints em créditos para seu cartão de transporte.
          </p>
        </div>

        {/* Saldo */}
        <section className="w-full max-w-[400px] mx-auto bg-gradient-to-br from-purple-600 to-blue-700 text-white p-5 sm:p-8 rounded-3xl text-center mb-8 sm:mb-12 shadow-lg shadow-cyan/20">
          <h3 className="text-base sm:text-lg text-white/90 font-medium mb-2">
            Seus MovePoints
          </h3>

          <p className="text-3xl sm:text-5xl font-bold break-words">
            {saldo.toLocaleString('pt-BR')}
            <span className="text-xl sm:text-2xl font-normal opacity-80">
              {' '}pts
            </span>
          </p>
        </section>

        {/* Cards de passagens */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-[760px] mx-auto">
          {opcoesPassagens.map((passagem) => {
            const qtd = quantidades[passagem.id - 1] ?? 1;
            const total = qtd * passagem.custoUnitario;
            const totalReais = qtd * passagem.valorReais;

            return (
              <article
                key={passagem.id}
                className="min-w-0 bg-white p-5 sm:p-8 rounded-3xl shadow-md text-center flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-dark mb-3 break-words">
                    {passagem.titulo}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-500 mb-2">
                    Valor da passagem:
                  </p>

                  <p className="text-cyan text-xl sm:text-2xl font-bold mb-5 sm:mb-6">
                    {passagem.valorReais.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>

                  <p className="text-secondary font-bold text-xs sm:text-sm mb-5 sm:mb-6">
                    {passagem.custoUnitario.toLocaleString('pt-BR')} pts / viagem
                  </p>

                  <div className="flex flex-col items-center gap-2 mb-5 sm:mb-6">
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
                            handleQuantidadeChange(
                              passagem.id,
                              e.target.value
                            )
                          }
                          className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg text-center font-bold focus:border-cyan outline-none"
                        />
                      )}
                    />
                  </div>

                  <p className="font-bold text-dark mb-2 text-sm sm:text-base">
                    Total:{' '}
                    <span className="text-cyan text-lg sm:text-xl">
                      {total.toLocaleString('pt-BR')}
                    </span>{' '}
                    pts
                  </p>

                  <p className="text-gray-500 text-sm mb-5 sm:mb-6">
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
                  texto={resgatando ? 'Processando...' : 'Resgatar Créditos'}
                  desabilitado={resgatando}
                  larguraTotal
                  className="bg-cyan hover:bg-[#009ecf] text-dark shadow-[0_3px_10px_rgba(0,194,255,0.2)]"
                  onClick={() => handleResgatar(passagem)}
                />
              </article>
            );
          })}
        </section>
      </section>

      {/* Histórico de geração */}
      <section className="min-w-0 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 shadow-md mt-8 sm:mt-12 mb-8 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-dark mb-2">
          Histórico de Geração
        </h2>

        <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6">
          Confira o histórico dos seus MovePoints convertidos.
        </p>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b-2 border-gray-100">
              <tr>
                <th className="py-4 px-3 sm:px-4 font-semibold">Data</th>
                <th className="py-4 px-3 sm:px-4 font-semibold">Transporte</th>
                <th className="py-4 px-3 sm:px-4 font-semibold">Quantidade</th>
                <th className="py-4 px-3 sm:px-4 font-semibold">Pontos</th>
                <th className="py-4 px-3 sm:px-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {historico.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-3 text-center text-gray-400"
                  >
                    Nenhuma conversão foi gerada ainda.
                  </td>
                </tr>
              ) : (
                historico.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-50 bg-[#e6fcf5] transition-colors"
                  >
                    <td className="py-4 px-3 sm:px-4 whitespace-nowrap">
                      {item.data}
                    </td>

                    <td className="py-4 px-3 sm:px-4 font-bold">
                      {item.transporte}
                    </td>

                    <td className="py-4 px-3 sm:px-4 font-bold text-purple whitespace-nowrap">
                      {item.quantidade}
                    </td>

                    <td className="py-4 px-3 sm:px-4 font-bold text-danger whitespace-nowrap">
                      -{item.pontos.toLocaleString('pt-BR')} pts
                    </td>

                    <td className="py-4 px-3 sm:px-4 font-bold text-green whitespace-nowrap">
                      ✓ Gerado
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sua mobilidade é nossa prioridade */}
      <section className="bg-gradient-to-r from-dark to-[#2a2f7e] rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-lg">
        <span className="text-3xl sm:text-4xl shrink-0" aria-hidden="true">
          🛡️
        </span>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
            Sua mobilidade é nossa prioridade
          </h2>

          <p className="text-white/70 text-sm sm:text-base leading-relaxed">
            Segurança, sustentabilidade e praticidade.
          </p>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-6 h-6 text-white/60 shrink-0 hidden sm:block"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01-.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-.02 1.06z"
            clipRule="evenodd"
          />
        </svg>
      </section>
    </main>
  );
}
