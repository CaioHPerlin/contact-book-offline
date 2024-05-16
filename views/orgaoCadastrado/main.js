document.querySelectorAll('.button').forEach((button) =>
	button.addEventListener('click', (e) => {
		if (!button.classList.contains('delete')) {
			button.classList.add('delete');

			setTimeout(() => button.classList.remove('delete'), 2200);
		}
		e.preventDefault();
	})
);

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

api.send('organization-getall-req'); //Load organizations on DOM load
const container = document.querySelector('#org-list');
const searchBox = document.getElementsByTagName('input')[0];
const searchButton = document.querySelector('#botao-pesquisar');

searchButton.addEventListener('click', () =>
	api.send('organization-getall-req', searchBox.value)
);

api.on('organization-getall-res', (_, { success, data, message }) => {
	if (!success) {
		return api.error(message);
	}

	if (!Array.isArray(data) || data.length === 0) {
		return (container.innerHTML =
			'<center class="p-3">0 resultados encontrados.</center>');
	}

	container.innerHTML = `<li class="list-group-item d-flex align-items-center">
									<strong class="col">Nome</strong>
									<strong class="col"></strong>
								</li>`;
	data.map((org) => {
		const orgElement = `<li id="${org.id}" class="list-group-item d-flex align-items-center">
									<span class="col">${org.name}</span>
									<div class="col text-end">
										<button data-id="${org.id}" class="delete-btn btn btn-danger">Excluir Órgão</button>
									</div>
								</li>`;
		container.innerHTML += orgElement;
	});

	[...document.getElementsByClassName('delete-btn')].map((btn) => {
		btn.addEventListener('click', () => {
			api.send('organization-delete-req', btn.dataset.id);
		});
	});
});

api.on('organization-delete-res', (_, { success, message, id }) => {
	if (!success) {
		return api.error(message);
	}

	fadeDelete(document.getElementById(id), 500);
});

function fadeDelete(el, speed) {
	const seconds = speed / 1000;
	el.style.transition = 'opacity ' + seconds + 's ease';

	el.style.opacity = 0;
	setTimeout(() => {
		el.parentNode.removeChild(el);

		api.send('organization-getall-req');
	}, speed);
}
