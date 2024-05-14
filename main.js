require('dotenv').config();

const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('node:path');
const db = require('./db');

const User = require('./models/user');

let mainWindow, dbInstance;
const ENV = process.env.ENV;

//API
ipcMain.on('auth-req', User.authenticate);
ipcMain.on('user-create-req', User.create);
ipcMain.on('user-getall-req', User.getAll);
ipcMain.on('user-delete-req', User.delete);

ipcMain.on('message', (_, options) =>
	dialog.showMessageBoxSync(mainWindow, { ...options, buttons: ['OK'] })
);

//App
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
		title: 'Erro',
		message: err.message,
	};
	dialog.showMessageBoxSync(messageBoxOptions);
});

//Window
const setWindowProd = () => {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 675,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});
	mainWindow.loadFile(path.join(__dirname, 'views/login/index.html'));
};

const setWindowDev = () => {
	const displays = screen.getAllDisplays();
	const externalDisplay = displays.find((display) => {
		return display.bounds.x !== 0 || display.bounds.y !== 0;
	});

	if (externalDisplay) {
		mainWindow = new BrowserWindow({
			x: externalDisplay.bounds.x + 50,
			y: externalDisplay.bounds.y + 50,
			width: 1200,
			height: 675,
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
			},
		});
	} else {
		setWindowProd();
	}

	mainWindow.webContents.openDevTools();
	mainWindow.loadFile(path.join(__dirname, 'views/admCadastrado/index.html'));
};

const createWindow = () => {
	ENV === 'DEV' ? setWindowDev() : setWindowProd();

	mainWindow.removeMenu();
};
