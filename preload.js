const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
	send: (channel, data) => ipcRenderer.send(channel, data),
	on: (channel, data) => ipcRenderer.on(channel, data),
	message: (options) => ipcRenderer.send('message', options),
	success: (message) => {
		ipcRenderer.send('message', {
			type: 'info',
			title: 'Sucesso',
			message: message,
		});
	},
	error: (message) => {
		ipcRenderer.send('message', {
			type: 'error',
			title: 'Ocorreu um erro',
			message: message,
		});
	},
});
