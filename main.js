const { app, dialog, BrowserWindow, ipcMain } = require('electron');
const database = require('./db');
const User = require('./models/user');

let db;

const createWindow = () => {
	let win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	win.removeMenu();

	win.loadFile('views/login/index.html');

	win.on('closed', () => (win = null));
};

app.on('ready', () => {
	db = database.connect();
	database.setup(db);

	createWindow();
});

app.on('before-quit', () => database.close(db));

ipcMain.on(
	'auth-request',
	async (event, user) => await User.authenticate(event, user)
);

process.on('uncaughtException', (err) => dialog.showErrorBox(err.message, ''));
