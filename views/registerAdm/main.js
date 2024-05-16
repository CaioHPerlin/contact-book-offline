const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', (ev) => {
	ev.preventDefault();

	const user = {
		name: form.name.value,
		password: form.password.value,
	};

	api.send('user-create-req', user);
});

api.on('user-create-res', (_, { success, message }) => {
	if (!success) {
		return api.error(message);
	}

	api.success(message);
	form.reset();
});

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
