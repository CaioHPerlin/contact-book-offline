const { app, BrowserWindow } = require('electron');
const { connectToDatabase, closeDatabaseConnection } = require('./db');

const createWindow = () => {
	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	win.removeMenu();

	win.loadFile('views/login/index.html');

	win.on('closed', () => (win = null));
};

app.on('ready', () => {
	createWindow();

	db = connectToDatabase();
});

app.on('before-quit', closeDatabaseConnection);
