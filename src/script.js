const inputUsuario = document.getElementById("usuario");
const botaoAdd = document.getElementById("botaoCartao");
const espacoCartao = document.getElementById("espacoCartoes");

botaoAdd.addEventListener("click", () => {
    if (inputUsuario.value === '') {
        alert("Usuário inválido");
    } else {
        adicionaCartao();
        inputUsuario.value = '';
    }
});

inputUsuario.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        adicionaCartao();
        inputUsuario.value = '';
    }
});

function adicionaCartao() {
    const novoCard = document.createElement("div");
    let user = inputUsuario.value;
    let url = `https://api.github.com/users/${user}`;

    fetch(url)
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Usuário inexistente");
            }
            return resposta.json();
        })
        .then((dados) => {
            let fotoPerfil = dados.avatar_url;

            novoCard.innerHTML = `
                <div class="border-solid border-2 border-black h-96 w-80 flex flex-col m-4 rounded-md relative">
                    <img id="imgFundo" src="/src/black.png" class="h-28 w-full self-center rounded-t-md">
                    <img id="imgPerfil" src="${fotoPerfil}" class="rounded-full w-20 h-30 border-4 border-black self-center absolute top-20">
                    <br>
                    <br>
                    <p class="self-center" id="nomeUsuario">${dados.name || dados.login}</p>
                    <p class="self-center text-gray" id="IDlogin">@${dados.login}</p>
                    <p class="text-xs font-semibold px-4 py-2">REPOSITÓRIOS</p>
                    <div id="divRepositorios" class="w-auto h-54 flex flex-col items-center gap-3 overflow-auto"></div>
                </div>
            `;
            espacoCartao.appendChild(novoCard);

            const caixaRepositorios = novoCard.querySelector("#divRepositorios");
            carregaRespositorio(user, caixaRepositorios);
        })
        .catch((erro) => {
            alert("Usuário não encontrado, digite um usuário existente", erro);
        });
}

function carregaRespositorio(user, caixaRepositorios) {
    let repositoryUrl = `https://api.github.com/users/${user}/repos`;

    fetch(repositoryUrl)
        .then((resposta) => resposta.json())
        .then((dadosRepositorio) => {
            dadosRepositorio.forEach((repo) => {
                const cartao = document.createElement("div");

                cartao.innerHTML = `
                    <div class="w-72 h-28 bg-gray-200 rounded-md border-2 border-neutral-300 p-2">
                        <h6 class="font-bold text-sm">${repo.name}</h6>
                        <p class="text-sm text-gray-600">${repo.description || 'Sem descrição'}</p>
                        <span class="bg-neutral-400 text-xs font-bold w-auto px-1 rounded">${repo.language || 'Sem linguagem'}</span>
                    </div>
                `;

                caixaRepositorios.appendChild(cartao);
            });
        })
        .catch((erro) => console.log(erro));
}
