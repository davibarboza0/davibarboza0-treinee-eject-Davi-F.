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

/**
 * GET /generos/ - Carrega apenas os gêneros existentes na API
 */
async function carregarListaDeGeneros(): Promise<void> {
    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/generos/`, { 
            method: 'GET', 
            headers: { 'Accept': 'application/json' } 
        });
        if (resposta.ok) {
            const dados = await resposta.json();
            const listaExtraida: Genero[] = Array.isArray(dados) ? dados : (dados.results || []);
            const generosUnicos = filtrarDuplicadosPorNome(listaExtraida).sort((a, b) => a.nome.localeCompare(b.nome));
            
            buscarTodosOsSeletoresDeGenero().forEach((s) => {
                const txt = s.classList.contains('select-filtro') || s.classList.contains('select-modal-filtro') ? 'Gênero' : 'Selecionar';
                preencherOpcoesDoSeletor(s, generosUnicos, txt);
            });
        }
    } catch (erro) {
        console.error('Erro ao carregar lista de gêneros:', erro);
    }
}

/**
 * GET /editoras/ - Carrega apenas as editoras existentes na API
 */
async function carregarListaDeEditoras(): Promise<void> {
    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/editoras/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            const listaExtraida: Editora[] = Array.isArray(dados) ? dados : (dados.results || []);
            const editorasUnicas = filtrarDuplicadosPorNome(listaExtraida).sort((a, b) => a.nome.localeCompare(b.nome));

            buscarTodosOsSeletoresDeEditora().forEach((s) => {
                const txt = s.classList.contains('select-filtro') || s.classList.contains('select-modal-filtro') ? 'Editora' : 'Selecionar';
                preencherOpcoesDoSeletor(s, editorasUnicas, txt);
            });
        }
    } catch (erro) {
        console.error('Erro ao carregar lista de editoras:', erro);
    }
}

/**
 * GET /livros/novidades/ - Carrega novidades diretamente da API
 */
async function carregarNovidadesDaSemana(): Promise<void> {
    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/novidades/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            const listaExtraida: Livro[] = Array.isArray(dados) ? dados : (dados.results || []);
            renderizarCarrosselNovidades(listaExtraida);
        }
    } catch (erro) {
        console.error('Erro ao carregar novidades:', erro);
    }
}

/**
 * Renderiza dinamicamente o carrossel de novidades
 */
function renderizarCarrosselNovidades(livros: Livro[]): void {
    const containerCarrossel = document.querySelector('.novidades-carrossel');
    const elDestaqueContainer = document.querySelector('.destaque-detalhe');
    const elTituloDestaque = document.querySelector('.destaque-detalhe h2');
    const elAutorDestaque = document.querySelector('.destaque-detalhe p');

    if (!containerCarrossel) return;

    containerCarrossel.innerHTML = '';
    
    if (livros.length === 0) {
        if (elTituloDestaque) elTituloDestaque.textContent = 'Sem novidades no momento';
        if (elAutorDestaque) elAutorDestaque.textContent = '';
        return;
    }

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

    if (livros.length === 0) {
        containerGrelha.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">Nenhum livro encontrado no acervo.</p>';
        return;
    }

    livros.forEach((livro, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card-catalogo';
        cardDiv.setAttribute('data-id', String(livro.id || ''));

        if (livro.capa) {
            cardDiv.style.backgroundImage = `url('${livro.capa}')`;
            cardDiv.style.backgroundSize = 'cover';
            cardDiv.style.backgroundPosition = 'center';
        }

        const tituloLivro = livro.titulo || 'Título indisponível';
        const autorLivro = livro.autor || 'Autor desconhecido';
        const anoLivro = livro.ano_publicacao ? livro.ano_publicacao : '';
        const autorEAno = anoLivro ? `${autorLivro}, ${anoLivro}` : autorLivro;

        const overlayDiv = document.createElement('div');
        overlayDiv.className = 'card-overlay-hover';
        overlayDiv.innerHTML = `
            <img src="../imagens/vizualizar.png" alt="Visualizar ${tituloLivro}" class="img-sobreposicao-card" draggable="false">
            <div class="overlay-conteudo-texto">
                <h3 class="overlay-titulo">${tituloLivro}</h3>
                <p class="overlay-autor">${autorEAno}</p>
            </div>
        `;
        cardDiv.appendChild(overlayDiv);

        // Botão MOBILE (4º card)
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

        // Botão DESKTOP (5º card)
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

    if (livros.length <= 3 && livros.length > 0) {
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

/**
 * GET /livros/ - Carrega apenas a lista real de livros da API
 */
async function carregarCatalogoDeLivros(pagina: number = 1): Promise<void> {
    paginaAtual = pagina;
    atualizarPaginacaoUI(pagina);

    const seletoresGenero = buscarTodosOsSeletoresDeGenero();
    const seletoresEditora = buscarTodosOsSeletoresDeEditora();

    const generoId = seletoresGenero.find((s) => s.value !== '')?.value || '';
    const editoraId = seletoresEditora.find((s) => s.value !== '')?.value || '';
    const termoBusca = (document.querySelector('.input-busca') as HTMLInputElement)?.value.trim() || '';

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
            renderizarLivrosNoCatalogo(resultados);
        } else {
            renderizarLivrosNoCatalogo([]);
        }
    } catch (erro) {
        console.error('Erro ao carregar livros da API:', erro);
        renderizarLivrosNoCatalogo([]);
    }
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

async function cadastrarLivro(dadosFormulario: FormData): Promise<boolean> {
    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/`, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
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

async function atualizarLivro(idLivro: number, dadosAtualizados: FormData): Promise<boolean> {
    try {
        const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/${idLivro}/`, {
            method: 'PUT',
            headers: { 'Accept': 'application/json' },
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