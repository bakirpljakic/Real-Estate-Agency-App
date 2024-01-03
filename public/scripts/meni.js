document.addEventListener('DOMContentLoaded', function() {
    const odjavaKlik = document.getElementById('odjava');
    const prijavaKlik = document.getElementById('prijava');
    const profilKlik = document.getElementById('profil');
    
    function provjeriPrijavu() {
        PoziviAjax.getKorisnik(function(error, korisnik) {
            if (!error && korisnik) {
                odjavaKlik.style.display = 'block';
                prijavaKlik.style.display = 'none';
                profilKlik.style.display = 'block';
               
            } else {
                odjavaKlik.style.display = 'none';
                prijavaKlik.style.display = 'block';
                profilKlik.style.display = 'none';
  
            }
        });
    }

    provjeriPrijavu(); 
});

function odjaviSe() {
    PoziviAjax.postLogout(function(error, response) {
        if (!error && response) {
            console.log('Uspješno ste se odjavili.');
        } else {
            console.error('Greška prilikom odjavljivanja:', error);
        }
    });
}

