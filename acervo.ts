// ==========================================
// 1. LÓGICA DO MODAL (ADICIONAR MATERIAL)
// ==========================================
function inicializarModalAdicionar(): void {
    const modalAdicionar = document.getElementById('modal-adicionar');
    const btnFlutuante = document.getElementById('btn-flutuante-adicionar');
    const btnCancelarDesktop = document.getElementById('btn-cancelar-modal');
    const btnCancelarMobile = document.querySelector('.id-btn-cancelar-add-mobile');

    if (btnFlutuante && modalAdicionar) {
        btnFlutuante.addEventListener('click', (evento: Event) => {
            evento.stopPropagation();
            evento.preventDefault();
            modalAdicionar.classList.remove('hidden');
        });
    }

    const fecharModal = (evento: Event) => {
        evento.preventDefault();
        modalAdicionar?.classList.add('hidden');
    };

    if (btnCancelarDesktop) btnCancelarDesktop.addEventListener('click', fecharModal);
    if (btnCancelarMobile) btnCancelarMobile.addEventListener('click', fecharModal);

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
    const btnFecharVerMais = document.getElementById('btn-fechar-ver-mais');
    const btnAbrirEditar = document.getElementById('btn-abrir-editar');
    const btnCancelarEditarDesktop = document.getElementById('btn-cancelar-modal-editar');
    const btnCancelarEditarMobile = document.querySelector('.id-btn-cancelar-edit-mobile');
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

    if (btnFecharVerMais && modalVerMais) {
        btnFecharVerMais.addEventListener('click', () => {
            modalVerMais.classList.add('hidden');
        });
    }

    if (btnAbrirEditar && modalVerMais && modalEditar) {
        btnAbrirEditar.addEventListener('click', () => {
            modalVerMais.classList.add('hidden');
            modalEditar.classList.remove('hidden');
        });
    }

    const fecharModalEditar = (evento: Event) => {
        evento.preventDefault();
        modalEditar?.classList.add('hidden');
    };

    if (btnCancelarEditarDesktop) btnCancelarEditarDesktop.addEventListener('click', fecharModalEditar);
    if (btnCancelarEditarMobile) btnCancelarEditarMobile.addEventListener('click', fecharModalEditar);

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
    const btnAbrirFiltro = document.getElementById('btn-abrir-filtro-mobile');
    const modalFiltro = document.getElementById('modal-filtro-mobile');
    const btnAplicarFiltro = document.getElementById('btn-aplicar-filtro-mobile');

    if (btnAbrirFiltro && modalFiltro) {
        btnAbrirFiltro.addEventListener('click', (evento: Event) => {
            evento.preventDefault();
            modalFiltro.classList.remove('hidden');
        });
    }

    if (btnAplicarFiltro && modalFiltro) {
        btnAplicarFiltro.addEventListener('click', (evento: Event) => {
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
    const btn = document.getElementById('btn-flutuante-adicionar');
    const cards = document.querySelectorAll('.grid-catalogo .card-catalogo');

    if (!btn || cards.length < 5) return;

    const cardMobile = cards[1];
    const cardDesktop = cards[4];

    if (window.innerWidth <= 768) {
        if (btn.parentElement !== cardMobile) {
            cardMobile.appendChild(btn);
        }
    } else {
        if (btn.parentElement !== cardDesktop) {
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