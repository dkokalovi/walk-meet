const userDetailsDiv = document.getElementById("userDetails");
const likeBtn = document.getElementById("likeBtn");
const messageBtn = document.getElementById("messageBtn");

const korisnici = JSON.parse(localStorage.getItem("korisnici")) || [];
const odabraniKorisnikIme = localStorage.getItem("odabraniKorisnikIme");
const odabraniKorisnik = korisnici.find(
    korisnik => korisnik.korisnickoIme === odabraniKorisnikIme
);
const ulogiraniKorisnik = JSON.parse(localStorage.getItem("ulogiraniKorisnik"));

if (!ulogiraniKorisnik) {
    alert("Moraš se prvo prijaviti.");
    window.location.href = "login.html";
}

if (!odabraniKorisnik) {
    userDetailsDiv.innerHTML = "<p>Korisnik nije pronađen.</p>";
} else {
    userDetailsDiv.innerHTML = `
        <h2>${odabraniKorisnik.ime} ${odabraniKorisnik.prezime}</h2>
        <p><strong>Grad:</strong> ${odabraniKorisnik.grad}</p>
        <p><strong>Spol:</strong> ${odabraniKorisnik.spol}</p>
        <p><strong>Datum rođenja:</strong> ${odabraniKorisnik.datumRodjenja}</p>
        <p><strong>Obrazovanje:</strong> ${odabraniKorisnik.obrazovanje}</p>
        <p><strong>Posao:</strong> ${odabraniKorisnik.posao}</p>
        <p><strong>Hobi:</strong> ${odabraniKorisnik.hobi}</p>
        <p><strong>O meni:</strong> ${odabraniKorisnik.opis || "-"}</p>
    `;
}

likeBtn.addEventListener("click", function () {
    let likeovi = JSON.parse(localStorage.getItem("likeovi")) || [];

    const vecPostoji = likeovi.some(like =>
        like.od === ulogiraniKorisnik.korisnickoIme &&
        like.prema === odabraniKorisnik.korisnickoIme
    );

    if (vecPostoji) {
        alert("Već si poslala like ovoj osobi.");
        return;
    }

    likeovi.push({
        od: ulogiraniKorisnik.korisnickoIme,
        prema: odabraniKorisnik.korisnickoIme
    });

    localStorage.setItem("likeovi", JSON.stringify(likeovi));
    alert("Like poslan ❤️");
});

messageBtn.addEventListener("click", function () {
    localStorage.setItem("razgovorKorisnikIme", odabraniKorisnik.korisnickoIme);
    window.location.href = "messages.html";
});