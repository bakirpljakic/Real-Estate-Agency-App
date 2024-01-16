// Uzmite podatke o nekretnini s servera (koristeći prethodno definisanu metodu)
const urlParams = new URLSearchParams(window.location.search);
const nekretninaId = urlParams.get('id');

PoziviAjax.getNekretninaById(nekretninaId, function (error, nekretninaData) {
    if (error) {
        console.error('Greška prilikom dohvaćanja podataka o nekretnini:', error);
        return;
    }

    // Postavite osnovne informacije o nekretnini
    document.getElementById('osnovno').innerHTML = `
        <h3>OSNOVNO</h3>
        <img src="https://prostor.ba/img/s/1200x800/upload/images/properties/11651/35a77b5a368c0cb5fa3c19e4d1f3e7a7.jpg" alt="Slika nekretnine">
        <p><strong>Naziv:</strong> ${nekretninaData.naziv}</p>
        <br>
        <p><strong>Kvadratura:</strong> ${nekretninaData.kvadratura} m2</p>
        <br>
        <p><strong>Cijena:</strong> ${nekretninaData.cijena} KM</p>
        <br>
    `;

    // Postavite dodatne informacije o nekretnini
    document.getElementById('detalji').innerHTML = `
        <h3>DETALJI</h3>
        <div class="grid">
            <div>
                <p><strong>Tip grijanja:</strong> ${nekretninaData.tip_grijanja}</p>
                <p><strong>Lokacija:</strong> ${nekretninaData.lokacija}</p>
            </div>
            <div>
                <p><strong>Godina izgradnje:</strong> ${nekretninaData.godina_izgradnje}</p>
                <p><strong>Datum objave:</strong> ${nekretninaData.datum_objave}</p>
            </div>
        </div>
        <p class="opis"><strong>Opis: </strong>${nekretninaData.opis}</p>
    `;

    const upitiList = document.getElementById('upiti').getElementsByTagName('ul')[0];

    if (upitiList) {  // Provjera postojanja upitiList
        // Koristite dinamičko određivanje polja: Upit ili Upits
        const upitiDataArray = nekretninaData['Upit' + (nekretninaData.Upits ? 's' : '')];

        upitiDataArray.forEach(function (upit) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p><strong>${upit.Korisnik.username}</strong></p>
                <p>${upit.tekst_upita}</p>
            `;
            upitiList.appendChild(listItem);
        });
    } else {
        console.error("Element 'upiti' ili 'ul' nije pronađen.");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Uzmite trenutno prijavljenog korisnika
    PoziviAjax.getKorisnik(function (error, korisnikData) {
        if (!error) {
            // Provjerite da li je korisnik prijavljen
            if (korisnikData && korisnikData.id) {
                // Ako je prijavljen, pokažite formu za novi upit
                prikaziFormuZaUpit();
            }
        }
    });
});

// Funkcija za prikazivanje forme za novi upit
function prikaziFormuZaUpit() {
    const noviUpitContainer = document.getElementById('noviUpit');
    noviUpitContainer.style.display = 'block';
}

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
