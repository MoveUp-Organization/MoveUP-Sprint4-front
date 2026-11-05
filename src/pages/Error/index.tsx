import { Link } from 'react-router-dom';

export default function Error() {
  return (
    <main className="w-full min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 py-10 text-center">

      <div
        className="text-7xl sm:text-8xl lg:text-9xl mb-4"
        aria-hidden="true"
      >
        🛸
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark mb-3 sm:mb-4">
        Erro 404
      </h1>

      <p className="text-sm sm:text-base lg:text-xl text-gray-500 mb-7 sm:mb-8 max-w-[500px] leading-relaxed">
        Ops! Parece que você se perdeu no caminho sustentável.
        A página que você está procurando não existe.
      </p>

      <Link
        to="/"
        className="inline-flex items-center justify-center w-full max-w-[300px] sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm sm:text-base rounded-full font-bold shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Voltar para a Página Inicial
      </Link>

    </main>
  );
}
