document.querySelectorAll('.button').forEach(button => button.addEventListener('click', e => {
    if(!button.classList.contains('delete')) {

        button.classList.add('delete');

        setTimeout(() => button.classList.remove('delete'), 2200);

    }
    e.preventDefault();
}));

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

