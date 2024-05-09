const database = require('../db');

class User {
	static async authenticate(event, { username, password }) {
		const db = database.connect();
		try {
			const query = `SELECT name, password FROM user WHERE name = ?`;

			db.get(query, [username], (err, row) => {
				if (err)
					throw new Error('Erro no banco de dados:', err.message);

				if (!row || row.password !== password) {
					throw new Error('Usuário ou senha inválidos.');
				}

				event.sender.send('auth-response', {
					success: true,
					message: 'Authentication succesfull',
					user: row,
				});
			});
		} catch (err) {
			event.sender.send('auth-response', {
				success: false,
				message: err.message,
			});
		} finally {
			database.close(db);
		}
	}
}

module.exports = User;
