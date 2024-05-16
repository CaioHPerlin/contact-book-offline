require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const connect = async () => {
	return open({
		filename: 'sqlite.db',
		driver: sqlite3.Database,
	});
};

const close = async (db) => {
	try {
		await db.close();
	} catch (err) {
		console.error('Error when closing database:', err.message);
	}
};

const setup = async (db) => {
	try {
		// Setup User
		await db.exec(
			`CREATE TABLE IF NOT EXISTS user (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL UNIQUE,
					password TEXT NOT NULL
				)`
		);

		const query = `INSERT OR IGNORE INTO user (id, name, password) VALUES (1, ?, ?)`;
		await db.run(query, [
			process.env.ADMIN_USERNAME,
			process.env.ADMIN_PASSWORD,
		]);

		//Setup Organization
		await db.exec(
			`CREATE TABLE IF NOT EXISTS organization (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL
				)`
		);

		//Setup Contact
		await db.exec(
			`CREATE TABLE IF NOT EXISTS contact (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL,
					pronoun TEXT NOT NULL,
					role TEXT NOT NULL,
					phone TEXT NOT NULL,
					email TEXT NOT NULL UNIQUE,
					organizationId INTEGER REFERENCES organization(id),
					isRepresenting BOOLEAN NOT NULL,
					representedName TEXT,
					representedRole TEXT
				)`
		);

		//Setup Event
		await db.exec(
			`CREATE TABLE IF NOT EXISTS event (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL,
					date DATE NOT NULL
				)`
		);

		//Setup Event Contact (many-to-many)
		await db.exec(
			`CREATE TABLE IF NOT EXISTS eventContact (
					eventId INTEGER NOT NULL REFERENCES event(id),
					contactId INTEGER NOT NULL REFERENCES contact(id)
				)`
		);
	} catch (err) {
		console.error('Error setting up database:', err);
	}
};

module.exports = {
	connect,
	close,
	setup,
};
