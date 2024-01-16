const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/korisnik', true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                fnCallback(null, response);
            } else {
                fnCallback(this.statusText, null);
            }
        }
        xhr.send();
    };

    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', '/korisnik', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    fnCallback(null, response);
                } else {
                    fnCallback(this.statusText, null);
                }
            }
        };
        xhr.send(JSON.stringify(noviPodaci));
    }
    

    // dodaje novi upit za trenutno loginovanog korisnika
    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/upit', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    fnCallback(null, response);
                } else {
                    fnCallback(this.statusText, null);
                }
            }
        };
        xhr.send(JSON.stringify({ nekretnina_id, tekst_upita }));
    }
    
    function impl_getNekretnine(fnCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/nekretnine', true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    fnCallback(null, response);
                } else {
                    fnCallback(this.statusText, null);
                }
            }
        };
        xhr.send();
    }
    
    function impl_postLogin(username, password, fnCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    fnCallback(null, response);
                } else {
                    var errorResponse = JSON.parse(this.response);
                    fnCallback(errorResponse, null);
                }
            }
        };
        xhr.send(JSON.stringify({ username, password }));
    }
    
    function impl_postLogout(fnCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/logout', true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    fnCallback(null, response);
                } else {
                    fnCallback(this.statusText, null);
                }
            }
        };
        xhr.send();
    }
    
    function impl_getNekretninaById(nekretnina_id, fnCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `/nekretnina/${nekretnina_id}`, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    fnCallback(null, response);
                } else {
                    fnCallback(this.statusText, null);
                }
            }
        };
        xhr.send();
    }

    
    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getNekretninaById: impl_getNekretninaById
    };
})();
