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

	static async getAll(event, name) {
		const dbInstance = db.connect();
		try {
			if (!name) {
				const query = `SELECT * FROM user`;
				await dbInstance.all(query, [], (err, rows) => {
					if (err) {
						console.error(err);
						throw new Error(
							'Erro ao buscar no banco da dados. Por favor, tente novamente.'
						);
					}
					event.sender.send('user-getall-res', {
						success: true,
						data: rows,
					});
				});
			} else {
				const query = `SELECT * FROM user WHERE name LIKE ?`;
				await dbInstance.all(query, [`%${name}%`], (err, rows) => {
					if (err) {
						console.error(err);
						throw new Error(
							'Erro ao buscar no banco da dados. Por favor, tente novamente.'
						);
					}
					event.sender.send('user-getall-res', {
						success: true,
						data: rows,
					});
				});
			}
		} catch (err) {
			console.error('Error when getting all users:', err);
			event.sender.send('user-getall-res', { success: false });
		} finally {
			await db.close(dbInstance);
		}
	}

	static async delete(event, id) {
		const dbInstance = db.connect();
		try {
			const query = `DELETE FROM user WHERE id = ?`;
			await dbInstance.run(query, [id], (err) => {
				if (err) {
					console.error('Error when deleting user:', err);
					throw new Error(
						'Erro ao remover usuário do banco de dados, por favor, tente pesquisar por usuários novamente'
					);
				}
				event.sender.send('user-delete-res', { success: true });
			});
		} catch (err) {
			console.error('Error when deleting user:', err);
			event.sender.send('user-delete-res', { success: false });
		} finally {
			await db.close(dbInstance);
		}
	}
}

module.exports = User;
