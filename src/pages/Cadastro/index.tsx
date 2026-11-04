import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../img/logo.png';
import { usuarioService } from '../../services/usuarioService';
import { voucherService } from '../../services/voucherService';

interface CadastroFormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

interface ContaLocal {
  nome: string;
  email: string;
  numeroCartao: string;
  salt: string;
  verificador: string;
}

export default function Cadastro() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>();

  const senhaAtual = useWatch({
    control,
    name: 'senha',
  });

  const onSubmit = async (data: CadastroFormData) => {
    const nome = data.nome.trim();
    const email = data.email.trim().toLowerCase();

    // Número fictício de 16 dígitos para o cartão.
    const numeroCartao =
      '99' +
      Array.from(
        crypto.getRandomValues(new Uint8Array(14)),
        (numero) => numero % 10
      ).join('');

    try {
      // Verifica se o e-mail já existe no armazenamento demonstrativo.
      const contasSalvas: ContaLocal[] = JSON.parse(
        localStorage.getItem('moveupCadastroDemo') || '[]'
      );

      const emailJaCadastrado = contasSalvas.some(
        (conta) => conta.email.trim().toLowerCase() === email
      );

      if (emailJaCadastrado) {
        alert('Este e-mail já possui um cadastro demonstrativo neste navegador.');
        return;
      }

      // Cadastra o usuário na API Java.
      await usuarioService.cadastrar({
        nomeUsuario: nome,
        email,
        senha: data.senha,
      });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Não foi possível cadastrar o usuário.');
      return;
    }

    try {
      // Cria o cartão na API Java.
      await voucherService.cadastrar({
        numeroCartao,
        titular: nome,
        tipo: 'Bilhete Único MoveUp',
        status: 'ATIVO',
        saldoDisponivel: 0,
      });

      // Guarda apenas a referência para o fluxo demonstrativo.
      const salt = crypto.randomUUID();

      const chave = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(data.senha),
        'PBKDF2',
        false,
        ['deriveBits']
      );

      const resultado = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode(salt),
          iterations: 100000,
          hash: 'SHA-256',
        },
        chave,
        256
      );

      const verificador = Array.from(
        new Uint8Array(resultado),
        (byte) => byte.toString(16).padStart(2, '0')
      ).join('');

      // Recupera os cadastros anteriores e adiciona a nova conta.
      const contasAtualizadas: ContaLocal[] = JSON.parse(
        localStorage.getItem('moveupCadastroDemo') || '[]'
      );

      contasAtualizadas.push({
        nome,
        email,
        numeroCartao,
        salt,
        verificador,
      });

      localStorage.setItem(
        'moveupCadastroDemo',
        JSON.stringify(contasAtualizadas)
      );

      alert('Cadastro e cartão criados com sucesso!');

      navigate('/login');
    } catch (error) {
      console.error('Erro ao criar cartão:', error);

      alert(
        'O usuário foi cadastrado, mas não foi possível concluir o cartão. Não repita o cadastro agora para evitar duplicidade.'
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#dbeafe] via-[#e0e7ff] to-[#ddd6fe]">
      <section className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Lado Esquerdo — Logo */}
        <div className="md:w-1/2 min-h-[550px] bg-gradient-to-br from-[#bfdbfe] via-[#c7d2fe] to-[#d8b4fe] p-8 sm:p-12 flex flex-col justify-center items-center text-center">
          <img
            src={logo}
            alt="Logo MoveUp"
            className="w-[600px] max-w-none h-auto mb-6 drop-shadow-lg translate-x-4"
          />

          <p className="text-[#6b6b72] text-base sm:text-lg leading-relaxed max-w-md">
            Crie sua conta para acessar a plataforma e começar a acumular MovePoints.
          </p>
        </div>

        <div className="md:w-1/2 p-8 sm:p-12">
          <h1 className="text-3xl font-extrabold text-dark mb-6">
            Criar Conta
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="cadNome"
                className="block text-sm font-semibold text-dark mb-1"
              >
                Nome
              </label>

              <input
                type="text"
                id="cadNome"
                placeholder="Digite seu nome completo"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors outline-none text-sm ${
                  errors.nome
                    ? 'border-danger bg-red-50 focus:border-danger'
                    : 'border-gray-200 focus:border-secondary bg-gray-50'
                }`}
                {...register('nome', {
                  required: 'O nome é obrigatório.',
                  maxLength: {
                    value: 80,
                    message: 'O nome deve ter no máximo 80 caracteres.',
                  },
                  validate: (valor) => {
                    const nome = valor.trim().replace(/\s+/g, ' ');

                    if (nome.length < 3) {
                      return 'O nome deve ter pelo menos 3 caracteres.';
                    }

                    if (!/^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u.test(nome)) {
                      return 'Digite um nome válido, sem números ou símbolos.';
                    }

                    return true;
                  },
                })}
              />

              {errors.nome && (
                <p className="text-danger text-xs mt-1 font-medium">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cadEmail"
                className="block text-sm font-semibold text-dark mb-1"
              >
                Email
              </label>

              <input
                type="email"
                id="cadEmail"
                placeholder="Digite seu email"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors outline-none text-sm ${
                  errors.email
                    ? 'border-danger bg-red-50 focus:border-danger'
                    : 'border-gray-200 focus:border-secondary bg-gray-50'
                }`}
                {...register('email', {
                  required: 'O email é obrigatório.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Formato de email inválido.',
                  },
                })}
              />

              {errors.email && (
                <p className="text-danger text-xs mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cadSenha"
                className="block text-sm font-semibold text-dark mb-1"
              >
                Senha
              </label>

              <input
                type="password"
                id="cadSenha"
                placeholder="Crie uma senha"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors outline-none text-sm ${
                  errors.senha
                    ? 'border-danger bg-red-50 focus:border-danger'
                    : 'border-gray-200 focus:border-secondary bg-gray-50'
                }`}
                {...register('senha', {
                  required: 'A senha é obrigatória.',
                  minLength: {
                    value: 8,
                    message: 'A senha deve ter pelo menos 8 caracteres.',
                  },
                  maxLength: {
                    value: 100,
                    message: 'A senha deve ter no máximo 100 caracteres.',
                  },
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_]).*$/,
                    message:
                      'A senha deve conter letra maiúscula, minúscula, número e caractere especial.',
                  },
                })}
              />

              {errors.senha && (
                <p className="text-danger text-xs mt-1 font-medium">
                  {errors.senha.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cadConfirmarSenha"
                className="block text-sm font-semibold text-dark mb-1"
              >
                Confirmar Senha
              </label>

              <input
                type="password"
                id="cadConfirmarSenha"
                placeholder="Confirme sua senha"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors outline-none text-sm ${
                  errors.confirmarSenha
                    ? 'border-danger bg-red-50 focus:border-danger'
                    : 'border-gray-200 focus:border-secondary bg-gray-50'
                }`}
                {...register('confirmarSenha', {
                  required: 'A confirmação de senha é obrigatória.',
                  validate: (value) =>
                    value === senhaAtual || 'As senhas não coincidem.',
                })}
              />

              {errors.confirmarSenha && (
                <p className="text-danger text-xs mt-1 font-medium">
                  {errors.confirmarSenha.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-secondary to-purple text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Já possui uma conta?{' '}
            <Link
              to="/login"
              className="text-secondary font-bold hover:underline"
            >
              Fazer Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}