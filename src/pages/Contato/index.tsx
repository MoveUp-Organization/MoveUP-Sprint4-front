
import { useForm } from 'react-hook-form';

interface ContatoFormData {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export default function Contato() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContatoFormData>();

  const onSubmit = (data: ContatoFormData) => {
    console.log('Mensagem de contato:', data);
    alert('✅ Mensagem enviada com sucesso! Em breve nossa equipe entrará em contato.');
    reset();
  };

  return (
    <main className="w-full max-w-[800px] mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
      {/* Cabeçalho */}
      <section className="text-center mb-7 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3">
          Contato
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed max-w-[600px] mx-auto">
          Envie sua dúvida, sugestão ou mensagem para a equipe MoveUp.
        </p>
      </section>

      {/* Formulário */}
      <section className="bg-white p-4 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5 sm:space-y-6"
        >
          {/* Nome e e-mail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="min-w-0">
              <label
                htmlFor="contatoNome"
                className="block text-sm font-semibold text-dark mb-2"
              >
                Nome Completo
              </label>

              <input
                type="text"
                id="contatoNome"
                placeholder="Ex: João da Silva"
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? 'erroNome' : undefined}
                className={`w-full min-w-0 px-3 sm:px-4 py-3 rounded-xl border-2 transition-colors outline-none text-sm focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  errors.nome
                    ? 'border-danger bg-red-50 focus:border-danger'
                    : 'border-gray-200 focus:border-primary bg-gray-50'
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
                <p
                  id="erroNome"
                  role="alert"
                  className="text-danger text-xs mt-1 font-medium"
                >
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div className="min-w-0">
              <label
                htmlFor="contatoEmail"
                className="block text-sm font-semibold text-dark mb-2"
              >
                E-mail
              </label>

              <input
                type="email"
                id="contatoEmail"
                placeholder="Ex: joao@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'erroEmail' : undefined}
                className={`w-full min-w-0 px-3 sm:px-4 py-3 rounded-xl border-2 transition-colors outline-none text-sm focus-visible:ring-2 focus-visible:ring-primary/30 ${
                  errors.email
                    ? 'border-danger bg-red-50 focus:border-danger'
                    : 'border-gray-200 focus:border-primary bg-gray-50'
                }`}
                {...register('email', {
                  required: 'O e-mail é obrigatório.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'E-mail inválido.',
                  },
                })}
              />

              {errors.email && (
                <p
                  id="erroEmail"
                  role="alert"
                  className="text-danger text-xs mt-1 font-medium"
                >
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Assunto */}
          <div className="min-w-0">
            <label
              htmlFor="contatoAssunto"
              className="block text-sm font-semibold text-dark mb-2"
            >
              Assunto
            </label>

            <input
              type="text"
              id="contatoAssunto"
              placeholder="Sobre o que deseja falar?"
              aria-invalid={!!errors.assunto}
              aria-describedby={errors.assunto ? 'erroAssunto' : undefined}
              className={`w-full min-w-0 px-3 sm:px-4 py-3 rounded-xl border-2 transition-colors outline-none text-sm focus-visible:ring-2 focus-visible:ring-primary/30 ${
                errors.assunto
                  ? 'border-danger bg-red-50 focus:border-danger'
                  : 'border-gray-200 focus:border-primary bg-gray-50'
              }`}
              {...register('assunto', {
                required: 'O assunto é obrigatório.',
                validate: (valor) => {
                  const assunto = valor.trim();

                  if (assunto.length < 5) {
                    return 'O assunto deve ter pelo menos 5 caracteres.';
                  }

                  if (assunto.length > 100) {
                    return 'O assunto deve ter no máximo 100 caracteres.';
                  }

                  return true;
                },
              })}
            />

            {errors.assunto && (
              <p
                id="erroAssunto"
                role="alert"
                className="text-danger text-xs mt-1 font-medium"
              >
                {errors.assunto.message}
              </p>
            )}
          </div>

          {/* Mensagem */}
          <div className="min-w-0">
            <label
              htmlFor="contatoMensagem"
              className="block text-sm font-semibold text-dark mb-2"
            >
              Mensagem
            </label>

            <textarea
              id="contatoMensagem"
              rows={5}
              placeholder="Escreva sua mensagem aqui..."
              aria-invalid={!!errors.mensagem}
              aria-describedby={errors.mensagem ? 'erroMensagem' : undefined}
              className={`w-full min-w-0 px-3 sm:px-4 py-3 rounded-xl border-2 transition-colors outline-none text-sm resize-y focus-visible:ring-2 focus-visible:ring-primary/30 ${
                errors.mensagem
                  ? 'border-danger bg-red-50 focus:border-danger'
                  : 'border-gray-200 focus:border-primary bg-gray-50'
              }`}
              {...register('mensagem', {
                required: 'A mensagem é obrigatória.',
                validate: (valor) => {
                  const mensagem = valor.trim();

                  if (mensagem.length < 10) {
                    return 'A mensagem deve ter pelo menos 10 caracteres.';
                  }

                  if (mensagem.length > 1000) {
                    return 'A mensagem deve ter no máximo 1000 caracteres.';
                  }

                  return true;
                },
              })}
            />

            {errors.mensagem && (
              <p
                id="erroMensagem"
                role="alert"
                className="text-danger text-xs mt-1 font-medium"
              >
                {errors.mensagem.message}
              </p>
            )}
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-12 px-4 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm sm:text-base font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </section>
    </main>
  );
}
