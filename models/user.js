const db = require('../db');

class User {
	static async authenticate(event, { name, password }) {
		const dbInstance = db.connect();
		try {
			const query = `SELECT name, password FROM user WHERE name = ?`;
			await dbInstance.get(query, [name], (err, row) => {
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
			await db.close(dbInstance);
		}
	}

	static async create(event, { name, password }) {
		const dbInstance = db.connect();
		try {
			const query = `INSERT INTO user (name, password) VALUES (?, ?)`;
			await dbInstance.run(query, [name, password], (err) => {
				if (err) {
					console.error('User already exists:', err);
					throw new Error(
						'Já existe um usuário administrador com esse nome, por favor, escolha um nome diferente'
					);
				}
				event.sender.send('user-create-res', {
					success: true,
					user: { name, password },
				});
			});
		} catch (err) {
			console.error('Error when creating user:', err);
			event.sender.send('user-create-res', { success: false });
		} finally {
			await db.close(dbInstance);
		}
	}
}

module.exports = User;
