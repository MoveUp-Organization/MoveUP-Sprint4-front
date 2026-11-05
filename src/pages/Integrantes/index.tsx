
import fotoEduardo from '../../img/fotoEduardo.png';
import fotoIsa from '../../img/fotoIsa.png';
import fotoMih from '../../img/fotoMih.png';
import fotoMarina from '../../img/fotoMarina.png';

import githubIcon from '../../img/github.png';
import linkedinIcon from '../../img/lkd.png';

export default function Integrantes() {
  const equipe = [
    {
      nome: 'Eduardo Damasio Guelere',
      rm: '569960',
      cargo: 'Desenvolvedor Back-end',
      turma: '1TDSPH',
      foto: fotoEduardo,
      github: 'https://github.com/Eduardoguelere',
      linkedin: 'https://www.linkedin.com/in/eduardo-guelere-0902753b8/',
    },
    {
      nome: 'Isabelle Ferreira Neri Feitoza',
      rm: '573507',
      cargo: 'Analista de Dados',
      cargoSecundario: 'Desenvolvedora Front-end',
      turma: '1TDSPH',
      foto: fotoIsa,
      github: 'https://github.com/isabelleferreiraa',
      linkedin: 'https://www.linkedin.com/in/isabelle-ferreira-8844593ab',
    },
    {
      nome: 'Milena Silva Conegin',
      rm: '568923',
      cargo: 'Desenvolvedora Back-end',
      turma: '1TDSPH',
      foto: fotoMih,
      github: 'https://github.com/MilenaConegin',
      linkedin: 'https://www.linkedin.com/in/milena-conegin-996b22269',
    },
    {
      nome: 'Marina Fernandes Gomes Mesquita',
      rm: '571265',
      cargo: 'Especialista em IA',
      cargoSecundario: 'Desenvolvedora Front-end',
      turma: '1TDSPH',
      foto: fotoMarina,
      github: 'https://github.com/marifernandesgm',
      linkedin: 'https://www.linkedin.com/in/marifernandesgm-58460a40a',
    },
  ];

  return (
    <main className="w-full max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <section className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-dark mb-3">
          Integrantes da Equipe
        </h2>

        <p className="text-gray-500 text-base sm:text-lg">
          Conheça os membros responsáveis pelo projeto MoveUp.
        </p>
      </section>

      <section className="flex flex-wrap justify-center items-stretch gap-5 sm:gap-8 max-w-[760px] mx-auto">
        {equipe.map((integrante) => (
          <article
            key={integrante.rm}
            className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-[320px] min-h-[440px] text-center shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col items-center"
          >
            <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden mb-5 border-4 border-white shadow-md bg-gray-100">
              <img
                src={integrante.foto}
                alt={`Foto de ${integrante.nome}`}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-blue-500 text-sm font-bold mb-1">
              {integrante.turma}
            </p>

            <h3 className="text-xl font-bold text-dark mb-1 min-h-[60px] flex items-center justify-center break-words">
              {integrante.nome}
            </h3>

            <p className="text-primary font-bold mb-1">
              RM: {integrante.rm}
            </p>

            <p className="text-gray-500 text-sm mb-1">
              {integrante.cargo}
            </p>

            {integrante.cargoSecundario ? (
              <p className="text-gray-500 text-sm mb-6">
                {integrante.cargoSecundario}
              </p>
            ) : (
              <div className="mb-6" />
            )}

            <div className="flex gap-3 w-full mt-auto">
              <a
                href={integrante.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub de ${integrante.nome}`}
                className="flex-1 min-w-0 py-2 px-2 rounded-xl bg-gray-800 text-white font-bold text-sm hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <img
                  src={githubIcon}
                  alt=""
                  className="w-5 h-5 shrink-0 object-contain"
                />
                GitHub
              </a>

              <a
                href={integrante.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn de ${integrante.nome}`}
                className="flex-1 min-w-0 py-2 px-2 rounded-xl bg-[#0077b5] text-white font-bold text-sm hover:bg-[#005e93] transition-colors flex items-center justify-center gap-2"
              >
                <img
                  src={linkedinIcon}
                  alt=""
                  className="w-5 h-5 shrink-0 object-contain"
                />
                LinkedIn
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
