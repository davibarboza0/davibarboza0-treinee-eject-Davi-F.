// Interface de Editoras
interface Editora {
    id: number;
    nome: string;
    endereco?: string | null;
    telefone?: string | null;
    email?: string | null;
}

// Interface de Gêneros
interface Genero {
    id: number;
    nome: string;
}

// Interface ajustada ao retorno real da API /livros/
interface Livro {
    id?: number;
    titulo: string;
    numero_paginas: number;
    capa?: string;
    isbn: string;
    autor: string;
    ano_publicacao: number;
    resumo: string;
    genero?: number | string | null;
    genero_nome?: string;
    editora?: number | string | null;
    editora_nome?: string;
    criado_em?: string;
    atualizado_em?: string;
}

interface RespostaPaginadaLivros {
    count: number;
    next: string | null;
    previous: string | null;
    results: Livro[];
}

// Endereço base da API backend em produção
const ENDERECO_BASE_DA_API: string = 'https://thekaapitrainee1.pythonanywhere.com';

// Editoras reserva para fallback offline
const EDITORAS_PADRAO: Editora[] = [
    { id: 10, nome: "Aleph" },
    { id: 15, nome: "Alta Books" },
    { id: 12, nome: "Arqueiro" },
    { id: 5, nome: "Companhia das Letras" },
    { id: 9, nome: "Globo" },
    { id: 11, nome: "HarperCollins Brasil" },
    { id: 13, nome: "Intrínseca" },
    { id: 7, nome: "Paralela" },
    { id: 1, nome: "Penguin-Companhia" },
    { id: 2, nome: "Principis" },
    { id: 4, nome: "Record" },
    { id: 6, nome: "Rocco" },
    { id: 14, nome: "Suma" },
    { id: 3, nome: "Todavia" },
    { id: 8, nome: "Via Leitura" },
    { id: 16, nome: "Trama" }
];

// Gêneros reserva para fallback offline
const GENEROS_PADRAO: Genero[] = [
    { id: 2, nome: "Fantasia" },
    { id: 3, nome: "Ficção Científica" },
    { id: 5, nome: "Não-ficção" },
    { id: 1, nome: "Romance" },
    { id: 4, nome: "Suspense" }
];

// Lista completa dos 20 livros reais (IDs 1 ao 20)
const LIVROS_API_PADRAO: Livro[] = [
    {
        id: 20,
        titulo: "Hábitos Atômicos",
        numero_paginas: 322,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788550807560.jpg",
        isbn: "9788550807560",
        autor: "James Clear",
        ano_publicacao: 2019,
        resumo: "James Clear mostra como pequenas mudanças diárias, somadas ao longo do tempo, geram resultados extraordinários. Um método prático para criar bons hábitos, abandonar os ruins e melhorar 1% a cada dia.",
        genero: 5,
        genero_nome: "Não-ficção",
        editora: 15,
        editora_nome: "Alta Books"
    },
    {
        id: 19,
        titulo: "Sapiens",
        numero_paginas: 472,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788535933925.jpg",
        isbn: "9788535933925",
        autor: "Yuval Noah Harari",
        ano_publicacao: 2020,
        resumo: "Harari percorre a trajetória da humanidade, da revolução cognitiva à científica, para explicar como o Homo sapiens passou a dominar o planeta e que histórias compartilhadas sustentam nossas sociedades.",
        genero: 5,
        genero_nome: "Não-ficção",
        editora: 5,
        editora_nome: "Companhia das Letras"
    },
    {
        id: 18,
        titulo: "O Diário de Anne Frank",
        numero_paginas: 352,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788501068200.jpg",
        isbn: "9788501068200",
        autor: "Anne Frank",
        ano_publicacao: 2014,
        resumo: "Escondida com a família num anexo secreto em Amsterdã durante a ocupação nazista, Anne registra em seu diário o cotidiano, os medos e os sonhos de uma adolescente. Um dos testemunhos mais marcantes do Holocausto.",
        genero: 5,
        genero_nome: "Não-ficção",
        editora: 4,
        editora_nome: "Record"
    },
    {
        id: 17,
        titulo: "O Iluminado",
        numero_paginas: 464,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788581050485.jpg",
        isbn: "9788581050485",
        autor: "Stephen King",
        ano_publicacao: 2012,
        resumo: "Jack Torrance aceita ser zelador do isolado Hotel Overlook durante o inverno e leva a esposa e o filho Danny, que tem um dom paranormal. Presos pela neve, eles enfrentam as forças sombrias do hotel.",
        genero: 4,
        genero_nome: "Suspense",
        editora: 14,
        editora_nome: "Suma"
    },
    {
        id: 16,
        titulo: "Garota Exemplar",
        numero_paginas: 448,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788580572902.jpg",
        isbn: "9788580572902",
        autor: "Gillian Flynn",
        ano_publicacao: 2013,
        resumo: "No dia do quinto aniversário de casamento, Amy Dunne desaparece e o marido, Nick, vira o principal suspeito. Entre diários e versões contraditórias, o casamento perfeito revela suas mentiras.",
        genero: 4,
        genero_nome: "Suspense",
        editora: 13,
        editora_nome: "Intrínseca"
    },
    {
        id: 15,
        titulo: "O Código Da Vinci",
        numero_paginas: 432,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788580416251.jpg",
        isbn: "9788580416251",
        autor: "Dan Brown",
        ano_publicacao: 2016,
        resumo: "O simbologista Robert Langdon é chamado ao Louvre após o assassinato do curador do museu. Ao lado da criptógrafa Sophie Neveu, ele segue pistas escondidas nas obras de Leonardo da Vinci até um segredo milenar.",
        genero: 4,
        genero_nome: "Suspense",
        editora: 12,
        editora_nome: "Arqueiro"
    },
    {
        id: 14,
        titulo: "O Nome do Vento",
        numero_paginas: 656,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788580410631.jpg",
        isbn: "9788580410631",
        autor: "Patrick Rothfuss",
        ano_publicacao: 2012,
        resumo: "Kvothe, um lendário arcanista que vive escondido como dono de uma estalagem, conta a verdadeira história de sua vida: a tragédia que destruiu sua trupe, os anos nas ruas e sua entrada na Universidade.",
        genero: 2,
        genero_nome: "Fantasia",
        editora: 12,
        editora_nome: "Arqueiro"
    },
    {
        id: 13,
        titulo: "Harry Potter e a Pedra Filosofal",
        numero_paginas: 208,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788532530783.jpg",
        isbn: "9788532530783",
        autor: "J.K. Rowling",
        ano_publicacao: 2017,
        resumo: "No seu aniversário de onze anos, Harry descobre que é bruxo e é levado para estudar em Hogwarts. Lá ele faz amigos, conhece a magia e enfrenta o mistério da pedra filosofal escondida no castelo.",
        genero: 2,
        genero_nome: "Fantasia",
        editora: 6,
        editora_nome: "Rocco"
    },
    {
        id: 12,
        titulo: "O Hobbit",
        numero_paginas: 336,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788595084742.jpg",
        isbn: "9788595084742",
        autor: "J.R.R. Tolkien",
        ano_publicacao: 2019,
        resumo: "Bilbo Bolseiro é arrancado do conforto de sua toca pelo mago Gandalf e por treze anões para recuperar um tesouro guardado pelo dragão Smaug. Uma aventura que dá início ao universo da Terra-média.",
        genero: 2,
        genero_nome: "Fantasia",
        editora: 11,
        editora_nome: "HarperCollins Brasil"
    },
    {
        id: 11,
        titulo: "Fundação",
        numero_paginas: 320,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788576574835.jpg",
        isbn: "9788576574835",
        autor: "Isaac Asimov",
        ano_publicacao: 2009,
        resumo: "O matemático Hari Seldon prevê a queda do Império Galáctico e cria a Fundação para reduzir de trinta mil para mil anos a era de barbárie que virá. O início de uma das sagas mais influentes da ficção científica.",
        genero: 3,
        genero_nome: "Ficção Científica",
        editora: 10,
        editora_nome: "Aleph"
    },
    {
        id: 10,
        titulo: "Duna",
        numero_paginas: 680,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788576574941.jpg",
        isbn: "9788576574941",
        autor: "Frank Herbert",
        ano_publicacao: 2021,
        resumo: "Paul Atreides chega a Arrakis, o planeta desértico que produz a especiaria mais valiosa do universo. Traído e caçado, ele se une ao povo fremen e se torna o centro de uma profecia que pode mudar a galáxia.",
        genero: 3,
        genero_nome: "Ficção Científica",
        editora: 10,
        editora_nome: "Aleph"
    },
    {
        id: 9,
        titulo: "Admirável Mundo Novo",
        numero_paginas: 312,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788525033222.jpg",
        isbn: "9788525033222",
        autor: "Aldous Huxley",
        ano_publicacao: 2001,
        resumo: "Numa sociedade futurista em que as pessoas são fabricadas em laboratório e condicionadas para a felicidade, Bernard Marx e o Selvagem John questionam um mundo sem dor, sem arte e sem liberdade.",
        genero: 3,
        genero_nome: "Ficção Científica",
        editora: 9,
        editora_nome: "Globo"
    },
    {
        id: 8,
        titulo: "1984",
        numero_paginas: 288,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9786587034201.jpg",
        isbn: "9786587034201",
        autor: "George Orwell",
        ano_publicacao: 2020,
        resumo: "Winston Smith trabalha reescrevendo a história para o Partido, sob a vigilância constante do Grande Irmão. Ao se apaixonar e começar a duvidar do regime, ele descobre o preço da liberdade de pensamento.",
        genero: 3,
        genero_nome: "Ficção Científica",
        editora: 8,
        editora_nome: "Via Leitura"
    },
    {
        id: 7,
        titulo: "O Alquimista",
        numero_paginas: 208,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788584390670.jpg",
        isbn: "9788584390670",
        autor: "Paulo Coelho",
        ano_publicacao: 2017,
        resumo: "Santiago, um jovem pastor andaluz, parte rumo às pirâmides do Egito atrás de um tesouro revelado em sonho. No caminho, aprende a ouvir o coração e a seguir sua Lenda Pessoal.",
        genero: 2,
        genero_nome: "Fantasia",
        editora: 7,
        editora_nome: "Paralela"
    },
    {
        id: 6,
        titulo: "A Hora da Estrela",
        numero_paginas: 88,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788532530660.jpg",
        isbn: "9788532530660",
        autor: "Clarice Lispector",
        ano_publicacao: 2017,
        resumo: "O narrador Rodrigo S.M. conta a história de Macabéa, uma nordestina pobre e ingênua que tenta sobreviver no Rio de Janeiro. O último romance de Clarice reflete sobre a escrita, a solidão e a invisibilidade.",
        genero: 1,
        genero_nome: "Romance",
        editora: 6,
        editora_nome: "Rocco"
    },
    {
        id: 5,
        titulo: "Capitães da Areia",
        numero_paginas: 283,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788535911695.jpg",
        isbn: "9788535911695",
        autor: "Jorge Amado",
        ano_publicacao: 2008,
        resumo: "Em Salvador, um grupo de meninos abandonados vive de pequenos furtos num trapiche à beira-mar. Liderados por Pedro Bala, eles enfrentam a violência das ruas e descobrem amizade, amor e consciência social.",
        genero: 1,
        genero_nome: "Romance",
        editora: 5,
        editora_nome: "Companhia das Letras"
    },
    {
        id: 4,
        titulo: "Vidas Secas",
        numero_paginas: 176,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788501114778.jpg",
        isbn: "9788501114778",
        autor: "Graciliano Ramos",
        ano_publicacao: 2018,
        resumo: "Fabiano, sinhá Vitória, os dois filhos e a cachorra Baleia fogem da seca pelo sertão nordestino em busca de sobrevivência. Uma narrativa seca e precisa sobre miséria, silêncio e dignidade.",
        genero: 1,
        genero_nome: "Romance",
        editora: 4,
        editora_nome: "Record"
    },
    {
        id: 3,
        titulo: "O Cortiço",
        numero_paginas: 304,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788593828966.jpg",
        isbn: "9788593828966",
        autor: "Aluísio Azevedo",
        ano_publicacao: 2019,
        resumo: "No Rio de Janeiro do século XIX, o português João Romão enriquece explorando os moradores de um cortiço. O romance naturalista retrata a vida coletiva, a ganância e as tensões sociais de uma cidade em transformação.",
        genero: 1,
        genero_nome: "Romance",
        editora: 3,
        editora_nome: "Todavia"
    },
    {
        id: 2,
        titulo: "Memórias Póstumas de Brás Cubas",
        numero_paginas: 208,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788594318619.jpg",
        isbn: "9788594318619",
        autor: "Machado de Assis",
        ano_publicacao: 2019,
        resumo: "Já morto, Brás Cubas decide escrever suas memórias e repassa com ironia uma vida de privilégios, amores frustrados e ambições pequenas. O romance que inaugurou o Realismo no Brasil e virou do avesso a forma de narrar.",
        genero: 1,
        genero_nome: "Romance",
        editora: 2,
        editora_nome: "Principis"
    },
    {
        id: 1,
        titulo: "Dom Casmurro",
        numero_paginas: 400,
        capa: "https://thekaapitrainee1.pythonanywhere.com/media/capas_livros/9788582850350.jpg",
        isbn: "9788582850350",
        autor: "Machado de Assis",
        ano_publicacao: 2016,
        resumo: "Bento Santiago, o Bentinho, narra sua vida desde a juventude até a velhice, revivendo o amor por Capitu e o ciúme que o leva a suspeitar de uma traição com seu melhor amigo, Escobar. Um clássico sobre memória, dúvida e o olhar de quem conta a história.",
        genero: 1,
        genero_nome: "Romance",
        editora: 1,
        editora_nome: "Penguin-Companhia"
    }
];

let livroSelecionadoAtualmente: Livro | null = null;
let paginaAtual: number = 1;

function atualizarPaginacaoUI(pagina: number): void {
    const botoesPagina = document.querySelectorAll('.paginacao .page-num');
    botoesPagina.forEach((btn) => {
        const num = Number(btn.textContent?.trim());
        if (num === pagina) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function filtrarDuplicadosPorNome<T extends { nome: string }>(lista: T[]): T[] {
    const nomesVistos = new Set<string>();
    return lista.filter((item) => {
        if (!item || !item.nome) return false;
        const nomeNormalizado = item.nome.trim().toLowerCase();
        if (nomesVistos.has(nomeNormalizado)) return false;
        nomesVistos.add(nomeNormalizado);
        return true;
    });
}

function preencherOpcoesDoSeletor(
    elementoSeletor: HTMLSelectElement,
    lista: { id: number; nome: string }[],
    textoOpcaoPadrao: string
): void {
    elementoSeletor.innerHTML = `<option value="" disabled selected>${textoOpcaoPadrao}</option>`;
    lista.forEach((item) => {
        const elementoOpcao = document.createElement('option');
        elementoOpcao.value = String(item.id);
        elementoOpcao.textContent = item.nome;
        elementoSeletor.appendChild(elementoOpcao);
    });
}

function buscarTodosOsSeletoresDeGenero(): HTMLSelectElement[] {
    const seletores = new Set<HTMLSelectElement>();
    ['genero', 'generos', 'edit-genero', 'edit-generos', 'filtro-genero-desktop', 'filtro-genero-mobile'].forEach((id) => {
        const el = document.getElementById(id) as HTMLSelectElement | null;
        if (el) seletores.add(el);
    });
    document.querySelectorAll<HTMLSelectElement>('select[id*="genero"], select[name*="genero"]').forEach((el) => seletores.add(el));
    const priDesktop = document.querySelector<HTMLSelectElement>('.filtros-grupo-desktop select:first-child');
    if (priDesktop) seletores.add(priDesktop);
    const priMobile = document.querySelector<HTMLSelectElement>('#modal-filtro-mobile select:first-child');
    if (priMobile) seletores.add(priMobile);
    return Array.from(seletores);
}

function buscarTodosOsSeletoresDeEditora(): HTMLSelectElement[] {
    const seletores = new Set<HTMLSelectElement>();
    ['editora', 'editoras', 'edit-editora', 'edit-editoras', 'filtro-editora-desktop', 'filtro-editora-mobile'].forEach((id) => {
        const el = document.getElementById(id) as HTMLSelectElement | null;
        if (el) seletores.add(el);
    });
    document.querySelectorAll<HTMLSelectElement>('select[id*="editora"], select[name*="editora"]').forEach((el) => seletores.add(el));
    const seletoresDesktop = document.querySelectorAll<HTMLSelectElement>('.filtros-grupo-desktop select');
    if (seletoresDesktop.length > 1) seletores.add(seletoresDesktop[1]);
    const seletoresMobile = document.querySelectorAll<HTMLSelectElement>('#modal-filtro-mobile select');
    if (seletoresMobile.length > 1) seletores.add(seletoresMobile[1]);
    return Array.from(seletores);
}

async function carregarListaDeGeneros(): Promise<void> {
    let lista: Genero[] = GENEROS_PADRAO;
    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/generos/`, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (resposta.ok) {
            const dados = await resposta.json();
            const listaExtraida = Array.isArray(dados) ? dados : (dados.results || []);
            if (listaExtraida.length > 0) {
                lista = [...listaExtraida, ...GENEROS_PADRAO];
            }
        }
    } catch (erro) {
        console.warn('Usando lista reserva de gêneros.', erro);
    }
    const generosUnicos = filtrarDuplicadosPorNome(lista).sort((a, b) => a.nome.localeCompare(b.nome));
    buscarTodosOsSeletoresDeGenero().forEach((s) => {
        const txt = s.classList.contains('select-filtro') || s.classList.contains('select-modal-filtro') ? 'Gênero' : 'Selecionar';
        preencherOpcoesDoSeletor(s, generosUnicos, txt);
    });
}

/**
 * Carrega a lista de editoras da API e mescla com a lista padrão
 */
async function carregarListaDeEditoras(): Promise<void> {
    let lista: Editora[] = EDITORAS_PADRAO;
    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/editoras/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            const listaExtraida = Array.isArray(dados) ? dados : (dados.results || []);
            if (listaExtraida.length > 0) {
                lista = [...listaExtraida, ...EDITORAS_PADRAO];
            }
        }
    } catch (erro) {
        console.warn('Usando lista reserva de editoras.', erro);
    }

    const editorasUnicas = filtrarDuplicadosPorNome(lista).sort((a, b) => a.nome.localeCompare(b.nome));

    buscarTodosOsSeletoresDeEditora().forEach((s) => {
        const txt = s.classList.contains('select-filtro') || s.classList.contains('select-modal-filtro') ? 'Editora' : 'Selecionar';
        preencherOpcoesDoSeletor(s, editorasUnicas, txt);
    });
}

/**
 * GET /livros/novidades/ - Conecta com as Novidades da Semana para o carrossel
 */
async function carregarNovidadesDaSemana(): Promise<void> {
    let novidades: Livro[] = LIVROS_API_PADRAO.slice(0, 5);

    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/novidades/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            const listaExtraida = Array.isArray(dados) ? dados : (dados.results || []);
            if (listaExtraida.length > 0) {
                novidades = listaExtraida;
            }
        }
    } catch (erro) {
        console.warn('Utilizando novidades padrão para o carrossel.', erro);
    }

    renderizarCarrosselNovidades(novidades);
}

/**
 * Renderiza dinamicamente as capas, títulos e autores com transição suave ao clicar
 */
function renderizarCarrosselNovidades(livros: Livro[]): void {
    const containerCarrossel = document.querySelector('.novidades-carrossel');
    const elDestaqueContainer = document.querySelector('.destaque-detalhe');
    const elTituloDestaque = document.querySelector('.destaque-detalhe h2');
    const elAutorDestaque = document.querySelector('.destaque-detalhe p');

    if (!containerCarrossel || livros.length === 0) return;

    containerCarrossel.innerHTML = '';
    const livrosExibidos = livros.slice(0, 5);

    livrosExibidos.forEach((livro, index) => {
        const card = document.createElement('div');
        const eAtivo = index === 2 || (livrosExibidos.length < 3 && index === 0);
        card.className = `card-carrossel card-${index + 1} ${eAtivo ? 'active' : ''}`;
        card.setAttribute('data-titulo', livro.titulo);
        card.setAttribute('data-autor', `${livro.autor} – ${livro.ano_publicacao}`);

        if (livro.capa) {
            card.style.backgroundImage = `url('${livro.capa}')`;
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';
        }

        card.innerHTML = `
            <img src="../imagens/setad.png" alt="Seta selecionada" class="icone-seta-card img-seta-ativa" draggable="false">
            <img src="../imagens/setac.png" alt="Seta inativa" class="icone-seta-card img-seta-inativa" draggable="false">
        `;

        if (eAtivo) {
            if (elTituloDestaque) elTituloDestaque.textContent = livro.titulo;
            if (elAutorDestaque) elAutorDestaque.textContent = `${livro.autor} – ${livro.ano_publicacao}`;
        }

        card.addEventListener('click', () => {
            if (card.classList.contains('active')) return;

            const todosCards = containerCarrossel.querySelectorAll('.card-carrossel');
            todosCards.forEach((c) => c.classList.remove('active'));
            card.classList.add('active');

            if (elDestaqueContainer) {
                elDestaqueContainer.classList.add('trocando');
                setTimeout(() => {
                    if (elTituloDestaque) elTituloDestaque.textContent = livro.titulo;
                    if (elAutorDestaque) elAutorDestaque.textContent = `${livro.autor} – ${livro.ano_publicacao}`;
                    elDestaqueContainer.classList.remove('trocando');
                }, 150);
            } else {
                if (elTituloDestaque) elTituloDestaque.textContent = livro.titulo;
                if (elAutorDestaque) elAutorDestaque.textContent = `${livro.autor} – ${livro.ano_publicacao}`;
            }
        });

        containerCarrossel.appendChild(card);
    });
}

function exibirModal(elementoModal: HTMLElement | null): void {
    if (!elementoModal) return;
    elementoModal.classList.remove('hidden');
    elementoModal.removeAttribute('hidden');
    elementoModal.style.setProperty('display', 'flex', 'important');
    elementoModal.style.setProperty('z-index', '99999', 'important');
}

function ocultarModal(elementoModal: HTMLElement | null): void {
    if (!elementoModal) return;
    elementoModal.classList.add('hidden');
    elementoModal.style.setProperty('display', 'none', 'important');
}

function renderizarLivrosNoCatalogo(livros: Livro[]): void {
    const containerGrelha = document.querySelector('.grid-catalogo');
    if (!containerGrelha) return;

    containerGrelha.innerHTML = '';

    livros.forEach((livro, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card-catalogo';
        cardDiv.setAttribute('data-id', String(livro.id || ''));

        if (livro.capa) {
            cardDiv.style.backgroundImage = `url('${livro.capa}')`;
            cardDiv.style.backgroundSize = 'cover';
            cardDiv.style.backgroundPosition = 'center';
        }

        // Overlay que toca de ponta a ponta com a imagem vizualizar.png e informações dinâmicas
        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'card-overlay-hover';
        overlayDiv.innerHTML = `
            <img src="../imagens/vizualizar.png" alt="Visualizar ${livro.titulo}" class="img-sobreposicao-card" draggable="false">
            <div class="overlay-conteudo-texto">
                <span class="overlay-titulo">${livro.titulo}</span>
                <span class="overlay-autor">${livro.autor}, ${livro.ano_publicacao}</span>
            </div>
        `;
        cardDiv.appendChild(overlayDiv);

        // Botão para o MOBILE (no 4º livro: O Iluminado, index === 3)
        if (index === 3) {
            const btnMobile = document.createElement('button');
            btnMobile.type = 'button';
            btnMobile.className = 'btn-flutuante-adicionar btn-flutuante-mobile';
            btnMobile.setAttribute('aria-label', 'Adicionar material');
            btnMobile.innerHTML = `
                <span class="btn-texto">Adicionar material</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            `;
            cardDiv.appendChild(btnMobile);
        }

        // Botão para o DESKTOP (no 5º livro: Garota Exemplar, index === 4)
        if (index === 4) {
            const btnDesktop = document.createElement('button');
            btnDesktop.type = 'button';
            btnDesktop.className = 'btn-flutuante-adicionar btn-flutuante-desktop';
            btnDesktop.setAttribute('aria-label', 'Adicionar material');
            btnDesktop.innerHTML = `
                <span class="btn-texto">Adicionar material</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            `;
            cardDiv.appendChild(btnDesktop);
        }

        cardDiv.addEventListener('click', (ev) => {
            const alvo = ev.target as HTMLElement;
            if (alvo.closest('.btn-flutuante-adicionar')) return;
            preencherEExibirModalVerMais(livro);
        });

        containerGrelha.appendChild(cardDiv);
    });

    if (livros.length <= 3) {
        const ultimoCard = containerGrelha.lastElementChild as HTMLElement;
        if (ultimoCard && !containerGrelha.querySelector('.btn-flutuante-adicionar')) {
            const btnFlutuante = document.createElement('button');
            btnFlutuante.type = 'button';
            btnFlutuante.className = 'btn-flutuante-adicionar';
            btnFlutuante.setAttribute('aria-label', 'Adicionar material');
            btnFlutuante.innerHTML = `
                <span class="btn-texto">Adicionar material</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            `;
            ultimoCard.appendChild(btnFlutuante);
        }
    }
}

async function carregarCatalogoDeLivros(pagina: number = 1): Promise<void> {
    paginaAtual = pagina;
    atualizarPaginacaoUI(pagina);

    const seletoresGenero = buscarTodosOsSeletoresDeGenero();
    const seletoresEditora = buscarTodosOsSeletoresDeEditora();

    const generoId = seletoresGenero.find((s) => s.value !== '')?.value || '';
    const editoraId = seletoresEditora.find((s) => s.value !== '')?.value || '';
    const termoBusca = (document.querySelector('.input-busca') as HTMLInputElement)?.value.trim() || '';

    let listaLivros: Livro[] = LIVROS_API_PADRAO;

    try {
        const parametros = new URLSearchParams();
        parametros.append('page', String(pagina));
        if (generoId) parametros.append('genero', generoId);
        if (editoraId) parametros.append('editora', editoraId);
        if (termoBusca) parametros.append('search', termoBusca);

        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/?${parametros.toString()}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (resposta.ok) {
            const dados: RespostaPaginadaLivros | Livro[] = await resposta.json();
            const resultados = Array.isArray(dados) ? dados : (dados.results || []);
            if (resultados.length > 0) {
                listaLivros = resultados;
            }
        }
    } catch (erro) {
        console.warn('Utilizando lista reserva de livros.', erro);
    }

    renderizarLivrosNoCatalogo(listaLivros);
}

function preencherEExibirModalVerMais(livro: Livro): void {
    livroSelecionadoAtualmente = livro;

    const elTitulo = document.querySelector('.ver-mais-titulo');
    const elAutorAno = document.querySelector('.ver-mais-autor');
    const elResumo = document.querySelector('.ver-mais-resumo');
    const elPaginas = document.querySelector('.ver-mais-paginas');
    const elEditora = document.querySelector('.ver-mais-editora');
    const elCapa = document.querySelector('.img-ver-mais-capa') as HTMLImageElement | null;

    if (elTitulo) elTitulo.textContent = livro.titulo;
    if (elAutorAno) elAutorAno.textContent = `${livro.autor}, ${livro.ano_publicacao}`;
    if (elResumo) elResumo.textContent = livro.resumo;
    if (elPaginas) elPaginas.textContent = `páginas: ${livro.numero_paginas}`;

    const nomeEditora = livro.editora_nome || (typeof livro.editora === 'string' ? livro.editora : 'Editora não informada');
    if (elEditora) elEditora.textContent = nomeEditora;

    if (elCapa && livro.capa) elCapa.src = livro.capa;

    exibirModal(document.getElementById('modal-ver-mais'));
}

function preencherModalEditar(livro: Livro): void {
    const elTitulo = document.getElementById('edit-titulo') as HTMLInputElement | null;
    const elPaginas = document.getElementById('edit-paginas') as HTMLInputElement | null;
    const elIsbn = document.getElementById('edit-isbn') as HTMLInputElement | null;
    const elAutor = document.getElementById('edit-autor') as HTMLInputElement | null;
    const elAno = document.getElementById('edit-ano') as HTMLInputElement | null;
    const elGenero = document.getElementById('edit-genero') as HTMLSelectElement | null;
    const elEditora = document.getElementById('edit-editora') as HTMLSelectElement | null;
    const elResumo = document.getElementById('edit-resumo') as HTMLTextAreaElement | null;

    if (elTitulo) elTitulo.value = livro.titulo;
    if (elPaginas) elPaginas.value = String(livro.numero_paginas);
    if (elIsbn) elIsbn.value = livro.isbn;
    if (elAutor) elAutor.value = livro.autor;
    if (elAno) elAno.value = String(livro.ano_publicacao);
    if (elResumo) elResumo.value = livro.resumo;

    if (elGenero && livro.genero) {
        elGenero.value = String(livro.genero);
    }
    if (elEditora && livro.editora) {
        elEditora.value = String(livro.editora);
    }
}

/**
 * POST /livros/ - Envia novo livro usando FormData
 */
async function cadastrarLivro(dadosFormulario: FormData): Promise<boolean> {
    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: dadosFormulario
        });

        if (resposta.ok || resposta.status === 201) {
            alert('Livro cadastrado com sucesso!');
            await carregarCatalogoDeLivros(1);
            await carregarNovidadesDaSemana();
            return true;
        } else {
            const dadosErro = await resposta.json().catch(() => ({}));
            const detalheErro = Object.entries(dadosErro)
                .map(([campo, mensagens]) => `${campo}: ${Array.isArray(mensagens) ? mensagens.join(', ') : mensagens}`)
                .join('\n');

            alert(`Erro ${resposta.status} ao cadastrar livro:\n\n${detalheErro || 'Verifique se os dados estão corretos.'}`);
        }
    } catch (erro) {
        console.error('Erro no POST /livros/:', erro);
        alert('Servidor inacessível no momento.');
    }
    return false;
}

/**
 * PUT /livros/{id}/ - Atualiza um livro existente
 */
async function atualizarLivro(idLivro: number, dadosAtualizados: FormData): Promise<boolean> {
    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/${idLivro}/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json'
            },
            body: dadosAtualizados
        });

        if (resposta.ok) {
            alert('Livro atualizado com sucesso!');
            await carregarCatalogoDeLivros(paginaAtual);
            await carregarNovidadesDaSemana();
            return true;
        } else {
            const dadosErro = await resposta.json().catch(() => ({}));
            const detalheErro = Object.entries(dadosErro)
                .map(([campo, mensagens]) => `${campo}: ${Array.isArray(mensagens) ? mensagens.join(', ') : mensagens}`)
                .join('\n');

            alert(`Erro ${resposta.status} ao atualizar livro:\n\n${detalheErro || 'Verifique os dados informados.'}`);
        }
    } catch (erro) {
        console.error(`Erro no PUT /livros/${idLivro}/:`, erro);
        alert('Servidor inacessível no momento.');
    }
    return false;
}

/**
 * DELETE /livros/{id}/ - Elimina um livro da API
 */
async function deletarLivro(idLivro: number): Promise<boolean> {
    if (!confirm('Tem certeza de que deseja excluir este livro?')) return false;

    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/${idLivro}/`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        });

        if (resposta.ok || resposta.status === 204) {
            alert('Livro excluído com sucesso!');
            await carregarCatalogoDeLivros(paginaAtual);
            await carregarNovidadesDaSemana();
            return true;
        } else {
            alert(`Erro ao deletar livro: Código ${resposta.status}`);
        }
    } catch (erro) {
        console.error(`Erro no DELETE /livros/${idLivro}/:`, erro);
        alert('Servidor inacessível no momento.');
    }
    return false;
}

function inicializarEventosEControles(): void {
    const elementoModalVerMais = document.getElementById('modal-ver-mais');
    const elementoModalAdicionar = document.getElementById('modal-adicionar');
    const elementoModalEditar = document.getElementById('modal-editar');
    const elementoModalFiltroMobile = document.getElementById('modal-filtro-mobile');

    document.addEventListener('click', async (e: MouseEvent) => {
        const alvo = e.target as HTMLElement;

        if (alvo.closest('.btn-flutuante-adicionar')) {
            e.preventDefault();
            e.stopPropagation();
            exibirModal(elementoModalAdicionar);
            return;
        }

        if (alvo.closest('#btn-abrir-editar, .btn-editar-detalhe')) {
            e.preventDefault();
            if (livroSelecionadoAtualmente) {
                preencherModalEditar(livroSelecionadoAtualmente);
            }
            ocultarModal(elementoModalVerMais);
            exibirModal(elementoModalEditar);
            return;
        }

        if (alvo.closest('#btn-abrir-filtro-mobile, .btn-filtro-mobile')) {
            e.preventDefault();
            exibirModal(elementoModalFiltroMobile);
            return;
        }

        if (alvo.closest('#btn-fechar-ver-mais, .btn-fechar-modal')) {
            ocultarModal(elementoModalVerMais);
            return;
        }

        if (alvo.closest('#btn-cancelar-modal, .id-btn-cancelar-add-mobile')) {
            ocultarModal(elementoModalAdicionar);
            return;
        }

        if (alvo.closest('#btn-cancelar-modal-editar, .id-btn-cancelar-edit-mobile')) {
            ocultarModal(elementoModalEditar);
            return;
        }

        if (alvo.closest('#btn-deletar-modal, .btn-pilula-deletar')) {
            e.preventDefault();
            if (livroSelecionadoAtualmente && livroSelecionadoAtualmente.id) {
                const deletado = await deletarLivro(livroSelecionadoAtualmente.id);
                if (deletado) ocultarModal(elementoModalEditar);
            } else {
                ocultarModal(elementoModalEditar);
            }
            return;
        }

        if (alvo.closest('#btn-aplicar-filtro-mobile')) {
            ocultarModal(elementoModalFiltroMobile);
            carregarCatalogoDeLivros(1);
            return;
        }

        if (alvo.classList.contains('modal-overlay') || alvo.classList.contains('modal-filtro-overlay')) {
            ocultarModal(elementoModalVerMais);
            ocultarModal(elementoModalAdicionar);
            ocultarModal(elementoModalEditar);
            ocultarModal(elementoModalFiltroMobile);
        }
    });

    const btnBuscarDesktop = document.querySelector('.btn-buscar');
    const btnBuscarIconeMobile = document.querySelector('.btn-buscar-icone');

    if (btnBuscarDesktop) {
        btnBuscarDesktop.addEventListener('click', (e) => {
            e.preventDefault();
            carregarCatalogoDeLivros(1);
        });
    }

    if (btnBuscarIconeMobile) {
        btnBuscarIconeMobile.addEventListener('click', (e) => {
            e.preventDefault();
            carregarCatalogoDeLivros(1);
        });
    }

    const botoesPagina = document.querySelectorAll('.paginacao .page-num');
    botoesPagina.forEach((btn) => {
        btn.addEventListener('click', () => {
            const num = Number(btn.textContent?.trim());
            if (num) {
                paginaAtual = num;
                carregarCatalogoDeLivros(paginaAtual);
            }
        });
    });

    const formAdicionar = document.getElementById('form-adicionar-material') as HTMLFormElement | null;
    const formEditar = document.getElementById('form-editar-material') as HTMLFormElement | null;

    if (formAdicionar) {
        formAdicionar.addEventListener('submit', async (e: Event) => {
            e.preventDefault();

            const inputCapa = document.getElementById('input-capa') as HTMLInputElement | null;
            const valorGenero = (document.getElementById('genero') as HTMLSelectElement)?.value;
            const valorEditora = (document.getElementById('editora') as HTMLSelectElement)?.value;

            const dadosForm = new FormData();
            dadosForm.append('titulo', (document.getElementById('titulo') as HTMLInputElement)?.value.trim() || '');
            dadosForm.append('numero_paginas', (document.getElementById('paginas') as HTMLInputElement)?.value.trim() || '0');
            dadosForm.append('isbn', (document.getElementById('isbn') as HTMLInputElement)?.value.trim() || '');
            dadosForm.append('autor', (document.getElementById('autor') as HTMLInputElement)?.value.trim() || '');
            dadosForm.append('ano_publicacao', (document.getElementById('ano') as HTMLInputElement)?.value.trim() || '0');
            dadosForm.append('resumo', (document.getElementById('resumo') as HTMLTextAreaElement)?.value.trim() || '');

            if (valorGenero) dadosForm.append('genero', valorGenero);
            if (valorEditora) dadosForm.append('editora', valorEditora);

            if (inputCapa && inputCapa.files && inputCapa.files.length > 0) {
                dadosForm.append('capa', inputCapa.files[0]);
            }

            const sucesso = await cadastrarLivro(dadosForm);
            if (sucesso) {
                ocultarModal(elementoModalAdicionar);
                formAdicionar.reset();
                const inputCapaImg = document.getElementById('preview-capa-img') as HTMLImageElement | null;
                if (inputCapaImg) {
                    inputCapaImg.src = '../imagens/adicionarcapa.png';
                }
            }
        });
    }

    if (formEditar) {
        formEditar.addEventListener('submit', async (e: Event) => {
            e.preventDefault();

            if (!livroSelecionadoAtualmente || !livroSelecionadoAtualmente.id) {
                ocultarModal(elementoModalEditar);
                return;
            }

            const valorGenero = (document.getElementById('edit-genero') as HTMLSelectElement)?.value;
            const valorEditora = (document.getElementById('edit-editora') as HTMLSelectElement)?.value;

            const dadosForm = new FormData();
            dadosForm.append('titulo', (document.getElementById('edit-titulo') as HTMLInputElement)?.value.trim() || '');
            dadosForm.append('numero_paginas', (document.getElementById('edit-paginas') as HTMLInputElement)?.value.trim() || '0');
            dadosForm.append('isbn', (document.getElementById('edit-isbn') as HTMLInputElement)?.value.trim() || '');
            dadosForm.append('autor', (document.getElementById('edit-autor') as HTMLInputElement)?.value.trim() || '');
            dadosForm.append('ano_publicacao', (document.getElementById('edit-ano') as HTMLInputElement)?.value.trim() || '0');
            dadosForm.append('resumo', (document.getElementById('edit-resumo') as HTMLTextAreaElement)?.value.trim() || '');

            if (valorGenero) dadosForm.append('genero', valorGenero);
            if (valorEditora) dadosForm.append('editora', valorEditora);

            const sucesso = await atualizarLivro(livroSelecionadoAtualmente.id, dadosForm);
            if (sucesso) {
                ocultarModal(elementoModalEditar);
            }
        });
    }
}

function configurarPreviewDeCapa(): void {
    const campoDeEntradaCapa = document.getElementById('input-capa') as HTMLInputElement | null;
    const imagemPreviewCapa = document.getElementById('preview-capa-img') as HTMLImageElement | null;
    const containerCapaPreview = document.querySelector('.caixa-capa-preview') as HTMLElement | null;

    if (campoDeEntradaCapa && imagemPreviewCapa) {
        campoDeEntradaCapa.addEventListener('change', () => {
            const ficheiros = campoDeEntradaCapa.files;
            if (ficheiros && ficheiros.length > 0) {
                const leitor = new FileReader();
                leitor.onload = (e: ProgressEvent<FileReader>) => {
                    if (e.target?.result) {
                        imagemPreviewCapa.src = e.target.result as string;
                        if (containerCapaPreview) containerCapaPreview.classList.add('tem-imagem');
                    }
                };
                leitor.readAsDataURL(ficheiros[0]);
            }
        });
    }
}

async function inicializarAplicacao(): Promise<void> {
    await Promise.all([
        carregarListaDeGeneros(),
        carregarListaDeEditoras(),
        carregarNovidadesDaSemana()
    ]);
    await carregarCatalogoDeLivros(1);
    inicializarEventosEControles();
    configurarPreviewDeCapa();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacao);
} else {
    inicializarAplicacao();
}