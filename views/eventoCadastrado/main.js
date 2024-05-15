function confirmarExclusao() {
    if (confirm("Tem certeza de que deseja excluir o evento?")) {
        alert("Evento excluído com sucesso!");
    }
}

document.querySelector('.hamburger').addEventListener('click', function() {
    var list = document.querySelector('.list');
    if (list.classList.contains('hidden')) {
        list.classList.remove('hidden');
        list.classList.add('show');
    } else {
        list.classList.remove('show');
        list.classList.add('hidden');
    }
});

