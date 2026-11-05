import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';

export default function Inicio() {
  return (
    <main className="w-full overflow-hidden">
      {/* Seção principal */}
      <section className="min-h-[420px] sm:min-h-[500px] py-12 sm:py-16 px-4 sm:px-8 flex justify-center items-center bg-[radial-gradient(circle_at_bottom_left,rgba(0,140,255,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(122,44,255,0.28),transparent_35%),linear-gradient(135deg,#f4f8ff,#d7e9ff,#cbb6ff)]">
        <div className="w-full max-w-[900px] text-center">
          <span className="inline-block mb-5 px-4 sm:px-5 py-2 rounded-full bg-white/70 text-primary font-bold text-xs sm:text-sm shadow-sm">
            🌱 Bem-vindos à MoveUP!
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold leading-tight mb-5 sm:mb-6 text-dark">
            Mova-se de forma inteligente.
            <br className="hidden sm:block" /> Mude o futuro.
          </h1>

          <p className="text-base sm:text-xl text-gray-500 leading-relaxed mb-7 sm:mb-9 max-w-[800px] mx-auto">
            A MoveUp transforma suas rotinas de transporte em ações sustentáveis.
            Acumule pontos, reduza sua pegada de carbono e ganhe recompensas
            cuidando do planeta.
          </p>

          <div className="flex justify-center">
            <Link
              to="/sobre"
              className="inline-block px-6 sm:px-9 py-3 sm:py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-[0_10px_25px_rgba(0,102,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:opacity-90 text-base sm:text-lg"
            >
              Conheça a MoveUp →
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de benefícios */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-light">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-dark mb-3">
              Descubra a MoveUp
            </h2>

            <p className="text-base sm:text-lg text-gray-500 max-w-[750px] mx-auto">
              Uma experiência que une mobilidade, sustentabilidade e benefícios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            <Card
              icone="🎮"
              titulo="Gamificação"
              descricao="Transforme caminhadas, pedaladas e trajetos de transporte público em conquistas e pontos dentro da plataforma."
            />

            <Card
              icone="🌱"
              titulo="Sustentabilidade"
              descricao="Acompanhe seu impacto positivo e contribua para uma mobilidade mais sustentável no dia a dia."
            />

            <Card
              icone="🎁"
              titulo="Recompensas"
              descricao="Troque seus pontos por vouchers, descontos, benefícios exclusivos e recompensas sustentáveis."
            />
          </div>
        </div>
      </section>

      {/* Seção de mobilidade */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-white">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
          <div className="w-full max-w-[650px]">
            <span className="text-primary font-bold text-xs sm:text-sm uppercase tracking-wider">
              Escolhas que transformam
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-dark mt-3 mb-5">
              Sua mobilidade pode fazer parte da mudança.
            </h2>

            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-7">
              Descubra novas possibilidades para seus deslocamentos e encontre
              maneiras de tornar sua rotina mais sustentável.
            </p>

            <Link
              to="/home"
              className="inline-block px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              Conheça o sistema →
            </Link>
          </div>

          <div className="w-full max-w-[400px] lg:w-[400px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 sm:p-10 text-center shadow-[0_10px_35px_rgba(0,0,0,0.08)]">
            <div className="text-6xl sm:text-7xl mb-5">🌎</div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-dark mb-3">
              Mude seus hábitos.
            </h3>

            <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
              Faça escolhas conscientes e transforme cada trajeto em uma
              oportunidade de contribuir para um futuro melhor.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de funcionalidades */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-[linear-gradient(135deg,#eef6ff,#f4edff)]">
        <div className="w-full max-w-[1100px] mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-secondary font-bold text-xs sm:text-sm uppercase tracking-wider">
              MoveUp
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-dark mt-3 mb-4">
              Uma nova forma de enxergar seus trajetos.
            </h2>

            <p className="text-base sm:text-lg text-gray-500 max-w-[750px] mx-auto">
              Transforme suas escolhas de mobilidade em uma experiência mais
              consciente, interativa e recompensadora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="min-w-0 bg-white rounded-2xl p-5 sm:p-7 shadow-md">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <span className="text-3xl sm:text-4xl shrink-0">🚲</span>

                <h3 className="text-lg sm:text-xl font-extrabold text-dark">
                  Mobilidade consciente
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Incentive escolhas de transporte que contribuem para uma
                mobilidade mais sustentável.
              </p>
            </div>

            <div className="min-w-0 bg-white rounded-2xl p-5 sm:p-7 shadow-md">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <span className="text-3xl sm:text-4xl shrink-0">🏆</span>

                <h3 className="text-lg sm:text-xl font-extrabold text-dark">
                  Conquiste enquanto participa
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Participe das atividades da plataforma e acompanhe suas
                conquistas ao longo da sua jornada.
              </p>
            </div>

            <div className="min-w-0 bg-white rounded-2xl p-5 sm:p-7 shadow-md">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <span className="text-3xl sm:text-4xl shrink-0">🌿</span>

                <h3 className="text-lg sm:text-xl font-extrabold text-dark">
                  Impacto positivo
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Faça parte de uma proposta que busca aproximar tecnologia,
                mobilidade e sustentabilidade.
              </p>
            </div>

            <div className="min-w-0 bg-white rounded-2xl p-5 sm:p-7 shadow-md">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <span className="text-3xl sm:text-4xl shrink-0">✨</span>

                <h3 className="text-lg sm:text-xl font-extrabold text-dark">
                  Sua jornada, suas escolhas
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Explore a plataforma, participe das missões e acompanhe sua
                evolução de acordo com suas escolhas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chamada final */}
      <section className="py-12 sm:py-16 px-4 sm:px-5 text-center bg-gradient-to-r from-primary to-secondary text-white">
        <div className="w-full max-w-[800px] mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-5">
            Pronto para começar?
          </h2>

          <p className="text-base sm:text-lg text-white/90 mb-8">
            Escolha uma missão e dê o próximo passo com a MoveUp.
          </p>

          <Link
            to="/missoes"
            className="inline-block px-7 sm:px-9 py-3 sm:py-4 rounded-full bg-white text-primary font-extrabold shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            Começar agora →
          </Link>
        </div>
      </section>
    </main>
  );
}
