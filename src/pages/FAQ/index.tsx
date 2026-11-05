import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

interface FaqItemData {
  id: number;
  pergunta: string;
  resposta: string;
}

const faqData: FaqItemData[] = [
  {
    id: 1,
    pergunta: 'Qual é o objetivo do projeto?',
    resposta:
      'O objetivo do MoveUp é incentivar a mobilidade sustentável por meio de missões, pontos e recompensas.',
  },
  {
    id: 2,
    pergunta: 'Quais tecnologias foram utilizadas?',
    resposta:
      'React, Vite, TypeScript e TailwindCSS foram utilizados no desenvolvimento desta aplicação.',
  },
  {
    id: 3,
    pergunta: 'Como funcionam as missões?',
    resposta:
      'As missões permitem que os usuários completem tarefas sustentáveis e acumulem MovePoints para trocar por passagens ou benefícios.',
  },
  {
    id: 4,
    pergunta: 'Como posso resgatar passagens?',
    resposta:
      'Acesse a página de Conversão, escolha o tipo de transporte e converta seus MovePoints em créditos de passagem.',
  },
  {
    id: 5,
    pergunta: 'Como acumulo MovePoints?',
    resposta:
      'Os MovePoints são acumulados ao realizar atividades e missões relacionadas à mobilidade sustentável dentro da plataforma. Esses pontos podem posteriormente ser utilizados para resgatar benefícios disponíveis no MoveUp.',
  },
];

interface FaqForm {
  busca: string;
}

export default function FAQ() {
  const { register, control } = useForm<FaqForm>({
    defaultValues: {
      busca: '',
    },
  });

  const busca = useWatch({
    control,
    name: 'busca',
  }) ?? '';

  const [abertoId, setAbertoId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setAbertoId((atual) => (atual === id ? null : id));
  };

  const filteredFaqs = faqData.filter(
    (item) =>
      item.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
      item.resposta.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className="w-full max-w-[800px] mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 min-h-[60vh]">
      {/* Cabeçalho */}
      <section className="text-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3">
          Perguntas Frequentes
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed max-w-[650px] mx-auto">
          Encontre respostas para as dúvidas mais comuns sobre a plataforma
          MoveUp.
        </p>
      </section>

      {/* Busca */}
      <div className="relative mb-8 sm:mb-10 shadow-sm rounded-xl overflow-hidden">
        <span
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl"
          aria-hidden="true"
        >
          🔍
        </span>

        <input
          type="text"
          placeholder="Buscar por uma pergunta..."
          aria-label="Buscar perguntas frequentes"
          {...register('busca')}
          className="w-full min-w-0 py-3 sm:py-4 pl-10 sm:pl-12 pr-3 sm:pr-4 bg-white border-2 border-transparent focus:border-primary outline-none transition-colors text-sm sm:text-base text-dark"
        />
      </div>

      {/* Perguntas */}
      <section className="space-y-3 sm:space-y-4" aria-label="Lista de perguntas frequentes">
        {filteredFaqs.length === 0 ? (
          <p
            className="text-center text-sm sm:text-base text-gray-500 py-8 px-4 bg-white rounded-xl break-words"
            role="status"
          >
            Nenhuma pergunta encontrada para "{busca}".
          </p>
        ) : (
          filteredFaqs.map((item, index) => {
            const isOpen = abertoId === item.id;
            const respostaId = `faq-resposta-${item.id}`;

            return (
              <article
                key={item.id}
                className={`min-w-0 bg-white rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                  isOpen
                    ? 'border-primary shadow-md'
                    : 'border-transparent shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={respostaId}
                  className="w-full min-w-0 flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                >
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <span className="text-gray-300 font-bold text-base sm:text-xl w-6 sm:w-8 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <h2
                      className={`min-w-0 font-bold text-base sm:text-lg transition-colors break-words ${
                        isOpen ? 'text-primary' : 'text-dark'
                      }`}
                    >
                      {item.pergunta}
                    </h2>
                  </div>

                  <span
                    className={`text-xl sm:text-2xl text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                    aria-hidden="true"
                  >
                    ⌄
                  </span>
                </button>

                <div
                  id={respostaId}
                  hidden={!isOpen}
                  className="px-4 sm:px-6 pb-4 sm:pb-6"
                >
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed pl-8 sm:pl-12 break-words">
                    {item.resposta}
                  </p>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
