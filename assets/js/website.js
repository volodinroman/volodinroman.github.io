// document.querySelectorAll('.copy-btn').forEach(button => {
//     button.addEventListener('click', function() {
//         let code = this.parentNode.previousElementSibling.textContent;
//         navigator.clipboard.writeText(code).then(() => {
//             /* Optional: Display a message that the code was copied */
//         });
//     });
// });

document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', function() {
        const code = this.nextElementSibling.textContent;
        navigator.clipboard.writeText(code).then(() => {
            // Optional: Display a message or change the button's appearance briefly to indicate a successful copy
            console.log('Code copied to clipboard!');
        });
    });
});