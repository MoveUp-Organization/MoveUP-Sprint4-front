<p align="center">
  <img src="./public/favicons/icon_moveup.png" width="180" alt="Logo MoveUP">
</p>

<h1 align="center">MoveUP — Plataforma de Mobilidade Sustentável</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=000000" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  Challenge — Turma 1TDSPH (2026)
</p>

<p align="center">
  Projeto desenvolvido para o Challenge da FIAP em parceria com a SoulUp,<br>
  utilizando gamificação para incentivar a mobilidade sustentável,<br>
  a inclusão social e a redução da pegada de carbono.
</p>

---

## Descrição do Projeto

A SoulUp é uma plataforma digital inovadora que propõe transformar interações online em benefícios reais para os usuários e impacto positivo para o planeta. Por meio de seu aplicativo, os usuários participam de atividades como assistir a conteúdos e interagir em comunidades, acumulando pontos que podem ser convertidos em vantagens concretas, como descontos na fatura de energia, selos de impacto socioambiental e experiências sustentáveis. Dessa forma, a SoulUp conecta pessoas, tecnologia e sustentabilidade, reforçando o propósito da Prospera de gerar valor econômico e ambiental de forma integrada.

A **MoveUP**, proposta para integração à plataforma SoulUp, tem como objetivo transformar engajamento digital em benefícios reais para a mobilidade urbana sustentável.

A solução busca permitir que usuários convertam pontos acumulados dentro da plataforma em créditos de transporte público, incentivando:

- Redução da emissão de carbono;
- Uso consciente da mobilidade urbana;
- Participação ativa em ações sustentáveis.

A proposta é estimular os usuários a adotarem alternativas de transporte coletivo e sustentáveis, acumulando **MovePoints** por meio de suas atividades e utilizando esses pontos para obter benefícios dentro da plataforma.

O projeto busca unir **tecnologia, sustentabilidade e mobilidade urbana**, oferecendo uma experiência digital simples, interativa e acessível.

---

## Objetivo

O principal objetivo do MoveUP é **incentivar uma mobilidade urbana mais sustentável**, utilizando elementos de gamificação e conversão de pontos em passagens de transporte público para transformar comportamentos cotidianos em uma experiência de engajamento.

A plataforma busca:

- Incentivar o uso de transportes mais sustentáveis;
- Valorizar o transporte público;
- Contribuir para a redução da pegada de carbono;
- Utilizar gamificação para aumentar o engajamento;
- Recompensar hábitos sustentáveis;
- Transformar pontos acumulados em benefícios;
- Promover uma mobilidade urbana mais consciente e inclusiva.

---

## Tecnologias Utilizadas

O MoveUP utiliza **React e TypeScript**, com Vite como ferramenta de desenvolvimento e Tailwind CSS para a construção da interface. O projeto também utiliza React Router DOM, React Hook Form e Oxlint.

### React

Biblioteca utilizada para construção da interface da aplicação por meio de componentes reutilizáveis e páginas independentes.

### TypeScript

Utilizado para adicionar tipagem estática ao projeto, proporcionando maior segurança e organização durante o desenvolvimento.

### Vite

Ferramenta utilizada para desenvolvimento e build da aplicação, proporcionando inicialização rápida e Hot Module Replacement (HMR).

### Tailwind CSS

Utilizado para a estilização das páginas e componentes, permitindo a criação de interfaces responsivas por meio de classes utilitárias.

### React Router DOM

Responsável pelo gerenciamento das rotas e navegação entre as páginas da aplicação.

Entre as rotas disponíveis estão:

- `/cadastro`
- `/login`
- `/inicio`
- `/home`
- `/missoes`
- `/missoes/:id`
- `/conversao`
- `/cartao`
- `/sobre`
- `/integrantes`
- `/faq`
- `/contato`

A configuração dessas rotas está centralizada em `src/main.tsx`.

### React Hook Form

Utilizado para auxiliar na criação, validação e gerenciamento dos formulários da aplicação.

### Session Storage e Local Storage

Utilizados para armazenar informações relacionadas à sessão e dados locais da aplicação.

### Oxlint

Ferramenta utilizada para análise estática do código durante o desenvolvimento.

---

## 📁 Estrutura de Pastas

O projeto está organizado de forma modular, separando os componentes reutilizáveis das páginas da aplicação e dos arquivos de configuração.

```text
MoveUP-Sprint4-front/
├── public/
│   └── favicons/
│       └── icon_moveup.png          # Ícone/favicon do MoveUP
│
├── src/
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── Botao/
│   │   │   └── Botao.tsx            # Componente de botão
│   │   ├── Cabecalho/
│   │   │   └── Cabecalho.tsx        # Cabeçalho e menu de navegação
│   │   ├── Card/
│   │   │   └── Card.tsx             # Componente de cards
│   │   ├── Rodape/
│   │   │   └── Rodape.tsx           # Rodapé da aplicação
│   │   └── WatsonAssistant/
│   │       └── WatsonAssistant.tsx  # Assistente virtual
│   │
│   ├── img/                         # Imagens utilizadas no projeto
│   │   ├── fotoEduardo.png
│   │   ├── fotoIsa.png
│   │   ├── fotoMarina.png
│   │   ├── fotoMih.png
│   │   ├── g.png
│   │   ├── github.png
│   │   ├── lkd.png
│   │   └── logo.png
│   │
│   ├── pages/                       # Páginas da aplicação
│   │   ├── Cadastro/
│   │   │   └── index.tsx            # Cadastro do usuário
│   │   ├── Carteira/
│   │   │   └── index.tsx            # Cartão/Bilhete MoveUP
│   │   ├── Contato/
│   │   │   └── index.tsx            # Página de contato
│   │   ├── Conversao/
│   │   │   └── index.tsx            # Conversão e transferência de MovePoints
│   │   ├── Error/
│   │   │   └── index.tsx            # Página de erro
│   │   ├── FAQ/
│   │   │   └── index.tsx            # Perguntas frequentes
│   │   ├── Home/
│   │   │   └── index.tsx            # Página principal após login
│   │   ├── Inicio/
│   │   │   └── index.tsx            # Página inicial/apresentação
│   │   ├── Integrantes/
│   │   │   └── index.tsx            # Integrantes da equipe
│   │   ├── Login/
│   │   │   └── index.tsx            # Login do usuário
│   │   ├── MissaoDetalhe/
│   │   │   └── index.tsx            # Detalhes de uma missão
│   │   ├── Missoes/
│   │   │   └── index.tsx            # Lista de missões
│   │   └── Sobre/
│   │       └── index.tsx            # Informações sobre o MoveUP
│   │
│   ├── services/                    # Serviços de integração e armazenamento
│   │   ├── api.ts                   # Configuração das requisições à API REST Java
│   │   ├── armazenamentoConta.ts    # Chaves de armazenamento por conta
│   │   ├── historicoService.ts      # Operações de histórico na API
│   │   ├── usuarioService.ts        # Operações de usuários na API
│   │   └── voucherService.ts        # Operações de vouchers na API
│   │
│   ├── App.tsx                      # Estrutura principal da aplicação
│   ├── globals.css                  # Estilos globais e Tailwind CSS
│   └── main.tsx                     # Entrada da aplicação e configuração das rotas
│
├── .gitignore                       # Arquivos ignorados pelo Git
├── .oxlintrc.json                   # Configuração do Oxlint
├── index.html                       # HTML principal da aplicação
├── package.json                     # Dependências e scripts do projeto
├── package-lock.json                # Controle das versões das dependências
├── README.md                        # Documentação do projeto
├── tsconfig.app.json                # Configuração TypeScript da aplicação
├── tsconfig.json                    # Configuração geral do TypeScript
├── tsconfig.node.json               # Configuração TypeScript para o Node
├── vercel.json                      # Reescrita de rotas SPA para a Vercel
└── vite.config.ts                   # Configuração do Vite
```

---

## Imagens e Ícones do Projeto

A identidade visual inclui o [favicon](./public/favicons/icon_moveup.png), a [logomarca](./src/img/logo.png) e as fotografias dos integrantes na [pasta de imagens](./src/img/). Esses elementos são utilizados nas páginas e na apresentação da equipe.

---

## Principais Funcionalidades

### Cadastro e Login

Permite cadastrar usuários por meio da API Java e acessar a plataforma com login demonstrativo no navegador. A API atual não possui autenticação de login.

### Home

Apresenta as principais informações e ações disponíveis para o usuário dentro do MoveUP.

### Missões

O usuário pode participar de missões relacionadas à mobilidade sustentável e acumular **MovePoints**.

### Conversão de MovePoints

Área destinada à conversão dos pontos acumulados em benefícios relacionados à mobilidade urbana.

### Bilhete MoveUP

O **Meu Cartão** funciona como uma carteira digital, permitindo visualizar informações relacionadas aos benefícios e valores convertidos pelo usuário.

### Histórico

Permite acompanhar as conversões realizadas. O registro das conversões é enviado à API Java; a lista apresentada na interface ainda utiliza armazenamento local e deve ser conferida nos testes finais.

### Assistente Virtual

O projeto possui o componente **Watson Assistant**, incluído na estrutura principal da aplicação para oferecer suporte e interação com o usuário.

---

## Integração com a API Java

O front-end utiliza `fetch` para consumir a API REST desenvolvida na disciplina de **Domain Driven Design Using Java**. A comunicação é organizada em arquivos da pasta `src/services/`:

- **`api.ts`** — URL-base, envio de requisições HTTP e tratamento de status de resposta;
- **`usuarioService.ts`** — cadastro e consulta de usuários;
- **`voucherService.ts`** — cadastro, consulta e atualização dos vouchers/cartões;
- **`historicoService.ts`** — registro e consulta do histórico de conversões;
- **`armazenamentoConta.ts`** — armazenamento local separado por conta demonstrativa.

O fluxo previsto é: cadastro de usuário e criação de voucher via API; consulta dos vouchers na carteira; conversão de MovePoints em créditos com atualização de voucher e registro no histórico da API.

**API Java configurada (Render):** [https://moveup-89cd.onrender.com/moveup](https://moveup-89cd.onrender.com/moveup)

---

## 👥 Integrantes & Autores

Abaixo encontram-se os integrantes responsáveis pelo desenvolvimento do projeto MoveUP:

- <img src="src/img/fotoIsa.png" width="120px" alt="Foto de Isabelle Ferreira"><br>
  **Isabelle Ferreira Neri Feitoza** — RM 573507 (Analista de Dados) — Turma: 1TDSPH  
  [LinkedIn](https://www.linkedin.com/in/isabelle-ferreira-8844593ab/) | [GitHub](https://github.com/isabelleferreiraa)

- <img src="src/img/fotoMih.png" width="120px" alt="Foto de Milena Silva"><br>
  **Milena Silva Conegin** — RM 568923 (Desenvolvedora Back-end) — Turma: 1TDSPH  
  [LinkedIn](https://www.linkedin.com/in/milena-conegin-996b22269) | [GitHub](https://github.com/MilenaConegin)

- <img src="src/img/fotoEduardo.png" width="120px" alt="Foto de Eduardo Damasio"><br>
  **Eduardo Damasio Guelere** — RM 569960 (Desenvolvedor Back-end) — Turma: 1TDSPH  
  [LinkedIn](https://www.linkedin.com/in/eduardo-guelere-0902753b8/) | [GitHub](https://github.com/Eduardoguelere)

- <img src="src/img/fotoMarina.png" width="120px" alt="Foto de Marina Fernandes"><br>
  **Marina Fernandes Gomes Mesquita** — RM 571265 (Especialista em IA) — Turma: 1TDSPH  
  [LinkedIn](https://www.linkedin.com/in/marifernandesgm-58460a40a) | [GitHub](https://github.com/marifernandesgm)

---

## Como Usar

### Links do projeto

| Recurso | Endereço |
| --- | --- |
| **Aplicação Web na Vercel** | [https://moveupbr.vercel.app](https://moveupbr.vercel.app) |
| **API Java no Render** | [https://moveup-89cd.onrender.com/moveup](https://moveup-89cd.onrender.com/moveup) |
| **Repositório no GitHub** | [MoveUp-Organization/MoveUP-Sprint4-front](https://github.com/MoveUp-Organization/MoveUP-Sprint4-front) |
| **Vídeo no YouTube** | [Apresentação do MoveUP](https://www.youtube.com/watch?v=TPeZ0DBWI6s) |

---

### Como executar localmente

**Pré-requisitos:** Node.js e npm instalados.

1. **Clone o repositório e entre na pasta:**

   ```bash
   git clone https://github.com/MoveUp-Organization/MoveUP-Sprint4-front.git
   cd MoveUP-Sprint4-front
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure a API Java:** crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

   ```dotenv
   VITE_API_URL=https://moveup-89cd.onrender.com/moveup
   ```

   O `.env.local` é ignorado pelo Git. Não coloque senhas nem tokens privados em variáveis com prefixo `VITE_`, pois elas ficam acessíveis no código do navegador.

   **Vercel:** configure a variável `VITE_API_URL` em **Settings → Environment Variables** e faça um novo deploy caso tenha alterado a variável após a publicação.

4. **Inicie o ambiente de desenvolvimento:**

   ```bash
   npm run dev
   ```

   Abra o endereço local exibido pelo Vite no terminal.

5. **Execute as verificações finais:**

   ```bash
   npm run lint
   npm run build
   ```

A aplicação usa login demonstrativo; as ações de cadastro, consulta de vouchers e conversão dependem de uma API Java acessível para funcionar integralmente.

---

## Scripts Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run lint` | Executa a análise do código com Oxlint |
| `npm run preview` | Executa uma prévia da build |

Esses scripts estão definidos no `package.json` do projeto.

---

## 📞 Contato

Para dúvidas, sugestões, identificação de problemas ou contribuições, abra uma **Issue** no GitHub do projeto. Para contato direto com os integrantes, utilize os perfis de **LinkedIn** apresentados na seção [Integrantes & Autores](#-integrantes--autores).

- [Abrir uma Issue no GitHub do MoveUP](https://github.com/MoveUp-Organization/MoveUP-Sprint4-front/issues/new)
- [Acessar o repositório oficial da equipe](https://github.com/MoveUp-Organization/MoveUP-Sprint4-front)

---

<p align="center">
  <strong>MoveUP</strong><br>
  FIAP Challenge — Turma 1TDSPH — 2026
</p>
