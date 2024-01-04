const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const bcrypt = require('bcrypt');
const fs = require('fs').promises;

app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));

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

hash();

async function hash() {
    try {
        const data = await fs.promises.readFile('public/data/korisnici.json', { encoding: 'utf-8' });
        const users = JSON.parse(data);
        for (let user of users) {
            if (!user.password.startsWith('$2b$')) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
            }
        }
        const updatedData = JSON.stringify(users, null, 2);
        await fs.promises.writeFile('public/data/korisnici.json', updatedData);
    } catch (error) {
        console.error('Error:', error);
    }
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await fs.readFile('./public/data/korisnici.json', 'utf-8');
        const korisnici = JSON.parse(data);
        const foundUser = korisnici.find(user => user.username === username);
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
        console.error('Greška prilikom čitanja datoteke korisnici.json:', error);
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
        const data = await fs.readFile('./public/data/korisnici.json', 'utf-8');
        const korisnici = JSON.parse(data);
        const prijavljeniKorisnik = korisnici.find(korisnik => korisnik.username === req.session.username);
        if (!prijavljeniKorisnik) {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }
        return res.status(200).json(prijavljeniKorisnik);
    } catch (error) {
        return res.status(500).json({ "greska": "Greška prilikom čitanja korisničkih podataka" });
    }
});

app.put('/korisnik', async (req, res) => {
    const { ime, prezime, username, password } = req.body;
    const data = await fs.readFile('./public/data/korisnici.json', 'utf-8');
    const korisnici = JSON.parse(data);
    if (!req.session.username) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
    try {
        const index = korisnici.findIndex(korisnik => korisnik.username === username);
        if (index === -1) {
            return res.status(404).json({ "greska": "Korisnik nije pronađen" });
        }
        if (ime) korisnici[index].ime = ime;
        if (prezime) korisnici[index].prezime = prezime;
        if (password) korisnici[index].password = password;
        await fs.writeFile('./public/data/korisnici.json', JSON.stringify(korisnici, null, 2));
        return res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
    } catch (error) {
        return res.status(500).json({ "greska": "Greška prilikom ažuriranja korisničkih podataka" });
    }
});
app.get('/nekretnine', async (req, res) => {
    try {
        const data = await fs.readFile('./public/data/nekretnine.json', 'utf-8');
        const nekretnine = JSON.parse(data);
        return res.status(200).json(nekretnine);
    } catch (error) {
        console.error('Greška prilikom dohvata nekretnina:', error);
        return res.status(500).json({ "greska": "Greška prilikom dohvata nekretnina" });
    }
});

app.post('/upit', async (req, res) => {
    const { nekretnina_id, tekst_upita } = req.body;

    if (!req.session.username) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }

    try {
        const korisniciData = await fs.readFile('./public/data/korisnici.json', 'utf-8');
        const korisnici = JSON.parse(korisniciData);

        const loggedInUser = korisnici.find(user => user.username === req.session.username);
        if (!loggedInUser) {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }

        const nekretnineData = await fs.readFile('./public/data/nekretnine.json', 'utf-8');
        const nekretnine = JSON.parse(nekretnineData);

        const targetNekretnina = nekretnine.find(nekretnina => nekretnina.id === nekretnina_id);
        if (!targetNekretnina) {
            return res.status(400).json({ "greska": `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
        }

        targetNekretnina.upiti.push({
            korisnik_id: loggedInUser.id,
            tekst_upita: tekst_upita
        });

        await fs.writeFile('./public/data/nekretnine.json', JSON.stringify(nekretnine, null, 2));

        return res.status(200).json({ "poruka": "Upit je uspješno dodan" });
    } catch (error) {
        console.error('Greška prilikom dodavanja upita:', error);
        return res.status(500).json({ "greska": "Greška prilikom dodavanja upita" });
    }
});

app.post('/marketing/nekretnine', async (req, res) => {
    try {
        const { nizNekretnina } = req.body;

        let data = await fs.readFile('./public/data/preferencije.json', 'utf8');
        let nekretnine = JSON.parse(data);

        nizNekretnina.forEach(id => {
            const nekretnina = nekretnine.find(item => item.id === id);

            if (nekretnina) {
                nekretnina.pretrage++;
            } else {
                nekretnine.push({
                    id: id,
                    pretrage: 1,
                    klikovi: 0
                });
            }
        });

        await fs.writeFile('./public/data/preferencije.json', JSON.stringify(nekretnine, null, 2), 'utf8');
        res.status(200).send('Uspješno ažurirano');
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška prilikom obrade zahtjeva');
    }
});

app.post('/marketing/nekretnina/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        let data = await fs.readFile('./public/data/preferencije.json', 'utf8');
        let nekretnine = JSON.parse(data);

        const nekretnina = nekretnine.find(item => item.id === id);

        if (nekretnina) {
            nekretnina.klikovi++;
        } else {
            nekretnine.push({
                id: id,
                pretrage: 0,
                klikovi: 1
            });
        }
        await fs.writeFile('./public/data/preferencije.json', JSON.stringify(nekretnine, null, 2), 'utf8');
        res.status(200).send('Uspješno ažurirano');
    } catch (err) {
        console.error(err);
        res.status(500).send('Greška prilikom obrade zahtjeva');
    }
});

app.post("/marketing/osvjezi", async function (req, res) {
    let pomocnaOsvjezi = req.session["pomocnaOsvjezi"];
    let osvjeziID = [];
    if (req.body["nizNekretnina"]) {
        osvjeziID = req.body["nizNekretnina"];
    } else {
        for (let nekretnina of pomocnaOsvjezi)
            osvjeziID.push(nekretnina["id"]);
    }
    let data = await fs.readFile('./public/data/preferencije.json', 'utf8');
    let osvjezi = JSON.parse(data);
    osvjezi = osvjezi.filter(x => osvjeziID.find(y => x["id"] == y));
    req.session["pomocnaOsvjezi"] = osvjezi;
    if (!req.body["nizNekretnina"]) {
        osvjezi = osvjezi.filter(osvjeziNekretnina => {
            return !pomocnaOsvjezi.find(pomocna => (
                osvjeziNekretnina["id"] === pomocna["id"] &&
                osvjeziNekretnina["klikovi"] === pomocna["klikovi"] &&
                osvjeziNekretnina["pretrage"] === pomocna["pretrage"]
            ));
        });
    }
    return res.status(200).json({ "nizNekretnina": osvjezi });
});

app.listen(3000);