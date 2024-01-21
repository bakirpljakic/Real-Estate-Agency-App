const urlParams = new URLSearchParams(window.location.search);
const nekretninaId = urlParams.get('id');

PoziviAjax.getNekretninaById(nekretninaId, function (error, nekretninaData) {
    if (error) {
        console.error('Greška prilikom dohvaćanja podataka o nekretnini:', error);
        return;
    }

   
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

    if (upitiList) {  
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

