(() => {
    function preCarregarImagem(src: string | null): void {
        if (!src) return;
        const imgPreload = new Image();
        imgPreload.src = src;
    }

    function configurarCardsAnimados(): void {
        const imagensClicaveis = document.querySelectorAll<HTMLImageElement>(
            '.imagem-valor-clicavel, .imagem-equipe-clicavel'
        );

        imagensClicaveis.forEach((img) => {
            const srcNormal = img.getAttribute('data-img-normal');
            const srcAnimada = img.getAttribute('data-img-animada');

            preCarregarImagem(srcAnimada);

            img.addEventListener('click', () => {
                if (img.classList.contains('trocando')) return;

                const estaAtivo = img.classList.contains('ativo');
                const proximoSrc = estaAtivo ? srcNormal : srcAnimada;

                img.classList.add('trocando');

                window.setTimeout(() => {
                    if (proximoSrc) {
                        img.src = proximoSrc;
                    }
                    img.classList.toggle('ativo', !estaAtivo);
                    img.classList.remove('trocando');
                }, 300);
            });
        });
    }

    function configurarArrasteObjetivos(): void {
        const containerObjetivos = document.getElementById('secao-objetivos');
        if (!containerObjetivos) return;

        let estaArrastando = false;
        let inicioX = 0;
        let scrollInicial = 0;

        containerObjetivos.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.button !== 0) return;
            estaArrastando = true;
            containerObjetivos.classList.add('arrastando');
            inicioX = e.pageX - containerObjetivos.offsetLeft;
            scrollInicial = containerObjetivos.scrollLeft;
        });

        containerObjetivos.addEventListener('mousemove', (e: MouseEvent) => {
            if (!estaArrastando) return;
            e.preventDefault();
            const x = e.pageX - containerObjetivos.offsetLeft;
            const deslocamento = (x - inicioX) * 1.2;
            containerObjetivos.scrollLeft = scrollInicial - deslocamento;
        });

        const finalizarArraste = (): void => {
            estaArrastando = false;
            containerObjetivos.classList.remove('arrastando');
        };

        containerObjetivos.addEventListener('mouseup', finalizarArraste);
        containerObjetivos.addEventListener('mouseleave', finalizarArraste);
    }

    function configurarMenuNavMobile(): void {
        const triggerHeader = document.getElementById('header-mobile-trigger');
        const modalNav = document.getElementById('modal-nav-mobile');
        const btnFechar = document.getElementById('btn-fechar-nav-mobile');

        if (!triggerHeader || !modalNav) return;

        const abrirMenu = (): void => {
            modalNav.classList.remove('hidden');
            modalNav.setAttribute('aria-hidden', 'false');
        };

        const fecharMenu = (): void => {
            modalNav.classList.add('hidden');
            modalNav.setAttribute('aria-hidden', 'true');
        };

        triggerHeader.addEventListener('click', (e: Event) => {
            e.preventDefault();
            abrirMenu();
        });

        triggerHeader.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrirMenu();
            }
        });

        btnFechar?.addEventListener('click', fecharMenu);

        modalNav.addEventListener('click', (e: MouseEvent) => {
            if (e.target === modalNav) {
                fecharMenu();
            }
        });

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !modalNav.classList.contains('hidden')) {
                fecharMenu();
            }
        });
    }

    function inicializarSobreNos(): void {
        configurarCardsAnimados();
        configurarArrasteObjetivos();
        configurarMenuNavMobile();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarSobreNos);
    } else {
        inicializarSobreNos();
    }
})();