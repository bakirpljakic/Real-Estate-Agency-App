let SpisakNekretnina = function () {
    
    let listaNekretnina = [];
    let listaKorisnika = [];

    let init = function (nekretnina, korisnik) {
        listaNekretnina = nekretnina;
        listaKorisnika = korisnik;
    }

    let filtrirajNekretnine = function (kriterij) {
        if (Object.keys(kriterij).length === 0) {
            return listaNekretnina;
        }

        return listaNekretnina.filter(nekretnina => {
            if (
                (!kriterij.tip_nekretnine || nekretnina.tip_nekretnine === kriterij.tip_nekretnine) &&
                (!kriterij.min_kvadratura || nekretnina.kvadratura >= kriterij.min_kvadratura) &&
                (!kriterij.max_kvadratura || nekretnina.kvadratura <= kriterij.max_kvadratura) &&
                (!kriterij.min_cijena || nekretnina.cijena >= kriterij.min_cijena) &&
                (!kriterij.max_cijena || nekretnina.cijena <= kriterij.max_cijena)
            ) {
                return true;
            }
            return false;
        });
    }


    let ucitajDetaljeNekretnine = function (id) {
        return (listaNekretnina.find(nekretnina => nekretnina.id === id) || null);
    }

    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};
