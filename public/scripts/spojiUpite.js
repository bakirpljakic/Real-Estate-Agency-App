document.addEventListener("DOMContentLoaded", function () {
    PoziviAjax.getKorisnik(function (error, korisnikData) {
        if (!error) {
            if (korisnikData && korisnikData.id) {
                prikaziFormuZaUpit();
            }
        }
    });
});

function prikaziFormuZaUpit() {
    const noviUpitContainer = document.getElementById('noviUpit');
    noviUpitContainer.style.display = 'block';
}

function postaviUpit() {
    const noviUpitTekstInput = document.getElementById('noviUpitTekst');
    const noviUpitTekst = noviUpitTekstInput.value;

    PoziviAjax.postUpit(nekretninaId, noviUpitTekst, function (error, response) {
        if (!error) {
            noviUpitTekstInput.value = '';
            location.reload();
        } else {
            console.error('Greška pri postavljanju upita:', error);
        }
    });
}