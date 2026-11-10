(() => {
    const ENDERECO_BASE_DA_API: string = 'https://thekaapitrainee1.pythonanywhere.com';

    document.addEventListener('DOMContentLoaded', () => {
        configurarBotoesOlho();
        configurarFormularioLogin();
        configurarFormularioCadastro();
        configurarFormularioRecuperarSenha();
        configurarFormularioRedefinirSenha();
    });

    /**
     * Exibe caixa de aviso (erro ou sucesso) no topo do formulário
     */
    function mostrarMensagem(form: HTMLFormElement, texto: string, eSucesso: boolean = false): void {
        let caixaMensagem = form.querySelector('.caixa-feedback') as HTMLElement;
        
        if (!caixaMensagem) {
            caixaMensagem = document.createElement('div');
            caixaMensagem.className = 'caixa-feedback';
            form.prepend(caixaMensagem);
        }

        caixaMensagem.textContent = texto;
        caixaMensagem.className = `caixa-feedback ${eSucesso ? 'sucesso' : 'erro'}`;
        caixaMensagem.style.display = 'block';
    }

    function limparMensagem(form: HTMLFormElement): void {
        const caixaMensagem = form.querySelector('.caixa-feedback') as HTMLElement;
        if (caixaMensagem) {
            caixaMensagem.style.display = 'none';
            caixaMensagem.textContent = '';
        }
    }

    function configurarBotoesOlho(): void {
        const botoesOlho = document.querySelectorAll<HTMLButtonElement>('.btn-olho');
        botoesOlho.forEach((botao) => {
            botao.addEventListener('click', () => {
                const container = botao.closest('.input-container');
                const input = container?.querySelector('input');
                if (input) {
                    const tipoAtual = input.getAttribute('type');
                    input.setAttribute('type', tipoAtual === 'password' ? 'text' : 'password');
                }
            });
        });
    }

    /**
     * 1. Login -> POST /auth/token/
     */
    function configurarFormularioLogin(): void {
        const form = document.getElementById('form-login') as HTMLFormElement | null;
        if (!form) return;

        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            limparMensagem(form);

            const emailInput = document.getElementById('email') as HTMLInputElement | null;
            const senhaInput = document.getElementById('senha') as HTMLInputElement | null;

            const email = emailInput?.value.trim() || '';
            const senha = senhaInput?.value || '';

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
                        window.location.replace('./acervo.html');
                    }, 600);
                } else {
                    mostrarMensagem(form, 'E-mail ou senha incorretos.');
                }
            } catch (erro) {
                console.error('Erro ao realizar login:', erro);
                mostrarMensagem(form, 'Servidor inacessível no momento.');
            }
        });
    }

    /**
     * 2. Cadastro -> POST /users/
     */
    function configurarFormularioCadastro(): void {
        const form = document.getElementById('form-cadastro') as HTMLFormElement | null;
        if (!form) return;

        const inputSenha = document.getElementById('senha') as HTMLInputElement | null;
        const inputConfirmar = document.getElementById('confirmar-senha') as HTMLInputElement | null;

        const checarSenhas = () => {
            if (inputConfirmar && inputSenha && inputConfirmar.value.length > 0) {
                if (inputSenha.value !== inputConfirmar.value) {
                    inputConfirmar.classList.add('input-invalido');
                } else {
                    inputConfirmar.classList.remove('input-invalido');
                }
            }
        };

        inputSenha?.addEventListener('input', checarSenhas);
        inputConfirmar?.addEventListener('input', checarSenhas);

        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            limparMensagem(form);

            const nome = (document.getElementById('nome') as HTMLInputElement).value.trim();
            const email = (document.getElementById('email') as HTMLInputElement).value.trim();
            const senha = inputSenha?.value || '';
            const confirmarSenha = inputConfirmar?.value || '';

            if (senha !== confirmarSenha) {
                inputConfirmar?.classList.add('input-invalido');
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
                        window.location.replace('./index.html');
                    }, 1200);
                } else {
                    const erroDados = await resposta.json().catch(() => ({}));
                    const mensagensErro = Object.entries(erroDados)
                        .map(([campo, msgs]) => {
                            const textoMsgs = Array.isArray(msgs) ? msgs.join(', ') : msgs;
                            if (campo === 'username' || campo === 'email') return 'Este e-mail já está em uso.';
                            if (campo === 'password') return `Senha: ${textoMsgs}`;
                            return `${campo}: ${textoMsgs}`;
                        })
                        .join(' | ');

                    mostrarMensagem(form, mensagensErro || 'Erro ao realizar o cadastro. Verifique os dados.');
                }
            } catch (erro) {
                console.error('Erro ao cadastrar:', erro);
                mostrarMensagem(form, 'Servidor inacessível no momento.');
            }
        });
    }

    /**
     * 3. Recuperar Senha -> Verifica e-mail via GET /users/?search=... e redireciona
     */
    function configurarFormularioRecuperarSenha(): void {
        const form = document.getElementById('form-recuperar') as HTMLFormElement | null;
        if (!form) return;

        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            limparMensagem(form);

            const email = (document.getElementById('email') as HTMLInputElement).value.trim();

            if (!email) {
                mostrarMensagem(form, 'Por favor, digite o seu e-mail.');
                return;
            }

            try {
                // Busca o usuário pelo e-mail na API
                const resposta = await fetch(`${ENDERECO_BASE_DA_API}/users/?search=${encodeURIComponent(email)}`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (resposta.ok) {
                    const dados = await resposta.json();
                    const listaUsuarios = Array.isArray(dados) ? dados : (dados.results || []);

                    // Verifica se há correspondência exata do e-mail
                    const usuarioEncontrado = listaUsuarios.find((u: { email?: string; username?: string; id: number }) => 
                        (u.email && u.email.toLowerCase() === email.toLowerCase()) || 
                        (u.username && u.username.toLowerCase() === email.toLowerCase())
                    );

                    if (usuarioEncontrado) {
                        mostrarMensagem(form, 'E-mail encontrado! Redirecionando para redefinição...', true);
                        setTimeout(() => {
                            window.location.replace(`./redefinir-senha.html?id=${usuarioEncontrado.id}&email=${encodeURIComponent(email)}`);
                        }, 800);
                    } else {
                        mostrarMensagem(form, 'E-mail não encontrado no sistema.');
                    }
                } else {
                    mostrarMensagem(form, 'Não foi possível verificar o e-mail no sistema.');
                }
            } catch (erro) {
                console.error('Erro na recuperação:', erro);
                mostrarMensagem(form, 'Servidor inacessível no momento.');
            }
        });
    }

    /**
     * 4. Redefinir Senha -> Atualiza via PATCH /users/{id}/ ou /auth/password/reset/confirm/
     */
    function configurarFormularioRedefinirSenha(): void {
        const form = document.getElementById('form-redefinir') as HTMLFormElement | null;
        if (!form) return;

        const urlParams = new URLSearchParams(window.location.search);
        const uid = urlParams.get('uid') || '';
        const token = urlParams.get('token') || '';
        const userId = urlParams.get('id') || '';
        const userEmail = urlParams.get('email') || '';

        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();
            limparMensagem(form);

            const novaSenha = (document.getElementById('nova-senha') as HTMLInputElement).value;
            const confirmarSenha = (document.getElementById('confirmar-senha') as HTMLInputElement).value;

            if (novaSenha !== confirmarSenha) {
                mostrarMensagem(form, 'As senhas não coincidem!');
                return;
            }

            if (novaSenha.length < 6) {
                mostrarMensagem(form, 'A nova senha deve ter pelo menos 6 caracteres.');
                return;
            }

            try {
                let resposta: Response;

                // Se houver ID do usuário na URL (veio do redirecionamento direto)
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
                } else {
                    // Fallback para o endpoint padrão de confirmação com token
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
                        window.location.replace('./index.html');
                    }, 1200);
                } else {
                    mostrarMensagem(form, 'Não foi possível redefinir a senha. Tente novamente.');
                }
            } catch (erro) {
                console.error('Erro na redefinição:', erro);
                mostrarMensagem(form, 'Servidor inacessível no momento.');
            }
        });
    }
})();