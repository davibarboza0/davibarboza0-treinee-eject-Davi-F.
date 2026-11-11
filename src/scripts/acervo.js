"use strict";
(() => {
    if (!localStorage.getItem('access_token')) {
        window.location.replace('../../index.html');
        return;
    }
    const ENDERECO_BASE_DA_API = 'https://thekapitrainee.pythonanywhere.com';
    let livroSelecionadoAtualmente = null;
    let paginaAtual = 1;
    function obterHeadersComToken() {
        const token = localStorage.getItem('access_token');
        const headers = {
            'Accept': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }
    function realizarLogout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.replace('../../index.html');
    }
    function atualizarPaginacaoUI(pagina) {
        const botoesPagina = document.querySelectorAll('.paginacao .page-num');
        botoesPagina.forEach((btn) => {
            var _a;
            const num = Number((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim());
            if (num === pagina) {
                btn.classList.add('active');
            }
            else {
                btn.classList.remove('active');
            }
        });
    }
    function filtrarDuplicadosPorNome(lista) {
        const nomesVistos = new Set();
        return lista.filter((item) => {
            if (!item || !item.nome)
                return false;
            const nomeNormalizado = item.nome.trim().toLowerCase();
            if (nomesVistos.has(nomeNormalizado))
                return false;
            nomesVistos.add(nomeNormalizado);
            return true;
        });
    }
    function preencherOpcoesDoSeletor(elementoSeletor, lista, textoOpcaoPadrao) {
        elementoSeletor.innerHTML = `<option value="" disabled selected>${textoOpcaoPadrao}</option>`;
        lista.forEach((item) => {
            const elementoOpcao = document.createElement('option');
            elementoOpcao.value = String(item.id);
            elementoOpcao.textContent = item.nome;
            elementoSeletor.appendChild(elementoOpcao);
        });
    }
    function buscarTodosOsSeletoresDeGenero() {
        const seletores = new Set();
        ['genero', 'generos', 'edit-genero', 'edit-generos', 'filtro-genero-desktop', 'filtro-genero-mobile'].forEach((id) => {
            const el = document.getElementById(id);
            if (el)
                seletores.add(el);
        });
        document.querySelectorAll('select[id*="genero"], select[name*="genero"]').forEach((el) => seletores.add(el));
        const priDesktop = document.querySelector('.filtros-grupo-desktop select:first-child');
        if (priDesktop)
            seletores.add(priDesktop);
        const priMobile = document.querySelector('#modal-filtro-mobile select:first-child');
        if (priMobile)
            seletores.add(priMobile);
        return Array.from(seletores);
    }
    function buscarTodosOsSeletoresDeEditora() {
        const seletores = new Set();
        ['editora', 'editoras', 'edit-editora', 'edit-editoras', 'filtro-editora-desktop', 'filtro-editora-mobile'].forEach((id) => {
            const el = document.getElementById(id);
            if (el)
                seletores.add(el);
        });
        document.querySelectorAll('select[id*="editora"], select[name*="editora"]').forEach((el) => seletores.add(el));
        const seletoresDesktop = document.querySelectorAll('.filtros-grupo-desktop select');
        if (seletoresDesktop.length > 1)
            seletores.add(seletoresDesktop[1]);
        const seletoresMobile = document.querySelectorAll('#modal-filtro-mobile select');
        if (seletoresMobile.length > 1)
            seletores.add(seletoresMobile[1]);
        return Array.from(seletores);
    }
    async function carregarListaDeGeneros() {
        try {
            const resposta = await fetch(`${ENDERECO_BASE_DA_API}/generos/`, {
                method: 'GET',
                headers: obterHeadersComToken()
            });
            if (resposta.ok) {
                const dados = await resposta.json();
                const listaExtraida = Array.isArray(dados) ? dados : (dados.results || []);
                const generosUnicos = filtrarDuplicadosPorNome(listaExtraida).sort((a, b) => a.nome.localeCompare(b.nome));
                buscarTodosOsSeletoresDeGenero().forEach((s) => {
                    const txt = s.classList.contains('select-filtro') || s.classList.contains('select-modal-filtro') ? 'Gênero' : 'Selecionar';
                    preencherOpcoesDoSeletor(s, generosUnicos, txt);
                });
            }
        }
        catch (erro) {
            console.error('Erro ao carregar gêneros:', erro);
        }
    }
    async function carregarListaDeEditoras() {
        try {
            const resposta = await fetch(`${ENDERECO_BASE_DA_API}/editoras/`, {
                method: 'GET',
                headers: obterHeadersComToken()
            });
            if (resposta.ok) {
                const dados = await resposta.json();
                const listaExtraida = Array.isArray(dados) ? dados : (dados.results || []);
                const editorasUnicas = filtrarDuplicadosPorNome(listaExtraida).sort((a, b) => a.nome.localeCompare(b.nome));
                buscarTodosOsSeletoresDeEditora().forEach((s) => {
                    const txt = s.classList.contains('select-filtro') || s.classList.contains('select-modal-filtro') ? 'Editora' : 'Selecionar';
                    preencherOpcoesDoSeletor(s, editorasUnicas, txt);
                });
            }
        }
        catch (erro) {
            console.error('Erro ao carregar editoras:', erro);
        }
    }
    async function carregarNovidadesDaSemana() {
        try {
            const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/novidades/`, {
                method: 'GET',
                headers: obterHeadersComToken()
            });
            if (resposta.ok) {
                const dados = await resposta.json();
                const listaExtraida = Array.isArray(dados) ? dados : (dados.results || []);
                renderizarCarrosselNovidades(listaExtraida);
            }
        }
        catch (erro) {
            console.error('Erro ao carregar novidades:', erro);
        }
    }
    function renderizarCarrosselNovidades(livros) {
        const containerCarrossel = document.querySelector('.novidades-carrossel');
        const elDestaqueContainer = document.querySelector('.destaque-detalhe');
        const elTituloDestaque = document.querySelector('.destaque-detalhe h2');
        const elAutorDestaque = document.querySelector('.destaque-detalhe p');
        if (!containerCarrossel)
            return;
        containerCarrossel.innerHTML = '';
        if (livros.length === 0) {
            if (elTituloDestaque)
                elTituloDestaque.textContent = 'Sem novidades no momento';
            if (elAutorDestaque)
                elAutorDestaque.textContent = '';
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
                <img src="../assets/images/setad.png" alt="Seta selecionada" class="icone-seta-card img-seta-ativa" draggable="false">
                <img src="../assets/images/setac.png" alt="Seta inativa" class="icone-seta-card img-seta-inativa" draggable="false">
            `;
            if (eAtivo) {
                if (elTituloDestaque)
                    elTituloDestaque.textContent = livro.titulo;
                if (elAutorDestaque)
                    elAutorDestaque.textContent = `${livro.autor} – ${livro.ano_publicacao}`;
            }
            card.addEventListener('click', () => {
                if (card.classList.contains('active'))
                    return;
                const todosCards = containerCarrossel.querySelectorAll('.card-carrossel');
                todosCards.forEach((c) => c.classList.remove('active'));
                card.classList.add('active');
                if (elDestaqueContainer) {
                    elDestaqueContainer.classList.add('trocando');
                    setTimeout(() => {
                        if (elTituloDestaque)
                            elTituloDestaque.textContent = livro.titulo;
                        if (elAutorDestaque)
                            elAutorDestaque.textContent = `${livro.autor} – ${livro.ano_publicacao}`;
                        elDestaqueContainer.classList.remove('trocando');
                    }, 150);
                }
                else {
                    if (elTituloDestaque)
                        elTituloDestaque.textContent = livro.titulo;
                    if (elAutorDestaque)
                        elAutorDestaque.textContent = `${livro.autor} – ${livro.ano_publicacao}`;
                }
            });
            containerCarrossel.appendChild(card);
        });
    }
    function exibirModal(elementoModal) {
        if (!elementoModal)
            return;
        elementoModal.classList.remove('hidden');
        elementoModal.removeAttribute('hidden');
        elementoModal.style.setProperty('display', 'flex', 'important');
        elementoModal.style.setProperty('z-index', '99999', 'important');
    }
    function ocultarModal(elementoModal) {
        if (!elementoModal)
            return;
        elementoModal.classList.add('hidden');
        elementoModal.style.setProperty('display', 'none', 'important');
    }
    function renderizarLivrosNoCatalogo(livros) {
        const containerGrelha = document.querySelector('.grid-catalogo');
        if (!containerGrelha)
            return;
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
                <img src="../assets/images/vizualizar.png" alt="Visualizar ${tituloLivro}" class="img-sobreposicao-card" draggable="false">
                <div class="overlay-conteudo-texto">
                    <h3 class="overlay-titulo">${tituloLivro}</h3>
                    <p class="overlay-autor">${autorEAno}</p>
                </div>
            `;
            cardDiv.appendChild(overlayDiv);
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
                const alvo = ev.target;
                if (alvo.closest('.btn-flutuante-adicionar'))
                    return;
                preencherEExibirModalVerMais(livro);
            });
            containerGrelha.appendChild(cardDiv);
        });
        if (livros.length <= 3 && livros.length > 0) {
            const ultimoCard = containerGrelha.lastElementChild;
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
    async function carregarCatalogoDeLivros(pagina = 1) {
        var _a, _b, _c;
        paginaAtual = pagina;
        atualizarPaginacaoUI(pagina);
        const seletoresGenero = buscarTodosOsSeletoresDeGenero();
        const seletoresEditora = buscarTodosOsSeletoresDeEditora();
        const generoId = ((_a = seletoresGenero.find((s) => s.value !== '')) === null || _a === void 0 ? void 0 : _a.value) || '';
        const editoraId = ((_b = seletoresEditora.find((s) => s.value !== '')) === null || _b === void 0 ? void 0 : _b.value) || '';
        const termoBusca = ((_c = document.querySelector('.input-busca')) === null || _c === void 0 ? void 0 : _c.value.trim()) || '';
        try {
            const parametros = new URLSearchParams();
            parametros.append('page', String(pagina));
            if (generoId)
                parametros.append('genero', generoId);
            if (editoraId)
                parametros.append('editora', editoraId);
            if (termoBusca)
                parametros.append('search', termoBusca);
            const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/?${parametros.toString()}`, {
                method: 'GET',
                headers: obterHeadersComToken()
            });
            if (resposta.ok) {
                const dados = await resposta.json();
                const resultados = Array.isArray(dados) ? dados : (dados.results || []);
                renderizarLivrosNoCatalogo(resultados);
            }
            else if (resposta.status === 401 || resposta.status === 403) {
                realizarLogout();
            }
            else {
                renderizarLivrosNoCatalogo([]);
            }
        }
        catch (erro) {
            console.error('Erro ao carregar livros:', erro);
            renderizarLivrosNoCatalogo([]);
        }
    }
    function preencherEExibirModalVerMais(livro) {
        livroSelecionadoAtualmente = livro;
        const elTitulo = document.querySelector('.ver-mais-titulo');
        const elAutorAno = document.querySelector('.ver-mais-autor');
        const elResumo = document.querySelector('.ver-mais-resumo');
        const elPaginas = document.querySelector('.ver-mais-paginas');
        const elEditora = document.querySelector('.ver-mais-editora');
        const elCapa = document.querySelector('.img-ver-mais-capa');
        if (elTitulo)
            elTitulo.textContent = livro.titulo;
        if (elAutorAno)
            elAutorAno.textContent = `${livro.autor}, ${livro.ano_publicacao}`;
        if (elResumo)
            elResumo.textContent = livro.resumo;
        if (elPaginas)
            elPaginas.textContent = `páginas: ${livro.numero_paginas}`;
        const nomeEditora = livro.editora_nome || (typeof livro.editora === 'string' ? livro.editora : 'Editora não informada');
        if (elEditora)
            elEditora.textContent = nomeEditora;
        if (elCapa && livro.capa)
            elCapa.src = livro.capa;
        exibirModal(document.getElementById('modal-ver-mais'));
    }
    function preencherModalEditar(livro) {
        const elTitulo = document.getElementById('edit-titulo');
        const elPaginas = document.getElementById('edit-paginas');
        const elIsbn = document.getElementById('edit-isbn');
        const elAutor = document.getElementById('edit-autor');
        const elAno = document.getElementById('edit-ano');
        const elGenero = document.getElementById('edit-genero');
        const elEditora = document.getElementById('edit-editora');
        const elResumo = document.getElementById('edit-resumo');
        if (elTitulo)
            elTitulo.value = livro.titulo;
        if (elPaginas)
            elPaginas.value = String(livro.numero_paginas);
        if (elIsbn)
            elIsbn.value = livro.isbn;
        if (elAutor)
            elAutor.value = livro.autor;
        if (elAno)
            elAno.value = String(livro.ano_publicacao);
        if (elResumo)
            elResumo.value = livro.resumo;
        if (elGenero && livro.genero)
            elGenero.value = String(livro.genero);
        if (elEditora && livro.editora)
            elEditora.value = String(livro.editora);
    }
    async function cadastrarLivro(dadosFormulario) {
        try {
            const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/`, {
                method: 'POST',
                headers: obterHeadersComToken(),
                body: dadosFormulario
            });
            if (resposta.ok || resposta.status === 201) {
                alert('Livro cadastrado com sucesso!');
                await carregarCatalogoDeLivros(1);
                await carregarNovidadesDaSemana();
                return true;
            }
            else {
                const dadosErro = await resposta.json().catch(() => ({}));
                const detalheErro = Object.entries(dadosErro)
                    .map(([campo, mensagens]) => `${campo}: ${Array.isArray(mensagens) ? mensagens.join(', ') : mensagens}`)
                    .join('\n');
                alert(`Erro ${resposta.status} ao cadastrar livro:\n\n${detalheErro || 'Verifique se os dados estão corretos.'}`);
            }
        }
        catch (erro) {
            console.error('Erro no POST /livros/:', erro);
            alert('Servidor inacessível no momento.');
        }
        return false;
    }
    async function atualizarLivro(idLivro, dadosAtualizados) {
        try {
            const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/${idLivro}/`, {
                method: 'PUT',
                headers: obterHeadersComToken(),
                body: dadosAtualizados
            });
            if (resposta.ok) {
                alert('Livro atualizado com sucesso!');
                await carregarCatalogoDeLivros(paginaAtual);
                await carregarNovidadesDaSemana();
                return true;
            }
            else {
                const dadosErro = await resposta.json().catch(() => ({}));
                const detalheErro = Object.entries(dadosErro)
                    .map(([campo, mensagens]) => `${campo}: ${Array.isArray(mensagens) ? mensagens.join(', ') : mensagens}`)
                    .join('\n');
                alert(`Erro ${resposta.status} ao atualizar livro:\n\n${detalheErro || 'Verifique os dados informados.'}`);
            }
        }
        catch (erro) {
            console.error(`Erro no PUT /livros/${idLivro}/:`, erro);
            alert('Servidor inacessível no momento.');
        }
        return false;
    }
    async function deletarLivro(idLivro) {
        if (!confirm('Tem certeza de que deseja excluir este livro?'))
            return false;
        try {
            const resposta = await fetch(`${ENDERECO_BASE_DA_API}/livros/${idLivro}/`, {
                method: 'DELETE',
                headers: obterHeadersComToken()
            });
            if (resposta.ok || resposta.status === 204) {
                alert('Livro excluído com sucesso!');
                await carregarCatalogoDeLivros(paginaAtual);
                await carregarNovidadesDaSemana();
                return true;
            }
            else {
                alert(`Erro ao deletar livro: Código ${resposta.status}`);
            }
        }
        catch (erro) {
            console.error(`Erro no DELETE /livros/${idLivro}/:`, erro);
            alert('Servidor inacessível no momento.');
        }
        return false;
    }
    function inicializarEventosEControles() {
        const elementoModalVerMais = document.getElementById('modal-ver-mais');
        const elementoModalAdicionar = document.getElementById('modal-adicionar');
        const elementoModalEditar = document.getElementById('modal-editar');
        const elementoModalFiltroMobile = document.getElementById('modal-filtro-mobile');
        document.addEventListener('click', async (e) => {
            const alvo = e.target;
            if (alvo.closest('#btn-logout, .link-logout, .link-overlay-usuario')) {
                e.preventDefault();
                realizarLogout();
                return;
            }
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
                    if (deletado)
                        ocultarModal(elementoModalEditar);
                }
                else {
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
                var _a;
                const num = Number((_a = btn.textContent) === null || _a === void 0 ? void 0 : _a.trim());
                if (num) {
                    paginaAtual = num;
                    carregarCatalogoDeLivros(paginaAtual);
                }
            });
        });
        const formAdicionar = document.getElementById('form-adicionar-material');
        const formEditar = document.getElementById('form-editar-material');
        if (formAdicionar) {
            formAdicionar.addEventListener('submit', async (e) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                e.preventDefault();
                const inputCapa = document.getElementById('input-capa');
                const valorGenero = (_a = document.getElementById('genero')) === null || _a === void 0 ? void 0 : _a.value;
                const valorEditora = (_b = document.getElementById('editora')) === null || _b === void 0 ? void 0 : _b.value;
                const dadosForm = new FormData();
                dadosForm.append('titulo', ((_c = document.getElementById('titulo')) === null || _c === void 0 ? void 0 : _c.value.trim()) || '');
                dadosForm.append('numero_paginas', ((_d = document.getElementById('paginas')) === null || _d === void 0 ? void 0 : _d.value.trim()) || '0');
                dadosForm.append('isbn', ((_e = document.getElementById('isbn')) === null || _e === void 0 ? void 0 : _e.value.trim()) || '');
                dadosForm.append('autor', ((_f = document.getElementById('autor')) === null || _f === void 0 ? void 0 : _f.value.trim()) || '');
                dadosForm.append('ano_publicacao', ((_g = document.getElementById('ano')) === null || _g === void 0 ? void 0 : _g.value.trim()) || '0');
                dadosForm.append('resumo', ((_h = document.getElementById('resumo')) === null || _h === void 0 ? void 0 : _h.value.trim()) || '');
                if (valorGenero)
                    dadosForm.append('genero', valorGenero);
                if (valorEditora)
                    dadosForm.append('editora', valorEditora);
                if (inputCapa && inputCapa.files && inputCapa.files.length > 0) {
                    dadosForm.append('capa', inputCapa.files[0]);
                }
                const sucesso = await cadastrarLivro(dadosForm);
                if (sucesso) {
                    ocultarModal(elementoModalAdicionar);
                    formAdicionar.reset();
                    const inputCapaImg = document.getElementById('preview-capa-img');
                    if (inputCapaImg) {
                        inputCapaImg.src = '../assets/images/adicionarcapa.png';
                    }
                }
            });
        }
        if (formEditar) {
            formEditar.addEventListener('submit', async (e) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                e.preventDefault();
                if (!livroSelecionadoAtualmente || !livroSelecionadoAtualmente.id) {
                    ocultarModal(elementoModalEditar);
                    return;
                }
                const valorGenero = (_a = document.getElementById('edit-genero')) === null || _a === void 0 ? void 0 : _a.value;
                const valorEditora = (_b = document.getElementById('edit-editora')) === null || _b === void 0 ? void 0 : _b.value;
                const dadosForm = new FormData();
                dadosForm.append('titulo', ((_c = document.getElementById('edit-titulo')) === null || _c === void 0 ? void 0 : _c.value.trim()) || '');
                dadosForm.append('numero_paginas', ((_d = document.getElementById('edit-paginas')) === null || _d === void 0 ? void 0 : _d.value.trim()) || '0');
                dadosForm.append('isbn', ((_e = document.getElementById('edit-isbn')) === null || _e === void 0 ? void 0 : _e.value.trim()) || '');
                dadosForm.append('autor', ((_f = document.getElementById('edit-autor')) === null || _f === void 0 ? void 0 : _f.value.trim()) || '');
                dadosForm.append('ano_publicacao', ((_g = document.getElementById('edit-ano')) === null || _g === void 0 ? void 0 : _g.value.trim()) || '0');
                dadosForm.append('resumo', ((_h = document.getElementById('edit-resumo')) === null || _h === void 0 ? void 0 : _h.value.trim()) || '');
                if (valorGenero)
                    dadosForm.append('genero', valorGenero);
                if (valorEditora)
                    dadosForm.append('editora', valorEditora);
                const sucesso = await atualizarLivro(livroSelecionadoAtualmente.id, dadosForm);
                if (sucesso) {
                    ocultarModal(elementoModalEditar);
                }
            });
        }
    }
    function configurarPreviewDeCapa() {
        const campoDeEntradaCapa = document.getElementById('input-capa');
        const imagemPreviewCapa = document.getElementById('preview-capa-img');
        const containerCapaPreview = document.querySelector('.caixa-capa-preview');
        if (campoDeEntradaCapa && imagemPreviewCapa) {
            campoDeEntradaCapa.addEventListener('change', () => {
                const ficheiros = campoDeEntradaCapa.files;
                if (ficheiros && ficheiros.length > 0) {
                    const leitor = new FileReader();
                    leitor.onload = (e) => {
                        var _a;
                        if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) {
                            imagemPreviewCapa.src = e.target.result;
                            if (containerCapaPreview)
                                containerCapaPreview.classList.add('tem-imagem');
                        }
                    };
                    leitor.readAsDataURL(ficheiros[0]);
                }
            });
        }
    }
    async function inicializarAplicacao() {
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
    }
    else {
        inicializarAplicacao();
    }
})();
