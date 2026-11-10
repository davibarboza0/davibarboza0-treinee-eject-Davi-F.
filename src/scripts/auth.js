"use strict";
(() => {
    const ENDERECO_BASE_DA_API = 'https://thekaapitrainee1.pythonanywhere.com';
    document.addEventListener('DOMContentLoaded', () => {
        configurarBotoesOlho();
        configurarFormularioLogin();
        configurarFormularioCadastro();
        configurarFormularioRecuperarSenha();
        configurarFormularioRedefinirSenha();
    });
    function mostrarMensagem(form, texto, eSucesso = false) {
        let caixaMensagem = form.querySelector('.caixa-feedback');
        if (!caixaMensagem) {
            caixaMensagem = document.createElement('div');
            caixaMensagem.className = 'caixa-feedback';
            form.prepend(caixaMensagem);
        }
        caixaMensagem.textContent = texto;
        caixaMensagem.className = `caixa-feedback ${eSucesso ? 'sucesso' : 'erro'}`;
        caixaMensagem.style.display = 'block';
    }
    function limparMensagem(form) {
        const caixaMensagem = form.querySelector('.caixa-feedback');
        if (caixaMensagem) {
            caixaMensagem.style.display = 'none';
            caixaMensagem.textContent = '';
        }
    }
    function configurarBotoesOlho() {
        const botoesOlho = document.querySelectorAll('.btn-olho');
        botoesOlho.forEach((botao) => {
            botao.addEventListener('click', () => {
                const container = botao.closest('.input-container');
                const input = container === null || container === void 0 ? void 0 : container.querySelector('input');
                if (input) {
                    const tipoAtual = input.getAttribute('type');
                    input.setAttribute('type', tipoAtual === 'password' ? 'text' : 'password');
                }
            });
        });
    }
    function configurarFormularioLogin() {
        const form = document.getElementById('form-login');
        if (!form)
            return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            limparMensagem(form);
            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const email = (emailInput === null || emailInput === void 0 ? void 0 : emailInput.value.trim()) || '';
            const senha = (senhaInput === null || senhaInput === void 0 ? void 0 : senhaInput.value) || '';
            if (!email || !senha) {
                mostrarMensagem(form, 'Por favor, preencha o e-mail e a senha.');
                return;
            }
            try {
                const resposta = await fetch(`${ENDERECO_BASE_DA_API}/auth/token/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: senha })
                });
                if (resposta.ok) {
                    const dados = await resposta.json();
                    localStorage.setItem('access_token', dados.access);
                    localStorage.setItem('refresh_token', dados.refresh);
                    mostrarMensagem(form, 'Login efetuado! Entrando no acervo...', true);
                    setTimeout(() => {
                        window.location.replace('./src/pages/acervo.html');
                    }, 600);
                }
                else {
                    mostrarMensagem(form, 'E-mail ou senha incorretos.');
                }
            }
            catch (erro) {
                console.error('Erro ao realizar login:', erro);
                mostrarMensagem(form, 'Servidor inacessível no momento.');
            }
        });
    }
    function configurarFormularioCadastro() {
        const form = document.getElementById('form-cadastro');
        if (!form)
            return;
        const inputSenha = document.getElementById('senha');
        const inputConfirmar = document.getElementById('confirmar-senha');
        const checarSenhas = () => {
            if (inputConfirmar && inputSenha && inputConfirmar.value.length > 0) {
                if (inputSenha.value !== inputConfirmar.value) {
                    inputConfirmar.classList.add('input-invalido');
                }
                else {
                    inputConfirmar.classList.remove('input-invalido');
                }
            }
        };
        inputSenha === null || inputSenha === void 0 ? void 0 : inputSenha.addEventListener('input', checarSenhas);
        inputConfirmar === null || inputConfirmar === void 0 ? void 0 : inputConfirmar.addEventListener('input', checarSenhas);
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            limparMensagem(form);
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = (inputSenha === null || inputSenha === void 0 ? void 0 : inputSenha.value) || '';
            const confirmarSenha = (inputConfirmar === null || inputConfirmar === void 0 ? void 0 : inputConfirmar.value) || '';
            if (senha !== confirmarSenha) {
                inputConfirmar === null || inputConfirmar === void 0 ? void 0 : inputConfirmar.classList.add('input-invalido');
                mostrarMensagem(form, 'As senhas não coincidem!');
                return;
            }
            const partesNome = nome.split(' ');
            const firstName = partesNome[0] || '';
            const lastName = partesNome.slice(1).join(' ') || '';
            try {
                const resposta = await fetch(`${ENDERECO_BASE_DA_API}/users/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: email,
                        email: email,
                        password: senha,
                        password_confirm: confirmarSenha,
                        first_name: firstName,
                        last_name: lastName
                    })
                });
                if (resposta.ok || resposta.status === 201) {
                    mostrarMensagem(form, 'Cadastro realizado com sucesso! Redirecionando para o login...', true);
                    setTimeout(() => {
                        window.location.replace('../../index.html');
                    }, 1200);
                }
                else {
                    const erroDados = await resposta.json().catch(() => ({}));
                    const mensagensErro = Object.entries(erroDados)
                        .map(([campo, msgs]) => {
                        const textoMsgs = Array.isArray(msgs) ? msgs.join(', ') : msgs;
                        if (campo === 'username' || campo === 'email')
                            return 'Este e-mail já está em uso.';
                        if (campo === 'password')
                            return `Senha: ${textoMsgs}`;
                        return `${campo}: ${textoMsgs}`;
                    })
                        .join(' | ');
                    mostrarMensagem(form, mensagensErro || 'Erro ao realizar o cadastro. Verifique os dados.');
                }
            }
            catch (erro) {
                console.error('Erro ao cadastrar:', erro);
                mostrarMensagem(form, 'Servidor inacessível no momento.');
            }
        });
    }
    function configurarFormularioRecuperarSenha() {
        const form = document.getElementById('form-recuperar');
        if (!form)
            return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            limparMensagem(form);
            const email = document.getElementById('email').value.trim();
            if (!email) {
                mostrarMensagem(form, 'Por favor, digite o seu e-mail.');
                return;
            }
            try {
                const resposta = await fetch(`${ENDERECO_BASE_DA_API}/users/?search=${encodeURIComponent(email)}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });
                if (resposta.ok) {
                    const dados = await resposta.json();
                    const listaUsuarios = Array.isArray(dados) ? dados : (dados.results || []);
                    const usuarioEncontrado = listaUsuarios.find((u) => (u.email && u.email.toLowerCase() === email.toLowerCase()) ||
                        (u.username && u.username.toLowerCase() === email.toLowerCase()));
                    if (usuarioEncontrado) {
                        mostrarMensagem(form, 'E-mail encontrado! Redirecionando para redefinição...', true);
                        setTimeout(() => {
                            window.location.replace(`./redefinir-senha.html?id=${usuarioEncontrado.id}&email=${encodeURIComponent(email)}`);
                        }, 800);
                    }
                    else {
                        mostrarMensagem(form, 'E-mail não encontrado no sistema.');
                    }
                }
                else {
                    mostrarMensagem(form, 'Não foi possível verificar o e-mail no sistema.');
                }
            }
            catch (erro) {
                console.error('Erro na recuperação:', erro);
                mostrarMensagem(form, 'Servidor inacessível no momento.');
            }
        });
    }
    function configurarFormularioRedefinirSenha() {
        const form = document.getElementById('form-redefinir');
        if (!form)
            return;
        const urlParams = new URLSearchParams(window.location.search);
        const uid = urlParams.get('uid') || '';
        const token = urlParams.get('token') || '';
        const userId = urlParams.get('id') || '';
        const userEmail = urlParams.get('email') || '';
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            limparMensagem(form);
            const novaSenha = document.getElementById('nova-senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;
            if (novaSenha !== confirmarSenha) {
                mostrarMensagem(form, 'As senhas não coincidem!');
                return;
            }
            if (novaSenha.length < 6) {
                mostrarMensagem(form, 'A nova senha deve ter pelo menos 6 caracteres.');
                return;
            }
            try {
                let resposta;
                if (userId) {
                    resposta = await fetch(`${ENDERECO_BASE_DA_API}/users/${userId}/`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: userEmail,
                            email: userEmail,
                            password: novaSenha,
                            password_confirm: confirmarSenha,
                            first_name: '',
                            last_name: ''
                        })
                    });
                }
                else {
                    resposta = await fetch(`${ENDERECO_BASE_DA_API}/auth/password/reset/confirm/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            uid: uid,
                            token: token,
                            new_password: novaSenha,
                            new_password_confirm: confirmarSenha
                        })
                    });
                }
                if (resposta.ok || resposta.status === 200) {
                    mostrarMensagem(form, 'Senha alterada com sucesso! Redirecionando para o login...', true);
                    setTimeout(() => {
                        window.location.replace('../../index.html');
                    }, 1200);
                }
                else {
                    mostrarMensagem(form, 'Não foi possível redefinir a senha. Tente novamente.');
                }
            }
            catch (erro) {
                console.error('Erro na redefinição:', erro);
                mostrarMensagem(form, 'Servidor inacessível no momento.');
            }
        });
    }
})();
