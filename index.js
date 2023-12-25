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

app.get('/', (req, res) => {
    if (req.session && req.session.username) {
        const korisnici = require('./public/data/korisnici.json');
        const foundUser = korisnici.find((user) => user.username === req.session.username);

        if (foundUser) {
            // Dobavljanje podataka o korisniku bez polja password (ne šaljemo šifru)
            const { password, ...userData } = foundUser;
            return res.status(200).json(userData); // Vraćanje podataka o korisniku
        } else {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }
    } else {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
});

app.get('/nekretnine', async (req, res) => {
    try {
        const data = await fs.readFile('./public/data/nekretnine.json', 'utf-8');
        const nekretnine = JSON.parse(data);

        // Vraćanje podataka o nekretninama
        return res.status(200).json(nekretnine);
    } catch (error) {
        console.error('Greška prilikom dohvata nekretnina:', error);
        return res.status(500).json({ "greska": "Greška prilikom dohvata nekretnina" });
    }
});


app.listen(3000);