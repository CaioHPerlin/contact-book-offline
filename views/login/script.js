const { ipcRenderer, dialog } = require('electron');

const authForm = document.getElementById('form-login');
authForm.addEventListener('submit', (ev) => {
	ev.preventDefault();
	const user = {
		username: authForm.username.value,
		password: authForm.password.value,
	};

	ipcRenderer.send('auth-request', user);
});

ipcRenderer.on('auth-response', (event, { success, message }) => {
	if (!success) {
		dialog.showErrorBox('Ocorreu um erro', message);
	}

	window.location.href = '../dashboardAdm/index.html';
});
