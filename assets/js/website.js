document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', function() {
        let code = this.parentNode.previousElementSibling.textContent;
        navigator.clipboard.writeText(code).then(() => {
            /* Optional: Display a message that the code was copied */
        });
    });
});

