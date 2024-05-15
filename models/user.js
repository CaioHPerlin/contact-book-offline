const db = require('../db');

class User {
	static async authenticate(event, { name, password }) {
		const dbInstance = await db.connect();
		try {
			const query = `SELECT name, password FROM user WHERE name = ?`;

			const row = await dbInstance.get(query, [name]);
			if (!row || row.password != password) {
				return event.sender.send('auth-res', {
					success: false,
					message: 'Login ou senha inválidos',
				});
			}

			event.sender.send('auth-res', { success: true });
		} catch (err) {
			console.error('Error during authentication:', err);
			event.sender.send('auth-res', {
				success: false,
				message:
					'Erro interno no banco de dados, por favor, reinicie a aplicação',
			});
		} finally {
			await db.close(dbInstance);
		}
	}

	static async create(event, { name, password }) {
		const dbInstance = await db.connect();
		try {
			const query = `INSERT INTO user (name, password) VALUES (?, ?)`;

			await dbInstance.run(query, [name, password]);
			event.sender.send('user-create-res', {
				success: true,
				message: `Usuário ${name} cadastrado com sucesso!`,
			});
		} catch (err) {
			console.error('Error when creating user:', err);
			event.sender.send('user-create-res', {
				success: false,
				message: `Já existe um usuário administrador chamado ${name}, por favor, escolha um nome diferente`,
			});
		} finally {
			await db.close(dbInstance);
		}
	}

	static async getAll(event, name) {
		const dbInstance = await db.connect();
		try {
			let query, params;
			if (name) {
				query = 'SELECT * FROM user WHERE name LIKE ?';
				params = [`%${name}%`];
			} else {
				query = 'SELECT * FROM user';
				params = [];
			}

			const rows = await dbInstance.all(query, params);
			event.sender.send('user-getall-res', { success: true, data: rows });
		} catch (err) {
			console.error('Error when getting all users:', err);
			event.sender.send('user-getall-res', {
				success: false,
				message:
					'Erro ao acessar o banco de dados. Por favor, reinicie a aplicação',
			});
		} finally {
			await db.close(dbInstance);
		}
	}

	static async delete(event, id) {
		const dbInstance = await db.connect();
		try {
			const query = `DELETE FROM user WHERE id = ?`;

			await dbInstance.run(query, [id]);
			event.sender.send('user-delete-res', {
				success: true,
				id: id,
			});
		} catch (err) {
			console.error('Error when deleting user:', err);
			event.sender.send('user-delete-res', {
				success: false,
				message:
					'Erro ao remover usuário do banco de dados, por favor, tente pesquisar por usuários novamente',
				id: id,
			});
		} finally {
			await db.close(dbInstance);
		}
	}
}

module.exports = User;
