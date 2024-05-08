document.querySelectorAll('.button').forEach(button => button.addEventListener('click', e => {
    if(!button.classList.contains('delete')) {

        button.classList.add('delete');

        setTimeout(() => button.classList.remove('delete'), 2200);

    }
    e.preventDefault();
}));