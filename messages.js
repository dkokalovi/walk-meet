const likesNotifications = document.getElementById("likesNotifications");
const conversationList = document.getElementById("conversationList");
const chatWith = document.getElementById("chatWith");
const chatMessages = document.getElementById("chatMessages");

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

const walkForm = document.getElementById("walkForm");

const ulogiraniKorisnik = JSON.parse(localStorage.getItem("ulogiraniKorisnik"));
const likeovi = JSON.parse(localStorage.getItem("likeovi")) || [];
const korisnici = JSON.parse(localStorage.getItem("korisnici")) || [];
let poruke = JSON.parse(localStorage.getItem("poruke")) || [];

let razgovorKorisnikIme = localStorage.getItem("razgovorKorisnikIme");

if (!ulogiraniKorisnik) {
    alert("Moraš se prvo prijaviti.");
    window.location.href = "login.html";
}


const primljeniLikeovi = likeovi.filter(
    like => like.prema === ulogiraniKorisnik.korisnickoIme
);

if (primljeniLikeovi.length === 0) {
    likesNotifications.innerHTML = "<p>Još nemaš nijedan like.</p>";
} else {
    primljeniLikeovi.forEach(like => {
        const osoba = korisnici.find(
            korisnik => korisnik.korisnickoIme === like.od
        );

        const likeCard = document.createElement("div");
        likeCard.classList.add("user-card");

        likeCard.innerHTML = `
            <h3>${osoba ? osoba.ime + " " + osoba.prezime : like.od}</h3>
            <p>Ova osoba je lajkala tvoj profil ❤️</p>
        `;

        likesNotifications.appendChild(likeCard);
    });
}


function prikaziRazgovore() {
    conversationList.innerHTML = "";

    const mojePoruke = poruke.filter(
        poruka =>
            poruka.od === ulogiraniKorisnik.korisnickoIme ||
            poruka.prema === ulogiraniKorisnik.korisnickoIme
    );

    const jedinstveniRazgovori = [];

    mojePoruke.forEach(poruka => {
        const drugaOsoba =
            poruka.od === ulogiraniKorisnik.korisnickoIme
                ? poruka.prema
                : poruka.od;

        if (!jedinstveniRazgovori.includes(drugaOsoba)) {
            jedinstveniRazgovori.push(drugaOsoba);
        }
    });

    if (jedinstveniRazgovori.length === 0) {
        conversationList.innerHTML = "<p>Nemaš još nijedan razgovor.</p>";
        return;
    }

    jedinstveniRazgovori.forEach(korisnickoIme => {
        const osoba = korisnici.find(k => k.korisnickoIme === korisnickoIme);

        const zadnjaPoruka = [...mojePoruke]
            .reverse()
            .find(p =>
                p.od === korisnickoIme || p.prema === korisnickoIme
            );

        const card = document.createElement("div");
        card.classList.add("conversation-card");

        if (razgovorKorisnikIme === korisnickoIme) {
            card.classList.add("active-conversation");
        }

        card.innerHTML = `
            <h3>${osoba ? osoba.ime + " " + osoba.prezime : korisnickoIme}</h3>
            <p>${zadnjaPoruka ? skratiTekst(zadnjaPoruka.tekst) : "Nema poruka"}</p>
        `;

        card.addEventListener("click", function () {
            razgovorKorisnikIme = korisnickoIme;
            localStorage.setItem("razgovorKorisnikIme", korisnickoIme);
            prikaziRazgovore();
            prikaziAktivniRazgovor();
        });

        conversationList.appendChild(card);
    });
}

function skratiTekst(tekst) {
    const cistiTekst = tekst.replace(/\n/g, " ");
    return cistiTekst.length > 50 ? cistiTekst.slice(0, 50) + "..." : cistiTekst;
}


function prikaziAktivniRazgovor() {
    chatMessages.innerHTML = "";

    if (!razgovorKorisnikIme) {
        chatWith.innerHTML = "<p>Nije odabran razgovor.</p>";
        messageForm.style.display = "none";
        walkForm.style.display = "none";
        return;
    }

    const razgovorKorisnik = korisnici.find(
        korisnik => korisnik.korisnickoIme === razgovorKorisnikIme
    );

    if (!razgovorKorisnik || razgovorKorisnik.korisnickoIme === ulogiraniKorisnik.korisnickoIme) {
        chatWith.innerHTML = "<p>Nije odabran razgovor.</p>";
        messageForm.style.display = "none";
        walkForm.style.display = "none";
        return;
    }

    messageForm.style.display = "block";
    walkForm.style.display = "block";

    chatWith.innerHTML = `
        <p><strong>Razgovor s:</strong> ${razgovorKorisnik.ime} ${razgovorKorisnik.prezime}</p>
    `;

    const razgovorPoruke = poruke.filter(poruka =>
        (poruka.od === ulogiraniKorisnik.korisnickoIme && poruka.prema === razgovorKorisnik.korisnickoIme) ||
        (poruka.od === razgovorKorisnik.korisnickoIme && poruka.prema === ulogiraniKorisnik.korisnickoIme)
    );

    if (razgovorPoruke.length === 0) {
        chatMessages.innerHTML = "<p>Nema poruka.</p>";
        return;
    }

    razgovorPoruke.forEach(poruka => {
        const porukaDiv = document.createElement("div");
        porukaDiv.classList.add("message-bubble");

        if (poruka.od === ulogiraniKorisnik.korisnickoIme) {
            porukaDiv.classList.add("my-message");
        } else {
            porukaDiv.classList.add("other-message");
        }

        porukaDiv.innerHTML = `<p>${poruka.tekst.replace(/\n/g, "<br>")}</p>`;
        chatMessages.appendChild(porukaDiv);
    });
}


messageForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!razgovorKorisnikIme) return;

    const tekst = messageInput.value.trim();

    if (tekst === "") return;

    poruke.push({
        od: ulogiraniKorisnik.korisnickoIme,
        prema: razgovorKorisnikIme,
        tekst: tekst
    });

    localStorage.setItem("poruke", JSON.stringify(poruke));
    messageInput.value = "";

    prikaziRazgovore();
    prikaziAktivniRazgovor();
});


walkForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!razgovorKorisnikIme) return;

    const mjesto = document.getElementById("mjesto").value.trim();
    const ruta = document.getElementById("ruta").value.trim();
    const datum = document.getElementById("datum").value;
    const vrijeme = document.getElementById("vrijeme").value;

    if (mjesto === "" || ruta === "" || datum === "" || vrijeme === "") {
        alert("Ispuni sva polja za prijedlog šetnje.");
        return;
    }

    const tekst = `🚶 PRIJEDLOG ŠETNJE:
Mjesto: ${mjesto}
Ruta: ${ruta}
Datum: ${datum}
Vrijeme: ${vrijeme}`;

    poruke.push({
        od: ulogiraniKorisnik.korisnickoIme,
        prema: razgovorKorisnikIme,
        tekst: tekst
    });

    localStorage.setItem("poruke", JSON.stringify(poruke));
    walkForm.reset();

    prikaziRazgovore();
    prikaziAktivniRazgovor();
});


prikaziRazgovore();
prikaziAktivniRazgovor();