const form = document.querySelector('#form-login');

form.addEventListener('submit', (ev) => {
	ev.preventDefault();

	const user = {
		name: form.name.value,
		password: form.password.value,
	};

	api.send('auth-req', user);

	api.on('auth-res', (_, { success }) => {
		success ? (window.location.href = '../dashboardAdm/index.html') : '';
	});
});
