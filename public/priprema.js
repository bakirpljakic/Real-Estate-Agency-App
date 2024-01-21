const db = require('./db.js');

db.sequelize.sync({ force: true }).then(function () {
    inicializacija().then(function () {
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija() {
    var korisnik1, korisnik2;
    var nekretnineListaPromisea = [];

    return new Promise(function (resolve, reject) {
        db.Korisnik.bulkCreate([
            {
                ime: "Neko",
                prezime: "Nekic",
                username: "username1",
                password: "$2b$10$T3Jo6bcjhDtQrsgD2/xTU.b8kjw6as/JkP0JRuiwFknVn9xgGYWre"
            },
            {
                ime: "Neko2",
                prezime: "Nekic2",
                username: "username2",
                password: "$2b$10$jq1DplsYdpQfEkzJx1ixyOOhhvDMxmuf0Y8RYK24wIUyi7ERnGCUa"
            },
        ]).then(function (korisnici) {
            korisnik1 = korisnici[0];
            korisnik2 = korisnici[1];


            nekretnineListaPromisea.push(db.Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Cetverosoban stan',
                kvadratura: 80,
                cijena: 120000,
                tip_grijanja: 'Centralno',
                lokacija: 'Centar grada',
                godina_izgradnje: 2010,
                datum_objave: '2024-01-14',
                opis: 'Predivan stan u centru grada.',
                pretrage: 0,
                klikovi: 0
            }).then(function (nekretnina) {
                return nekretnina.createUpit({
                    tekst_upita: 'Ima li parking?',
                    korisnik_id: korisnik1.id,
                });
            }));

            nekretnineListaPromisea.push(db.Nekretnina.create({
                tip_nekretnine: 'Kuća',
                naziv: 'Dvospratba kuca',
                kvadratura: 200,
                cijena: 250000,
                tip_grijanja: 'Plinsko',
                lokacija: 'Predgrađe',
                godina_izgradnje: 2005,
                datum_objave: '2024-01-14',
                opis: 'Prostrana kuća u mirnom predgrađu.',
                pretrage: 0,
                klikovi: 0,
                Upiti: [
                    {
                        tekst_upita: 'Koliko soba ima?',
                        KorisnikId: korisnik1.id,
                    },
                    {
                        tekst_upita: 'Ima li vrt?',
                        KorisnikId: korisnik2.id,
                    },
                ],
            }));

            nekretnineListaPromisea.push(db.Nekretnina.create({
                tip_nekretnine: 'Poslovni prostor',
                naziv: 'Mali poslovni prostor',
                kvadratura: 20,
                cijena: 70000,
                tip_grijanja: 'struja',
                lokacija: 'Centar',
                godina_izgradnje: 2005,
                datum_objave: '2024-01-14',
                opis: 'Magnis dis parturient montes.',
                pretrage: 0,
                klikovi: 0,
                Upiti: [
                    {
                        tekst_upita: 'Koliko kvadrata?',
                        KorisnikId: korisnik1.id,
                    }
                ],
            }));

            return Promise.all(nekretnineListaPromisea);
        }).then(function (nekretnine) {
            resolve(nekretnine);
        }).catch(function (err) {
            console.log("Nekretnine greska " + err);
            reject(err);
        });
    });
}
