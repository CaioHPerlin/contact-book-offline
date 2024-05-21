require('dotenv').config();

const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const path = require('node:path');
const db = require('./db');

const User = require('./models/user');
const Contact = require('./models/contact');
const Organization = require('./models/organization');

let mainWindow, dbInstance;
const ENV = process.env.ENV;

//API
ipcMain.on('auth-req', User.authenticate);
ipcMain.on('user-create-req', User.create);
ipcMain.on('user-getall-req', User.getAll);
ipcMain.on('user-delete-req', User.delete);

ipcMain.on('contact-create-req', Contact.create);
ipcMain.on('contact-getall-req', Contact.getAll);
ipcMain.on('contact-delete-req', (event, id) => {
	const response = dialog.showMessageBoxSync(mainWindow, {
		type: 'question',
		buttons: ['Sim', 'Não'],
		defaultId: 1,
		title: 'Confirmar exclusão',
		message: 'Tem certeza de que deseja deletar este contato?',
	});

	if (response === 0) {
		Contact.delete(event, id);
	}
});

ipcMain.on('organization-create-req', Organization.create);
ipcMain.on('organization-getall-req', Organization.getAll);
ipcMain.on('organization-delete-req', Organization.delete);

ipcMain.on('message', (_, options) =>
	dialog.showMessageBoxSync(mainWindow, { ...options, buttons: ['OK'] })
);

//App
app.on('ready', async () => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	dbInstance = await db.connect();
	await db.setup(dbInstance);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', async () => await db.close(dbInstance));

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
		width: 1120,
		height: 630,
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
			x: externalDisplay.bounds.x + 150,
			y: externalDisplay.bounds.y + 100,
			width: 1120,
			height: 630,
			webPreferences: {
				preload: path.join(__dirname, 'preload.js'),
			},
		});
	} else {
		setWindowProd();
	}

	// mainWindow.webContents.openDevTools();
	mainWindow.loadFile(
		path.join(__dirname, 'views/contatoCadastrado/index.html')
	);
};

const createWindow = () => {
	ENV === 'DEV' ? setWindowDev() : setWindowProd();

	mainWindow.removeMenu();
};
