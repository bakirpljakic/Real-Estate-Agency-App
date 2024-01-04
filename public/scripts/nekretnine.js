let listaNekretnina = [];
let listaKorisnika = [];
PoziviAjax.getNekretnine(function (error, nekretnine) {

    if (error) {
        console.error('Greška prilikom dohvatanja nekretnina:', error);
        return;
    }
    listaNekretnina = nekretnine;
    let spisak_nekretnina = SpisakNekretnina();
    spisak_nekretnina.init(listaNekretnina, listaKorisnika);
    const divStan = document.getElementById("stan");
    const divKuca = document.getElementById("kuca");
    const divPp = document.getElementById("pp");

    spojiNekretnine(divStan, spisak_nekretnina, "Stan");
    spojiNekretnine(divKuca, spisak_nekretnina, "Kuća");
    spojiNekretnine(divPp, spisak_nekretnina, "Poslovni prostor");
    MarketingAjax.novoFiltriranje(nekretnine);
    MarketingAjax.osvjeziPretrage(document.getElementById("divNekretnina"));
    MarketingAjax.osvjeziKlikove(document.getElementById("divNekretnina"));
});

function spojiNekretnine(divReferenca, listaNekretnina, tip_nekretnine) {
    const filtriraneNekretnine = listaNekretnina.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

    filtriraneNekretnine.forEach(nekretnina => {
        const divNekretnina = document.createElement("div");
        divNekretnina.classList.add("nekretnina");
        divNekretnina.id = nekretnina.id;

        const image = document.createElement("img");
        image.src = "https://prostor.ba/img/s/1200x800/upload/images/properties/11651/35a77b5a368c0cb5fa3c19e4d1f3e7a7.jpg"
        image.alt = nekretnina.naziv;

        const naziv = document.createElement("p");
        naziv.classList.add("naziv");
        naziv.textContent = nekretnina.naziv;

        const divInformacije = document.createElement("div");
        divInformacije.classList.add("informacije");

        const kvadratura = document.createElement("p");
        kvadratura.classList.add("kvadratura");
        kvadratura.textContent = `Kvadratura: ${nekretnina.kvadratura} m²`;

        const cijena = document.createElement("p");
        cijena.classList.add("cijena");
        cijena.textContent = `Cijena: ${nekretnina.cijena} BAM`;

        const divPretrage = document.createElement("div");
        divPretrage.classList.add("pretrage");
        divPretrage.id = `pretrage-${nekretnina.id}`;
        divPretrage.textContent = `Broj pretraga:`;

        const divKlikovi = document.createElement("div");
        divKlikovi.classList.add("klikovi");
        divKlikovi.id = `klikovi-${nekretnina.id}`;
        divKlikovi.textContent = `Broj klikova:`;

        const buttonDetalji = document.createElement("button");
        buttonDetalji.classList.add("detalji");
        buttonDetalji.textContent = "Detalji";
        buttonDetalji.addEventListener('click', function () {
            povecajDetalje(nekretnina.id);
        });

        if (nekretnina.tip_nekretnine === "Stan") {
            divNekretnina.style.backgroundColor = "white";
        } else if (nekretnina.tip_nekretnine === "Kuća") {
            divNekretnina.style.backgroundColor = "powderblue";
        } else if (nekretnina.tip_nekretnine === "Poslovni prostor") {
            divNekretnina.style.backgroundColor = "green";
        }


        divInformacije.appendChild(naziv);
        divInformacije.appendChild(kvadratura);
        divInformacije.appendChild(cijena);
        divInformacije.appendChild(divPretrage);
        divInformacije.appendChild(divKlikovi);
        divNekretnina.appendChild(image);
        divNekretnina.appendChild(divInformacije);
        divNekretnina.appendChild(buttonDetalji);
        divReferenca.appendChild(divNekretnina);

    });
}


function povecajDetalje(id) {
    MarketingAjax.klikNekretnina(id);
    const kartica = document.getElementById(id);
    document.querySelectorAll(".nekretnina").forEach((karta) => {
        karta.style.width = "300px";
        karta.style.gridColumn = "span 1";
    })
    kartica.style.width = "500px";
    kartica.style.gridColumn = "span 2";
}


function pretraziNekretnine() {


    const min_cijena_input = document.getElementById("minCijena");
    const max_cijena_input = document.getElementById("maxCijena");
    const min_kvadratura_input = document.getElementById("minKvadratura");
    const max_kvadratura_input = document.getElementById("maxKvadratura");
    const pretrazi_button = document.getElementById("pretrazi");

    let kriteriji = {};

    if (min_cijena_input) kriteriji.min_cijena = parseInt(min_cijena_input.value);
    if (max_cijena_input) kriteriji.max_cijena = parseInt(max_cijena_input.value);
    if (min_kvadratura_input) kriteriji.min_kvadratura = parseInt(min_kvadratura_input.value);
    if (max_kvadratura_input) kriteriji.max_kvadratura = parseInt(max_kvadratura_input.value);

    let spisak_nekretnina = SpisakNekretnina();
    spisak_nekretnina.init(listaNekretnina, listaKorisnika);

    let filrirane = spisak_nekretnina.filtrirajNekretnine(kriteriji);
    spisak_nekretnina.init(filrirane, listaKorisnika);

    MarketingAjax.novoFiltriranje(filrirane);

    const divStan = document.getElementById("stan");
    const divKuca = document.getElementById("kuca");
    const divPp = document.getElementById("pp");

    divStan.innerHTML = '';
    divKuca.innerHTML = '';
    divPp.innerHTML = '';

    spojiNekretnine(divStan, spisak_nekretnina, "Stan");
    spojiNekretnine(divKuca, spisak_nekretnina, "Kuća");
    spojiNekretnine(divPp, spisak_nekretnina, "Poslovni prostor");

}