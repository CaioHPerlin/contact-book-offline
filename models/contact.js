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

	static async getAll(event, name) {
		const dbInstance = await db.connect();
		try {
			let query, params;
			if (name) {
				query = 'SELECT * FROM contact WHERE name LIKE ?';
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
					'Erro ao acessar o banco de dados. Por favor, reinicie a aplicação.',
			});
		} finally {
			await db.close(dbInstance);
		}
	}
}

module.exports = Contact;
