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
        // Prvo, kreiraj dva korisnika
        db.Korisnik.bulkCreate([
            {
                ime: 'Bakir',
                prezime: 'Pljakic',
                username: 'bakir',
                password: '$2b$10$T3Jo6bcjhDtQrsgD2/xTU.b8kjw6as/JkP0JRuiwFknVn9xgGYWre',
            },
            {
                ime: 'Safet',
                prezime: 'Doe',
                username: 'jane.doe',
                password: 'password456',
            },
        ]).then(function (korisnici) {
            // Dodaj Upite vezane uz korisnike
            korisnik1 = korisnici[0];
            korisnik2 = korisnici[1];
            
            // Dodaj dvije nekretnine s povezanim upitima
            nekretnineListaPromisea.push(db.Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Lijepi stan',
                kvadratura: 80,
                cijena: 120000,
                tip_grijanja: 'Centralno',
                lokacija: 'Centar grada',
                godina_izgradnje: 2010,
                datum_objave: '2024-01-14',
                opis: 'Predivan stan u centru grada.',
                pretrage: 58,
                klikovi: 34
            }).then(function (nekretnina) {
                // Dodaj Upite vezane uz korisnike
                return nekretnina.createUpit({
                    tekst_upita: 'Ima li parking?',
                    korisnik_id: korisnik1.id,
                });
            }));

            nekretnineListaPromisea.push(db.Nekretnina.create({
                tip_nekretnine: 'Kuća',
                naziv: 'Velika kuća',
                kvadratura: 200,
                cijena: 250000,
                tip_grijanja: 'Plinsko',
                lokacija: 'Predgrađe',
                godina_izgradnje: 2005,
                datum_objave: '2024-01-14',
                opis: 'Prostrana kuća u mirnom predgrađu.',
                pretrage: 42,
                klikovi: 20,
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

            return Promise.all(nekretnineListaPromisea);
        }).then(function (nekretnine) {
            // Ako želiš nešto raditi s kreiranim podacima, možeš to ovdje dodati.
            resolve(nekretnine);
        }).catch(function (err) {
            console.log("Nekretnine greska " + err);
            reject(err);
        });
    });
}
