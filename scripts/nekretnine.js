function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const nekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
    

    nekretnine.forEach(nekretnina => {

        const divNekretnina = document.createElement("div");
        divNekretnina.classList.add("nekretnina");
        const image = document.createElement("img");
        image.src = "https://prostor.ba/img/s/1200x800/upload/images/properties/11651/35a77b5a368c0cb5fa3c19e4d1f3e7a7.jpg"
        image.alt = nekretnina.naziv

        const divInformacije = document.createElement("div");
        divInformacije.classList.add("informacije");

        const naziv = document.createElement("p");
        naziv.classList.add("naziv");
        naziv.textContent = nekretnina.naziv

        const kvadratura = document.createElement("p");
        kvadratura.classList.add("kvadratura");
        kvadratura.textContent = nekretnina.kvadratura

        const cijena = document.createElement("p");
        cijena.classList.add("cijena");
        cijena.textContent = nekretnina.cijena

        const buttonDetalji = document.createElement("button");
        buttonDetalji.classList.add("detalji");
        buttonDetalji.textContent = "Detalji"


        if (nekretnina.tip_nekretnine === "Stan") {
            divNekretnina.style.backgroundColor = "white";
        } else if(nekretnina.tip_nekretnine ==="Kuća"){
            divNekretnina.style.backgroundColor = "powderblue";
        } else if(nekretnina.tip_nekretnine === "Poslovni prostor") {
            divNekretnina.style.backgroundColor = "green";
        }

        divInformacije.appendChild(naziv);
        divInformacije.appendChild(kvadratura);
        divInformacije.appendChild(cijena);
        divNekretnina.appendChild(image);
        divNekretnina.appendChild(divInformacije);
        divNekretnina.appendChild(buttonDetalji);
        divReferenca.appendChild(divNekretnina);

    });
}
const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 3,
    tip_nekretnine: "Kuća",
    naziv: "Useljiva kuća Ilidza",
    kvadratura: 150,
    cijena: 350000,
    tip_grijanja: "plin",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

//instanciranje modula
let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

//pozivanje funkcije
spojiNekretnine(divStan, nekretnine, "Stan");
spojiNekretnine(divKuca, nekretnine, "Kuća");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
