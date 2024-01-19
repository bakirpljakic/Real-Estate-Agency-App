const urlParams = new URLSearchParams(window.location.search);
const nekretninaId = urlParams.get('id');

// Funkcija za postavljanje novog upita
function postaviUpit() {
    const noviUpitTekstInput = document.getElementById('noviUpitTekst');
    const noviUpitTekst = noviUpitTekstInput.value;

    PoziviAjax.postUpit(nekretninaId, noviUpitTekst, function (error, response) {
        if (!error) {
            noviUpitTekstInput.value = '';
            location.reload();
           // console.log('Upit uspješno postavljen!');
        } else {
            console.error('Greška pri postavljanju upita:', error);
        }
    });
}
