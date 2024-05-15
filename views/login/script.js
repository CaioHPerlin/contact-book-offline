const form = document.querySelector('#form-login');

form.addEventListener('submit', (ev) => {
	ev.preventDefault();

	const user = {
		name: form.name.value,
		password: form.password.value,
	};

	api.send('auth-req', user);
});

api.on('auth-res', (_, { success, message }) => {
	if (!success) {
		return api.error(message);
	}

	window.location.href = '../dashboardAdm/index.html';
});
