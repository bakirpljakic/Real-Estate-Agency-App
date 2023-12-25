const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const bcrypt = require('bcrypt');
const fs = require('fs').promises;

app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Postavljanje putanje do public foldera
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

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await fs.readFile('./public/data/korisnici.json', 'utf-8');
        const korisnici = JSON.parse(data);
        console.log(korisnici);
        const foundUser = korisnici.find(user => user.username === username);
        console.log(foundUser);
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
    
    // Provjera da li je korisnik loginovan
    if (!req.session.username) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }

    try {
        // Čitanje korisnika iz datoteke
        const korisniciData = await fs.readFile('./public/data/korisnici.json', 'utf-8');
        const korisnici = JSON.parse(korisniciData);

        // Pronalaženje loginovanog korisnika
        const loggedInUser = korisnici.find(user => user.username === req.session.username);
        if (!loggedInUser) {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }

        // Čitanje nekretnina iz datoteke
        const nekretnineData = await fs.readFile('./public/data/nekretnine.json', 'utf-8');
        const nekretnine = JSON.parse(nekretnineData);

        // Pronalaženje nekretnine sa datim ID-em
        const targetNekretnina = nekretnine.find(nekretnina => nekretnina.id === nekretnina_id);
        if (!targetNekretnina) {
            return res.status(400).json({ "greska": `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
        }

        // Dodavanje novog upita u nekretninu
        targetNekretnina.upiti.push({
            korisnik_id: loggedInUser.id,
            tekst_upita: tekst_upita
        });

        // Ažuriranje datoteke sa nekretninama
        await fs.writeFile('./public/data/nekretnine.json', JSON.stringify(nekretnine, null, 2));

        return res.status(200).json({ "poruka": "Upit je uspješno dodan" });
    } catch (error) {
        console.error('Greška prilikom dodavanja upita:', error);
        return res.status(500).json({ "greska": "Greška prilikom dodavanja upita" });
    }
});



app.listen(3000);