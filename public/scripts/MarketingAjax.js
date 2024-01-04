const MarketingAjax = (() => {
    let nekretnine = [];
    let poslanoKlik = false;
    let poslanoPretrage = false;

    function osvjeziPretrage(divNekretnina) {
        const interval = setInterval(() => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const nekretnine = JSON.parse(xhr.responseText);
                        nekretnine.nizNekretnina.forEach((nekretnina) => {
                            divNekretnina.querySelector(`#pretrage-${nekretnina.id}`).innerHTML = "Broj pretraga: " + nekretnina.pretrage;
                        })
                    }
                }
            }
            xhr.open('POST', '/marketing/osvjezi', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            if (!poslanoPretrage) {
                xhr.send(JSON.stringify({ "nizNekretnina": nekretnine }));
                poslanoPretrage = true;
            }
            else
                xhr.send();
        }, 500);

    }

    function osvjeziKlikove(divNekretnina) {
        const interval = setInterval(() => {
            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const nekretnine = JSON.parse(xhr.responseText);
                        nekretnine.nizNekretnina.forEach((nekretnina) => {
                            if(nekretnina.klikovi === 0){
                                divNekretnina.querySelector(`#klikovi-${nekretnina.id}`).innerHTML = '';
                            }else
                            divNekretnina.querySelector(`#klikovi-${nekretnina.id}`).innerHTML = "Broj klikova: " + nekretnina.klikovi;
                        })
                    }
                }
            }
            xhr.open('POST', '/marketing/osvjezi', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            if (!poslanoKlik) {
                xhr.send(JSON.stringify({ "nizNekretnina": nekretnine }));
                poslanoKlik = true;
            }
            else
                xhr.send();
        }, 500);
    }

    function novoFiltriranje(listaFiltriranihNekretnina) {

        const listaID = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id);
        if (listaID.length === 0) {
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    nekretnine = listaID;
                    poslanoKlik = false;
                    poslanoPretrage = false;
                }
            }
        }
        xhr.open('POST', '/marketing/nekretnine', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ "nizNekretnina": listaID }));
    }


    function klikNekretnina(idNekretnine) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    nekretnine = [idNekretnine];
                    poslanoKlik = false;
                    poslanoPretrage = false;
                }
            }
        }
        xhr.open('POST', `/marketing/nekretnina/${idNekretnine}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    }



    return {
        osvjeziPretrage,
        osvjeziKlikove,
        novoFiltriranje,
        klikNekretnina,
    };
})();