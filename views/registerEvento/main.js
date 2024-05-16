function adicionarOrgao() {
	// Cria um novo elemento select
	var select = document.createElement('select');
	select.setAttribute('class', 'form-select');
	select.setAttribute('required', '');

	// Adiciona opções ao select
	var opcaoPadrao = new Option('Escolha o órgão', '', false, false);
	var opcaoNenhum = new Option('Nenhum', 'Nenhum', false, false);
	select.options.add(opcaoPadrao);
	select.options.add(opcaoNenhum);

	// Cria um novo div para inserir o select
	var div = document.createElement('div');
	div.setAttribute('class', 'col-md-6 teste');
	div.appendChild(select);

	// Adiciona o div ao container de outros órgãos
	document.getElementById('outrosOrgaos').appendChild(div);
}

// teste de interação
const dadosContatos = [
	{ id: 1, nome: 'João' },
	{ id: 2, nome: 'Maria' },
	{ id: 3, nome: 'Pedro' },
];

function adicionarContato() {
	const nomeInput = document.getElementById('inputAddress').value;

	if (nomeInput.trim() === '') {
		alert('Por favor, insira um nome de contato válido.');
		return;
	}

	const contatoEncontrado = dadosContatos.find(
		(contato) => contato.nome === nomeInput
	);

	let containerContatos = document.getElementById('containerContatos');

	if (!containerContatos) {
		// Cria o contêiner se ele não existir
		containerContatos = document.createElement('div');
		containerContatos.id = 'containerContatos';
		document.body.appendChild(containerContatos);
	}

	if (contatoEncontrado) {
		alert('contato adicionado com sucesso');
	} else {
		alert('Contato não encontrado.');
	}
}
document.querySelector('.hamburger').addEventListener('click', function() {
    var list = document.querySelector('.list');
    if (list.classList.contains('hidden')) {
        list.classList.remove('hidden');
        list.classList.add('show');
    } else {
        list.classList.remove('show');
        list.classList.add('hidden');
    }
});

