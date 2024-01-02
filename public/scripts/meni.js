document.addEventListener('DOMContentLoaded', function() {
    const odjavaLink = document.getElementById('odjava');
    const prijavaLink = document.getElementById('prijava');
    const profilLink = document.getElementById('profil');
    
    function provjeriPrijavu() {
        PoziviAjax.getKorisnik(function(error, korisnik) {
            if (!error && korisnik) {
                odjavaLink.style.display = 'block';
                prijavaLink.style.display = 'none';
                profilLink.style.display = 'block';
                // Dodatno prikaži navigaciju ili druge elemente ako je korisnik prijavljen
               
            } else {
                odjavaLink.style.display = 'none';
                prijavaLink.style.display = 'block';
                profilLink.style.display = 'none';
                // Dodatno prikaži navigaciju ili druge elem
                // Sakrij navigaciju ili druge elemente ako korisnik nije prijavljen
               
            }
        });
    }

    provjeriPrijavu(); // Poziv funkcije prilikom učitavanja stranice
});

function odjaviSe() {
    PoziviAjax.postLogout(function(error, response) {
        if (!error && response) {
            // Uspješno odjavljivanje - možete izvršiti dodatne radnje ako je potrebno
            console.log('Uspješno ste se odjavili.');
            // Dodajte dodatne korake ili preusmjeravanje korisnika nakon odjave
        } else {
            // Greška prilikom odjavljivanja
            console.error('Greška prilikom odjavljivanja:', error);
        }
    });
}

