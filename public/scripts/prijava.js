function submitForm() {
    console.log('submitForm() pozvana'); 
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    PoziviAjax.postLogin(username, password, function(error, data) {
        if (error) {
            console.error('Greška prilikom prijave:', error);
        } else {
            console.log('Uspješna prijava:', data);
            window.location.href = '/nekretnine.html';
        }
    });
}
