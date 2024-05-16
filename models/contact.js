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
				message: `Já existe um contato registrado com o e-mail inserido (${contact.email})`,
			});
		} finally {
			await db.close(dbInstance);
		}
	}
}

module.exports = Contact;
