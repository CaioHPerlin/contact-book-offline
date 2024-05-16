const db = require('../db');

// id, name, password
class Organization {
	static async create(event, name) {
		const dbInstance = await db.connect();
		try {
			const query = `INSERT INTO organization (name) VALUES (?)`;

			await dbInstance.run(query, [name]);
			event.sender.send('organization-create-res', {
				success: true,
				message: `Organização ${name} cadastrada com sucesso!`,
			});
		} catch (err) {
			console.error('Error when creating organization:', err);
			event.sender.send('organization-create-res', {
				success: false,
				message: `Já existe uma organização chamada ${name}, por favor, escolha um nome diferente.`,
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
				query = 'SELECT * FROM organization WHERE name LIKE ?';
				params = [`%${name}%`];
			} else {
				query = 'SELECT * FROM organization';
				params = [];
			}

			const rows = await dbInstance.all(query, params);
			event.sender.send('organization-getall-res', {
				success: true,
				data: rows,
			});
		} catch (err) {
			console.error('Error when getting all organizations:', err);
			event.sender.send('organization-getall-res', {
				success: false,
				message:
					'Erro ao acessar o banco de dados. Por favor, reinicie a aplicação.',
			});
		} finally {
			await db.close(dbInstance);
		}
	}

	static async delete(event, id) {
		const dbInstance = await db.connect();
		try {
			const query = `DELETE FROM organization WHERE id = ?`;

			await dbInstance.run(query, [id]);
			event.sender.send('organization-delete-res', {
				success: true,
				id: id,
			});
		} catch (err) {
			console.error('Error when deleting organization:', err);
			event.sender.send('organization-delete-res', {
				success: false,
				message:
					'Erro ao remover organização do banco de dados, por favor, tente buscar novamente.',
				id: id,
			});
		} finally {
			await db.close(dbInstance);
		}
	}
}

module.exports = Organization;
