const db = require('../db');

class User {
	static async authenticate(event, { name, password }) {
		const dbInstance = db.connect();
		try {
			const query = `SELECT name, password FROM user WHERE name = ?`;
			dbInstance.get(query, [name], (err, row) => {
				if (err) {
					console.error('Error during database query:', err);
					throw new Error(
						'Erro durante busca no banco de dados, por favor, reinicie a aplicação'
					);
				}
				if (!row || row.password != password) {
					console.error('User does not exist');
					throw new Error('Login ou senha inválidos');
				}
				event.sender.send('auth-res', { success: true });
			});
		} catch (err) {
			console.error('Error during authentication:', err);
			event.sender.send('auth-res', { success: false });
		} finally {
			db.close(dbInstance);
		}
	}
}

module.exports = User;
