# TheKa

> Plataforma web de acervo literário e gerenciamento de catálogo de livros.

## 📋 Sobre o Projeto

A **TheKa®** é uma aplicação web desenvolvida para conectar pessoas e histórias por meio da leitura e da cultura. Mais do que um catálogo digital, o sistema funciona como um ambiente interativo para exploração e administração de acervos literários.

Entre as principais funcionalidades do projeto, destacam-se:

* **Autenticação Completa:** Fluxo de login (`index.html`), cadastro de usuários (`cadastro.html`), recuperação (`recuperar-senha.html`) e redefinição de senha (`redefinir-senha.html`) gerenciados via token (`localStorage`).
* **Novidades da Semana:** Carrossel interativo com os lançamentos e destaques recentes do acervo.
* **Catálogo Inteligente:** Listagem paginada de livros com pré-visualização rápida ao passar o cursor (*hover*), busca textual por título ou autor e filtros dinâmicos por gênero e editora (adaptados para desktop e dispositivos móveis).
* **Gerenciamento Completo (CRUD):** Modais responsivos para visualização de detalhes da obra, cadastro de novos materiais com upload de capa, edição de informações e exclusão de registros integrados à API REST.
* **Página Institucional (Sobre Nós):** Apresentação da missão, objetivos com rolagem interativa, história, valores animados e equipe da biblioteca.

## 🚀 Tecnologias Utilizadas

### Core

* **HTML** — Linguagem de Marcação
* **CSS** — Linguagem de Estilos (com layout responsivo para desktop e mobile)
* **TypeScript** — Linguagem de Programação

### Utilitários

* **TypeScript Compiler (`tsc`)** — Compilação, geração de mapas de origem (`.map`) e tipagem estática dos scripts
* **Fetch API** — Integração assíncrona com a API REST do acervo
* **Vercel** — Hospedagem e configuração de rotas da aplicação (`vercel.json`)

## ▶️ Como Rodar o Projeto

```bash
npm install     # instala as dependências
npm run build   # compila os arquivos TypeScript para JavaScript
npm run dev     # inicia o servidor de desenvolvimento
```

## 📁 Estrutura do Projeto

```
TheKa
├── src/                           # Código-fonte da aplicação
│   ├── assets/                    # Arquivos de mídia
│   │   └── images/                # Imagens, logos e ilustrações do projeto
│   ├── pages/                     # Páginas HTML secundárias
│   │   ├── acervo.html            # Página do catálogo e gerenciamento de livros
│   │   ├── cadastro.html          # Página de cadastro de novos usuários
│   │   ├── recuperar-senha.html   # Página de solicitação de recuperação de senha
│   │   ├── redefinir-senha.html   # Página de redefinição de senha
│   │   └── sobrenos.html          # Página institucional (Sobre Nós)
│   ├── scripts/                   # Scripts TypeScript e arquivos compilados
│   │   ├── acervo.d.ts            # Declarações de tipos do acervo
│   │   ├── acervo.d.ts.map        # Source map das declarações do acervo
│   │   ├── acervo.js              # JavaScript compilado da página de acervo
│   │   ├── acervo.js.map          # Source map do script de acervo
│   │   ├── acervo.ts              # Lógica e integração da página de acervo
│   │   ├── auth.js                # JavaScript compilado de autenticação
│   │   ├── auth.js.map            # Source map do script de autenticação
│   │   ├── auth.ts                # Lógica de login, cadastro e recuperação de senha
│   │   ├── sobrenos.js            # JavaScript compilado da página Sobre Nós
│   │   └── sobrenos.ts            # Interatividade da página Sobre Nós
│   └── styles/                    # Folhas de estilo CSS
│       ├── acervo.css             # Estilização da página de acervo
│       ├── reset.css              # Reset de estilos padrão do navegador
│       ├── sobrenos.css           # Estilização da página Sobre Nós
│       └── style.css              # Estilização global e telas de autenticação
├── index.html                     # Página HTML principal (Login)
├── package.json                   # Dependências e scripts do projeto
├── README.md                      # Documentação do projeto
├── tsconfig.json                  # Configuração do compilador TypeScript
└── vercel.json                    # Configurações de deploy e rotas na Vercel
```

## 👤 Desenvolvedor

* Davi Flor Barboza

© **EJECT**