function toggleInputs() {
    var checkBox = document.getElementById("mostrarMaisInputs");
    var extra1 = document.getElementById("campoExtra1");
    var extra2 = document.getElementById("campoExtra2");

    // Verifica se o checkbox está marcado
    if (checkBox.checked === true){
        extra1.classList.remove('hidden');
        extra2.classList.remove('hidden');
    } else {
        extra1.classList.add('hidden');
        extra2.classList.add('hidden');
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

