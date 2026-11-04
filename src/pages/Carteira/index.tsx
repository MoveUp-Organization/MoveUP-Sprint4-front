
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { voucherService, type Voucher } from '../../services/voucherService';
import { chavePorConta } from '../../services/armazenamentoConta';

interface DadosCarteira {
  nome: string;
  saldo: number;
  greenPoints: number;
  numeroCartao: string;
  tipoCartao: string;
  statusCartao: 'ATIVO' | 'INATIVO';
  co2Evitado: number;
  distanciaPercorrida: number;
}

interface RegistroMobilidade {
  data: string;
  tipo: string;
  distanciaKm: number;
  pontos: number;
  co2Evitado?: number;
}

const carregarDadosCarteira = (): DadosCarteira => {

const dados: DadosCarteira = {
  nome: 'EcoViajante',
  saldo: 0,
  greenPoints: 0,
  numeroCartao: '** ** ** 4827',
  tipoCartao: 'Bilhete Único MoveUp',
  statusCartao: 'ATIVO',
  co2Evitado: 0,
  distanciaPercorrida: 0,
};

  // Carrega os dados do usuário
  try {
    const cadastroSalvo = localStorage.getItem('moveupUsuario');

    if (cadastroSalvo) {
      const cadastro = JSON.parse(cadastroSalvo);
      dados.nome = cadastro.nome || dados.nome;
    }
  } catch (error) {
    console.error('Erro ao carregar cadastro:', error);
  }

  // Carrega o saldo e os MovePoints
  try {
    const saldoSalvo = sessionStorage.getItem(chavePorConta('moveup_saldo'));

    if (saldoSalvo) {
      const dadosSaldo = JSON.parse(saldoSalvo);

      dados.saldo = Number(dadosSaldo.saldo ?? 0);

      dados.greenPoints = Number(
        dadosSaldo.greenPointsAcumulados ??
        dadosSaldo.greenPoints ??
        dadosSaldo.movePoints ??
        0
      );
    }

    // Compatibilidade com um saldo de pontos salvo separadamente
    const pontosSalvos = localStorage.getItem(chavePorConta('greenPointsSaldo'));

    if (pontosSalvos !== null) {
      const pontos = JSON.parse(pontosSalvos);

      if (typeof pontos === 'number') {
        dados.greenPoints = pontos;
      } else if (pontos && typeof pontos === 'object') {
        dados.greenPoints = Number(
          pontos.greenPointsAcumulados ??
          pontos.greenPoints ??
          pontos.movePoints ??
          dados.greenPoints
        );
      }
    }
  } catch (error) {
    console.error('Erro ao carregar saldo e MovePoints:', error);
  }

  // Carrega os registros reais de mobilidade
  try {
      const registrosSalvos = localStorage.getItem(
        chavePorConta('moveupRegistrosMobilidade')
      );

    if (registrosSalvos) {
      const registros: RegistroMobilidade[] = JSON.parse(registrosSalvos);

      const distanciaTotal = registros.reduce((total, registro) => {
        const distancia = Number(registro.distanciaKm);

        return total + (
          Number.isFinite(distancia) && distancia > 0
            ? distancia
            : 0
        );
      }, 0);

      // Regra de negócio:
      // CO₂ evitado = (emissão do carro - emissão do transporte público) x distância

      const co2Total = registros.reduce((total, registro) => {
        const co2 = Number(registro.co2Evitado ?? 0);

        return total + (
          Number.isFinite(co2) && co2 > 0 ? co2 : 0
        );
      }, 0);

      dados.distanciaPercorrida = distanciaTotal;
      dados.co2Evitado = co2Total;

    }
  } catch (error) {
    console.error(
      'Erro ao calcular indicadores de mobilidade:',
      error
    );
  }

  return dados;
};

export default function MeuCartao() {
  const navigate = useNavigate();

  const [saldoVisivel, setSaldoVisivel] = useState(true);

  const [dados, setDados] = useState<DadosCarteira>(
    carregarDadosCarteira
  );

const [consultaVouchers, setConsultaVouchers] =
  useState<number | 'erro' | null>(null);

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  

const numeroCartaoConta =
  localStorage.getItem('moveupLogado') === 'true'
    ? localStorage.getItem('moveupNumeroCartao')
    : null;

const voucherAtual = numeroCartaoConta
  ? vouchers.find(
      (voucher) => voucher.numeroCartao === numeroCartaoConta
    )
  : undefined;


useEffect(() => {
  let ativo = true;

  const carregarVouchers = async () => {
    try {
      const vouchers = await voucherService.listar();
      
  if (ativo) {
    setVouchers(vouchers);
    setConsultaVouchers(vouchers.length);
  }

    } catch (error) {
      console.error('Erro ao consultar vouchers:', error);

      if (ativo) {
        setConsultaVouchers('erro');
      }
    }
  };

  void carregarVouchers();

  return () => {
    ativo = false;
  };
}, []);

  // Atualiza os dados quando a tela recebe foco ou quando o armazenamento muda
  useEffect(() => {
    
  const atualizarDados = () => {
    const idVoucher = Number(import.meta.env.VITE_VOUCHER_ID);

    // Evita sobrescrever os dados do Java com os dados locais.
    if (Number.isInteger(idVoucher) && idVoucher > 0) {
      return;
    }

    setDados(carregarDadosCarteira());
  };

    window.addEventListener('focus', atualizarDados);
    window.addEventListener('storage', atualizarDados);
    window.addEventListener('pageshow', atualizarDados);

    return () => {
      window.removeEventListener('focus', atualizarDados);
      window.removeEventListener('storage', atualizarDados);
      window.removeEventListener('pageshow', atualizarDados);
    };
  }, []);

  const toggleSaldo = () => {
    setSaldoVisivel((prev) => !prev);
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8">

      <Link
        to="/conversao"
        className="inline-flex items-center gap-2 mb-6 text-primary font-semibold hover:text-secondary transition-colors cursor-pointer"
      >
      </Link>

      <section className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark mb-1">
          Minha Carteira Digital
        </h1>

        <p className="text-gray-500 text-base sm:text-lg">
          Gerencie seu Bilhete MoveUp e sua carteira digital.
        </p>

      
        {consultaVouchers === null ? (
          <p className="text-sm text-gray-500 mt-2">
            Consultando vouchers na API Java...
          </p>
        ) : consultaVouchers === 'erro' ? (
          <p className="text-sm text-red-600 mt-2">
            Não foi possível consultar os vouchers.
            O cartão exibido é ilustrativo.
          </p>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            API Java conectada: {consultaVouchers} voucher(s) encontrado(s).
          </p>
        )}

      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        <div>
          <h2 className="text-lg font-bold text-dark mb-4">
            Bilhete MoveUp
          </h2>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary p-6 sm:p-8 text-white shadow-xl min-h-[280px]">

            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -right-10 bottom-[-70px] w-56 h-56 rounded-full bg-white/10" />

            <div className="relative z-10 flex items-center justify-between mb-10">
              <div>
                <p className="text-sm font-medium text-white/70">
                  BILHETE
                </p>

                <h3 className="text-2xl font-extrabold tracking-tight">
                  MoveUp
                </h3>
              </div>

              <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center shadow-md">
                <div className="w-7 h-5 border-2 border-yellow-700/40 rounded-md" />
              </div>
            </div>

            <div className="relative z-10 mb-8">
              <p className="text-xs text-white/60 mb-1">
                Número do cartão
              </p>

              <p className="text-xl sm:text-2xl font-semibold tracking-[0.18em]">
                
              {voucherAtual
                ? `•••• •••• •••• ${voucherAtual.numeroCartao.slice(-4)}`
                : dados.numeroCartao}

              </p>
            </div>

            <div className="relative z-10 flex items-end justify-between">

            <div>
              <p className="text-xs text-white/60 mb-1">
                TITULAR
              </p>

              <p className="font-semibold uppercase">
                {voucherAtual?.titular ?? dados.nome}
              </p>
            </div>

              <div className="text-right">
                <p className="text-xs text-white/60 mb-1">
                  STATUS
                </p>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
                  
                <span
                  className={`w-2 h-2 rounded-full ${
                    (voucherAtual?.status ?? dados.statusCartao) === 'ATIVO'
                      ? 'bg-green-300'
                      : 'bg-red-300'
                  }`}
                />
                  {(voucherAtual?.status ?? dados.statusCartao) === 'ATIVO'
                    ? 'Ativo'
                    : 'Inativo'}

                </span>
              </div>
            </div>

          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-dark mb-4">
            Carteira
          </h2>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md min-h-[280px] flex flex-col justify-between">

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">
                  Saldo disponível
                </p>

                <button
                  type="button"
                  onClick={toggleSaldo}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label={
                    saldoVisivel
                      ? 'Ocultar saldo'
                      : 'Mostrar saldo'
                  }
                >
                  {saldoVisivel ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-gray-500"
                    >
                      <path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-gray-500"
                    >
                      <path d="M2 4.3l2.3 2.3.4.4C3.2 8.3 2 10 1 12c1.7 4.4 6 7.5 11 7.5 1.5 0 3-.3 4.4-.8l2.9 2.9 1.3-1.3L3.3 3 2 4.3zM12 17c-2.8 0-5-2.2-5-5 0-.8.2-1.5.6-2.2l1.5 1.5c0 .2-.1.5-.1.7 0 1.7 1.3 3 3 3 .2 0 .5 0 .7-.1l1.5 1.5c-.7.3-1.4.6-2.2.6zm0-10c5 0 9.3 3.1 11 7.5-.8 1.8-2 3.4-3.5 4.7l-1.5-1.5c.8-.9 1.5-2 2-3.2-1.7-3-4.7-5-8-5-.8 0-1.6.1-2.4.3L8 8.2C9.2 7.4 10.5 7 12 7z" />
                    </svg>
                  )}
                </button>
              </div>

              {saldoVisivel ? (
                <p className="text-4xl sm:text-5xl font-extrabold text-dark tracking-tight">

                {(voucherAtual?.saldoDisponivel ?? dados.saldo).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}

                </p>
              ) : (
                <p className="text-4xl sm:text-5xl font-extrabold text-dark tracking-tight">
                  R$ •••••
                </p>
              )}

              <p className="text-sm text-gray-400 mt-2">
                Valor disponível na carteira
              </p>
            </div>

            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-md">
              <h2 className="text-lg font-bold text-dark mb-5">
                Indicadores
              </h2>

              <div className="space-y-5">

                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-green/10 text-2xl shrink-0">
                    🌿
                  </span>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      CO₂ evitado
                    </p>

                    <p className="text-xl font-bold text-dark">
                      {dados.co2Evitado.toFixed(2).replace('.', ',')} kg
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan/10 text-2xl shrink-0">
                    🚲
                  </span>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      Distância percorrida
                    </p>

                    <p className="text-xl font-bold text-dark">
                      {dados.distanciaPercorrida.toFixed(1).replace('.', ',')} km
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-2xl shrink-0">
                    ⭐
                  </span>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      MovePoints acumulados
                    </p>

                    <p className="text-xl font-bold text-dark">
                      {dados.greenPoints.toLocaleString('pt-BR')} pts
                    </p>
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="bg-gradient-to-r from-dark to-[#2a2f7e] rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center gap-5">

          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-3xl shrink-0">
            💰
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
              Transforme seus MovePoints em saldo
            </h2>

            <p className="text-white/70 text-sm sm:text-base">
              Converta seus pontos e utilize o saldo na sua carteira MoveUp.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/conversao')}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-dark font-bold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Converter MovePoints

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-.02 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-dark mb-4">
          Informações do bilhete
        </h2>

        <div className="bg-white rounded-3xl shadow-md divide-y divide-gray-100">

          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">
                Tipo de cartão
              </p>

              <p className="font-semibold text-dark mt-1">
                {voucherAtual?.tipo ?? dados.tipoCartao}
              </p>
            </div>

            <span className="text-2xl">
              🎫
            </span>
          </div>

          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">
                Situação
              </p>

              <p className={`font-semibold mt-1 ${
                  (voucherAtual?.status ?? dados.statusCartao) === 'ATIVO'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
>
                {(voucherAtual?.status ?? dados.statusCartao) === 'ATIVO'
                  ? 'Cartão ativo'
                  : 'Cartão inativo'}
              </p>
            </div>

            <span
              className={`w-3 h-3 rounded-full ${
                (voucherAtual?.status ?? dados.statusCartao) === 'ATIVO'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />

          </div>

          <div className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">
                Número do cartão
              </p>

              <p className="font-semibold text-dark mt-1 tracking-wider">
              {voucherAtual
                ? `•••• •••• •••• ${voucherAtual.numeroCartao.slice(-4)}`
                : dados.numeroCartao}

              </p>
            </div>

            <span className="text-2xl">
              💳
            </span>
          </div>

        </div>
      </section>

    </main>
  );
}
