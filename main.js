const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const db = require('./db');

const User = require('./models/user');

//API
ipcMain.on('auth-req', User.authenticate);

//App
let mainWindow, dbInstance;

app.on('ready', () => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	dbInstance = db.connect();
	db.setup(dbInstance);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => db.close(dbInstance));

process.on('uncaughtException', (err) => {
	const messageBoxOptions = {
		type: 'error',
		title: '',
		message: err.message,
	};
	dialog.showMessageBoxSync(messageBoxOptions);
});

//Window
const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 675,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	mainWindow.removeMenu();
	mainWindow.loadFile(path.join(__dirname, 'views/login/index.html'));
};
