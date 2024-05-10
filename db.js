require('dotenv').config();

const sqlite = require('sqlite3').verbose();

const connect = () => {
	const db = new sqlite.Database('sqlite.db');
	return db;
};

const close = (db) => {
	db.close((err) => {
		if (err) {
			return console.error('Error when closing database:', err.message);
		}
		console.log('Database connection closed');
	});
};

const setup = (db) => {
	try {
		db.serialize(() => {
			// Setup User
			db.run(
				`CREATE TABLE IF NOT EXISTS user (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL,
					password TEXT NOT NULL
				)`
			);

			const stmt = db.prepare(
				`INSERT OR IGNORE INTO user (id, name, password) VALUES (1, ?, ?)`
			);
			stmt.run(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
			stmt.finalize();

			//Setup Organization
			db.run(
				`CREATE TABLE IF NOT EXISTS organization (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL
				)`
			);

			//Setup Contact
			db.run(
				`CREATE TABLE IF NOT EXISTS contact (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL,Z
					role TEXT NOT NULL,
					phone TEXT NOT NULL,
					email TEXT NOT NULL,
					organizationId INTEGER REFERENCES organization(id)
				)`
			);

			//Setup Event
			db.run(
				`CREATE TABLE IF NOT EXISTS event (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					name TEXT NOT NULL,
					date DATE NOT NULL
				)`
			);

			//Setup Event Contact (many-to-many)
			db.run(
				`CREATE TABLE IF NOT EXISTS eventContact (
					eventId INTEGER NOT NULL REFERENCES event(id),
					contactId INTEGER NOT NULL REFERENCES contact(id)
				)`
			);
		});
	} catch (err) {
		console.error('Error setting up database:', err);
	}
};

module.exports = {
	connect,
	close,
	setup,
};
