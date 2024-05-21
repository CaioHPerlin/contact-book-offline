const db = require('../db');

// id, name, pronoun, role, phone, email, organizationId, isRepresenting, representedName, representedRole
class Contact {
	static async create(event, contact) {
		const dbInstance = await db.connect();
		try {
			const query = `INSERT INTO contact (name, pronoun, role, phone, email, organizationId, isRepresenting, representedName, representedRole)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

			await dbInstance.run(query, Object.values(contact));
			event.sender.send('contact-create-res', {
				success: true,
				message: `Contato ${contact.name} cadastrado com sucesso!`,
			});
		} catch (err) {
			console.error('Error when creating user:', err);
			event.sender.send('contact-create-res', {
				success: false,
				message: `Já existe um contato registrado com o e-mail inserido (${contact.email}).`,
			});
		} finally {
			await db.close(dbInstance);
		}
	}

	static async getAll(event, { name, organizationId } = {}) {
		const dbInstance = await db.connect();
		try {
			let query = `SELECT contact.*, organization.name AS organizationName
						 FROM contact
						 LEFT JOIN organization ON contact.organizationId = organization.id`;

			let params = [];

			if (name) {
				query += ' WHERE contact.name LIKE ?';
				params = [`%${name}%`];
			}

			if (organizationId) {
				query += 'AND contact.organizationId = ?';
				params = [...params, organizationId];
			}

			const rows = await dbInstance.all(query, params);
			event.sender.send('contact-getall-res', {
				success: true,
				data: rows,
			});
		} catch (err) {
			console.error('Error when getting all contacts:', err);
			event.sender.send('contact-getall-res', {
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
			const query = `DELETE FROM contact WHERE id = ?`;

			await dbInstance.run(query, [id]);
			event.sender.send('contact-delete-res', {
				success: true,
				id: id,
			});
		} catch (err) {
			console.error('Error when deleting user:', err);
			event.sender.send('contact-delete-res', {
				success: false,
				message:
					'Erro ao remover contato do banco de dados, por favor, tente buscar novamente.',
				id: id,
			});
		} finally {
			await db.close(dbInstance);
		}
	}
}

module.exports = Contact;
