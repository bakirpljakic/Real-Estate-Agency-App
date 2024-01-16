const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const db = require('./public/db.js');

app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));
//hash();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/detalji.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/detalji.html'));
});

app.get('/meni.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/meni.html'));
});

app.get('/nekretnine.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/nekretnine.html'));
});

app.get('/prijava.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/prijava.html'));
});

app.get('/profil.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/profil.html'));
});
/*
async function hash() {
    try {
      const rawdata = await fs.readFile('public/data/korisnici.json', { encoding: 'utf-8' });
      const korisnici = JSON.parse(rawdata);
    
      await Promise.all(korisnici.map(async (korisnik) => {
        if(!korisnik.password.startsWith('$2b$')){
        const hashPassword = await bcrypt.hash(korisnik.password, 10);
        korisnik.password = hashPassword; 
     } }));
      await fs.writeFile('public/data/korisnici.json', JSON.stringify(korisnici, null, 2));
    } catch (error) {
      console.error('Error:', error);
    }
  }
*/

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const foundUser = await db.Korisnik.findOne({
            where: { username: username }
        });

        if (foundUser) {
            try {
                const match = await bcrypt.compare(password, foundUser.password);
                if (match) {
                    req.session.username = username;
                    return res.status(200).json({ "poruka": "Uspješna prijava" });
                } else {
                    return res.status(401).json({ "greska": "Neuspješna prijava" });
                }
            } catch (error) {
                console.error('Greška prilikom provjere lozinke:', error);
                return res.status(500).json({ "greska": "Greška prilikom provjere lozinke" });
            }
        } else {
            return res.status(401).json({ "greska": "Neuspješna prijava" });
        }
    } catch (error) {
        console.error('Greška prilikom čitanja korisničkih podataka iz baze:', error);
        return res.status(500).json({ "greska": "Greška prilikom čitanja korisničkih podataka" });
    }
});

app.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        return res.status(200).json({ "poruka": "Uspješno ste se odjavili" });
    } else {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
});


app.get('/korisnik', async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }
        const prijavljeniKorisnik = await db.Korisnik.findOne({
            where: { username: req.session.username }
        });
        if (!prijavljeniKorisnik) {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }
        return res.status(200).json({
            id: prijavljeniKorisnik.id,
            ime: prijavljeniKorisnik.ime,
            prezime: prijavljeniKorisnik.prezime,
            username: prijavljeniKorisnik.username,
        });
    } catch (error) {
        console.error('Greška prilikom čitanja korisničkih podataka iz baze:', error);
        return res.status(500).json({ "greska": "Greška prilikom čitanja korisničkih podataka" });
    }
});



app.put('/korisnik', async (req, res) => {
    const { ime, prezime, username, password } = req.body;

    if (!req.session.username) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }

    try {
        const prijavljeniKorisnik = await db.Korisnik.findOne({
            where: { username: req.session.username }
        });

        if (!prijavljeniKorisnik) {
            return res.status(404).json({ "greska": "Korisnik nije pronađen" });
        }

        await prijavljeniKorisnik.update({
            ime: ime || prijavljeniKorisnik.ime,
            prezime: prezime || prijavljeniKorisnik.prezime,
            username: username || prijavljeniKorisnik.username,
            password: password ? await bcrypt.hash(password, 10) : prijavljeniKorisnik.password,
        });

        return res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
    } catch (error) {
        console.error('Greška prilikom ažuriranja korisničkih podataka u bazi:', error);
        return res.status(500).json({ "greska": "Greška prilikom ažuriranja korisničkih podataka" });
    }
});

app.get('/nekretnine', async (req, res) => {
    try {
        const nekretnine = await db.Nekretnina.findAll();
        return res.status(200).json(nekretnine);
    } catch (error) {
        console.error('Greška prilikom dohvata nekretnina iz baze:', error);
        return res.status(500).json({ "greska": "Greška prilikom dohvata nekretnina" });
    }
});
app.post('/upit', async (req, res) => {
    const { nekretnina_id, tekst_upita } = req.body;

    if (!req.session.username) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }

    try {
        const loggedInUser = await db.Korisnik.findOne({
            where: { username: req.session.username }
        });

        if (!loggedInUser) {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }

        const targetNekretnina = await db.Nekretnina.findOne({
            where: { id: nekretnina_id }
        });

        if (!targetNekretnina) {
            return res.status(400).json({ "greska": `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
        }

        await db.Upit.create({
            korisnik_id: loggedInUser.id,
            nekretnina_id: targetNekretnina.id,
            tekst_upita: tekst_upita
        });

        return res.status(200).json({ "poruka": "Upit je uspješno dodan" });
    } catch (error) {
        console.error('Greška prilikom dodavanja upita u bazu:', error);
        return res.status(500).json({ "greska": "Greška prilikom dodavanja upita" });
    }
});

app.post('/marketing/nekretnine', async (req, res) => {
    try {
        const { nizNekretnina } = req.body;

        const nekretnine = await db.Nekretnina.findAll({
            where: { id: nizNekretnina }
        });

        for (const nekretnina of nekretnine) {
            nekretnina.pretrage++;
            await nekretnina.save();
        }

        res.status(200).send('Uspješno ažurirano');
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška prilikom obrade zahtjeva');
    }
});

app.post('/marketing/nekretnina/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const [nekretnina, created] = await db.Nekretnina.findOrCreate({
            where: { id: id },
            defaults: { pretrage: 0, klikovi: 1 }
        });

        if (!created) {
            nekretnina.klikovi++;
            await nekretnina.save();
        }

        res.status(200).send('Uspješno ažurirano');
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška prilikom obrade zahtjeva');
    }
});

app.post("/marketing/osvjezi", async function (req, res) {
    try {
        let pomocnaOsvjezi = req.session["pomocnaOsvjezi"];
        let osvjeziID = [];

        if (req.body["nizNekretnina"]) {
            osvjeziID = req.body["nizNekretnina"];
        } else {
            for (let nekretnina of pomocnaOsvjezi)
                osvjeziID.push(nekretnina["id"]);
        }

        const osvjezi = await db.Nekretnina.findAll({
            attributes: ['id', 'pretrage', 'klikovi'],
            where: { id: osvjeziID }
        });

        req.session["pomocnaOsvjezi"] = osvjezi;

        if (!req.body["nizNekretnina"]) {
            const filteredOsvjezi = osvjezi.filter(osvjeziNekretnina => {
                return !pomocnaOsvjezi.find(pomocna => (
                    osvjeziNekretnina.id === pomocna.id &&
                    osvjeziNekretnina.klikovi === pomocna.klikovi &&
                    osvjeziNekretnina.pretrage === pomocna.pretrage
                ));
            });

            return res.status(200).json({ "nizNekretnina": filteredOsvjezi });
        }

        return res.status(200).json({ "nizNekretnina": osvjezi });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ "greska": "Greška prilikom obrade zahtjeva" });
    }
});

// Dodajte novu rutu koja će vraćati nekretninu i pripadajuće upite
app.get('/nekretnina/:id', async (req, res) => {
    const nekretninaId = req.params.id;

    try {
        const nekretnina = await db.Nekretnina.findByPk(nekretninaId, {
            include: [{ model: db.Upit, include: [db.Korisnik] }]
        });
        if (!nekretnina) {
            return res.status(404).json({ error: 'Nekretnina nije pronađena.' });
        }
        res.json(nekretnina);
    } catch (error) {
        console.error('Greška prilikom dohvaćanja podataka o nekretnini i upitima:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3000);