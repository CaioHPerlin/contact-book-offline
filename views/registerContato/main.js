var checkBox = document.getElementById('mostrarMaisInputs');
var extra1 = document.getElementById('campoExtra1');
var extra2 = document.getElementById('campoExtra2');

checkBox.addEventListener('click', () => {
	// Verifica se o checkbox está marcado
	if (checkBox.checked === true) {
		extra1.classList.remove('hidden');
		extra2.classList.remove('hidden');
	} else {
		extra1.classList.add('hidden');
		extra2.classList.add('hidden');
	}
});

document.querySelector('.hamburger').addEventListener('click', function () {
	var list = document.querySelector('.list');
	if (list.classList.contains('hidden')) {
		list.classList.remove('hidden');
		list.classList.add('show');
	} else {
		list.classList.remove('show');
		list.classList.add('hidden');
	}
});

const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', (ev) => {
	ev.preventDefault();
	// name, pronoun, role, phone, email, organizationId, isRepresenting, representedName, representedRole
	const contact = {
		name: form.inputNome4.value,
		pronoun: form.pronomeTratamento.value,
		role: form.inputAddress.value,
		phone: form.inputPhone.value,
		email: form.inputEmail.value,
		organizationId: form.inputOrgao.value,
		isRepresenting: form.mostrarMaisInputs.checked,
		representedName: form.inputExtra1.value,
		representedRole: form.inputExtra2.value,
	};

	api.send('contact-create-req', contact);
});

api.on('contact-create-res', (_, { success, message }) => {
	if (!success) {
		return api.error(message);
	}

	api.success(message);
	form.reset();

	if (checkBox.checked === true) {
		extra1.classList.remove('hidden');
		extra2.classList.remove('hidden');
	} else {
		extra1.classList.add('hidden');
		extra2.classList.add('hidden');
	}
});
