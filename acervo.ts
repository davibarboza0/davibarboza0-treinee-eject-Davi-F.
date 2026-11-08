// ==========================================
// 1. LÓGICA DO MODAL (ADICIONAR MATERIAL)
// ==========================================
function inicializarModalAdicionar(): void {
    const modalAdicionar = document.getElementById('modal-adicionar');
    const botaoFlutuante = document.getElementById('btn-flutuante-adicionar');
    const botaoCancelarDesktop = document.getElementById('btn-cancelar-modal');
    const botaoCancelarMobile = document.querySelector('.id-btn-cancelar-add-mobile');

    if (botaoFlutuante && modalAdicionar) {
        botaoFlutuante.addEventListener('click', (evento: Event) => {
            evento.stopPropagation();
            evento.preventDefault();
            modalAdicionar.classList.remove('hidden');
        });
    }

    const fecharModal = (evento: Event) => {
        evento.preventDefault();
        modalAdicionar?.classList.add('hidden');
    };

    if (botaoCancelarDesktop) botaoCancelarDesktop.addEventListener('click', fecharModal);
    if (botaoCancelarMobile) botaoCancelarMobile.addEventListener('click', fecharModal);

    if (modalAdicionar) {
        modalAdicionar.addEventListener('click', (evento: Event) => {
            if (evento.target === modalAdicionar) {
                modalAdicionar.classList.add('hidden');
            }
        });
    }
}

// ==========================================
// 2. LÓGICA DOS MODAIS (VER MAIS & EDITAR)
// ==========================================
function inicializarModaisVerMaisEEditar(): void {
    const modalVerMais = document.getElementById('modal-ver-mais');
    const modalEditar = document.getElementById('modal-editar');
    const botaoFecharVerMais = document.getElementById('btn-fechar-ver-mais');
    const botaoAbrirEditar = document.getElementById('btn-abrir-editar');
    const botaoCancelarEditarDesktop = document.getElementById('btn-cancelar-modal-editar');
    const botaoCancelarEditarMobile = document.querySelector('.id-btn-cancelar-edit-mobile');
    const cardsCatalogo = document.querySelectorAll('.card-catalogo');

    cardsCatalogo.forEach(card => {
        card.addEventListener('click', (evento: Event) => {
            const alvo = evento.target as HTMLElement;
            
            if (alvo.closest('#btn-flutuante-adicionar')) {
                return;
            }

            if (modalVerMais) {
                modalVerMais.classList.remove('hidden');
            }
        });
    });

    if (botaoFecharVerMais && modalVerMais) {
        botaoFecharVerMais.addEventListener('click', () => {
            modalVerMais.classList.add('hidden');
        });
    }

    if (botaoAbrirEditar && modalVerMais && modalEditar) {
        botaoAbrirEditar.addEventListener('click', () => {
            modalVerMais.classList.add('hidden');
            modalEditar.classList.remove('hidden');
        });
    }

    const fecharModalEditar = (evento: Event) => {
        evento.preventDefault();
        modalEditar?.classList.add('hidden');
    };

    if (botaoCancelarEditarDesktop) botaoCancelarEditarDesktop.addEventListener('click', fecharModalEditar);
    if (botaoCancelarEditarMobile) botaoCancelarEditarMobile.addEventListener('click', fecharModalEditar);

    [modalVerMais, modalEditar].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (evento: Event) => {
                if (evento.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    });
}

// ==========================================
// 3. PRÉ-VISUALIZAÇÃO DA CAPA AO CARREGAR
// ==========================================
function inicializarUploadCapa(): void {
    const inputCapa = document.getElementById('input-capa') as HTMLInputElement;
    const imgPreview = document.getElementById('preview-capa-img') as HTMLImageElement;
    const caixaPreview = document.querySelector('.caixa-capa-preview');

    if (inputCapa && imgPreview) {
        inputCapa.addEventListener('change', () => {
            const arquivo = inputCapa.files?.[0];
            if (arquivo) {
                const leitor = new FileReader();
                leitor.onload = (e) => {
                    if (e.target?.result) {
                        imgPreview.src = e.target.result as string;
                        caixaPreview?.classList.add('tem-imagem');
                    }
                };
                leitor.readAsDataURL(arquivo);
            }
        });
    }
}

// ==========================================
// 4. LÓGICA DO CARROSSEL ACORDEÃO
// ==========================================
function inicializarCarrossel(): void {
    const cards = document.querySelectorAll<HTMLElement>('.card-carrossel');
    const tituloElemento = document.querySelector<HTMLElement>('.destaque-detalhe h2');
    const autorElemento = document.querySelector<HTMLElement>('.destaque-detalhe p');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const titulo = card.getAttribute('data-titulo');
            const autor = card.getAttribute('data-autor');

            if (tituloElemento && titulo) {
                tituloElemento.textContent = titulo;
            }
            if (autorElemento && autor) {
                autorElemento.textContent = autor;
            }
        });
    });
}

// ==========================================
// 5. LÓGICA DO POPUP DE FILTROS (MOBILE)
// ==========================================
function inicializarFiltroMobile(): void {
    const botaoAbrirFiltro = document.getElementById('btn-abrir-filtro-mobile');
    const modalFiltro = document.getElementById('modal-filtro-mobile');
    const botaoAplicarFiltro = document.getElementById('btn-aplicar-filtro-mobile');

    if (botaoAbrirFiltro && modalFiltro) {
        botaoAbrirFiltro.addEventListener('click', (evento: Event) => {
            evento.preventDefault();
            modalFiltro.classList.remove('hidden');
        });
    }

    if (botaoAplicarFiltro && modalFiltro) {
        botaoAplicarFiltro.addEventListener('click', (evento: Event) => {
            evento.preventDefault();
            modalFiltro.classList.add('hidden');
        });
    }

    if (modalFiltro) {
        modalFiltro.addEventListener('click', (evento: Event) => {
            if (evento.target === modalFiltro) {
                modalFiltro.classList.add('hidden');
            }
        });
    }
}

// ==========================================
// 6. POSICIONAMENTO DINÂMICO DO BOTÃO +
// ==========================================
function ajustarPosicaoBotao(): void {
    const botao = document.getElementById('btn-flutuante-adicionar');
    const cards = document.querySelectorAll('.grid-catalogo .card-catalogo');

    if (!botao || cards.length < 5) return;

    const cardMobile = cards[1];
    const cardDesktop = cards[4];

    if (window.innerWidth <= 768) {
        if (botao.parentElement !== cardMobile) {
            cardMobile.appendChild(btn);
        }
    } else {
        if (botao.parentElement !== cardDesktop) {
            cardDesktop.appendChild(btn);
        }
    }
}

// ==========================================
// INICIALIZAÇÃO DA PÁGINA
// ==========================================
function inicializar(): void {
    inicializarModalAdicionar();
    inicializarModaisVerMaisEEditar();
    inicializarUploadCapa();
    inicializarCarrossel();
    inicializarFiltroMobile();
    ajustarPosicaoBotao();

    window.addEventListener('resize', ajustarPosicaoBotao);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}

// 1. Interface correspondente aos dados retornados pela API
interface Editora {
    id: number;
    nome: string;
}

// 2. URL base da API (substitua pela URL real do backend se for diferente)
const API_BASE_URL = 'http://localhost:8000';

/**
 * Procura a lista de editoras no servidor e popula os selects do formulário
 */
async function carregarEditoras(): Promise<void> {
    try {
        const resposta = await fetch(`${API_BASE_URL}/editoras/`);

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }

        const editoras: Editora[] = await resposta.json();

        // Elementos select nas modais do Acervo
        const selectAdicionar = document.getElementById('editora') as HTMLSelectElement | null;
        const selectEditar = document.getElementById('edit-editora') as HTMLSelectElement | null;

        if (selectAdicionar) {
            preencherSelectEditoras(selectAdicionar, editoras, 'Selecionar');
        }

        if (selectEditar) {
            preencherSelectEditoras(selectEditar, editoras, 'Selecionar');
        }

    } catch (erro) {
        console.error('Erro ao carregar a lista de editoras:', erro);
    }
}

/**
 * Função auxiliar para popular as tags <option> de um <select>
 */
function preencherSelectEditoras(
    selectElement: HTMLSelectElement,
    editoras: Editora[],
    placeholder: string
): void {
    // Limpa opções anteriores mantendo apenas o cabeçalho padrão
    selectElement.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;

    editoras.forEach((editora) => {
        const option = document.createElement('option');
        option.value = String(editora.id);
        option.textContent = editora.nome;
        selectElement.appendChild(option);
    });
}

// Executa o carregamento assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    carregarEditoras();
});