"use strict";
(() => {
    function preCarregarImagem(src) {
        if (!src)
            return;
        const imgPreload = new Image();
        imgPreload.src = src;
    }
    function configurarCardsAnimados() {
        const imagensClicaveis = document.querySelectorAll('.imagem-valor-clicavel, .imagem-equipe-clicavel');
        imagensClicaveis.forEach((img) => {
            const srcNormal = img.getAttribute('data-img-normal');
            const srcAnimada = img.getAttribute('data-img-animada');
            preCarregarImagem(srcAnimada);
            img.addEventListener('click', () => {
                if (img.classList.contains('trocando'))
                    return;
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
    function configurarArrasteObjetivos() {
        const containerObjetivos = document.getElementById('secao-objetivos');
        if (!containerObjetivos)
            return;
        let estaArrastando = false;
        let inicioX = 0;
        let scrollInicial = 0;
        containerObjetivos.addEventListener('mousedown', (e) => {
            if (e.button !== 0)
                return;
            estaArrastando = true;
            containerObjetivos.classList.add('arrastando');
            inicioX = e.pageX - containerObjetivos.offsetLeft;
            scrollInicial = containerObjetivos.scrollLeft;
        });
        containerObjetivos.addEventListener('mousemove', (e) => {
            if (!estaArrastando)
                return;
            e.preventDefault();
            const x = e.pageX - containerObjetivos.offsetLeft;
            const deslocamento = (x - inicioX) * 1.2;
            containerObjetivos.scrollLeft = scrollInicial - deslocamento;
        });
        const finalizarArraste = () => {
            estaArrastando = false;
            containerObjetivos.classList.remove('arrastando');
        };
        containerObjetivos.addEventListener('mouseup', finalizarArraste);
        containerObjetivos.addEventListener('mouseleave', finalizarArraste);
    }
    function inicializarSobreNos() {
        configurarCardsAnimados();
        configurarArrasteObjetivos();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarSobreNos);
    }
    else {
        inicializarSobreNos();
    }
})();
