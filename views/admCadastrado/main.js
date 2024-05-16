document.querySelector('.hamburger').addEventListener('click', function () {
	var list = document.querySelector('.list');
	if (list.classList.contains('hidden')) {
		list.classList.remove('hidden');
		list.classList.add('show');
	} else {
		list.classList.remove('show');
		list.classList.add('hidden');
	}
});

api.send('user-getall-req'); //Load users on DOM load
const container = document.querySelector('#user-list');
const searchBox = document.getElementsByTagName('input')[0];
const searchButton = document.querySelector('#botao-pesquisar');

searchButton.addEventListener('click', () =>
	api.send('user-getall-req', searchBox.value)
);

api.on('user-getall-res', (_, { success, data, message }) => {
	if (!success) {
		return api.error(message);
	}

	if (!Array.isArray(data) || data.length === 0) {
		return (container.innerHTML =
			'<center class="p-3">0 resultados encontrados.</center>');
	}

	container.innerHTML = `<li class="list-group-item d-flex align-items-center">
									<strong class="col">Login</strong>
									<strong class="col text-center">Senha</strong>
									<strong class="col"></strong>
								</li>`;
	data.map((user) => {
		const userElement = `<li id="${user.id}" class="list-group-item d-flex align-items-center">
									<span class="col">${user.name}</span>
									<span class="col text-center">${user.password}</span>
									<div class="col text-end">
										<button data-id="${user.id}" class="delete-btn btn btn-danger">Excluir Administrador</button>
									</div>
								</li>`;
		container.innerHTML += userElement;
	});

	[...document.getElementsByClassName('delete-btn')].map((btn) => {
		btn.addEventListener('click', () => {
			api.send('user-delete-req', btn.dataset.id);
		});
	});
});

api.on('user-delete-res', (_, { success, message, id }) => {
	if (!success) {
		return api.error(message);
	}

	// api.send('user-getall-req', searchBox.value);
	fadeDelete(document.getElementById(id), 500);
});

function fadeDelete(el, speed) {
	const seconds = speed / 1000;
	el.style.transition = 'opacity ' + seconds + 's ease';

	el.style.opacity = 0;
	setTimeout(() => {
		el.parentNode.removeChild(el);
	}, speed);
}
